import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { NavigationMenu } from "../components/NavigationMenu";

export class HomepagePage extends BasePage {
    //page locators
    readonly mainHeader: Locator;
    readonly navigationMenu: NavigationMenu;

    //constructor with inheriting page from BasePage + initializing locators
    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('h1.main-header');
        this.navigationMenu = new NavigationMenu(page);
     }

     //URL getter realized as abstract method from BasePage
     get url(): string {
        return '#/greenCity';
     }
    
     //async methods

}