var nodemailer = require('nodemailer');
class XL_GOI_THU_DIEN_TU {
    Goi_Thu_Lien_he (from,to,subject,body){
        var transporter = nodemailer.createTransport({
            service :'gmail',
            auth : {
                user : 'mephim2804@gmail.com',
                pass : 'huudinh2804'
            }
        });
        var mailOptions = {
            from : `Nhóm 2 JS250T4CN <${from}>`,
            to : to,
            subject : subject,
            html : body
        };
        return transporter.sendMail(mailOptions);
    }
}

var Goi_thu = new XL_GOI_THU_DIEN_TU()
module.exports = Goi_thu