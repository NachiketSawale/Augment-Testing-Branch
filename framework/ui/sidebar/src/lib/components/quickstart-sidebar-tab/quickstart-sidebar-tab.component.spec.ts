/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslatePipe } from '@libs/platform/common';

import { UiSidebarQuickstartSidebarTabComponent } from './quickstart-sidebar-tab.component';
import { TileGroup } from '@libs/platform/common';

const API_DATA = { useSettings: false, modules: [], showPages: true, showTabs: true };
const API_DATA_TABS_FALSE = { useSettings: false, modules: [], showPages: true, showTabs: false };
const API_DATA_PAGES_FALSE = { useSettings: false, modules: [], showPages: false, showTabs: true };
const TILE_DATA = [
	{
		id: 'basics.clerk',
		defaultGroupId: TileGroup.Enterprise,
		displayName: {
			text: 'Materials',
			key: 'cloud.desktop.moduleDisplayNameMaterial',
		},
		description: {
			text: 'Material Catalogues',
			key: 'cloud.desktop.moduleDescriptionMaterial',
		},
		iconClass: 'ico-materials',
		color: 5223853,
		opacity: 0.9,
		textColor: 16777215,
		iconColor: 16777215,
		tileSize: 0,
		defaultSorting: 13,
		permissionGuid: 'aaf74523d08849eb9752a842bec64827',
		targetRoute: 'modules/basics/materials',
	},
	{
		id: 'basics.unit',
		defaultGroupId: TileGroup.Enterprise,
		displayName: {
			text: 'Task',
			key: 'cloud.desktop.moduleDisplayNameWorkflowTask',
		},
		description: {
			text: 'Task Module',
			key: 'cloud.desktop.moduleDescriptionNameWorkflowTask',
		},
		iconClass: 'ico-task',
		color: 3704191,
		opacity: 0.9,
		textColor: 16777215,
		iconColor: 16777215,
		tileSize: 1,
		defaultSorting: 13,
		permissionGuid: '37876a44641f4177bd1ee51d08ad6313',
		targetRoute: 'modules/basics/workflowTask',
	},
	{
		id: 'basics.company',
		defaultGroupId: TileGroup.MasterData,
		displayName: {
			text: 'Company',
			key: 'cloud.desktop.moduleDisplayNameCompany',
		},
		description: {
			text: 'Company Structure',
			key: 'cloud.desktop.moduleDescriptionCompany',
		},
		iconClass: 'ico-company-structure',
		color: 2722769,
		opacity: 0.9,
		textColor: 16777215,
		iconColor: 16777215,
		tileSize: 1,
		defaultSorting: 13,
		permissionGuid: 'c64625fa8ae3452a9c6fea373b835d67',
		targetRoute: 'modules/basics/company',
	},
];
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
			Description: undefined,
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
describe('UiSidebarQuickstartSidebarTabComponent when show tabs present', () => {
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	let component: UiSidebarQuickstartSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarQuickstartSidebarTabComponent>;
	let httpTestingController: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			declarations: [UiSidebarQuickstartSidebarTabComponent, TranslatePipe],
		}).compileComponents();
	});

	beforeEach(() => {
		localStorage.setItem('sidebarUserSettings', JSON.stringify({ sidebarpin: { lastButtonId: 'dummy' } }));
		httpTestingController = TestBed.get(HttpTestingController);
		fixture = TestBed.createComponent(UiSidebarQuickstartSidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => {
		jest.spyOn(component['quickstartDataHandlingService']['platformModuleManagerService'], 'preloadDesktopTileData').mockReturnValue(TILE_DATA);
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/cloud/desktop/usersettings/loadmergedsetting?settingsKey=quickstartSettings');
		req.flush(API_DATA);

		const tabReq = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/layout/quickstarttabs');
		tabReq.flush(TABS_DATA);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('check if watchSettingsChange function accepts the change event when emiited', () => {
		component['quickstartDataHandlingService'].onSettingsChanged({
			quickstartSettings: {},
			sidebarSettings: {},
		});
	});

	it('check if search working properly', () => {
		component.search('Clerk');
		component.search('');
	});

	it('check if on panel open gets called', () => {
		component.onPanelOpen(component.moduleAccordionData[0]);
	});
	it('check if on panel close gets called', () => {
		component.onPanelClosed(component.moduleAccordionData[0]);
	});
	it('check if on panel selected gets called', () => {
		component.onPanelSelected(component.moduleAccordionData[0]);
	});
});
describe('UiSidebarQuickstartSidebarTabComponent when show tabs abscent', () => {
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	let component: UiSidebarQuickstartSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarQuickstartSidebarTabComponent>;
	let httpTestingController: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			declarations: [UiSidebarQuickstartSidebarTabComponent, TranslatePipe],
		}).compileComponents();
	});

	beforeEach(() => {
		localStorage.setItem('sidebarUserSettings', JSON.stringify({ sidebarpin: { lastButtonId: 'dummy' } }));
		httpTestingController = TestBed.get(HttpTestingController);
		fixture = TestBed.createComponent(UiSidebarQuickstartSidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => {
		jest.spyOn(component['quickstartDataHandlingService']['platformModuleManagerService'], 'preloadDesktopTileData').mockReturnValue(TILE_DATA);
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/cloud/desktop/usersettings/loadmergedsetting?settingsKey=quickstartSettings');
		req.flush(API_DATA_TABS_FALSE);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

describe('UiSidebarQuickstartSidebarTabComponent when show tabs abscent', () => {
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	let component: UiSidebarQuickstartSidebarTabComponent;
	let fixture: ComponentFixture<UiSidebarQuickstartSidebarTabComponent>;
	let httpTestingController: HttpTestingController;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			declarations: [UiSidebarQuickstartSidebarTabComponent, TranslatePipe],
		}).compileComponents();
	});

	beforeEach(() => {
		localStorage.setItem('sidebarUserSettings', JSON.stringify({ sidebarpin: { lastButtonId: 'dummy' } }));
		httpTestingController = TestBed.get(HttpTestingController);
		fixture = TestBed.createComponent(UiSidebarQuickstartSidebarTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	beforeEach(() => {
		jest.spyOn(component['quickstartDataHandlingService']['platformModuleManagerService'], 'preloadDesktopTileData').mockReturnValue(TILE_DATA);
		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/cloud/desktop/usersettings/loadmergedsetting?settingsKey=quickstartSettings');
		req.flush(API_DATA_PAGES_FALSE);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
