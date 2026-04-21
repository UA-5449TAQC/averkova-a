import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import {step}  from 'allure-js-commons';
import { EventCard } from "../components/EventCard";
import { DatePickerComponent } from "../components/DatePicker";

export const EVENT_TIME_FILTERS = {
  UPCOMING: 'Upcoming',
  PAST: 'Past',
  ANY_TIME: ' Any Time ',
} as const;

export const EVENT_STATUS_FILTERS = {
    OPEN: 'Open',
    CLOSED: 'Closed',
    ANY_STATUS: ' Any Status ',
} as const;

export const EVENT_TYPES_FILTERS = {
    ECONOMIC: 'Economic',
    ENVIRONMENTAL: 'Environmental',
    SOCIAL: 'Social',
    ALL_TYPES: ' All Types ',
} as const;

export type EventTimeFilter =
  typeof EVENT_TIME_FILTERS[keyof typeof EVENT_TIME_FILTERS];

export type EventStatusFilter =
  typeof EVENT_STATUS_FILTERS[keyof typeof EVENT_STATUS_FILTERS];

export type EventTypeFilter =
  typeof EVENT_TYPES_FILTERS[keyof typeof EVENT_TYPES_FILTERS];

export class EventsPage extends BasePage {

    readonly mainHeader: Locator;
    readonly eventCards: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly gridViewButton: Locator;
    readonly listViewButton: Locator;
    readonly filtersText: Locator;
    readonly filterByTimeDropdown: Locator;
    readonly filterByLocationDropdown: Locator;
    readonly filterByStatusDropdown: Locator;
    readonly filterByTypeDropdown: Locator;
    readonly filterByDateDropdown: Locator;
    readonly resetFiltersButton: Locator;
    readonly chips: Locator;
    readonly filterResults: Locator;


    //constructor with inheriting page from BasePage + initializing locators
    constructor(page: Page) {
        super(page);
        this.mainHeader = page.locator('p.main-header');
        this.eventCards = page.locator('mat-card.event-list-item');
        this.searchButton = page.locator('.search-img')
        this.searchInput = page.locator('input[placeholder="Search"]');
        this.gridViewButton = page.locator('button.gallery');
        this.listViewButton = page.locator('button.list');
        this.filtersText = page.locator('p.filter-by');
        this.filterByTimeDropdown = page.locator('mat-label.filter', { hasText: 'Event time' });
        this.filterByLocationDropdown = page.locator('mat-label.filter', { hasText: 'Location' });
        this.filterByStatusDropdown = page.locator('mat-label.filter', { hasText: 'Status' });
        this.filterByTypeDropdown = page.locator('mat-label.filter', { hasText: 'Type' });
        this.filterByDateDropdown = page.locator('mat-label.filter', { hasText: 'Date range' });
        this.resetFiltersButton = page.locator('button.reset');
        this.chips = page.locator('div.chips');
        this.filterResults = page.locator('.active-filter-container p');
     }

     get url(): string {
        return '#/greenCity/events';
     }

    //── Event Cards helpers ────────────────────────────────────────────────

    getEventCardByLocation(location: string): EventCard {
    const card = this.page
        .locator('mat-card.event-list-item')
        .filter({ hasText: location })
        .first();

    return new EventCard(card);
    }

    getEventCardByTitle(title: string): EventCard {
    const card = this.page
        .locator('mat-card.event-list-item')
        .filter({ hasText: title })
        .first();

    return new EventCard(card);
    }

     getEventCardByIndex(index: number): EventCard {
        const cardLocator = this.eventCards.nth(index);
        return new EventCard(cardLocator);
     }

    getEventItemsCount() {
        return this.eventCards.count();
     }

    getEventItemDate(index: number) {
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

    async checkAllEventCardsStatus(status: string) {
        await step(`Verify all event cards have status: ${status}`, async () => {
        const count = await this.getEventItemsCount();
        await expect.poll(async () => await this.getEventItemsCount())
        .toBeGreaterThan(0);
            for (let i = 0; i < count; i++) {
                const eventCard = this.getEventCardByIndex(i);
                const cardStatus = await eventCard.getStatus();
                await expect(cardStatus).toBe(status);
            }
        });
    }

    async checkAllEventCardsLocation(location: string) {
        await step(`Verify all event cards have location: ${location}`, async () => {
        await this.eventCards.first().waitFor({ timeout: 5000 });
        const count = await this.getEventItemsCount();
        await expect.poll(async () => await this.getEventItemsCount())
        .toBeGreaterThan(0);
            for (let i = 0; i < count; i++) {
                const eventCard = this.getEventCardByIndex(i);
                const cardLocation = await eventCard.getLocation();
                await expect(cardLocation).toContain(location);
            }
        });
    }


    async checkAllDateTimeFormat() {
        await step('Validate cards date/time format is "MMM DD, YYYY"', async () => {
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

    async expectNoCardsWithDate(date: string) {
        await step(`Verify no event cards with date: ${date}`, async () => {
            const cards = this.eventCards.filter({ hasText: date });
            await expect(cards).toHaveCount(0);
        });

    }

    async expectAllCardsTitleContains(title: string) {
        await step(`Verify all event cards have title containing: ${title}`, async () => {
            const count = await this.getEventItemsCount();
            await expect(count).toBeGreaterThan(0);
            for (let i = 0; i < count; i++) {
                const eventCard = this.getEventCardByIndex(i);
                const cardTitle = await eventCard.getTitle();
                await expect(cardTitle).toContain(title);
            }
        });
    }


    //── Switch View helpers ────────────────────────────────────────────────

    async switchViewTo(view: 'list' | 'grid') { 
        await step(`Switch to ${view} view`, async () => {
            const selectors = {
                list: this.listViewButton,
                grid: this.gridViewButton
            };
            await selectors[view].click();
        });
    }

    //── Filters & Search helpers ────────────────────────────────────────────────

    async openSearch() {
        await this.searchButton.click();
    }

    async searchEvent(query: string) {
        await step(`Search for event with query: "${query}"`, async () => {
            await this.searchInput.fill(query);
            await this.searchInput.press('Enter');
    }
    );}

    async clearSearch() {
        await step('Clear search input', async () => {
            await this.searchInput.fill('');
            await this.searchInput.press('Enter');
    }
    );}

    async expectAllFiltersVisible() {
        await step('Verify all filter controls are visible', async () => {
            await expect(this.filtersText).toBeVisible();
            await expect(this.filterByDateDropdown).toBeVisible();
            await expect(this.filterByLocationDropdown).toBeVisible();
            await expect(this.filterByStatusDropdown).toBeVisible();
            await expect(this.filterByTypeDropdown).toBeVisible();
            await expect(this.filterByTimeDropdown).toBeVisible();
            await expect(this.resetFiltersButton).toBeVisible();
        });
    }

    async openEventTimeFilter() {
        await this.filterByTimeDropdown.click();
    }

    async applyEventTimeFilter(eventTime: EventTimeFilter) {
        await step(`Apply event time filter: ${eventTime}`, async () => {
            await this.page.getByRole('option', { name: eventTime }).click();
        });
    }

    async openLocationFilter() {
        await this.filterByLocationDropdown.click();
    }

    async addLocationToFilter(city: string) {
        await step(`Add location: ${city}`, async () => {
        await this.page.locator('.add-location-option').click();
        await this.page.locator('.city-input-row input').fill(city);
        await this.page.locator('#mat-autocomplete-0 mat-option').first().click();
        });
        await this.page.getByRole('button', { name: ' Add selected cities ' }).click();
    }

    async applyLocationFilter(city: string) {
        await step(`Apply location filter: ${city}`, async () => {
            await this.page.locator('mat-option.ng-star-inserted span.mdc-list-item__primary-text', { hasText: city }).click();
        });
    }

    async openStatusFilter() {
        await this.filterByStatusDropdown.click();
    }

    async applyStatusFilter(status: EventStatusFilter) {
        await step(`Apply event status filter: ${status}`, async () => {
            await this.page.getByRole('option', { name: status }).click();
        });
    }

    async openTypeFilter() {
        await this.filterByTypeDropdown.click();
    }

    async applyTypeFilter(type: EventTypeFilter) {
        await step(`Apply eventtype filter: ${type}`, async () => {
            await this.page.getByRole('option', { name: type }).click();
        });
    }

    async checkFilterChipVisible(filterText: string) {
        await step(`Verify filter chip is visible: ${filterText}`, async () => {
            const chip = this.chips.getByText(filterText, { exact: true });
            await expect(chip).toBeVisible();
        });
    }

    async removeFilterChip(filterText: string) {
        await step(`Remove filter chip: ${filterText}`, async () => {
            const chip = this.chips
                .locator('.active-filter')
                .filter({ hasText: filterText });

            await chip.locator('.cross-container').click();
        });
    }

    async getFilterResultsNumber(): Promise<number> {
        await expect.poll(
            async () => await this.getEventItemsCount()
        ).toBeGreaterThan(0);
        const filterText = await this.filterResults.innerText();
        const [count] = filterText.split(' ');
        return parseInt(count, 10);
    }


    //── Date Picker helpers ────────────────────────────────────────────────


    async openDatePicker() {
        await this.filterByDateDropdown.click();
    }

    datePicker(): DatePickerComponent {
        return new DatePickerComponent(this.page.locator('mat-datepicker-content'));
    }

}