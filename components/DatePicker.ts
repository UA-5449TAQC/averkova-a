import { BaseComponent } from "./BaseComponent";
import { Locator, Page } from "@playwright/test";

export class DatePickerComponent extends BaseComponent {

    private  calendar: Locator;
    private nextButton: Locator;
    private previousButton: Locator;
    private curentMonthYear: Locator;

    constructor(root: Locator) {
        super(root);
        this.calendar = this.root.locator('mat-calendar');
        this.nextButton = this.calendar.getByRole('button', { name: /next month/i });
        this.previousButton = this.calendar.getByRole('button', { name: /previous month/i });
        this.curentMonthYear = this.calendar
      .getByRole('button', { name: 'Choose month and year' })
      .locator('span[aria-hidden="true"]');
  }

  private dayCell(day: number): Locator {
    return this.calendar.getByRole('button', {
      name: new RegExp(`\\b${day}\\b`)
    });
  }

  async selectPreviousMonth() {
    await this.previousButton.click();
  }

  async selectNextMonth() {
    await this.nextButton.click();
  }

  async selectDay(day: number) {
    await this.dayCell(day).click();
  }

  async getCurrentMonth(): Promise<string> {
    const monthYearText = await this.curentMonthYear.innerText();
    const [month] = monthYearText.split(' ');
    return Promise.resolve(month);
  }

  async getCurrentYear(): Promise<string> {
    const monthYearText = await this.curentMonthYear.innerText();
    const [, year] = monthYearText.split(' ');
    return Promise.resolve(year);
  }
}