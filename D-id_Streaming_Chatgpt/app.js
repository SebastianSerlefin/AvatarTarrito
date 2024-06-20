const express = require('express');
const http = require('http');
const OpenAI = require('openai');



const Groq = require("groq-sdk");

// import Groq from 'groq-sdk';
// const Groq = require("groq-sdk");
  // const groq = new Groq(); // Initialize Groq
const groq = new Groq({ apiKey: "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" });

  const openai = new OpenAI({
    apiKey: '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', // This is the default and can be omitted
  });


  // Function adapted for Groq's API
  async function fetchGroqResponse(userMessage) {

    console.log("First Step")
    try {
      

      const chatCompletion = await openai.chat.completions.create({
        messages: [{
          role: "system",
          content: "Vas a clasificar las preguntas que te hacen en categorías, si hay alguna pregunta que no es sobre tarrito rojo por favor devuelve @FUERA_CONTEXTO@",
        },
        {
          role: "user",
          content: userMessage,
        }],
        model: 'ft:gpt-3.5-turbo-0125:serlefin:jgbtarrito01:9btHtzjn',
        temperature: 0.01,
      });
      // Assuming the response structure is similar to OpenAI's, adjust accordingly
       console.log(chatCompletion.choices[0]?.message?.content.trim())
      
      return chatCompletion.choices[0]?.message?.content.trim() || '';
      
    } catch (error) {
      console.error('openAI API request failed:', error);
      throw error; // Rethrow or handle as needed
    }
  }
  

const port = 3000;

const app = express();
app.use('/', express.static(__dirname));
app.use(express.urlencoded());
const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

app.post('/fetchGroqResponse', async(req, res) => {

    console.log(req.body)
    var userInput = req.body.userInput
    console.log(userInput)
    res.send(
        {
            "message": await fetchGroqResponse(userInput)

        })

})
app.get('/helloworld', async(req, res) => {

    await fetchGroqResponse("What is the highest peak on earth")

    

    res.send(
        {

            message:"Hello World"

        }


    )

})
const server = http.createServer(app);

server.listen(port, () => console.log(`Server started on port localhost:${port}`));
