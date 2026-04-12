import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import {step}  from 'allure-js-commons';

export class EventItemPage extends BasePage { 
    readonly eventTitle: Locator;
    readonly eventDate: Locator;
    readonly eventTime: Locator;
    readonly eventLocation: Locator;
    readonly eventDescription: Locator;
    readonly eventOrganizer: Locator
    readonly joinButton: Locator;
    readonly breadcrumbs: Locator;
    readonly eventImage: Locator;
    readonly favoriteButton: Locator;
    readonly shareButton: Locator;
    readonly recommendationsSection: Locator;
    readonly commentInput: Locator;
    readonly submitCommentButton: Locator;

    constructor(page: Page) {
        super(page);
        this.eventTitle = page.locator('.event-item-title');
        this.eventDate = page.locator('.event-item-date');
        this.eventTime = page.locator('.event-item-time');
        this.eventLocation = page.locator('.event-item-location');
        this.eventDescription = page.locator('.event-item-description');
        this.eventOrganizer = page.locator('.event-item-organizer');
        this.joinButton = page.locator('.event-item-join-button');
        this.breadcrumbs = page.locator('.event-item-breadcrumbs');
        this.eventImage = page.locator('.event-item-image');
        this.favoriteButton = page.locator('.event-item-favorite-button');
        this.shareButton = page.locator('.event-item-share-button');
        this.recommendationsSection = page.locator('.event-item-recommendations');
        this.commentInput = page.locator('.event-item-comment-input');
        this.submitCommentButton = page.locator('.event-item-submit-comment-button');
    }

    get url(): string {
        return  '#/greenCity/events/' + this.getNewsIdFromUrl();
    }

    getNewsIdFromUrl(): string {
        const currentUrl = this.getCurrentUrl();
        const urlParts = currentUrl.split('/');
        return urlParts[urlParts.length - 1];
    }

    async verifyEventTitle(expectedTitle: string): Promise<void> {
        await step(`Verify event title is "${expectedTitle}"`, async () => {
            await expect(this.eventTitle).toHaveText(expectedTitle);
        });
    }

    async verifyEventDate(expectedDate: string): Promise<void> {
        await step(`Verify event date is "${expectedDate}"`, async () => {
            await expect(this.eventDate).toHaveText(expectedDate);
        });
    }

    async verifyEventTime(expectedTime: string): Promise<void> {
        await step(`Verify event time is "${expectedTime}"`, async () => {
            await expect(this.eventTime).toHaveText(expectedTime);
        });
    }

    async verifyEventLocation(expectedLocation: string): Promise<void> {
        await step(`Verify event location is "${expectedLocation}"`, async () => {
            await expect(this.eventLocation).toHaveText(expectedLocation);
        });
    }

    async clickJoinButton(): Promise<void> {
        await step('Click Join Event button', async () => {
            await this.joinButton.click();
        });
    }
}