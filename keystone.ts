import "dotenv/config"
import { createAuth } from "@keystone-next/auth"
import { config, createSchema } from "@keystone-next/keystone/schema"
import { extendGraphqlSchema } from "./mutations"
import {
  withItemData,
  statelessSessions
} from "@keystone-next/keystone/session"
import {
  User,
  Letter,
  CartItem,
  OrderItem,
  Order,
  Role
} from "./schemas"
import { insertSeedData } from "./seed-data"
import { sendPasswordResetEmail } from "./lib/mail"
import { permissionsList } from "./schemas/fields"

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-firemail"

const sessionsConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long is the user signed in
  secret: process.env.COOKIE_SECRET,
  secure: false
}

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["fullName", "email", "password"]
    // TODO add in intial rolres here
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity)
    }
  }
})

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true
      }
    },
    db: {
      adapter: "mongoose",
      url: databaseURL,
      async onConnect(keystone) {
        if (process.argv.includes("--seed-data")) await insertSeedData(keystone)
      }
      // ADD data seeding here
    },
    lists: createSchema({
      // Schema items here
      User,
      Letter,
      CartItem,
      OrderItem,
      Order,
      Role
    }),
    extendGraphqlSchema,
    ui: {
      isAccessAllowed: ({ session }) => {
        return !!session?.data.role?.canManageUsers
      }
    },
    session: withItemData(statelessSessions(sessionsConfig), {
      User: `id email fullName role {${permissionsList.join(" ")} }`
    })
  })
)
