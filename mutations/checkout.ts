import { KeystoneContext } from "@keystone-next/types"
const Lob = require('lob')(process.env.LOB_SECRET)
import { CartItemWhereInput, OrderCreateInput } from '../.keystone/schema-types'
import { stripeConfig } from "../lib/stripe"

const graphql = String.raw // IDE formatting hack

export const checkout = async (root: any, {token}: {token: string}, context: KeystoneContext): Promise<OrderCreateInput> => {
    console.log('Checking Out!')

    // 1. make sure they are signed in
    const session = context.session
    // session.itemId is basically the userId
    if (!session.itemId) throw new Error('You must be logged in to do create an order!')

    // 2. Query the current user
    const user = await context.lists.User.findOne({
        where: { id: session.itemId },
        resolveFields: graphql`
            id
            fullName
            addressLine1
            addressLine2
            locality
            state
            postcode
            email
            cart {
                id
                letter {
                    recipientName
                    addressLine1
                    addressLine2
                    postcode
                    locality
                    state
                    content
                    price
                }
            }
        `
    })

    const cartItems = user.cart.filter(cartItem => cartItem.letter) // sanity check
    
    // 3. calc the total price
    const amount = cartItems.reduce((total: number, cartItem: CartItemWhereInput) => total + cartItem.letter.price, 0)

    // 4. create the charge with stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: "USD",
        confirm: true,
        payment_method: token
    }).catch(error => {
        console.log(error)
        throw new Error(error.message)
    })

    console.log(charge)

    // for each one of the orderItems send a letter
        const data = await Promise.all(cartItems.map(cartItem => 
            Lob.letters.create({
                to: {
                    name: cartItem.letter.recipientName,
                    address_line1: cartItem.letter.addressLine1,
                    address_line2: cartItem.letter.addressLine2,
                    address_city: cartItem.letter.locality,
                    address_state: cartItem.letter.state,
                    address_zip: cartItem.letter.postcode
                },
                from: {
                    name: user.fullName,
                    address_line1: user.addressLine1,
                    address_line2: user.addressLine2,
                    address_city: user.locality,
                    address_state: user.state,
                    address_zip: user.postcode
                    },
                file: `<html style="padding-top: 3in; margin: .5in;">${cartItem.letter.content}</html>`,
                color: false
            })
        )).catch(e => {
            console.log('ERROR SENDING LETTERS')
            console.log(e)
        })
            
      console.log(data)

      const orderItems = cartItems.map((cartItem, idx) => {
        const createLetterResponse = {...data[idx]}
        const lobOrderId = createLetterResponse.id
        const lobOrderToId = createLetterResponse.to.id
        const lobOrderMailType = createLetterResponse.mail_type
        const lobOrderPdfUrl = createLetterResponse.url
        const lobOrderCarrier = createLetterResponse.carrier
        const lobOrderExpectedDeliveryDate = createLetterResponse.expected_delivery_date
        const lobOrderType = createLetterResponse.object
        const orderItem = {
            recipientName: cartItem.letter.recipientName, 
            addressLine1: cartItem.letter.addressLine1, 
            addressLine2: cartItem.letter.addressLine2, 
            postcode: cartItem.letter.postcode, 
            locality: cartItem.letter.locality, 
            state: cartItem.letter.state, 
            content: cartItem.letter.content,
            price: cartItem.letter.price,
            lobOrderId,
            lobOrderToId,
            lobOrderMailType,
            lobOrderPdfUrl,
            lobOrderCarrier,
            lobOrderExpectedDeliveryDate,
            lobOrderType,
        }
        return orderItem
    })

    // 6. create the order and return it

    const order = await context.lists.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            paymentStatus: charge.status,
            items: { create: orderItems },
            user: { connect: { id: session.itemId }},
            chargeDate: charge.created
        }
    })

    // 7. Clean up any old cart items
    const cartItemsIds = cartItems.map(cartItem => cartItem.id)
    await context.lists.CartItem.deleteMany({
        ids: cartItemsIds
    })

    // 8. Retuirn the order

    return order
}