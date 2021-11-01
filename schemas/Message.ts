import { relationship, select, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Message = list({
  ui: {
    listView: {
      initialColumns: [
        'content',
        'recipientName',
        'recipientAddress',
        'images',
      ],
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
    recipientAddress: text({
      isRequired: true,
      ui: {
        displayMode: 'input',
      },
    }),
    content: text({
      isRequired: true,
      ui: {
        displayMode: 'textarea',
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Sent', value: 'SENT' },
        { label: 'Pending', value: 'PENDING' },
      ],
      defaultValue: 'DRAFT',
    }),
    images: relationship({
      ref: 'MessageImage.message',
      many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image'],
        inlineCreate: {
          fields: ['image'],
        },
        inlineEdit: {
          fields: ['image'],
        },
      },
    }),
    user: relationship({
      ref: 'User.messages',
    }),
  },
});
