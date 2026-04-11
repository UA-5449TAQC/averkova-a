import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import {step}  from 'allure-js-commons';
import { EventCard } from "../components/EventCard";

export class EventsPage extends BasePage {

    //page locators
    readonly mainHeader: Locator;
    readonly eventCards: Locator;
    readonly switchViewButton: Locator;
    readonly search: Locator;


    //constructor with inheriting page from BasePage + initializing locators
    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('p.main-header');
        this.eventCards = page.locator('mat-card.event-list-item');
        this.switchViewButton = page.locator('button.switch-view');
        this.search = page.locator('input[placeholder="Search"]');
     }

     //URL getter realized as abstract method from BasePage
     get url(): string {
        return '#/greenCity/events';
     }

     
    getEventCardByLocation(location: string): EventCard {
    const card = this.page
        .getByTestId('event-card')
        .filter({ hasText: location });

    return new EventCard(card);
    }

    getEventCardByTitle(title: string): EventCard {
    const card = this.page
        .getByTestId('event-card')
        .filter({ hasText: title });

    return new EventCard(card);
    }

     getEventCardByIndex(index: number): EventCard {
        const cardLocator = this.eventCards.nth(index);
        return new EventCard(cardLocator);
     }

     async getEventItemsCount() {
        return this.eventCards.count();
     }

     async getEventItemDate(index: number) {
        return this.getEventCardByIndex(index).getDate();
     }

    async expectAllEventsItemsVisible() {
        await expect(this.eventCards.first()).toBeVisible();

        const count = await this.getEventItemsCount();
        await expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await expect(this.eventCards.nth(i)).toBeVisible();
        }
    }

    async checkAllDateTimeFormat() {
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

    async expectAllImagesVisible() {
        await step('Verify all event images are visible', async () => {
            const count = await this.getEventItemsCount();
            await expect(count).toBeGreaterThan(0);
            for (let i = 0; i < count; i++) {
                const eventCard = this.getEventCardByIndex(i);
                const image = eventCard.getImage();
                await expect(image).toBeVisible();
            }
        });

    }

    async switchView() { 
        await this.switchViewButton.click();
    }

    async searchEvent(query: string) {
        await this.search.fill(query);
        await this.search.press('Enter');
    }

    async clearSearch() {
        await this.search.fill('');
        await this.search.press('Enter');
    }

}