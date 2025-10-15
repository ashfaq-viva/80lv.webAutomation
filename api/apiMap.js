// api/apiMap.js

const ENV = process.env.ENV || '80LV_PROD';

// Default methods with expectedStatus
const defaultMethods = {
  GET:    { expectedStatus: 200 },
  POST:   { expectedStatus: 200 },
  PUT:    { expectedStatus: 200 },
  PATCH:  { expectedStatus: 200 },
  DELETE: { expectedStatus: 200 },
};

const apiMap = {
  "80LV_PROD": {
    cookieApi: { url: "https://cdn.80.lv/api", methods: { ...defaultMethods } },
    loginApi: { url: "https://login.xsolla.com/api/login",methods: { ...defaultMethods },
    signupApi: { url:"https://login.xsolla.com/api/user",methods: { ...defaultMethods }},
    }
  },
  "80LV_QA": {
    cookieApi: { url: "https://cdn.80.lv/api", methods: { ...defaultMethods } },
    loginApi: { url: "https://login.xsolla.com/api/login",methods: { ...defaultMethods },
    signupApi: { url:"https://login.xsolla.com/api/user",methods: { ...defaultMethods }},
    }
  }
};

// Export only the current environment APIs
const currentApiMap = apiMap[ENV];
if (!currentApiMap) {
  throw new Error(`No API mapping found for environment: ${ENV}`);
}

export default currentApiMap;
