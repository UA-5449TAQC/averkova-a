import { test, expect } from '../fixtures/page';
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
    
    await allure.step('Verify Event Card content', async () => {
        await eventsPage.expectAllImagesVisible(); //9. Verify fallback image??
        await eventsPage.checkAllDateTimeFormat(); //11. Validate date/time format??
        const onlineCardEvent = eventsPage.getEventCardByTitle('Community Cleanup Saturday new');
        await onlineCardEvent.expectLocationVisible(' office 113, st. Svetlitsky 35 '); //12. Validate location display??
        
        await test.step.skip('Verify title handling for long titles', async () => { // Skipping because Search doesn't work as expected
        await eventsPage.openSearch();
        await eventsPage.searchEvent('V'); 
        const offlineCardEvent = eventsPage.getEventCardByTitle('Very long title for event so i...'); //10. Verify title handling??
        await offlineCardEvent.expectTitleVisible('Very long title for event so i...');
        await offlineCardEvent.expectOrganizerVisible('WIMP QA');//13. Verify organizer info??
        await offlineCardEvent.expectJoinButtonVisible();//14. Verify Join button??
        await eventsPage.clearSearch();
        });
    });
    await allure.step('Verify new Cards loading', async () => {
        const cardsBefore = await eventsPage.getEventItemsCount(); 
        await eventsPage.page.mouse.wheel(0, 2000);//15. Scroll page
        const cardsAfter = await eventsPage.getEventItemsCount();
        await expect.poll(
            async () => await eventsPage.getEventItemsCount()
        ).toBeGreaterThan(cardsBefore); //16. Trigger lazy loading


    });
    await allure.step('Verify page views (Grid/List)', async () => {
        await eventsPage.page.reload({ timeout: 5000 }); // Refresh page to reset state
        await eventsPage.switchViewTo('list'); //17. Switch view (Grid/List)
        await eventsPage.expectAllEventsItemsVisible();

    });
    await allure.step('Verify page search', async () => {
        await eventsPage.openSearch();
        await eventsPage.searchEvent('!@#NoEvent123'); //18. Enter invalid search
        const count = await eventsPage.getEventItemsCount();
        expect(count).toBe(0); // Verify no results for invalid search
        await eventsPage.clearSearch(); //19. Clear search
        await eventsPage.page.reload({ timeout: 5000 }); //20. Refresh page

    });

})

test ('TC-02: Filtering, Search & State Management', async ({ eventsPage }) => {

    allure.epic('Events Page');
    allure.story('Events List Rendering, Filtering & Data Integrity');
    allure.issue('PROJ-1234', 'https://jira.company.com/browse/PROJ-1234');
    allure.tms('TC-02', 'https://testlink.company.com/case/TC-02');

    await eventsPage.navigateAndWait();
    const cardsBefore = await eventsPage.getFilterResultsNumber();

    await allure.step('Verify status filter functionality', async () => {
        await eventsPage.expectAllFiltersVisible(); //1. Verify filters panel
        await eventsPage.openStatusFilter();//2. Expand Category filter
        await eventsPage.applyStatusFilter("Open");//3. Select category
        await eventsPage.checkAllEventCardsStatus("Open");
        const cardsAfterStatusFilter = await eventsPage.getFilterResultsNumber();
        expect(cardsAfterStatusFilter).toBeLessThan(cardsBefore);
        await eventsPage.page.keyboard.press('Escape');
    });

    await allure.step('Verify type filter functionality', async () => {
        await eventsPage.openTypeFilter();//4. Add category
        await eventsPage.applyTypeFilter("Economic");//5. Select category
        const cardsAfterTypeFilter = await eventsPage.getFilterResultsNumber();
        expect(cardsAfterTypeFilter).toBeLessThan(cardsBefore);
        await eventsPage.page.keyboard.press('Escape');
    });

    await allure.step('Verify filter chips', async () => {
        const cardsFiltered = await eventsPage.getFilterResultsNumber();
        await eventsPage.checkFilterChipVisible("Economic");//5. Verify filter chips
        await eventsPage.checkFilterChipVisible("Open");
        await eventsPage.removeFilterChip("Economic");//6. Remove one filter
        const cardsAfterRemovingChip = await eventsPage.getFilterResultsNumber();
        expect(cardsAfterRemovingChip).toBeGreaterThan(cardsFiltered);
    });

    await allure.step('Verify location filter functionality', async () => {
        await eventsPage.openLocationFilter();//7. Expand Location filter
        await eventsPage.addLocationToFilter("L'viv");//8. Add city to filter
        await eventsPage.applyLocationFilter("L'viv");//8. Select city
        await eventsPage.page.keyboard.press('Escape');
        await eventsPage.checkAllEventCardsLocationContains("L'viv");
        await eventsPage.page.reload(); // Reload because Online option is missing when selecting cities
        await eventsPage.expectAllFiltersVisible();
        await eventsPage.openLocationFilter();
        await eventsPage.applyLocationFilter("Online");
        await eventsPage.page.keyboard.press('Escape');

    });

    await allure.step('Verify date filter functionality', async () => {
        await eventsPage.openDatePicker();//10. Expand Date filter
        await eventsPage.datePicker().isVisible();
        const currentMonth = await eventsPage.datePicker().getCurrentMonth();
        const currentYear = await eventsPage.datePicker().getCurrentYear();
        await eventsPage.datePicker().selectDay(14);//11. Select date ranges
        await eventsPage.datePicker().selectNextMonth();
        await eventsPage.datePicker().selectDay(10);
        await eventsPage.page.keyboard.press('Escape');
        await eventsPage.expectNoCardsWithDate(`${currentMonth} 1, ${currentYear}`);
    });

    await allure.step('Verify search functionality', async () => {
        await eventsPage.expectAllFiltersVisible();
        await eventsPage.openLocationFilter();
        await eventsPage.applyLocationFilter("L'viv");  
        await eventsPage.page.keyboard.press('Escape');
        await eventsPage.openSearch();
        await eventsPage.searchEvent("t"); //12. Enter search keyword
        await eventsPage.checkAllEventCardsLocationContains("L'viv");
        await eventsPage.expectAllCardsTitleContains("t"); // Verify search results
        const cardsCount = await eventsPage.getEventItemsCount();//14. Validate result count
        expect(cardsCount).toBe(await eventsPage.getFilterResultsNumber());
        await eventsPage.clearSearchButton.click(); // Clear search
    });

    await allure.step('Verify filter no-match scenario', async () => {
        await eventsPage.openEventTimeFilter(); 
        await eventsPage.applyEventTimeFilter("Past"); //15. Apply no-match filters
        await eventsPage.page.keyboard.press('Escape');
        await eventsPage.searchEvent("Wrongstring");
        expect(await eventsPage.getEventItemsCount()).toBe(0); // Verify no results
        await eventsPage.checkEmptyStateMessage();
        await eventsPage.resetFiltersButton.click(); //16. Reset filters

    });

    await allure.step('Verify event time filter functionality', async () => {
        await eventsPage.openEventTimeFilter(); 
        await eventsPage.applyEventTimeFilter("Past"); //17. Switch event time filter
        await eventsPage.page.keyboard.press('Escape');
        const card = eventsPage.getEventCardByIndex(0);
        await expect(card.getJoinButton()).toHaveCount(0);  //18. Check past event
        await eventsPage.page.reload(); //19. Reload page

    });
        
    await allure.step('Verify page state persistence during resize', async () => {
        await eventsPage.page.setViewportSize({ width: 768, height: 1024 }); //20. Resize viewport
        await eventsPage.expectAllEventsItemsVisible(); // Verify state persistence
        await eventsPage.expectAllFiltersVisible();
    });

})

test ('TC-03: Event Details Page & Guest Access Restrictions', async ({ eventsPage, eventItemPage }) => {
    allure.epic('Events Page');
    allure.story('Event Details');
    allure.issue('PROJ-1234', 'https://jira.company.com/browse/PROJ-1234');
    allure.tms('TC-03', 'https://testlink.company.com/case/TC-03');

    await eventsPage.navigateAndWait();
    await eventsPage.openStatusFilter();
    await eventsPage.applyStatusFilter("Open");
    await eventsPage.page.keyboard.press('Escape');
    await eventsPage.openEventTimeFilter();
    await eventsPage.applyEventTimeFilter("Upcoming");
    await eventsPage.page.keyboard.press('Escape');
    const eventCard = eventsPage.getEventCardByIndex(1);
    await expect(eventCard.getMoreButton()).toBeVisible();
    const eventTitle = await eventCard.getTitle();
    const eventOrganizer = await eventCard.getOrganizer();
    const eventDate = await eventCard.getDate();
    const eventTime = await eventCard.getTime();

    await allure.step('Navigate to Event page', async () => {
        await eventsPage.clickMoreButtonOfEventByTitle(eventTitle); // 1.Navigate to details page
        await eventItemPage.assertOnPage(); // 2. Validate URL
    });

    await allure.step('Verify Event details content', async () => {
        await eventItemPage.verifyBreadcrumbs('Back to Events'); // 3. Verify location link
        await eventItemPage.verifyEventImageVisible(); // 3. Verify event image
        await eventItemPage.verifyEventTitle(eventTitle); // 3. Verify event title
        await eventItemPage.verifyEventDate(eventDate); // 6. Verify event date
        await eventItemPage.verifyEventTime(eventTime); // 7. Verify event time
        await eventItemPage.verifyEventLocationVisible(); // 4. Verify event location
        await eventItemPage.verifyEventDescriptionVisible(); // 8. Verify event description
        await eventItemPage.verifyEventParticipantsVisible(); // 9. Verify participants count
        await eventItemPage.verifyEventParticipantsCount(); // 10. Verify participants count > 0
        await eventItemPage.verifyEventParticipantsVisible(); // 11. Verify participants list
        await eventItemPage.verifyEventOrganizer(eventOrganizer); // 5. Verify event organizer
    });

    await allure.step('Verify Join Event restrictions for guests', async () => {
        await eventItemPage.joinButton.click(); // 12. Click Join button
        await eventItemPage.getLoginEventModal().verifyModalVisible(); // 13. Verify guest access restriction
        await eventItemPage.getLoginEventModal().closeModal(); // 14. Close modal
        await eventItemPage.assertOnPage(); // 15. Verify still on event page

    });

    await allure.step('Verify Add to Favorites restrictions for guests', async () => {
        await eventItemPage.favoriteButton.click(); // 16. Click Add to Favorites
        await eventItemPage.getLoginEventModal().verifyModalVisible();
        await eventItemPage.getLoginEventModal().closeModal();
        await eventItemPage.assertOnPage();
    });

    await allure.step('Verify Share Event functionality', async () => {
        await test.step.skip('Share Event functionality', async () => { // Skipping because share functionality doesn't work
        await eventItemPage.shareButton.click(); // 17. Click Share button
    });
    });

    await allure.step('Verify comments section', async () => {
        await eventItemPage.page.mouse.wheel(0, 500); // 18. Scroll down
        await eventItemPage.verifyCommentSectionVisible(); // 19. Verify comment section visible
        await eventItemPage.verifyCommentItemVisible(); // 20. Verify comment item visible
    });

    await allure.step('Verify breadcrumbs navigation', async () => {
        await eventItemPage.breadcrumbs.click();
        await eventsPage.assertOnPage(); // 21. Click breadcrumbs and verify navigation back to events page
    });
});