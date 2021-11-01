import { relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const CartItem = list({
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
