    import { NavigationMenu } from '../components/NavigationMenu';
import { EventCard } from '../components/EventCard';
import { BasePage } from '../pages/BasePage';
import { test, expect } from '../fixtures/page';
import { assert } from 'node:console';
import * as allure from 'allure-js-commons';

test ('TC-01: Events List Rendering, Navigation & Data Integrity', async ({ homepagePage, eventsPage }) => {
    allure.epic('Events Page');
    allure.story('Events List Rendering, Navigation & Data Integrity');
    allure.description('This test validates the rendering of the events list, navigation to the events page, and the integrity of event data displayed.');
    allure.issue('PROJ-1234', 'https://jira.company.com/browse/PROJ-1234');
    allure.tms('TC-01', 'https://testlink.company.com/case/TC-01');

    await allure.step('Navigate to the Events Page', async () => {
        await homepagePage.navigateAndWait(); // 1. Navigate to the homepage
        await homepagePage.getNavigationMenu().clickEventsLink(); // 2. Click on the "Events" link in the header
        await eventsPage.assertOnPage(); // 3. Validate page URL
    });
    await allure.step('Verify Events Page content', async () => {
        await expect.soft(eventsPage.mainHeader).toBeVisible(); // 4. Verify page title is visible
        await expect.soft(eventsPage.mainHeader).toHaveText('Events'); // 4. Verify page title text
        await eventsPage.expectAllEventsItemsVisible(); // 8. Verify event cards rendering
    });
    
    // -------------------------------------------------------------------------------------------------------------//
    
    await allure.step('Verify Event Card content', async () => {
        await eventsPage.expectAllImagesVisible(); //9. Verify fallback image??
        await eventsPage.checkAllDateTimeFormat(); //11. Validate date/time format??
        const onlineCardEvent = eventsPage.getEventCardByTitle('Online Event');
        await onlineCardEvent.expectLocationVisible('Online');
        const offlineCardEvent = eventsPage.getEventCardByTitle('Some Long Title'); //10. Verify title handling??
        await offlineCardEvent.expectLongTitleVisible('Some Long Title');
        await offlineCardEvent.expectLocationVisible('Offline'); 
        // Verify location icon??
        await offlineCardEvent.expectLocationVisible('office 113, st. Svetlitsky 35');//12. Validate location display??
        await offlineCardEvent.expectOrganizerVisible('test');//13. Verify organizer info??
        await offlineCardEvent.expectJoinButtonVisible();//14. Verify Join button??
        await onlineCardEvent.expectJoinButtonVisible();
    });
    await allure.step('Verify new Cards loading', async () => {
        const cardsBefore = await eventsPage.getEventItemsCount(); 
        await eventsPage.page.mouse.wheel(0, 2000);//15. Scroll page
        const cardsAfter = await eventsPage.getEventItemsCount();
        expect(cardsAfter).toBeGreaterThan(cardsBefore); //16. Trigger lazy loading


    });
    await allure.step('Verify page views (Grid/List)', async () => {
        await eventsPage.page.reload(); // Refresh page to reset state
        await eventsPage.switchView(); //17. Switch view (Grid/List)
        await eventsPage.expectAllEventsItemsVisible();

    });
    await allure.step('Verify page search', async () => {
        //18. Enter invalid search
        //19. Clear search
        //20. Refresh page

    });

})