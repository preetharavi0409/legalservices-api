const app = require('./app');
const http = require('http');


const port = process.env.PORT; //|| 8000;

const httpServer = http.createServer(app);

const server = httpServer.listen(port, () => {
  console.log(`Connected to port ` + port);
});

process.on('unhandledRejection',err=>{
    console.log(`Shutting ddown`);
    console.log(err);
    server.close(()=>{
        process.exit(1);
    })

});