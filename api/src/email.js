import _ from 'lodash';
import {url, cryptrPw} from './config';

export default class Email {

    constructor(app) {

        this.app = app;
    }

    breakLines(message = ''){
        const eachLine = message.split('\n');
        let newMessage = '';
        _.each(eachLine, line => {
            newMessage += `${line}<br>`;
            
        });

        return newMessage;
    }

    async sendLink(post ,cb = () => {}) {

        const app = this.app;
        const email = app.email;
        const cryptr = app.get('cryptr');

        const from = _.get(post, 'from');
        const to = _.get(post, 'to');
        const title = _.get(post, 'title', '');
        const message = this.breakLines(_.get(post, 'message', ''));
        const postId = _.get(post, '_id');
        const link = `${url}/share/${postId}`;

        const subject = title !== '' ? `[SEND IT] ${title}` : `[SEND IT] Download link from ${from}`;
        // send mail with defined transport object
        let info_to = await email.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: message, // plain text body
            html: `<p>${from} has sent files to you. Click <a href="${link}">here</a> to download.</p><p>Or copy this URL <br>${list} </p><p>${message}</p>` // html body
        }, (error, info) => {

            return cb(error, info);
        });

        let info_from = await email.sendMail({
            from: from, // sender address
            to: from, // list of receivers
            subject: `[SEND IT] Confirmation`, // Subject line
            text: '', // plain text body
            html: `<p>You have sent files to ${to}. Click <a href="${link}">here</a> to download.</p>` // html body
        }, (error, info) => {

            return cb(error, info);
        });
    }
}