// api/apiMap.js
import { config } from '../config/testConfig.js';
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
    loginApi: { url: "https://login.xsolla.com/api/login",methods: { ...defaultMethods }},
    signupApi: { url:"https://login.xsolla.com/api/user",methods: { ...defaultMethods }},
    partnersApi: { url:"https://80.lv/api/partners",methods: { ...defaultMethods }},
    articlePopularListPage1Api: { url:"https://80.lv/api/articles/list?category=&page=1&total=10&sort=popular",methods: { ...defaultMethods }},
    subscribeApi: { url:"https://80.lv/api/user/subscribe",methods: { ...defaultMethods }},
    allEventsFilterOldestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=sort&online=",methods: { ...defaultMethods }},
    allEventsFilterOldestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=sort&online=",methods: { ...defaultMethods }},
    onlineEventsFilterOldestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=sort&online=1",methods: { ...defaultMethods }}, 
    onlineEventsFilterOldestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=sort&online=1",methods: { ...defaultMethods }}, 
    offlineEventsFIlterOldestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFIlterOldestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=sort&online=0",methods: { ...defaultMethods }},
    allEventsFilterNewestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-sort&online=",methods: { ...defaultMethods }},
    allEventsFilterNewestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-sort&online=",methods: { ...defaultMethods }},
    alleventsFilterAToZApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=title&online=",methods: { ...defaultMethods }},
    alleventsFilterAToZPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=title&online=",methods: { ...defaultMethods }},
    alleventsFilterZToAApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-title&online=",methods: { ...defaultMethods }},
    alleventsFilterZToAPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-title&online=",methods: { ...defaultMethods }},
    onlineEventsFilterNewestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-sort&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterNewestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-sort&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterAToZApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterAToZPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterZToAApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterZToAPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-title&online=1",methods: { ...defaultMethods }},
    offlineEventsFilterNewestApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterNewestPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterAToZApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterAToZPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterZToAApi: { url:"https://80.lv/api/events?total=10&title=&page=1&sort=-title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterZToAPage2Api: { url:"https://80.lv/api/events?total=10&title=&page=2&sort=-title&online=0",methods: { ...defaultMethods }},
    allEventsValidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=`,methods: { ...defaultMethods }},
    allEventsInvalidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=`,methods: { ...defaultMethods }},
    onlineEventsValidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=1`,methods: { ...defaultMethods }}, 
    onlineEventsInvalidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=1`,methods: { ...defaultMethods }}, 
    offlineEventsValidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=0`,methods: { ...defaultMethods }},
    offlineEventsInvalidSearchApi: { url:`https://80.lv/api/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=0`,methods: { ...defaultMethods }},

    },
  "80LV_QA": {
    loginApi: { url: "https://login.xsolla.com/api/login",methods: { ...defaultMethods }},
    signupApi: { url:"https://login.xsolla.com/api/user",methods: { ...defaultMethods }},
    partnersApi: { url:"https://80.lv/api/partners",methods: { ...defaultMethods }},
    articlePopularListPage1Api: { url:"https://api.test.80lv.srv.local/articles/list?category=&page=1&total=10&sort=popular",methods: { ...defaultMethods }},
    subscribeApi: { url:"https://api.test.80lv.srv.local/user/subscribe",methods: { ...defaultMethods }},
    allEventsFilterOldestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=sort&online=",methods: { ...defaultMethods }},
    allEventsFilterOldestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=sort&online=",methods: { ...defaultMethods }},
    onlineEventsFilterOldestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=sort&online=1",methods: { ...defaultMethods }}, 
    onlineEventsFilterOldestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=sort&online=1",methods: { ...defaultMethods }}, 
    offlineEventsFIlterOldestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFIlterOldestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=sort&online=0",methods: { ...defaultMethods }},
    allEventsFilterNewestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-sort&online=",methods: { ...defaultMethods }},
    allEventsFilterNewestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-sort&online=",methods: { ...defaultMethods }},
    alleventsFilterAToZApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=title&online=",methods: { ...defaultMethods }},
    alleventsFilterAToZPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=title&online=",methods: { ...defaultMethods }},
    alleventsFilterZToAApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-title&online=",methods: { ...defaultMethods }},
    alleventsFilterZToAPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-title&online=",methods: { ...defaultMethods }},
    onlineEventsFilterNewestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-sort&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterNewestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-sort&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterAToZApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterAToZPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterZToAApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-title&online=1",methods: { ...defaultMethods }},
    onlineEventsFilterZToAPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-title&online=1",methods: { ...defaultMethods }},
    offlineEventsFilterNewestApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterNewestPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-sort&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterAToZApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterAToZPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterZToAApi: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=1&sort=-title&online=0",methods: { ...defaultMethods }},
    offlineEventsFilterZToAPage2Api: { url:"https://api.test.80lv.srv.local/events?total=10&title=&page=2&sort=-title&online=0",methods: { ...defaultMethods }},
    allEventsValidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=`,methods: { ...defaultMethods }},
    allEventsInvalidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=`,methods: { ...defaultMethods }},
    onlineEventsValidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=1`,methods: { ...defaultMethods }}, 
    onlineEventsInvalidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=1`,methods: { ...defaultMethods }}, 
    offlineEventsValidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.validEventSearch}&page=1&sort=sort&online=0`,methods: { ...defaultMethods }},
    offlineEventsInvalidSearchApi: { url:`https://api.test.80lv.srv.local/events?total=10&title=${config.data.invalidEventSearch}&page=1&sort=sort&online=0`,methods: { ...defaultMethods }},

  }
};

// Export only the current environment APIs
const currentApiMap = apiMap[ENV];
if (!currentApiMap) {
  throw new Error(`No API mapping found for environment: ${ENV}`);
}

export default currentApiMap;
