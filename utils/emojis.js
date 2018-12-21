// 定义表情和图片的对应关系
import emojis from './ejdata'
// 将表情文字转为图片
const emojiToPath = (i) => `/pages/imgs/emojis/${emojis[i]}.gif`

// 将聊天内容转为一个文字和图片混合的列表
const textToEmoji = (s) => {
  const r = /\[[^\[\]]+?\]/g;

  const a = [];
  let t = null;
  let i = 0;

  while (true) {
    t = r.exec(s);
    if (t) {
      a.push({
        msgType: 'text',
        msgCont: s.slice(i, t.index)
      });

      if (emojis[t[0]]) {
        a.push({
          msgType: 'emoji',
          msgCont: t[0],
          msgImage: emojiToPath(t[0])
        });
      } else {
        a.push({
          msgType: 'text',
          msgCont: t[0]
        });
      }

      i = t.index + t[0].length;
    } else {
      a.push({
        msgType: 'text',
        msgCont: s.slice(i)
      });
      break;
    }
  }

  return a;
}

module.exports = {
  emojis,
  emojiToPath,
  textToEmoji,
}

