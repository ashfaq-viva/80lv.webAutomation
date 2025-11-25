import BasePage from './BasePage';
import { config } from '../config/testConfig.js';
import  { BASE_URL } from '../playwright.config.js';

export class SubscribeFormFooterPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.emailField = page.getByLabel('', { exact: true });
    this.SubscribeBtn = page.getByRole('button', { name: 'Subscribe' });
    this.subscribeErrorMessage = page.locator('label').filter({ hasText: 'Invalid email address' }).locator('div').nth(1);
    this.subscribeSuccessMessage = page.getByText('Yay, thank you.');
    this.facebook= page.getByRole('link', { name: '@LevelEighty' });
    this.twitter= page.getByRole('link', { name: '@80Level' });
    this.youtube= page.getByRole('link', { name: '@80lv' });
    this.instagram= page.getByRole('link', { name: '@eighty_level' });
    this.podcasts= page.getByRole('link', { name: 'Round Table' });
    this.aboutContactUs= page.getByRole('link', { name: 'About & Contact us' });
    this.republishingPolicy= page.getByRole('link', { name: 'Republishing policy' });
    this.disclaimer= page.getByRole('link', { name: 'Disclaimer' });
    this.privacyPolicy= page.getByRole('link', { name: 'Privacy Policy' });
    this.termsOfUse= page.getByRole('link', { name: 'Terms of use' });
  }

  async invalidSubscribe(){
    await this.waitAndFill(this.emailField,config.credentials.invalidEmail);
    await this.expectAndClick(this.SubscribeBtn,'Subscribe Button');
    await this.assert({
      locator: this.subscribeErrorMessage,
      state: 'visible',
      alias: 'Subscribe error message'
    });
  }
  async validSubscribe(){
    await this.waitAndFill(this.emailField,config.credentials.talentEmail);
    await this.expectAndClick(this.SubscribeBtn,'Subscribe Button','subscribeApi:POST');
    await this.assert({
      locator: this.subscribeSuccessMessage,
      state: 'visible',
      alias: 'Subscribe success message'
    });
  }
  async facebookRedirection(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.facebook },
        'Facebook Link'
      ),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await this.assert(
      {
        toHaveURL: 'https://www.facebook.com/LevelEighty',
        alias: 'facebook redirection link'
      },
      newPage 
    );
  }
  async twitterRedirection(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.twitter },
        'Twitter Link'
      ),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await this.assert(
      {
        toHaveURL: 'https://x.com/80Level',
        alias: 'twitter redirection link'
      },
      newPage 
    );
  }
  async youtubeRedirection(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.youtube },
        'Youtube Link'
      ),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await this.assert(
      {
        toHaveURL: 'https://www.youtube.com/channel/UCI8IFlI7_0xU9Dc60xoZuiA',
        alias: 'youtube redirection link'
      },
      newPage 
    );
  }
  async instagramRedirection(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.instagram },
        'Instagram Link'
      ),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await this.assert(
      {
        toHaveURL: [
          'https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Feighty_level%2F&is_from_rle',
          'https://www.instagram.com/eighty_level'
        ],
        alias: 'instagram redirection link'
      },
      newPage
    );
  }
  async podcastsRedirection(){
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.expectAndClick(
        { default: this.podcasts },
        'Podcasts Link'
      ),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    await this.assert(
      {
        toHaveURL: 'https://80levelroundtable.buzzsprout.com/',
        alias: 'podcasts redirection link'
      },
      newPage 
    );
  }
  async aboutContactUsRedirection(){
    await this.expectAndClick(this.aboutContactUs,'About & Contact us Link');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assert({
      toHaveURL: `${BASE_URL}/contact-us`,
      alias: 'About & Contact us redirection link'
    });
  }
  async republishingPolicyRedirection(){
    await this.expectAndClick(this.republishingPolicy,'Republishing policy Link');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assert({
      toHaveURL: `${BASE_URL}/republishing-policy`,
      alias: 'Republishing policy redirection link'
    });
  }
  async disclaimerRedirection(){
    await this.expectAndClick(this.disclaimer,'Disclaimer Link');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assert({
      toHaveURL: `${BASE_URL}/disclaimer`,
      alias: 'Disclaimer redirection link'
    });
  }
  async privacyPolicyRedirection(){
    await this.expectAndClick(this.privacyPolicy,'Privacy Policy Link');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assert({
      toHaveURL: `${BASE_URL}/privacy-policy`,
      alias: 'Privacy Policy redirection link'
    });
  }
  async termsOfUseRedirection(){
    await this.expectAndClick(this.termsOfUse,'Terms of use Link');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assert({
      toHaveURL: `${BASE_URL}/terms-of-use`,
      alias: 'Terms of use redirection link'
    });
  }
}
