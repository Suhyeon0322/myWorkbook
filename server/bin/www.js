const app = require("../server");

const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log('Node.js Server is running on port 5000...'));