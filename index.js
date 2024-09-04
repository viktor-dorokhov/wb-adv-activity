import 'dotenv/config';
import axios from 'axios';
import { format as formatDate, parse as parseDate } from 'date-fns';

const WB_API_KEY_ADV = process.env.WB_API_KEY_ADV;
const apiUrl = 'https://advert-api.wildberries.ru/adv/v0/';

// const campaignIds = process.env.CAMPAIGN_IDS.split(',');
// пока только одна кампания
const campaignId = process.env.CAMPAIGN_IDS;
// пока только одно время и только старт
const timeStart = process.env.TIME_START;
// const timePause = process.env.TIME_PAUSE;
let globalTimer;
let started = false;

const campaignAction = async (id, action) => {
  const now = new Date(); 
  try {
    const response = await axios({
      method: 'get',
      url: `${apiUrl}${action}?id=${id}1`,
      responseType: 'json',
      headers: { 'Authorization': WB_API_KEY_ADV },
    });
    started = true;
    console.log(`[${formatDate(now, 'dd.LL.yyyy HH:mm:ss')}]: Кампания успешно запущена!`);
  } catch (err) {
    // console.log(err);
    console.log(`[${formatDate(now, 'dd.LL.yyyy HH:mm:ss')}]: Запрос к API WB завершился с ошибкой`);
    console.log(`Код ответа:${err.response.status}`);
    console.log(`Текст ошибки:${err.response.data.error}`);
    // process.exit(0);
  }
};

const app = async () => {
  console.log('Приложение изменения активности WB кампаний запущено!');
  globalTimer = setInterval(async () => {
    const now = new Date(); 
    const dateStart = parseDate(`${formatDate(now, 'dd.LL.yyyy')} ${timeStart}`, 'dd.LL.yyyy HH:mm', now);
    if (!started && now > dateStart && (now - dateStart) < (1000 * 60 * 60)) {
      await campaignAction(campaignId, 'start');
    }
  }, 60* 1000);
};

await app();