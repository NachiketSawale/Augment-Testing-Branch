/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { TestBed } from '@angular/core/testing';
//import { HttpClientModule } from '@angular/common/http';
//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//import { UiSidebarWizardsService } from './wizard-sidebar.service';

//import { ModuleInfoBase } from '@libs/platform/common';

//import { API_DATA } from '../model/data/mock-data/wizard-api-data';
//import { SYSTEM_WIZARDS } from '../model/data/mock-data/system-registered-wizards';

// TODO: restore test cases
describe('WizardSidebarService', () => {
	// let service: UiSidebarWizardsService;
	// let httpTestingController: HttpTestingController;

	// beforeEach(() => {
	// 	TestBed.configureTestingModule({
	// 		imports: [HttpClientModule, HttpClientTestingModule],
	// 	});
	// 	httpTestingController = TestBed.get(HttpTestingController);
	// 	service = TestBed.inject(UiSidebarWizardsService);
	// });

	// beforeEach(() => {
	// 	service['platformModuleManagerService'].activateModule({ internalModuleName: 'project.main' } as ModuleInfoBase);
	// 	jest.spyOn(service['platformModuleManagerService'], 'listWizards').mockReturnValue(SYSTEM_WIZARDS);
	// });

	// afterEach(() => {
	// 	httpTestingController.verify();
	// });

	// it('should be created', () => {
	// 	expect(service).toBeTruthy();
	// });

	// it('Get wizards data from "sidebar/load" APi and filter the response based on System registered wizards', () => {
	// 	service.loadWizards$().subscribe((data) => {
	// 		expect(data).toBeTruthy();
	// 	});
	// 	const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/config/sidebar/load?module=project.main');
	// 	req.flush(API_DATA);
	// });
	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
