
const jwt = require("jsonwebtoken");


        const token = jwt.sign({ email : "whatsapp@carnotresearch.com" }, "secret", {
          algorithm: "HS256"
        });
        console.log("token: ", token);