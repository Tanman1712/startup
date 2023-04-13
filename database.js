const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const Question = require('./global_classes.js');

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME;

if (!userName) {
  throw Error('Database not configured. Set environment variables');
}

const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const userCollection = client.db('startup').collection('user');
const questionCollection = client.db('startup').collection('questions');
const suggestionCollection = client.db('startup').collection('suggestions');

function getUser(username) {
  return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function createUser(username, password) {
  // Hash the password before we insert it into the database
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    username: username,
    password: passwordHash,
    token: uuid.v4(),
    responses: [],
  };
  await userCollection.insertOne(user);

  return user;
}

async function addResp(resp) {
  // resp = { username: username, response: 0 or 1 }
  await userCollection.findOneAndUpdate({ username: resp.username}, {$push: { responses: resp.response }});
}

async function updateQPerc(question) {
  // question = { text: text, choice: 0 or 1}
  let currQuestion = new Question( await questionCollection.findOne({ text: question.text }));
  currQuestion.updatePercents(question.choice);
  questionCollection.findOneAndReplace({ text: question.text }, currQuestion, {returnNewDocument: true});
  return currQuestion;
}

function getQuestions() {
  return questionCollection.find({}).toArray();
}

async function email(text) {
  if (text === "" || text === null)
    return;
  await suggestionCollection.insertOne({words: text});
  return "hi";
}

module.exports = {
  getUser,
  getUserByToken,
  createUser,
  addResp,
  updateQPerc,
  getQuestions,
  email,
};