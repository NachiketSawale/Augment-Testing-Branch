/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { UiSidebarUserSettingsService } from './sidebar-user-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarUserSettingsService', () => {
	let service: UiSidebarUserSettingsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [UiSidebarUserSettingsService]
		});

		service = TestBed.inject(UiSidebarUserSettingsService);

	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call getSidebarUserSettings', () => {
		service.sidebarUserSettings = {
			sidebarpin: {
				active: false,
				lastButtonId: 'sidebar-lastobjects'
			}
		};
		service.getSidebarUserSettings();
	});

	it('should call getSidebarUserSettings', () => {
		service.getSidebarUserSettings();
	});

	it('should call saveSidebarUserSettingsinLocalstorage', () => {
		const sidebarData = {
			sidebarpin: {
				active: false,
				lastButtonId: 'sidebar-lastobjects'
			}
		};
		service.saveSidebarUserSettingsinLocalstorage(sidebarData);
	});

	it('should call getSidebarUserSettingValues', () => {
		service.sidebarUserSettings = {
			sidebarpin: {
				active: false,
				lastButtonId: 'sidebar-lastobjects'
			}
		};
		service.getSidebarUserSettingValues();
	});

	it('should call getSidebarUserSettingValues', () => {
		service.sidebarUserSettings = null;
		service.getSidebarUserSettingValues();
	});
	it('should call getUserSettingsFromLocalStorage', () => {
		service.getUserSettingsFromLocalStorage();
	});
});
