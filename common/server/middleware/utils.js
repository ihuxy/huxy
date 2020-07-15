const crypto=require('crypto');

const sha512=(str,options)=>crypto.createHmac('sha512',options.salt.toString()).update(str).digest('hex');

module.exports=sha512;

