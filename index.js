const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const { log } = require("console");
const axios = require('axios');
const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const data = {
  select: function () {
    return JSON.parse(fs.readFileSync("./test.json"));
  },
  insert: function (newObj) {
    const jsonData = data.select();
    const newData = [...jsonData, { id: jsonData.length + 1, ...newObj }];
    fs.writeFileSync("./test.json", JSON.stringify(newData));
    return newData;
  },
  update: function () {},
  delete: function () {},
};

app.get("/abc", function (req, res) {
  res.send(data.select());
});

app.delete("/abc/:id", function (req, res) {
  const jsonData = data.select();

  const { id } = req.params;
  const newData = jsonData.filter((n) => n.id != id);
  fs.writeFileSync("./test.json", JSON.stringify(newData));
  res.send(newData);
});

app.post("/insert", function (req, res) {
  res.send(data.insert(req.body));
});

app.get("/endgame", async function (req, res) {
  const key = "095E77F5939B44CE8D0B9CAF5C219B20";

  const {word} = req.query;
  const d = await axios.get(`https://opendict.korean.go.kr/api/search?key=${key}&q=${word}&req_type=json&start=1&num=100`)
                                              
  res.send(d.data);
});

app.listen(3000);
