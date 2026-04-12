import { Locator} from '@playwright/test';
import { BaseComponent} from './BaseComponent';
import { expect } from '@playwright/test';
import { step } from "allure-js-commons";

export class JoinEventModal extends BaseComponent {
    private modalTitle: Locator;
    private confirmButton: Locator;
    private closeButton: Locator;

    constructor(root: Locator) {
        super(root);
        this.modalTitle = this.root.locator('.join-event-modal-title');
        this.confirmButton = this.root.getByRole('button', { name: 'Confirm' });
        this.closeButton = this.root.getByRole('button', { name: 'Close' });
    }

    async closeModal(): Promise<void> {
        await step('Close Join Event modal', async () => {
            await this.closeButton.click();
        });
    }
}