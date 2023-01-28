import WAWebJS from 'whatsapp-web.js';
import { client, run } from './main';

export function handleMessage(message: WAWebJS.Message) {
  if (message.body.startsWith('!pc')) { // !pc teste avião skin game guitarra
    const words = message.body.split(' ');
    words.shift(); // remove !pc
    const keywords = words;
    run(keywords);
  } else if (message.body.startsWith('!')) {
    client.sendMessage(<string>process.env.CHAT_ID, 'Esse comando não existe ❌');
  }
}