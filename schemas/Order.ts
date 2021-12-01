import { integer, relationship, text, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: () => false,
    delete: () => false,
  },
  ui: {
      listView: {
          initialColumns: ['charge', 'total', 'paymentStatus', 'user'],
      },
      labelField: "charge"
      },
  fields: {
      total: integer(),
      items: relationship({ref: 'OrderItem.order', many: true}),
      user: relationship({ref: 'User.orders'}),
      charge: text(),
      paymentStatus: text(),
      chargeDate: integer()
    //   label: virtual({
    //       graphQLReturnType: 'String',
    //       resolver: function(item) {
    //         return 'Maybe some custom label here eventually idk'
    //       }
    //   })
  }
});
