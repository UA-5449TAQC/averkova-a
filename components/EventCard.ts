import { Locator} from '@playwright/test';
import { BaseComponent} from './BaseComponent';
import { expect } from '@playwright/test';
import { step } from "allure-js-commons";

export class EventCard extends BaseComponent {
    private title: Locator;
    private date: Locator;
    private location: Locator;
    private organizer: Locator;
    private joinButton: Locator;
    private image: Locator;

    constructor(root: Locator) {
        super(root);
        this.title = this.root.locator('.event-title');
        this.date = this.root.locator('.event-date');
        this.location = this.root.locator('.event-location');
        this.organizer = this.root.locator('.event-organizer');
        this.joinButton = this.root.getByRole('button', { name: 'Join' });
        this.image = this.root.locator('img.event-image');
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

    async expectLocationVisible(location: string) {
        await expect(this.location).toHaveText(location);
        await expect(this.location).toBeVisible();
    }

    async expectLongTitleVisible(title: string) {
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

}