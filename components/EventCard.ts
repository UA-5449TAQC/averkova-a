import { Locator} from '@playwright/test';
import { BaseComponent} from './BaseComponent';
import { expect } from '@playwright/test';
import { step } from "allure-js-commons";

export class EventCard extends BaseComponent {
    private title: Locator;
    private date: Locator;
    private time: Locator;
    private location: Locator;
    private organizer: Locator;
    private joinButton: Locator;
    private moreButton: Locator;
    private image: Locator;
    private status: Locator;

    constructor(root: Locator) {
        super(root);
        this.title = this.root.locator('.event-name');
        this.date = this.root.locator('.date-container .date');
        this.time = this.root.locator('.date-container .time');
        this.location = this.root.locator('.date-container p');
        this.organizer = this.root.locator('.author p');
        this.joinButton = this.root.getByRole('button', { name: 'Join event' });
        this.moreButton = this.root.getByRole('button', { name: 'More' });
        this.image = this.root.locator('img.event-image');
        this.status = this.root.locator('.event-status');
    }

    getTitle(): Promise<string> {
        return this.title.innerText();
    }
    
    getDate(): Promise<string> {
        return this.date.innerText();
    }

    getLocation(): Promise<string> {
        return this.location.innerText();
    }

    getOrganizer(): Promise<string> {
        return this.organizer.innerText();
    }

    getJoinButton(): Locator {
        return this.joinButton;
    }

    getImage(): Locator {
        return this.image;
    }

    getStatus(): Promise<string> {
        return this.status.innerText();
    }

    getMoreButton(): Locator {
        return this.moreButton;
    }

    getTime(): Promise<string> {
        return this.time.innerText();
    }
    //── Visibility helpers ────────────────────────────────────────────────

    async expectLocationVisible(location: string) {
        await expect(this.location).toHaveText(location);
        await expect(this.location).toBeVisible();
    }

    async expectTitleVisible(title: string) {
        await expect(this.title).toHaveText(title);
        await expect(this.title).toBeVisible();
    }

    async expectOrganizerVisible(organizer: string) {
        await expect(this.organizer).toHaveText(organizer);
        await expect(this.organizer).toBeVisible();
    }

    async expectJoinButtonVisible() {
        await expect(this.joinButton).toBeVisible();
    }

    async expectMoreButtonVisible() {
        await expect(this.moreButton).toBeVisible();
    }
}