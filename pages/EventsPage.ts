import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import {step}  from 'allure-js-commons';

export class EventsPage extends BasePage {

    //page locators
    readonly mainHeader: Locator;
    readonly eventsItems: Locator;


    //constructor with inheriting page from BasePage + initializing locators
    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('p.main-header');
        this.eventsItems = page.locator('mat-card.event-list-item');
     }

     //URL getter realized as abstract method from BasePage
     get url(): string {
        return '#/greenCity/events';
     }

     async getEventItemsCount() {
        return this.eventsItems.count();
     }

     async getEventItemDate(index: number) {
        return this.eventsItems.nth(index).locator('div.date p').innerText();
     }

     //async methods
    async expectAllEventsItemsVisible() {
        await expect(this.eventsItems.first()).toBeVisible();

        const count = await this.getEventItemsCount();
        await expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await expect(this.eventsItems.nth(i)).toBeVisible();
        }
    }

    async checkDateTimeFormat() {
        await step('Validate date/time format is "MMM DD, YYYY"', async () => {
        const count = await this.getEventItemsCount();
        await expect(count).toBeGreaterThan(0);
        const dateRegex = /^[A-Za-z]{3} \d{1,2}, \d{4}$/; // regex for "MMM DD, YYYY" format
        for (let i = 0; i < count; i++) {
            const dateText = await this.getEventItemDate(i);
            await expect(dateText).toMatch(dateRegex);
        }
    });
    }

    async expectLocationVisible(location: string) {
        const eventItem = this.eventsItems.filter({ hasText: location });
        await expect(eventItem).not.toHaveCount(0);
        await expect(eventItem.first()).toBeVisible();
    }

}