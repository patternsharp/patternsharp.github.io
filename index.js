const mailgun = require("mailgun-js");
const DOMAIN = 'xxx';
const mg = mailgun({apiKey: 'xxx', domain: DOMAIN});
const data = {
	from: clientAddress,
	to: 'a@gmail.com',
	subject: 'Hello',
	text: clientName + "::" + clientTxt
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});