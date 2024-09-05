import 'dotenv/config';
import axios from 'axios';
import { format as formatDate, parse as parseDate } from 'date-fns';

const WB_API_KEY_ADV = process.env.WB_API_KEY_ADV;
const apiUrl = 'https://advert-api.wildberries.ru/adv/v0/';

const campaigns = process.env.CAMPAIGN_IDS.split(',').map((campaignId) => ({
  id: campaignId,
  started: false,
}));
// пока только одно время для всех и только старт
const timeStart = process.env.TIME_START;
// const timePause = process.env.TIME_PAUSE;

const getNow = () => new Date();

const log = (text) => (
  console.log(`[${formatDate(getNow(), 'dd.LL.yyyy HH:mm:ss')}]: ${text}`)
);

const getCampaignById = (campaignId) => campaigns.find(({ id }) => id === campaignId);

const campaignAction = async (campaignId, action) => {
  try {
    await axios({
      method: 'get',
      url: `${apiUrl}${action}?id=${campaignId}`,
      responseType: 'json',
      headers: { 'Authorization': WB_API_KEY_ADV },
    });
    getCampaignById(campaignId).started = true;
    log(`Кампания (${campaignId}) успешно запущена!`);
  } catch (err) {
    // console.log(err);
    log('Запрос к API WB завершился с ошибкой');
    console.log(`Код ответа: ${err.response.status}`);
    console.log(`Текст ошибки: ${err.response.data.error}`);
    // process.exit(0);
  }
};

const app = async () => {
  console.log(`[${formatDate(getNow(), 'dd.LL.yyyy HH:mm:ss')}]: Приложение изменения активности WB кампаний запущено!`);
  setInterval(async () => {
    const now = getNow(); 
    const dateStart = parseDate(`${formatDate(now, 'dd.LL.yyyy')} ${timeStart}`, 'dd.LL.yyyy HH:mm', now);
    if (now > dateStart && (now - dateStart) < (1000 * 60 * 60)) {
      campaigns.filter(({ started }) => !started).forEach(async ({ id }) => await campaignAction(id, 'start'));
    }
  }, 60 * 1000);
};

await app();