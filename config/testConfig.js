import dotenv from 'dotenv';
dotenv.config();

export const config = {
  "80LV_PROD": "https://80.lv",
  "80LV_QA": "https://test.80lv.srv.local",
  "80LV_DEV": "https://localhost:3000",

  "credentials": {
    "talentEmail": process.env.TALENT_EMAIL, 
    "talentPassword": process.env.TALENT_PASSWORD,
    "companyEmail": process.env.COMPANY_EMAIL,
    "companyPassword": process.env.COMPANY_PASSWORD,
    "invalidEmail": "invalidEmail.com"
  },
  "slug":{
    "allArticlesPage": "/articles",
    "eventsPage": "/events",
  },
  "data":{
    "invalidSearch": "adasd",
    "validSearch": "watch j hil",
    "validEventSearch": "game",
    "invalidEventSearch": "asdfghjkl",
  }
}

