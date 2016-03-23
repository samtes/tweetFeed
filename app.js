"use strict";

const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const cons = require("consolidate");

app.engine("html", cons.swig);
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "html");
app.use(express.static(path.join(__dirname + "/public")));
app.set("port", process.env.PORT || 3002);

router.get("/", (req, res) => {
  res.render("index", {});
});

app.use("/", router);

server.listen(app.get("port"));

let Twitter = require("twitter");

let client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

let runnungStream;

io.sockets.on("connection", socket => {
  socket.on("start stream", data => {
    client.stream("user", {track: data, language: "en"}, stream => {
      runnungStream = stream;

      stream.on("data", tweet => {
        io.sockets.emit("new stream", tweet);
      });

      stream.on("error", error => {
        console.log(error);
      });
    });
  });

  socket.on("stop stream", data => {
    runnungStream.destroy();
  });
});
