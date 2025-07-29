// middleware/sanitize.js
const xss = require("xss");

function sanitizeBody(req, res, next) {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
}

module.exports = sanitizeBody;