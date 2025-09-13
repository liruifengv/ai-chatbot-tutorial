const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());
app.use(express.static('public'));

// 这就是 SSE 的核心端点
app.get('/events', (req, res) => {
    // 1. 设置响应头，告诉浏览器这是 SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log('Client connected');

    const text = `“孔乙己是站着喝酒而穿长衫的唯一的人。他身材很高大；青白脸色，皱纹间时常夹些伤痕；一部乱蓬蓬的花白的胡子。穿的虽然是长衫，可是又脏又破，似乎十多年没有补，也没有洗。他对人说话，总是满口之乎者也，叫人半懂不懂的。因为他姓孔，别人便从描红纸上的“上大人孔乙己”这半懂不懂的话里，替他取下一个绰号， 叫作孔乙己。

    孔乙己一到店，所有喝酒的人便都看着他笑，有的叫道，“孔乙己，你脸上又添上新伤疤了！”他不回答，对柜里说，“温两碗酒，要一碟茴香豆。”便排出九文大 钱。他们又故意的高声嚷道，“你一定又偷了人家的东西了！”孔乙己睁大眼睛说，“你怎么这样凭空污人清白……”“什么清白？我前天亲眼见你偷了何家的书，吊着打。”孔乙己便涨红了脸，额上的青筋条条绽出，争辩道，“窃书不能算偷……窃书！……读书人的事，能算偷么？”接连便是难懂的话，什么“君子固穷”，什么“者乎”之类，引得众人都哄笑起来：店内外充满了快活的空气。”
    `

    // 2. 每隔100毫秒给客户端发送一个字符
    res.write('event: start\n');
    res.write('data: start\n\n');
    let charIndex = 0;
    const intervalId = setInterval(() => {
        if (charIndex < text.length) {
            // 消息格式必须是 "data: ...\n\n"
            res.write(`data: ${text[charIndex]}\n\n`);
            charIndex++;
        } else {
            // 所有字符发送完毕，发送结束事件
            res.write('event: end\n');
            res.write('data: end\n\n');
            clearInterval(intervalId);
        }
    }, 30);

    // 3. 当客户端关闭连接时，停止发送
    req.on('close', () => {
        console.log('Client disconnected');
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(port, () => {
    console.log(`SSE server listening at http://localhost:${port}`);
});