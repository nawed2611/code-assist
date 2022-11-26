from flask import Flask, request
from flask_cors import CORS, cross_origin
import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app,)

@cross_origin('*')
@app.route('/', methods=['GET', 'POST'])
def home():

    if request.method == 'POST':

        data = request.json
        data = data['transcripts']
        print(data)
        response = openai.Completion.create(
        model="code-davinci-002",
        prompt=data,
        temperature=0,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
        )
        final_response = {"answer": response["choices"][0]["text"]}
        return final_response, 200, {'Access-Control-Allow-Origin': '*'}

app.run(debug=True)
