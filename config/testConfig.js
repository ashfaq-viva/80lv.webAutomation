import dotenv from 'dotenv';
dotenv.config();

export const config = {
  "80LV_PROD": "https://80.lv",
  "80LV_QA": "https://test.80lv.srv.local",
  "80LV_DEV": "https://localhost:3000",
  "ADMIN_PROD": "",
  "ADMIN_QA": "http://test-admin.80lv.srv.local",


  "credentials": {
    "existingUser": "ashfaq.ahmed@vivasoftltd.com",
    "existingUserPassword": "Ashfaq123",
    "talentEmail": process.env.TALENT_EMAIL, 
    "talentPassword": process.env.TALENT_PASSWORD,
    "recruiterEmail": process.env.RECRUITER_EMAIL,
    "recruiterPassword": process.env.RECRUITER_PASSWORD,

  },
  "data":{
    "invalidSearch": "adasd",
    "validSearch": "watch j hil"
  }
}

