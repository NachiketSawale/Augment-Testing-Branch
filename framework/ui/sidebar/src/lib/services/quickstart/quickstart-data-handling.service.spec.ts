/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UiSidebarQuickstartDataHandlingService } from './quickstart-data-handling.service';
import { TileGroup } from '@libs/platform/common';

const API_DATA = { useSettings: false, modules: [], showPages: true, showTabs: true };

const TILE_DATA = [
	{
		id: 'basics.materials',
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
		id: 'basics.workflowTask',
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

const SETTINGS = {
	showPages: true,
	showTabs: true,
	useSettings: false,
	desktopItems: [
		{
			id: 'basics.materials',
			iconClass: 'ico-materials',
			displayName: {
				text: 'Materials',
				key: 'cloud.desktop.moduleDisplayNameMaterial',
			},
			description: {
				text: 'Material Catalogues',
				key: 'cloud.desktop.moduleDescriptionMaterial',
			},
			targetRoute: 'modules/basics/materials',
			defaultGroupId: TileGroup.Enterprise,
		},
		{
			id: 'basics.workflowTask',
			iconClass: 'ico-task',
			displayName: {
				text: 'Task',
				key: 'cloud.desktop.moduleDisplayNameWorkflowTask',
			},
			description: {
				text: 'Task Module',
				key: 'cloud.desktop.moduleDescriptionNameWorkflowTask',
			},
			targetRoute: 'modules/basics/workflowTask',
			defaultGroupId: TileGroup.Enterprise,
		},
		{
			id: 'basics.company',
			iconClass: 'ico-company-structure',
			displayName: {
				text: 'Company',
				key: 'cloud.desktop.moduleDisplayNameCompany',
			},
			description: {
				text: 'Company Structure',
				key: 'cloud.desktop.moduleDescriptionCompany',
			},
			targetRoute: 'modules/basics/company',
			defaultGroupId: TileGroup.MasterData,
		},
	],
	modules: [],
	pages: [
		{
			id: 'main',
			iconClass: 'ico-page',
			displayName: {
				text: 'workspace',
				key: 'cloud.desktop.desktopWorkspace',
			},
			description: {
				text: 'cloud.desktop.desktopWorkspace',
				key: 'cloud.desktop.desktopWorkspace',
			},
			targetRoute: 'app/main',
		},
		{
			id: 'config',
			iconClass: 'ico-page',
			displayName: {
				text: 'Administration',
				key: 'cloud.desktop.desktopAdministration',
			},
			description: {
				text: 'cloud.desktop.desktopAdministration',
				key: 'cloud.desktop.desktopAdministration',
			},
			targetRoute: 'app/config',
		},
	],
};

describe('QuickstartDataHandlingService', () => {
	let service: UiSidebarQuickstartDataHandlingService;
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
		});
		httpTestingController = TestBed.get(HttpTestingController);
		service = TestBed.inject(UiSidebarQuickstartDataHandlingService);
	});

	// beforeEach(() => {
	// 	jest.spyOn(service['platformModuleManagerService'], 'preloadDesktopTileData').mockReturnValue(TILE_DATA);
	// });
	afterEach(() => {
		httpTestingController.verify();
	});

	it('get quickstart data from "usersettings/loadmergedsetting" api and check if mapped data is returned as response', () => {
		service.loadSettings$().subscribe((data) => {
			expect(data).toBe(SETTINGS);
		});

		const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/cloud/desktop/usersettings/loadmergedsetting?settingsKey=quickstartSettings');
		req.flush(API_DATA);
	});

	it('check if settings changed event gets emitted', () => {
		service.settingsChanged$.subscribe((data) => {
			expect(data).toBe('changed');
		});
		service.onSettingsChanged({
			quickstartSettings: {},
			sidebarSettings: {},
		});
	});
});
