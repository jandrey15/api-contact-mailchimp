require('dotenv').config()

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT,
  listId: process.env.LISTID,
  apiKeyMail: process.env.API_KEY_MAIL
}

module.exports = { config }
