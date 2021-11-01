import { relationship, text, integer } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Letter = list({
  ui: {
    listView: {
      initialColumns: ['content', 'recipientName', 'addressLine1'],
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
    content: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    price: integer({ defaultValue: 200 }), // not an ideal way of pricing things
    user: relationship({
      ref: 'User.letters',
      defaultValue: ({ context }) => ({
        connect: { id: context.session.itemId },
      }),
    }),
  },
  label: 'recipientName'
});
