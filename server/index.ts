import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

// 这就是 SSE 的核心端点
app.get('/events', (req, res) => {
  // 1. 设置响应头，告诉浏览器这是 SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('Client connected');

  const text = `“孔乙己是站着喝酒而穿长衫的唯一的人。他身材很高大；青白脸色，皱纹间时常夹些伤痕；一部乱蓬蓬的花白的胡子。穿的虽然是长衫，可是又脏又破，似乎十多年没有补，也没有洗。他对人说话，总是满口之乎者也，叫人半懂不懂的。因为他姓孔，别人便从描红纸上的“上大人孔乙己”这半懂不懂的话里，替他取下一个绰号， 叫作孔乙己。”`

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
