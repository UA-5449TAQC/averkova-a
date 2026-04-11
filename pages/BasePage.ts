import { Page, expect } from '@playwright/test';
import { NavigationMenu } from '../components/NavigationMenu';

export abstract class BasePage {
    public page: Page;
    protected navigationMenu: NavigationMenu;

    constructor(page: Page) {
        this.page = page;
        this.navigationMenu = new NavigationMenu(this.page.locator('header'));
    }

    // ── Abstract contract ─────────────────────────────────────────────────────

    /** Each subclass declares its own URL path. */
    abstract get url(): string;

    // ── Navigation ────────────────────────────────────────────────────────────

    /** Navigate to this page's URL. */
    async navigate(): Promise<void> {
        await this.page.goto(this.url);
    }

    /** Navigate and wait until the page is fully loaded. */
    async navigateAndWait(): Promise<void> {
        await this.navigate();
        await this.waitForPageReady();
    }

    /** Wait for network to be idle (no pending requests for 500ms). */
    async waitForPageReady(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /** Assert the browser is currently on this page. */
    async assertOnPage(): Promise<void> {
        await expect(this.page, `Should be on ${this.url}`)
            .toHaveURL(new RegExp(this.url));
    }
    getCurrentUrl(): string {
        return this.page.url();
    }

    getNavigationMenu(): NavigationMenu {
        return this.navigationMenu;
    }
}
