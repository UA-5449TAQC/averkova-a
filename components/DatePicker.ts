import { BaseComponent } from "./BaseComponent";
import { Locator, Page } from "@playwright/test";

export class DatePickerComponent extends BaseComponent {
    constructor(root: Locator) {
        super(root);
  }

  private calendar(): Locator {
    return this.root.locator('mat-calendar');
  }

  private nextButton(): Locator {
    return this.calendar().locator('.mat-calendar-next-button');
  }

  private previousButton(): Locator {
    return this.calendar().locator('.mat-calendar-previous-button');
  }

  private periodButton(): Locator {
    return this.calendar().locator('.mat-calendar-period-button');
  }

  private dayCell(day: number): Locator {
    return this.calendar().getByRole('gridcell', { name: String(day), exact: true });
  }

  async selectCurrentMonthDay(day: number) {
    await this.dayCell(day).click();
  }
}