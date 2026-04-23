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
    readonly commentSection: Locator;
    readonly commentItem: Locator;
    readonly eventParticipantsCount: Locator;
    readonly eventParticipant: Locator;

    constructor(page: Page) {
        super(page);
        this.eventTitle = page.locator('div.event-title');
        this.eventDate = page.locator('div.event-duration');
        this.eventTime = page.locator('div.event-date-content :nth-child(3)');
        this.eventLocation = page.locator('div.event-location a');
        this.eventDescription = page.locator('div.ql-editor');
        this.eventOrganizer = page.locator('div.event-author :nth-child(2)');
        this.joinButton = page.getByRole('button', { name: ' Join event ' });
        this.breadcrumbs = page.locator('div.event-nav .back-button a.button-link');
        this.eventImage = page.locator('img[alt="event"]');
        this.favoriteButton = page.getByRole('button', { name: ' Save event ' });
        this.shareButton = page.locator('div.share-buttons img[alt="Share"]');
        this.commentSection = page.locator('app-comments-container.event');
        this.commentItem = page.locator('.comment-body-wrapper');
        this.eventParticipantsCount = page.locator('div.event-participants');
        this.eventParticipant = page.locator('div.event-participants-avatar img');
    }

    get url(): string {
        return  '#/greenCity/events/' + this.getEventIdFromUrl();
    }

    getEventIdFromUrl(): string {
        const currentUrl = this.getCurrentUrl();
        const urlParts = currentUrl.split('/');
        return urlParts[urlParts.length - 1];
    }

    getLocationLink(): Promise<string | null> {
        return this.eventLocation.getAttribute('href');
    }

    async verifyEventTitle(expectedTitle: string) {
        await step(`Verify event title is "${expectedTitle}"`, async () => {
            await expect(this.eventTitle).toHaveText(expectedTitle);
        });
    }

    async verifyEventDate(expectedDate: string) {
        await step(`Verify event date is "${expectedDate}"`, async () => {
            await expect(this.eventDate).toHaveText(expectedDate);
        });
    }

    async verifyEventTime(expectedTime: string) {
        await step(`Verify event time is "${expectedTime}"`, async () => {
            await expect(this.eventTime).toHaveText(expectedTime);
        });
    }

    async verifyEventLocation(expectedLocation: string) {
        await step(`Verify event location is "${expectedLocation}"`, async () => {
            await expect(this.eventLocation).toHaveText(expectedLocation);
        });
    }

    async verifyEventDescriptionVisible() {
        await step(`Verify event description is visible`, async () => {
            await expect(this.eventDescription).toBeVisible();
        });
    }
    
    async verifyEventOrganizer(expectedOrganizer: string) {
        await step(`Verify event organizer is "${expectedOrganizer}"`, async () => {
            await expect(this.eventOrganizer).toHaveText(expectedOrganizer);
        });
    }

    async verifyEventImageVisible() {
        await step('Verify event image is visible', async () => {
            await expect(this.eventImage).toBeVisible();
        });
    }

    async verifyBreadcrumbs(expectedBreadcrumbs: string) {
        await step(`Verify breadcrumbs are "${expectedBreadcrumbs}"`, async () => {
            await expect(this.breadcrumbs).toHaveText(expectedBreadcrumbs);
        });
    }

    async verifyEventParticipantsVisible() {
        await step('Verify event participants are visible', async () => {
            await expect(this.eventParticipant.first()).toBeVisible();
        });
    }

    async verifyEventParticipantsCount() {
        await step('Verify event participants count is greater than 0', async () => {
            const participantsText = await this.eventParticipantsCount.innerText();
            const match = participantsText.match(/\d+/);
            expect(Number(match?.[0])).toBeGreaterThan(0);
        });
    }

    async verifyCommentSectionVisible() {
        await step('Verify comment section is visible', async () => {
            await expect(this.commentSection).toBeVisible();
        });
    }

    async verifyCommentItemVisible() {
        await step('Verify comment item is visible', async () => {
            await expect(this.commentItem).toBeVisible();
        });
    }

    async verifyEventLocationVisible() {
        await step('Verify event location is visible', async () => {
            await expect(this.eventLocation).toBeVisible();
        });
    }


}