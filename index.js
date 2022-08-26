const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Script } = require("vm");
const io = new Server(server);
var path = require("path");
const { connect } = require("http2");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(path.join(__dirname, "public")));

let connected = [
  { name: "player1", id: null, status: false },
  { name: "player2", id: null, status: false },
  { name: "audience", id: null, status: false },
];

const freeUserSlot = (element) => element.id === null;

let looking4;

io.on("connection", (socket) => {
  console.log("incoming connection from " + socket.id);
  //als er geen opgeslagen rol is, geef dan de laagste rol zonder (offline) gebruiker en zet die op actief

  socket.on("host", (msg) => {
    let importDetails = msg;
    console.log(importDetails);
    socket.emit("noHost", importDetails);
  });

  socket.on("onboarding", (msg) => {
    if (!msg.storage) {
      if (connected[2].id != null) {
        console.log("overflow");
        io.emit(msg.src, { info: "no more room in lobby" });
      } else {
        //vind eerste vrije rol en zet eigen id daarin
        console.log("plugged " + socket.id);
        console.log(connected.findIndex(freeUserSlot));
        looking4 = connected.findIndex(freeUserSlot);
        connected[looking4].id = msg.src;
        //vind die rol en zet hem op actief
        connected[looking4].status = true;
        console.log(connected);

        //stuur het resultaat terug
        io.emit(msg.src, {
          info: "enlisted on spot " + looking4,
          storage: looking4,
        });
      }
    } else {
      console.log("storage backup");
      if (connected[msg.storage]) {
        console.log(
          "overwriting position " + msg.storage + " with " + socket.id
        );
        connected[msg.storage].id = msg.src;
        connected[msg.storage].status = true;
      } else {
        console.log("incorrect storage");
      }

      console.log(connected);
    }
  });

  socket.on("obituary", (msg) => {
    let disconnected = socket.id;
    console.log("unplugged " + socket.id);
    //vind de rol van de ontbonden gebruiker en zet hem op non-actief
    const sourceMatch = (element) => element.id === disconnected;
    console.log(connected.findIndex(sourceMatch));
    if (connected.findIndex(sourceMatch) != -1) {
      connected[connected.findIndex(sourceMatch)].status = false;
      connected[connected.findIndex(sourceMatch)].id = null;
    } else {
      console.log("--outdated socket left--");
    }
    console.log(connected);
  });

  socket.on("message", (msg) => {
    console.log(msg);
  });

  socket.on("sensor", (msg) => {
    io.emit("sensor", msg);
  });

  socket.on("laSensor", (msg) => {
    io.emit("laSensor", msg);
  });

  socket.on("swing", (msg) => {
    console.log(msg);
    io.emit("swing", msg);
  });

  socket.on("disconnect", () => {
    let disconnected = socket.id;
    console.log("unplugged " + socket.id);
    //vind de rol van de ontbonden gebruiker en zet hem op non-actief
    const sourceMatch = (element) => element.id === disconnected;
    console.log(connected.findIndex(sourceMatch));
    if (connected.findIndex(sourceMatch) != -1) {
      connected[connected.findIndex(sourceMatch)].status = false;
    } else {
      console.log("--outdated socket disconnected--");
    }
    console.log(connected);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
