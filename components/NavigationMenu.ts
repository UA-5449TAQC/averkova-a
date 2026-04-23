import { Locator, Page} from '@playwright/test';
import { BaseComponent} from './BaseComponent';
import { step } from "allure-js-commons";

export class NavigationMenu extends BaseComponent {
    private logo: Locator;
    private EcoNewsLink: Locator;
    private EventsLink: Locator;

    constructor(root: Locator) {
        super(root);
        this.logo = this.root.getByAltText('Image green city logo');
        this.EcoNewsLink = this.root.getByRole('link', { name: ' Eco news ' });
        this.EventsLink = this.root.getByRole('link', { name: ' Events ' });
    }


    async clickLogo(): Promise<void> {
        await step('Click on logo in header', async () => {
            await this.logo.click();
        });
    }

    async clickEcoNewsLink(): Promise<void> {
        await step('Click on Eco News link in header', async () => {
            await this.EcoNewsLink.click();
        });

    }

    async clickEventsLink(): Promise<void> {
        await step ('Click on Events link in header', async () => {
            await this.EventsLink.click();
        });
    }

}