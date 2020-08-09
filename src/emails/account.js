const sgMail = require('@sendgrid/mail')
require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (name, email)=>{
    sgMail.send({
        to: email,
        from: 'expertsanoy@gmail.com',
        subject: 'Thanks for joining in', 
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })   
}

const sendCancelEmail = (name, email)=>{
    sgMail.send({
        to: email,
        from:'expertsanoy@gmail.com',
        subject: 'Goodbye '+name,
        text: `Please let us know why you left our service. Can't wait to see back again`
    })
}

module.exports = {
    sendWelcomeEmail, 
    sendCancelEmail
}
