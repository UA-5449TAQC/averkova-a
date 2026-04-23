import {test as base, expect} from '@playwright/test';
import { HomepagePage } from '../pages/HomepagePage';
import { EcoNewsPage } from '../pages/EcoNewsPage';
import { EventsPage } from '../pages/EventsPage';
import env from '../config/env';
import { EventItemPage } from '../pages/EventItemPage';

type PageFixtures = {
    homepagePage: HomepagePage;
    ecoNewsPage: EcoNewsPage;
    eventsPage: EventsPage;
    eventItemPage: EventItemPage;
}

const test = base.extend<PageFixtures>({
    homepagePage: async ({ page }, use) => {
        const homepagePage = new HomepagePage(page);
        await use(homepagePage);
    },
    ecoNewsPage: async ({ page }, use) => {
        const ecoNewsPage = new EcoNewsPage(page);
        await use(ecoNewsPage);
    },
    eventsPage: async ({ page }, use) => {
        const eventsPage = new EventsPage(page);
        await use(eventsPage);
    },
    eventItemPage: async ({ page }, use) => {
        const eventItemPage = new EventItemPage(page);
        await use(eventItemPage);
    }
});

export { test, expect };