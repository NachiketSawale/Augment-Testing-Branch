/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UiSidebarQuickstartTabsSettingsService } from './quickstart-tabs-settings.service';

const TAB_NAMES = ['basics.clerk', 'basics.company', 'basics.unit'];
const TABS_DATA = {
	'basics.clerk': [
		{
			Id: 402,
			BasModuleFk: 33,
			Description: 'Clerk',
			Sorting: 0,
			Isvisible: true,
			InsertedAt: '2014-12-01T08:13:07.607Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
		},
	],
	'basics.company': [
		{
			Id: 405,
			BasModuleFk: 34,
			Description: 'Company',
			Sorting: 0,
			Isvisible: true,
			InsertedAt: '2014-12-01T08:27:44.69Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
		},
		{
			Id: 406,
			BasModuleFk: 34,
			Description: 'Authority',
			Sorting: 0,
			Isvisible: true,
			InsertedAt: '2014-12-01T08:27:44.697Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
		},
		{
			Id: 407,
			BasModuleFk: 34,
			Description: 'Defaults',
			Sorting: 0,
			Isvisible: true,
			InsertedAt: '2014-12-01T08:27:44.707Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
		},
	],
	'basics.unit': [
		{
			Id: 1309,
			BasModuleFk: 37,
			Description: 'Unit 2',
			Sorting: 2,
			Isvisible: true,
			InsertedAt: '2015-08-04T08:26:54.047Z',
			InsertedBy: 31,
			Version: 0,
			Visibility: 1,
		},
		{
			Id: 404,
			BasModuleFk: 37,
			Description: 'Unit',
			Sorting: 0,
			Isvisible: true,
			InsertedAt: '2014-12-01T08:27:30.19Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
		},
	],
};
//TODO: Unit testing will be completed once Sidebar user settings service gets merged in master.
describe('QuickstartTabsSettingsService', () => {
	let service: UiSidebarQuickstartTabsSettingsService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});
		httpTestingController = TestBed.get(HttpTestingController);
		service = TestBed.inject(UiSidebarQuickstartTabsSettingsService);
	});
	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('Check if getTabsByModulenames function returns the module tabs as response when module names are provided', () => {
		service.getTabsByModulenames$(TAB_NAMES).subscribe((data) => {
			expect(data).toBe(TABS_DATA);
		});
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/layout/quickstarttabs');
		req.flush(TABS_DATA);
	});
	it('Check if getTabsByModulenames function return empty array(catches error) when no module names provided', () => {
		service.getTabsByModulenames$([]).subscribe((data) => {
			expect(data).toBe([]);
		});
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/layout/quickstarttabs');

		req.error({} as ErrorEvent);
	});
});
