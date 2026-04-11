import { Locator, Page} from '@playwright/test';

export class NavigationMenu {

    readonly headerMenu: Locator;

  constructor(private page: Page) {
    this.headerMenu = page.locator('div.header_navigation-menu');
  }

  private item(name: string): Locator {
    return this.headerMenu.getByRole('link', { name }); //get item from the header menu bar by its name
  }

  async goTo(name: string) {
    await this.item(name).click();
  }

  async goToNews() {
    await this.goTo(' Eco news ');
  }

  async goToEvents() {
    await this.goTo(' Events ');
  }

}