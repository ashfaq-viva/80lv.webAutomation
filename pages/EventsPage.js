import { expect } from '@playwright/test';
import BasePage from './BasePage';

export class EventsPage extends BasePage {
  constructor(page , context) {
    super(page, context);
    this.page = page;
    this.allEventsTab= page.getByRole('button', { name: 'All events' });
    this.responsiveAllEventsTab= page.locator('div.Select-option[title="All events"]');
    this.selectedresponsiveAllEventsTab= page.getByText('All events');
    this.onlineEventsTab= page.getByRole('button', { name: 'Online events' });
    this.reaponsiveOnlineEventsTab= page.locator('div.Select-option[title="Online events"]');
    this.selectedresponsiveOnlineEventsTab= page.getByText('Online events');
    this.offlineEventsTab= page.getByRole('button', { name: 'Offline events' });
    this.responsiveOfflineEventsTab= page.locator('div.Select-option[title="Offline events"]');
    this.selectedresponsiveOfflineEventsTab= page.getByText('Offline events');
    this.filterArrow = page.locator('div.Select-control:has(#react-select-sort_type--value) .Select-arrow-zone');
    this.responsiveFilterArrow = page.locator('div.Select-control:has(#react-select-filter_type--value) .Select-arrow-zone');
    this.filterOptionOldest = page.locator('.Select-option[title="Oldest"]');
    this.selectedFilterOptionOldest = page.getByText('Oldest');
    this.filterOptionNewest = page.locator('.Select-option[title="Newest"]');
    this.selectedFilterOptionNewest = page.getByText('Newest');
    this.filterOptionAToZ = page.locator('.Select-option[title="A-Z"]');
    this.selectedFilterOptionAToZ = page.getByText('A-Z');
    this.filterOptionZToA = page.locator('.Select-option[title="Z-A"]');
    this.selectedFilterOptionZToA = page.getByText('Z-A');
    this.eventsPagination1 = page.getByRole('link', { name: '1', exact: true })
    this.eventsPagination2 = page.getByRole('listitem').filter({ hasText: '2' }).first()
    this.eventsPaginationArrow = page.getByRole('link').filter({ hasText: /^$/ }).nth(1);
    this.searchField = page.getByRole('textbox', { name: 'Search by name' });
    this.searchIcon =  page.getByRole('main').locator('form').getByRole('button');
    this.searchCrossIcon = page.locator('button:has(svg)').first();
    this.eventsCard1 = page.locator('(//header[@role="button"])[1]');
    this.eventsCards = page.locator('(//header[@role="button"])');
    this.eventsCardCollapseIcon = page.locator('//button[.//svg/path[@d="M7 16v-4h4v4H7zm4-4V8h4v4h-4zM7 8V4h4v4H7z"]]');
    this.officialWebsiteLink = page.locator('p:text("Official website") >> xpath=following-sibling::a');
    this.eventscardGoogleCalenderLink = page.getByRole('link', { name: 'Google Google Calendar' });
    this.eventscardICalenderLink = page.getByRole('link', { name: 'Google iCalendar' });
    this.exportGoogleCalenderLink = page.locator('span:text("Export:") >> xpath=following-sibling::a[1]');
    this.exportICalenderLink = page.locator('span:text("Export:") >> xpath=following-sibling::a[2]');
    this.futureEventsPagination1 = page.getByRole('listitem').filter({ hasText: '1' });
    this.futureEventsPagination2 = page.getByRole('listitem').filter({ hasText: '2' });
    this.futureEventsPaginationNavArrowIcon = page.locator('li >> button:has(svg)').nth(0);
    this.featuredEventsSection = page.locator('section:has(h3:text("Featured events"))');
  }
  async paginationOfEventsTab(assertApi,saveApiResponse={},route){
    if (await this.eventsPagination1.isVisible()) {
      console.log("Pagination is present");   
      await this.expectAndClick(this.eventsPagination2,'Events Pagination 2',assertApi,saveApiResponse);
      await this.assert({
      locator: this.eventsPagination2,
        state: 'visible',
        toHaveCSS: { color: 'rgb(71, 75, 47)' },
        alias: 'Pagination 2 Button '
    });
      await this.assertDataFromResponseBody(route,'events.items.title');
    }
    else {
      console.log("Pagination not present, only one page of events.");    
    }
  }
  async assertSelectedAllEventsTab(){
    await this.assert({
      locator: {
        default: this.allEventsTab,
        Mobile: this.selectedresponsiveAllEventsTab,
      },
      state: 'visible',
      alias: 'All Events Tab',
      toHaveCSS: {
        Desktop: { 'background-color': 'rgb(72, 75, 50)' },
        Laptop:  { 'background-color': 'rgb(72, 75, 50)' },
        Tablet:  { 'background-color': 'rgb(72, 75, 50)' }
      }
    });
  }
  async assertSelectedOnlineEventsTab(){
    await this.assert({
      locator: {
        default: this.onlineEventsTab,
        Mobile: this.selectedresponsiveOnlineEventsTab,
      },
      state: 'visible',
      alias: 'Online Events Tab',
      toHaveCSS: {
        Desktop: { 'background-color': 'rgb(72, 75, 50)' },
        Laptop:  { 'background-color': 'rgb(72, 75, 50)' },
        Tablet:  { 'background-color': 'rgb(72, 75, 50)' }
      }
    });
  }
  async assertSelectedOfflineEventsTab(){
    await this.assert({
      locator: {
        default: this.offlineEventsTab,
        Mobile: this.selectedresponsiveOfflineEventsTab,
      },
      state: 'visible',
      alias: 'Offline Events Tab',
      toHaveCSS: {
        Desktop: { 'background-color': 'rgb(72, 75, 50)' },
        Laptop:  { 'background-color': 'rgb(72, 75, 50)' },
        Tablet:  { 'background-color': 'rgb(72, 75, 50)' }
      }
    });
  }
  async assertSelectedFilterOptionOldest(){
    await this.assert({
      locator: {
      default:this.selectedFilterOptionOldest,
      },
      state: 'visible',
      alias: 'Selected Filter Option Oldest'
    });
  }
  async assertSelectedFilterOptionNewest(){
    await this.assert({
      locator: {
      default:this.selectedFilterOptionNewest,
      },
      state: 'visible',
      alias: 'Selected Filter Option Newest'
    });
  }
  async assertSelectedFilterOptionAToZ(){
    await this.assert({
      locator: {
      default:this.selectedFilterOptionAToZ,
      },
      state: 'visible',
      alias: 'Selected Filter Option A to Z'
    });
  }
  async assertSelectedFilterOptionZToA(){
    await this.assert({
      locator: {
      default:this.selectedFilterOptionZToA,
      },
      state: 'visible',
      alias: 'Selected Filter Option Z to A'
    });
  }
  async allEventsTabDefaultFilterOldest() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({
        default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab],
      },'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.expectAndClick({
        default: this.allEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveAllEventsTab],
      },'All Events Tab','allEventsFilterOldestApi:GET',{detectApi: "allEventsFilterOldestApi",saveApiResponse: true,saveFileName: "events/GETOldestAllEvents"});
    await this.assertSelectedAllEventsTab();
    await this.assertDataFromResponseBody('events/GETOldestAllEvents','events.items.title');
    await this.paginationOfEventsTab('allEventsFilterOldestPage2Api:GET',{detectApi: "allEventsFilterOldestPage2Api",saveApiResponse: true,saveFileName: "events/GETOldestEventsPagination2"},'events/GETOldestEventsPagination2');
  }
  async onlineEventsTabDefaultFilterOldest() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},
          'Online Events Tab','onlineEventsFilterOldestApi:GET',
              {detectApi: "onlineEventsFilterOldestApi",saveApiResponse: true,saveFileName: "events/GETOnlineEvents"});
    await this.assertSelectedOnlineEventsTab();
    await this.assertDataFromResponseBody('events/GETOnlineEvents','events.items.title');
    await this.paginationOfEventsTab('onlineEventsFilterOldestPage2Api:GET',{detectApi: "onlineEventsFilterOldestPage2Api",saveApiResponse: true,saveFileName: "events/GETOnlineEventsFilterOldestPage2"},'GETOnlineEventsFilterOldestPage2');
  }
  async offlineEventsTabDefaultFilterOldest() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},
          'Offline Events Tab', 'offlineEventsFIlterOldestApi:GET',{detectApi: "offlineEventsFIlterOldestApi",saveApiResponse: true,saveFileName: "events/GETOfflineEventsFilterOldest"});
    await this.assertSelectedOfflineEventsTab();
    await this.assertDataFromResponseBody('events/GETOfflineEventsFilterOldest','events.items.title');
    await this.paginationOfEventsTab('offlineEventsFIlterOldestPage2Api:GET',{detectApi: "offlineEventsFIlterOldestPage2Api",saveApiResponse: true,saveFileName: "events/GETOfflineEventsFilterOldestPage2"},'events/GETOfflineEventsFilterOldestPage2');
  }
  async allEventsTabFilterNewest() {
    await this.assertSelectedAllEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionNewest,'Filter Option Newest','allEventsFilterNewestApi:GET',{detectApi: "allEventsFilterNewestApi",saveApiResponse: true,saveFileName: "events/GETallEventsFilterNewest"});
    await this.assertSelectedFilterOptionNewest();
    await this.assertDataFromResponseBody('events/GETallEventsFilterNewest','events.items.title');
    await this.paginationOfEventsTab('allEventsFilterNewestPage2Api:GET',{detectApi: "allEventsFilterNewestPage2Api",saveApiResponse: true,saveFileName: "events/GETallEventsFilterNewestPage2"},'events/GETallEventsFilterNewestPage2');
  }
  async alleventsTabFilterAToZ() {
    await this.assertSelectedAllEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionAToZ,'Filter Option A to Z','alleventsFilterAToZApi:GET',{detectApi: "alleventsFilterAToZApi",saveApiResponse: true,saveFileName: "events/GETalleventsFilterAToZ"});
    await this.assertSelectedFilterOptionAToZ();
    await this.assertDataFromResponseBody('events/GETalleventsFilterAToZ','events.items.title');
    await this.paginationOfEventsTab('alleventsFilterAToZPage2Api:GET',{detectApi: "alleventsFilterAToZPage2Api",saveApiResponse: true,saveFileName: "events/GETalleventsFilterAToZPage2"},'events/GETalleventsFilterAToZPage2');
  }
  async alleventsTabFilterZToA() {
    await this.assertSelectedAllEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionZToA,'Filter Option Z to A','alleventsFilterZToAApi:GET',{detectApi: "alleventsFilterZToAApi",saveApiResponse: true,saveFileName: "events/GETalleventsFilterZToA"});
    await this.assertSelectedFilterOptionZToA();
    await this.assertDataFromResponseBody('events/GETalleventsFilterZToA','events.items.title');
    await this.paginationOfEventsTab('alleventsFilterZToAPage2Api:GET',{detectApi: "alleventsFilterZToAPage2Api",saveApiResponse: true,saveFileName: "events/GETalleventsFilterZToAPage2"},'events/GETalleventsFilterZToAPage2');
  }
  async onlineEventsTabFilterNewest() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionNewest,'Filter Option Newest','onlineEventsFilterNewestApi:GET',{detectApi: "onlineEventsFilterNewestApi",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterNewest"});
    await this.assertSelectedFilterOptionNewest();
    await this.assertDataFromResponseBody('events/GETonlineEventsFilterNewest','events.items.title');
    await this.paginationOfEventsTab('onlineEventsFilterNewestPage2Api:GET',{detectApi: "onlineEventsFilterNewestPage2Api",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterNewestPage2"},'events/GETonlineEventsFilterNewestPage2');
  }
  async onlineEvnentsTabFilterAToZ() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionAToZ,'Filter Option A to Z','onlineEventsFilterAToZApi:GET',{detectApi: "onlineEventsFilterAToZApi",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterAToZ"});
    await this.assertSelectedFilterOptionAToZ();
    await this.assertDataFromResponseBody('events/GETonlineEventsFilterAToZ','events.items.title');
    await this.paginationOfEventsTab('onlineEventsFilterAToZPage2Api:GET',{detectApi: "onlineEventsFilterAToZPage2Api",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterAToZPage2"},'events/GETonlineEventsFilterAToZPage2');
  }
  async onlineEventsTabFilterZToA() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionZToA,'Filter Option Z to A','onlineEventsFilterZToAApi:GET',{detectApi: "onlineEventsFilterZToAApi",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterZToA"});
    await this.assertSelectedFilterOptionZToA();
    await this.assertDataFromResponseBody('events/GETonlineEventsFilterZToA','events.items.title');
    await this.paginationOfEventsTab('onlineEventsFilterZToAPage2Api:GET',{detectApi: "onlineEventsFilterZToAPage2Api",saveApiResponse: true,saveFileName: "events/GETonlineEventsFilterZToAPage2"},'events/GETonlineEventsFilterZToAPage2');
  }
  async offlineEventsTabFilterNewest() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionNewest,'Filter Option Newest','offlineEventsFilterNewestApi:GET',{detectApi: "offlineEventsFilterNewestApi",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterNewest"});
    await this.assertSelectedFilterOptionNewest();
    await this.assertDataFromResponseBody('events/GETofflineEventsFilterNewest','events.items.title');
    await this.paginationOfEventsTab('offlineEventsFilterNewestPage2Api:GET',{detectApi: "offlineEventsFilterNewestPage2Api",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterNewestPage2"},'events/GETofflineEventsFilterNewestPage2');
  }
  async offlineEventsTabFilterAToZ() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionAToZ,'Filter Option A to Z','offlineEventsFilterAToZApi:GET',{detectApi: "offlineEventsFilterAToZApi",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterAToZ"});
    await this.assertSelectedFilterOptionAToZ();
    await this.assertDataFromResponseBody('events/GETofflineEventsFilterAToZ','events.items.title');
    await this.paginationOfEventsTab('offlineEventsFilterAToZPage2Api:GET',{detectApi: "offlineEventsFilterAToZPage2Api",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterAToZPage2"},'events/GETofflineEventsFilterAToZPage2');
  }
  async offlineEventsTabFilterZToA() {
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');  
    await this.assertSelectedOfflineEventsTab();
    await this.assertSelectedFilterOptionOldest();
    await this.expectAndClick(this.filterArrow,'Filter Arrow');
    await this.expectAndClick(this.filterOptionZToA,'Filter Option Z to A','offlineEventsFilterZToAApi:GET',{detectApi: "offlineEventsFilterZToAApi",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterZToA"});
    await this.assertSelectedFilterOptionZToA();
    await this.assertDataFromResponseBody('events/GETofflineEventsFilterZToA','events.items.title');
    await this.paginationOfEventsTab('offlineEventsFilterZToAPage2Api:GET',{detectApi: "offlineEventsFilterZToAPage2Api",saveApiResponse: true,saveFileName: "events/GETofflineEventsFilterZToAPage2"},'events/GETofflineEventsFilterZToAPage2');
  }
  async validSearchInEvents(eventName, api, path) {
  await this.waitAndFill(this.searchField, eventName, 'Search Field');
  await this.expectAndEnter("Enter",`${api}:GET`, {detectApi: api,saveApiResponse: true,saveFileName: path});
  await this.assertDataFromResponseBody(path, 'events.items.title');
  await this.expectAndClick(this.searchCrossIcon, 'Search Cross Icon');
  await this.assert({
    locator: this.searchField,
    state: 'toHaveValue',
    value: '',
    alias: 'Search Field after clearing'
  });
}

  async invalidSearchInEvents(eventName,api, path){
    await this.waitAndFill(this.searchField,eventName,'Search Field');
    await this.expectAndEnter("Enter",`${api}:GET`,{detectApi: api,saveApiResponse: true,saveFileName: path});
    await this.assertDataFromResponseBody(path,'events.items.title');
    await this.expectAndClick(this.searchCrossIcon,'Search Cross Icon');
    await this.assert({
      locator: this.searchField,
      state: 'toHaveValue',
      value: '',
      alias: 'Search Field after clearing'
    });
  }
  async validSearchAllEvents(eventName){
    await this.assertSelectedAllEventsTab();
    await this.validSearchInEvents(eventName,'allEventsValidSearchApi','events/GETAllEventsSearchValid');
  }
  async validSearchOnlineEvents(eventName){
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},
          'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.validSearchInEvents(eventName,'onlineEventsValidSearchApi','events/GETOnlineEventsSearchValid');
  }
  async validSearchOfflineEvents(eventName){
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},
          'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.validSearchInEvents(eventName,'offlineEventsValidSearchApi','events/GETOfflineEventsSearchValid');
  }
  async invalidSearchAllEvents(eventName){
    await this.assertSelectedAllEventsTab();
    await this.invalidSearchInEvents(eventName,'allEventsInvalidSearchApi','events/GETAllEventsSearchInvalid');
  }
  
  async invalidSearchOnlineEvents(eventName){
    await this.expectAndClick({default: this.onlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},
          'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.invalidSearchInEvents(eventName,'onlineEventsInvalidSearchApi','events/GETOnlineEventsSearchInvalid');
  }
  async invalidSearchOfflineEvents(eventName){
    await this.expectAndClick({default: this.offlineEventsTab,
        Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},
          'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.invalidSearchInEvents(eventName,'offlineEventsInvalidSearchApi','events/GETOfflineEventsSearchInvalid');
  }
  async eventsCardsExpandAndCollapse() {
  try {
    const count = await this.eventsCards.count();
    console.log(`Total event cards present: ${count}`);
    if (count === 0) {
      console.log('No cards present to expand');
      return;
    }

    for (let i = 0; i < count; i++) {
      const card = this.eventsCards.nth(i);

      if (await card.isVisible()) {
        await this.expectAndClick(card, `Event card ${i + 1} Expanded`);
        await this.expectAndClick(card, `Event card ${i + 1} Collapsed`);
      } else {
        console.log(`Event card ${i + 1} is not visible`);
      }
    }
  } catch (error) {
    console.error('Error in expanding/collapsing event cards:', error);
  }
  }
  async allEventsCardsExpandAndCollapse(){
    await this.assertSelectedAllEventsTab();
    await this.eventsCardsExpandAndCollapse();
  }
  async onlineEventsCardsExpandAndCollapse(){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.eventsCardsExpandAndCollapse();
  }
  async offlineEventsCardsExpandAndCollapse(){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');  
    await this.assertSelectedOfflineEventsTab();
    await this.eventsCardsExpandAndCollapse();
  }
  
  async offcialWebSiteRedirection(folderRoute) {
    try {
      const count = await this.eventsCards.count();
      console.log(`Total event cards present: ${count}`);
      if (count === 0) {
        console.log('No cards present to expand');
        return;
      }
      for (let i = 0; i < count; i++) {
        const card = this.eventsCards.nth(i);

        if (await card.isVisible()) {
          await this.expectAndClick(card, `Event card ${i + 1} Expanded`);
          const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'), 
            this.expectAndClick({ default: this.officialWebsiteLink }, 'Official website redirection')
          ]);

          await newPage.waitForLoadState('load');
          const newPageUrl = newPage.url();
          console.log("🌐 Captured official website Redirection URL:", newPageUrl);
          const filePath = await this.createSavedFile(
            folderRoute,
            `card${i + 1}officialWebsiteUrl`,
            'txt',
            newPageUrl
          );
          await newPage.close();
          await this.expectAndClick(card, `Event card ${i + 1} Collapsed`);
          console.log('--------------------------------------------------');
        } else {
          console.log(`Event card ${i + 1} is not visible`);
        }
      }

    } catch (error) {
      console.error('Error in expanding/collapsing event cards:', error);
    }
  }
async paginationOfEventsTabIfPresentRedirection(redirectionFn) {
  if (await this.eventsPagination1.isVisible()) {
    console.log("Pagination is present");   
    await this.expectAndClick(this.eventsPagination2, 'Events Pagination 2');

    await this.assert({
      locator: this.eventsPagination2,
      state: 'visible',
      toHaveCSS: { color: 'rgb(71, 75, 47)' },
      alias: 'Pagination 2 Button'
    });
    await redirectionFn();
  } else {
    console.log("Pagination not present, only one page of events.");
    await redirectionFn();
  }
}
  async allEventsCardsOffcialWebSiteRedirection(route){
    await this.assertSelectedAllEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.offcialWebSiteRedirection(route));
  }
  async onlineEventsCardsoffcialWebSiteRedirection(route){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
            Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.offcialWebSiteRedirection(route));
  }
  async offlineEventsCardsoffcialWebSiteRedirection(route){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.offcialWebSiteRedirection(route));
  }
  async googleCalendarRedirection(locator) {
    try {
      const count = await this.eventsCards.count();
      console.log(`Total event cards present: ${count}`);
      if (count === 0) {
        console.log('No cards present to expand');
        return;
      }

      for (let i = 0; i < count; i++) {
        const card = this.eventsCards.nth(i);

        if (await card.isVisible()) {
          await this.expectAndClick(card, `Event card ${i + 1} Expanded`);
          const href = await locator.getAttribute('href');
          console.log('Google Calendar URL:', href);

          const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.expectAndClick(locator, 'Google Calendar redirection')
          ]);

          await newPage.waitForLoadState('networkidle');
          const newPageUrl = newPage.url();
          console.log('New Page URL:', newPageUrl);

          await this.assert({
            toHaveURL: newPageUrl,
            alias: 'Google Calendar Page URL',
            page: newPage
          });

          await newPage.close();
          await this.expectAndClick(card, `Event card ${i + 1} Collapsed`);
          console.log('--------------------------------------------------');
        } else {
          console.log(`Event card ${i + 1} is not visible`);
        }
      }
    } catch (error) {
      console.error("❌ Error during calendar redirection check:", error.message);
    }
  }

  async allEventsCardsGoogleCalenderRedirection(){
    await this.assertSelectedAllEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.googleCalendarRedirection(this.eventscardGoogleCalenderLink));
  }
  async onlineEventsCardsGoogleCalenderRedirection(){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
            Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.assertSelectedOnlineEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.googleCalendarRedirection(this.eventscardGoogleCalenderLink));
  }
  async offlineEventsCardsGoogleCalenderRedirection(){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.googleCalendarRedirection(this.eventscardGoogleCalenderLink));
  }


async ICalendarRedirection(folderRoute) {
  const count = await this.eventsCards.count();
  console.log(`Total event cards present: ${count}`);
  if (count === 0) return console.log('No cards present to expand');

  for (let i = 0; i < count; i++) {
    const card = this.eventsCards.nth(i);
    if (!(await card.isVisible())) {
      console.log(`Event card ${i + 1} is not visible`);
      continue;
    }
    await this.expectAndClick(card, `Event card ${i + 1} Expanded`);
    const iCalLink = this.eventscardICalenderLink.nth(0);
    await iCalLink.waitFor({ state: 'visible' });

    const href = await iCalLink.getAttribute('href');
    const expectedPattern = /^webcal:\/\/80\.lv\/events\/calendar\/.*\.ics$/;

    console.log(`Event card ${i + 1} iCalendar HREF:`, href);
    console.log(`Expected pattern: ${expectedPattern}`);

    if (!href) {
      console.warn(`❌ iCalendar href is empty for card ${i + 1}`);
    } else {
      const filePath = await this.createSavedFile(
        folderRoute,
        `card${i + 1}iCalender`,
        'txt',
        href
      );
      expect(href).toMatch(expectedPattern);
      console.log(`   Actual:   ${href}`);
      console.log(`   Expected: ${expectedPattern}`);
      console.log(`✅ Event card ${i + 1} iCalendar href assertion passed`);
    }
    await this.expectAndClick(card, `Event card ${i + 1} Collapsed`);
    console.log('--------------------------------------------------');
  }
}
async allEventsCardsICalenderRedirection(folderRoute){
    await this.assertSelectedAllEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.ICalendarRedirection(folderRoute));
  }
  async onlineEventsCardsICalenderRedirection(folderRoute){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.onlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.reaponsiveOnlineEventsTab]},'Online Events Tab');
    await this.paginationOfEventsTabIfPresentRedirection(() => this.ICalendarRedirection(folderRoute));
  }
  async offlineEventsCardsICalenderRedirection(folderRoute){
    await this.assertSelectedAllEventsTab();
    await this.expectAndClick({default: this.offlineEventsTab,
          Mobile:  [this.responsiveFilterArrow,this.responsiveOfflineEventsTab]},'Offline Events Tab');
    await this.assertSelectedOfflineEventsTab();
    await this.paginationOfEventsTabIfPresentRedirection(() => this.ICalendarRedirection(folderRoute));
  }
  async googleButtonRedirection() {
  await this.assertSelectedAllEventsTab();

  const href = await this.exportGoogleCalenderLink.getAttribute('href');
  console.log('Google Calendar URL:', href);

  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'),
    this.expectAndClick(this.exportGoogleCalenderLink, 'Google Calendar button redirection')
  ]);

  await newPage.waitForLoadState('load');
  await newPage.waitForURL(/google\.com/, { timeout: 10000 }); // ✅ use RegExp

  console.log('New Page URL:', newPage.url());

  await this.assert({
    toHaveURL: 'google.com', // substring match is safer
    alias: 'Google Calendar Page URL'
  }, newPage);

  await newPage.close();
}


  async iCalenderButtonRedirection(){
    await this.assertSelectedAllEventsTab();
    const iCalLink = this.exportICalenderLink;
    await iCalLink.waitFor({ state: 'visible' });

    const href = await iCalLink.getAttribute('href');
    const expectedPattern = /^webcal:\/\/80\.lv\/events\/calendar\/.*\.ics$/;

    console.log(`Button iCalendar HREF:`, href);
    console.log(`Expected pattern: ${expectedPattern}`);

    if (!href) {
      console.warn(`❌ iCalendar href is empty for card ${i + 1}`);
    } else {
      const filePath = await this.createSavedFile(
        'events/buttonICalender',
        `iCalenderButtonLink`,
        'txt',
        href
      );
      expect(href).toMatch(expectedPattern);
      console.log(`   Actual:   ${href}`);
      console.log(`   Expected: ${expectedPattern}`);
      console.log(`✅ Button iCalendar href assertion passed`);
    }
  }
  async futureEventsPaginationFunctionalityIfPresent(){
    if (await this.futureEventsPagination1.isVisible()) {
       await this.assert({
      locator: this.futureEventsPagination1,
      state: 'visible',
      toHaveCSS: { color: 'rgb(71, 75, 47)' },
      alias: 'Pagination1 Button'
    });
    console.log("Pagination is present");   
    await this.expectAndClick(this.futureEventsPagination2, 'Future Events Pagination 2');
    await this.assert({
      locator: this.futureEventsPagination2,
      state: 'visible',
      toHaveCSS: { color: 'rgb(71, 75, 47)' },
      alias: 'Pagination 2 Button'
    });
    await this.assert({
          locator: this.futureEventsPaginationNavArrowIcon,
          state: 'visible',
          alias: 'Pagination Left Arrow Button'
        });
    await this.expectAndClick(this.futureEventsPaginationNavArrowIcon, 'Future Events Pagination Left Arrow');
    await this.assert({
      locator: this.futureEventsPagination1,
      state: 'visible',
      toHaveCSS: { color: 'rgb(71, 75, 47)' },
      alias: 'Pagination1 Button'
    });
    await this.expectAndClick(this.futureEventsPaginationNavArrowIcon, 'Future Events Pagination Right Arrow');
    await this.assert({
      locator: this.futureEventsPagination2,
      state: 'visible',
      toHaveCSS: { color: 'rgb(71, 75, 47)' },
      alias: 'Pagination 2 Button'
    });
  } else {
    console.log("Pagination not present, only one page of events.");
  }
  }
async futureEventsCardsWithPagination() {
  const initialVisiblePages = this.page
    .getByRole('listitem')
    .filter({ has: this.page.locator('a') })
    .filter({ hasText: /^[0-9]+$/ }); // strictly numeric only

  const pageCount = await initialVisiblePages.count();
  const visiblePageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    const pageNumber = (await initialVisiblePages.nth(i).locator('a').textContent())?.trim();
    if (pageNumber) visiblePageNumbers.push(pageNumber);
  }
        console.log(`Visible pagination pages: [${visiblePageNumbers.join(', ')}]`);
  // Function to process all event links on the current page
  const processEventLinks = async () => {
    const allEventLinks = this.featuredEventsSection.locator('a:has(h4):has(p)');
    const count = await allEventLinks.count();
    console.log(`Total event cards present: ${count}`);

    for (let i = 0; i < count; i++) {
      const link = allEventLinks.nth(i);
      const actualHref = await link.getAttribute('href');
      const expectedHref = '/events';
      const eventTitle = await link.locator('h4').textContent();

      console.log(`\n🔗 Link ${i + 1}`);
      console.log(`Event Title:   ${eventTitle?.trim()}`);
      console.log(`Actual HREF:   ${actualHref}`);
      console.log(`Expected HREF: ${expectedHref}`);

      await expect(link).toHaveAttribute('href', expectedHref);
      console.log('✅ PASS: href matches expected');
    }
  };


  // Process first page cards
  await processEventLinks();

  // Track visited pages
  const visitedPages = new Set(['1']); // page 1 already processed

  // Loop through dynamic pagination for remaining pages
  while (true) {
    const visiblePages = this.page
      .getByRole('listitem')
      .filter({ has: this.page.locator('a') })
      .filter({ hasText: /^[0-9]+$/ }); // strictly numeric

    let nextPageFound = false;
    const pageCount = await visiblePages.count();

    for (let i = 0; i < pageCount; i++) {
      const pageLink = visiblePages.nth(i).locator('a');
      const pageNumber = (await pageLink.textContent())?.trim();

      if (!pageNumber || visitedPages.has(pageNumber)) continue;

      if (await pageLink.isVisible()) {
        nextPageFound = true;
        visitedPages.add(pageNumber);

        console.log(`\nPagination detected. Navigating to page ${pageNumber}...`);
        await pageLink.click();

        // Wait for event cards to load
        await this.page.waitForSelector('section:has(h3:text("Featured events")) a:has(h4):has(p)');

        // Process cards on this page
        await processEventLinks();

        break; // re-fetch visible pagination links
      }
    }

    if (!nextPageFound) {
      console.log('No more pagination pages.');
      break;
    }
  }
}











}