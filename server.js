const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

const CHANNEL_ACCESS_TOKEN = 'nP1ll13Niq6RQZwFSq/qq6dL2PvQGDh4TCRVml/pD5dXDvXeOJglL/6amCVyXFaUEOtaHSXdncAhThMQCJAgcO1Hr1Aj9kXlhi6eFdfLKpeFR5lvj0hnouVGSEq3O01yyN3UZKSDD43dfn/Jb7gGpAdB04t89/1O/w1cDnyilFU=';
const LINE_USER_ID = '@301agjro';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', upload.single('photo'), (req, res) => {
    const { item, description, contactTimeFrom, contactTimeTo, contactPhone } = req.body;
    const photo = req.file;

    const messageText = {
        type: 'text',
        text: `維修物品：${item}\n詳細說明：${description}\n可聯絡時間：${contactTimeFrom} - ${contactTimeTo}\n聯絡手機：${contactPhone}`
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
    };

    const body = {
        to: LINE_USER_ID,
        messages: [messageText]
    };

    axios.post('https://api.line.me/v2/bot/message/push', body, { headers })
        .then(response => {
            if (photo) {
                const imagePath = path.join(__dirname, photo.path);
                const imageBuffer = fs.readFileSync(imagePath);

                const formData = {
                    to: LINE_USER_ID,
                    messages: [
                        {
                            type: 'image',
                            originalContentUrl: `https://your-server-domain/uploads/${photo.filename}`,
                            previewImageUrl: `https://your-server-domain/uploads/${photo.filename}`
                        }
                    ]
                };

                axios.post('https://api.line.me/v2/bot/message/push', formData, { headers })
                    .then(() => {
                        res.json({ success: true });
                    })
                    .catch(error => {
                        console.error('Error sending image:', error);
                        res.json({ success: false });
                    });
            } else {
                res.json({ success: true });
            }
        })
        .catch(error => {
            console.error('Error sending text message:', error);
            res.json({ success: false });
        });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});