import { EventTimeFilter, EventStatusFilter, EventTypeFilter } from '../pages/EventsPage';
import { test, expect } from '../fixtures/page';
import { assert } from 'node:console';
import * as allure from 'allure-js-commons';

test ('TC-01: Events List Rendering, Filtering & Data Integrity', async ({ homepagePage, eventsPage }) => {
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
        await eventsPage.switchViewTo('list'); //17. Switch view (Grid/List)
        await eventsPage.expectAllEventsItemsVisible();

    });
    await allure.step('Verify page search', async () => {
        await eventsPage.searchEvent('!@#NoEvent123'); //18. Enter invalid search
        const count = await eventsPage.getEventItemsCount();
        expect(count).toBe(0); // Verify no results for invalid search
        await eventsPage.clearSearch(); //19. Clear search
        await eventsPage.page.reload(); //20. Refresh page

    });

})

test ('TC-02: Filtering, Search & State Management', async ({ eventsPage }) => {

    allure.epic('Events Page');
    allure.story('Events List Rendering, Filtering & Data Integrity');
    allure.issue('PROJ-1234', 'https://jira.company.com/browse/PROJ-1234');
    allure.tms('TC-02', 'https://testlink.company.com/case/TC-02');

    await eventsPage.navigateAndWait();
    const cardsBefore = await eventsPage.getEventItemsCount();

    await allure.step('Verify status filter functionality', async () => {
        await eventsPage.expectAllFiltersVisible(); //1. Verify filters panel
        await eventsPage.openStatusFilter();//2. Expand Category filter
        await eventsPage.applyStatusFilter("Open");//3. Select category
        await eventsPage.checkAllEventCardsStatus("Open");
        const cardsAfterStatusFilter = await eventsPage.getEventItemsCount();
        expect(cardsAfterStatusFilter).toBeLessThan(cardsBefore);
    });

    await allure.step('Verify type filter functionality', async () => {
        await eventsPage.openTypeFilter();//4. Add category
        await eventsPage.applyTypeFilter("Economic");//5. Select category
        const cardsAfterTypeFilter = await eventsPage.getEventItemsCount();
        expect(cardsAfterTypeFilter).toBeLessThan(cardsBefore);
    });

    await allure.step('Verify filter chips', async () => {
        const cardsFiltered = await eventsPage.getEventItemsCount();
        await eventsPage.checkFilterChipVisible("Economic");//5. Verify filter chips
        await eventsPage.checkFilterChipVisible("Open");
        await eventsPage.removeFilterChip("Open");//6. Remove one filter
        const cardsAfterRemovingChip = await eventsPage.getEventItemsCount();
        expect(cardsAfterRemovingChip).toBeGreaterThan(cardsFiltered);
    });

    await allure.step('Verify location filter functionality', async () => {
        await eventsPage.openLocationFilter();//7. Expand Location filter
        await eventsPage.applyLocationFilter("Kyiv");//8. Select city
        await eventsPage.checkAllEventCardsLocation("Kyiv");
        await eventsPage.applyLocationFilter("Online");//9. Apply Online filter
        await eventsPage.checkAllEventCardsLocation("Online");
    });

    await allure.step('Verify date filter functionality', async () => {
        await eventsPage.openDatePicker();//10. Expand Date filter
        await eventsPage.datePicker().isVisible();
        const currentMonth = await eventsPage.datePicker().getCurrentMonth();
        const currentYear = await eventsPage.datePicker().getCurrentYear();
        await eventsPage.datePicker().selectDay(14);//11. Select date ranges
        await eventsPage.datePicker().selectNextMonth();
        await eventsPage.datePicker().selectDay(10);
        await eventsPage.expectNoCardsWithDate(`${currentMonth} 1, ${currentYear}`);
    });

    await allure.step('Verify search functionality', async () => {
        await eventsPage.searchEvent("Clean"); //12. Enter search keyword
        await eventsPage.openLocationFilter();
        await eventsPage.applyLocationFilter("Lviv");  //13. Combine filters
        await eventsPage.checkAllEventCardsLocation("Lviv");
        await eventsPage.expectAllCardsTitleContains("Clean"); // Verify search results
        const cardsCount = await eventsPage.getEventItemsCount();//14. Validate result count
        expect(cardsCount).toBe(await eventsPage.getFilterResultsNumber());
    });

    await allure.step('Verify filter no-match scenario', async () => {
        await eventsPage.openEventTimeFilter(); 
        await eventsPage.applyEventTimeFilter("Past"); //15. Apply no-match filters
        expect(await eventsPage.getEventItemsCount()).toBe(0); // Verify no results
        await eventsPage.resetFiltersButton.click(); //16. Reset filters

    });

    await allure.step('Verify event time filter functionality', async () => {
        await eventsPage.openEventTimeFilter(); 
        await eventsPage.applyEventTimeFilter("Past"); //17. Switch event time filter
        const card = eventsPage.getEventCardByIndex(0);
        await expect(card.getJoinButton()).toHaveCount(0);  //18. Check past event
        await eventsPage.page.reload(); //19. Reload page
        await eventsPage.checkFilterChipVisible("Past");

    });
        
    await allure.step('Verify page state persistence during resize', async () => {
        await eventsPage.page.setViewportSize({ width: 768, height: 1024 }); //20. Resize viewport
        await eventsPage.expectAllEventsItemsVisible(); // Verify state persistence
        await eventsPage.expectAllFiltersVisible();
    });

})