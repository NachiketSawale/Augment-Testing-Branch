/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UiSidebarReportSettingsService } from './report-sidebar-settings.service';

describe('ReportSidebarSettingsServiceService', () => {
	let service: UiSidebarReportSettingsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(UiSidebarReportSettingsService);
	});

	it('Check if report sidebar state gets maintained using local storage', () => {
		/**
		 * Check if pin data is stored and is fetched sucessfully.
		 */
		expect(service.getPinState()).toEqual([]);
		const pinData = { id: 1, groupId: 11 };
		service.setPinState(pinData);
		const pinStatus = service.getPinState();
		expect(pinStatus[0]).toBe(pinData);

		/**
		 * Condition to check if repeated pin data not saved again.
		 */
		service.setPinState(pinData);

		/**
		 * Condition to check if pin state is deleted.
		 */
		service.deletePinState(pinData.id, pinData.groupId);
		expect(service.getPinState()).toStrictEqual([]);

		/**
		 * Check if language data is stored and is fetched sucessfully.
		 */
		expect(service.getLanguageFromStorage()).toBeNull();
		const langData = 'de';
		service.saveCommonFlagStatusInLocalStorage(langData);
		const language = service.getLanguageFromStorage();
		expect(language).toBe(langData);

		/**
		 * Check if expand/collapse data is stored and is fetched sucessfully.
		 */
		expect(service.getExpandState()).toStrictEqual([]);
		const expandData = 1;
		service.setExpandState(expandData);
		const expandState = service.getExpandState();
		expect(expandState[0]).toBe(expandData);

		/**
		 * Condition to check if repeated expand/collapse data not saved again.
		 */
		service.setExpandState(expandData);

		/**
		 * Condition to check if expand state is deleted.
		 */
		service.deleteExpandState(expandData);
		expect(service.getExpandState()).toStrictEqual([]);
	});
});
