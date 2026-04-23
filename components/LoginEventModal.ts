import { Locator} from '@playwright/test';
import { BaseComponent} from './BaseComponent';
import { expect } from '@playwright/test';
import { step } from "allure-js-commons";

export class LoginEventModal extends BaseComponent {
    private modalHeading: Locator;
    private modalTitle: Locator;
    private confirmButton: Locator;
    private closeButton: Locator;

    constructor(root: Locator) {
        super(root);
        this.modalHeading = this.root.getByRole('heading', { level: 1, name: ' Welcome back! ' });
        this.modalTitle = this.root.getByRole('heading', { level: 2, name: 'Please enter your details to sign in.' });
        this.confirmButton = this.root.getByRole('button', { name: 'Sign in', exact: true });
        this.closeButton = this.root.getByAltText('close button');
    }

    async closeModal(): Promise<void> {
        await step('Close Join Event modal', async () => {
            await this.closeButton.click();
        });
    }

    async verifyModalVisible(): Promise<void> {
        await step('Verify Join Event modal is visible', async () => {
            await expect(this.modalHeading).toBeVisible();
            await expect(this.modalTitle).toBeVisible();
            await expect(this.confirmButton).toBeVisible();
            await expect(this.closeButton).toBeVisible();
        });
    }

}