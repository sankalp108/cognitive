const express = require('express')
const router = express.Router();
const OpenAIApi = require("openai");

const openai = new OpenAIApi({
    apiKey: "sk-proj-8sFJgN0yDdu3XP9W7CFVT3BlbkFJxvtopFmoOYH8aDNohfDB"
});

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
        });
        res.json({ response: completion.choices[0].message.content?.trim() })
    } catch (error) {
        console.log(error.message)
        res.json({ response: "Something went wrong. Try again later!" })
    }
})

module.exports = router;
