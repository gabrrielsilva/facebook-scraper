import { handleMessage } from './handleMessage';
import { client } from './main';

client.on('message', async message => {
  const chatID = (await message.getChat()).id;
  if (chatID._serialized === process.env.CHAT_ID) {
    handleMessage(message);
  }
})