import { relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { rules, isSignedIn } from '../access';

export const CartItem = list({
  access: {
    create: isSignedIn,
    read: rules.canOrder,
    update: rules.canOrder,
    delete: rules.canOrder,
  },
  ui: {
    listView: {
      initialColumns: ["letter", "user"]
    }
  },
  fields: {
    letter: relationship({ ref: 'Letter' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
