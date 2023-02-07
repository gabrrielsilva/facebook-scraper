import WAWebJS from 'whatsapp-web.js';
import { client, run } from './main';

export function handleMessage(message: WAWebJS.Message) {
  if (message.body.startsWith('!pc')) { // !pc teste, avião, skin do minecraft, guitarra
    const words = message.body.replace('!pc ', '').split(', '); // ['teste', 'avião', 'skin do minecraft', 'guitarra']
    const keywords = words;
    run(keywords);
  } else if (message.body.startsWith('!')) {
    client.sendMessage(<string>process.env.CHAT_ID, 'Esse comando não existe ❌');
  }
}