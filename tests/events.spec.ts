import { NavigationMenu } from '../components/NavigationMenu';
import { BasePage } from '../pages/BasePage';
import { test, expect } from '../fixtures/page';
import { assert } from 'node:console';
import * as allure from 'allure-js-commons';

test ('TC-01: Events List Rendering, Navigation & Data Integrity', async ({ homepagePage, eventsPage }) => {

    await homepagePage.navigateAndWait(); // 1. Navigate to the homepage
    await homepagePage.getNavigationMenu().goToEvents(); // 2. Click on the "Events" link in the header
    await eventsPage.assertOnPage(); // 3. Validate page URL
    await expect.soft(eventsPage.mainHeader).toBeVisible(); // 4. Verify page title is visible
    await expect.soft(eventsPage.mainHeader).toHaveText('Events'); // 4. Verify page title text
    await eventsPage.expectAllEventsItemsVisible(); // 8. Verify event cards rendering
    //9. Verify fallback image
    //10. Verify title handling
    await eventsPage.checkDateTimeFormat(); //11. Validate date/time format
    await eventsPage.expectLocationVisible('Online'); 
    await eventsPage.expectLocationVisible('office 113, st. Svetlitsky 35');//12. Validate location display
    //13. Verify organizer info
    //14. Verify Join button
    //15. Scroll page
    //16. Trigger lazy loading
    //17. Switch view (Grid/List)
    //18. Enter invalid search
    //19. Clear search
    //20. Refresh page
})