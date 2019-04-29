const mongoose = require('mongoose');
const { check,validationResult } = require('express-validator/check');
const config = require('config');

// DB Config
const db = config.get('mongoURI');
const apiKey = config.get('sendGridKey');


mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));


require('../models/email');
const Email = mongoose.model('emails');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(apiKey);


module.exports = app => {
    app.post('/send-email', [
        check('name').isLength({ min: 1 }).trim().withMessage('Name empty.'),
        check('email').isEmail().withMessage('email is invalid').normalizeEmail(),
        check('subject').isLength({ min: 1 }).trim().withMessage('subject is empty.'),
        check('message').isLength({min: 1}).trim().withMessage('message is empty'),

        
    ] ,(req, res) => {
        const errors = validationResult(req);
       
        if(!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
        new Email({
            from: req.body.name,
            emailAddress: req.body.email,
            subjectLine: req.body.subject,
            body: req.body.message,
            date: Date()
        })
        .save(function (err, doc) {
            if (err)
                res.json('Whoops! I\'m sorry, an error happened while sending your message. Please send a message directly to <a href="mailto:rg3646@outlook.com">rg3646@outlook.com');
            else
                res.send(`Thanks for reaching out ${req.body.name}!`);
        });

        // email adress Config
        const email = config.get('emailAddress');
        const msg = {
            to: email,
            from: req.body.email,
            emailAddress: req.body.email,
            subject: req.body.subject,
            text: req.body.message,
            html: `<h1>from: ${req.body.name}</h1>
                  <p>${req.body.message}</p>`
        };

        sgMail.send(msg);
    });
}