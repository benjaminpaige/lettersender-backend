import { integer, relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const OrderItem = list({
  // we are "duplicating" this data because we want to give the user the ability to change letter content and re-order
  // as such we do not want to just reference the letters themselves because they might change
  ui: {
    listView: {
      initialColumns: ['recipientName', 'addressLine1', 'content'],
    },
    labelField: "recipientName"
  },
  fields: {
    recipientName: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    addressLine1: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    addressLine2: text({
      ui: {
        displayMode: 'input',
      },
    }),
    postcode: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    locality: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    state: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    price: integer({
      isRequired: true
    }),
    content: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    lobOrderId: text(),
    lobOrderToId: text(),
    lobOrderMailType: text(),
    lobOrderPdfUrl: text(),
    lobOrderCarrier: text(),
    lobOrderExpectedDeliveryDate: text(),
    lobOrderType: text(),
    order: relationship({ref: 'Order.items'}),
    // eventually we may want to accosiate each order item with a user (or more likely a "sender"), but for now we will just associate the order itself with the user
    // user: relationship({
    //   ref: 'User',
    //   defaultValue: ({ context }) => ({
    //     connect: { id: context.session.itemId },
    //   }),
    // }),
  },
});
