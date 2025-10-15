import BasePage from './BasePage';
import  { BASE_URL } from '../playwright.config.js';

export class NavbarPage extends BasePage {
  constructor(page, context, loginpage) {
    super(page, context);
    this.loginpage = loginpage;
    this.adevertiseBtn= page.getByText('Advertise');
    this.navbarThreeDotMenuOld =  page.getByRole('button', { name: 'Menu' });
  }

  async advertiseRedirection() {
    await this.expectAndClick({
        default: this.adevertiseBtn,
        Laptop:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
        Tablet:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
        Mobile:  [this.loginpage.navbarThreeDotMenuOld,this.adevertiseBtn],
      },
      'Advertise Button');
      await this.assert({
        toHaveURL: `${BASE_URL}/contact-us#Promote`,
        alias: 'Advertise Redirect'
      });
  }
    
}

