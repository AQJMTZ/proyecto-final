const app = require("express")();
const { ok } = require("assert");
const bodyParser = require("body-parser");
const http = require("http").Server(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  path: "/"
});

const client = require("socket.io-client");

var Argumentos = process.argv.slice(2);
const port = process.env.PORT || Argumentos[0];
var messages = [];
var socketOut = null;

app.get("/", (req, res) => {
  res.send("ASCP framework");
});
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors);

app.post("/test", (req, res) => {
  console.log("Got body:", req.body);
  res.sendStatus(200);
});
app.get("/conectar", (req, res) => {
  console.log(req.query.host);
  res.send("Host " + req.query.host);
  socketOut = client.connect(req.query.host);
  console.log(socketOut);
});

app.get("/enviar_mensaje", (req, res) => {
  res.send("Mensaje " + req.query.msg);
  socketOut.emit("Mensaje ASCP", req.query.msg);
});


app.post("/enviar_mensaje", (req, res) => {
  console.log("Got body:", req.body);
  res.send("Mensaje: " + req.body.data);
  socketOut.emit("Mensaje ASCP", req.body);
});

app.get("/obtener_ultimo_mensaje", (req, res) => {
  res.send("Ultimo: " + messages[messages.length - 1]);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} se ha conectado`);

  socket.on("Mensaje ASCP", (ascp_msg) => {
    console.log(socket.id + " " + JSON.stringify(ascp_msg));
    messages.push(ascp_msg);
    io.emit("Mensaje ASCP", ascp_msg);
    if(ascp_msg.function === 1) {
      io.emit("Mensaje ASC", ascp_msg);
    }
  });
});

http.listen(port, () => {
  console.log(`Escuchando en http://localhost:${port}/`);
});
