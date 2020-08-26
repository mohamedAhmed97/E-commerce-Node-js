const mongoose = require('mongoose');
mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected To DB");
}).
    catch(error => handleError(error));
;
