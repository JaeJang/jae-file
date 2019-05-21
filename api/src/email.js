import _ from 'lodash';
import {url, cryptrPw} from './config';

export default class Email {

    constructor(app) {

        this.app = app;
    }

    encryptPostId(postId) {

    }

    async sendLink(post ,cb = () => {}) {

        const app = this.app;
        const email = app.email;
        const cryptr = app.get('cryptr');

        const from = _.get(post, 'from');
        const to = _.get(post, 'to');
        const message = _.get(post, 'message', '');
        const postId = _.get(post, '_id');
        const encryptedId = cryptr.encrypt(postId);
        const link = `${url}/share/${encryptedId}`;

        // send mail with defined transport object
        let info = await email.sendMail({
            from: from, // sender address
            to: to, // list of receivers
            subject: "[SEND IT] Download Invitation", // Subject line
            text: message, // plain text body
            html: `<p>${from} has send files to you. Click <a href="${link}">here</a> to download.</p><p>${message}</p>` // html body
        }, (error, info) => {

            return cb(error, info);
        });
    }
}