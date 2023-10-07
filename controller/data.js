const jwt = require("jsonwebtoken");
const { OpenAI } = require("openai");
const DataModel = require("../model/data");

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"], // defaults to process.env["OPENAI_API_KEY"]
});

// let securityKey = process.env["SECRATE_KEY"];
console.log(process.env["SECRATE_KEY"]);
let securityKey = "sonu1234";

const getAllData = async (req, res) => {
    let token = req.cookies?.token;

    try {
        let verifiedToken = jwt.verify(token, securityKey);

        if (!verifiedToken) {
            return res.status(400).json({ status: "fail", message: "token is not valid" });
        }

        let userId = verifiedToken.id;
        let allChatData = await DataModel.find({ createdBy: userId });

        return res.status(200).json({ result: allChatData, message: "data fetched successfully", userName: verifiedToken.email });

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message });
    }
}

const generateChat = async (req, res) => {
    let token = req.cookies?.token;
    let question = req.body.question;
    let chatId = req.body.chatId;


    try {
        let verifiedToken = jwt.verify(token, securityKey);

        if (!verifiedToken) {
            return res.status(400).json({ status: "fail", message: "token is not valid" });
        }


        try {

            let response = await openai.chat.completions.create({
                messages: [{ role: 'user', content: question }],
                model: 'gpt-3.5-turbo',
            });

            // message = response["choices"][0]["message"]
            console.log("message is: ", response.choices[0].message)

            let obj = {
                question: question,
                answer: response.choices[0].message.content,
            }

            if (chatId) {
                let savedData = await DataModel.updateOne({ _id: chatId }, { $push: { chatData: obj } })
                return res.status(200).json({ result: response.choices[0].message.content, chatId: chatId });

            } else {
                let savedData = await DataModel.create({ chatName: question, createdBy: verifiedToken.id, chatData: [obj] });

                return res.status(200).json({ result: response.choices[0].message.content, chatId: savedData._id });
            }

        } catch (error) {
            // Consider adjusting the error handling logic for your use case
            if (error.response) {
                console.error(error.response.status, error.response.data);
                res.status(error.response.status).json(error.response.data);
            } else {
                console.error(`Error with OpenAI API request: ${error.message}`);
                res.status(500).json({
                    error: {
                        message: 'An error occurred during your request.',
                    }
                });
            }
        }


    } catch (error) {
        console.log(error.message);
        res.status(400).json({ status: "fail", message: error.message });
    }

}




const editChat = async (req, res) => {
    const { id, chatName } = req.body;

    try {
        let updatedData = await DataModel.findByIdAndUpdate({ _id: id }, { chatName });
        console.log("updated chat is: ", updatedData);
        return res.status(200).json({ status: "success", message: "chatName updated" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: 'fail', message: error.message })
    }
}

const deleteChat = async (req, res) => {
    let id = req.body.id;
    try {
        let deltedData = await DataModel.findByIdAndDelete({ _id: id });
        console.log(deltedData);
        return res.status(200).json({ status: "success", message: "Chat deleted" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllData, generateChat, editChat, deleteChat };