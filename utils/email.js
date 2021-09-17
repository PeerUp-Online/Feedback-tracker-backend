const sendGridMail = require('@sendgrid/mail')

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (options) => {
    const mail = {
        to: options.to, // Change to your recipient
        from: '"Fred Foo 👻" <help@fbt.com>', // Change to your verified sender
        subject: options.subject,
        text: options.message,
        html: `<strong>${options.message}</strong>`,
    }

    await sendGridMail.send(mail)
}

module.exports = sendMail
