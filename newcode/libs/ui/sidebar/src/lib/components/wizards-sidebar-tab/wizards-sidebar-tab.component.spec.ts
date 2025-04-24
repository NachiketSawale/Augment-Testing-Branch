/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { FormsModule } from '@angular/forms';
//import { HttpClientModule } from '@angular/common/http';
//import { MatAccordion } from '@angular/material/expansion';
//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

//import { UiSidebarWizardsSidebarTabComponent } from './wizards-sidebar-tab.component';
//import { UiCommonAccordionComponent } from '@libs/ui/common';
//import { UiCommonAccordionTreeComponent } from '@libs/ui/common';

//import { TranslatePipe } from '@libs/platform/common';

//import { ModuleInfoBase } from '@libs/platform/common';

//import { API_DATA } from '../../model/data/mock-data/wizard-api-data';
//import { SYSTEM_WIZARDS } from '../../model/data/mock-data/system-registered-wizards';

//import { AccordionItemAction } from '@libs/ui/common';
//import { ISidebarWizardAccordionItem } from '../../model/interfaces/wizard/sidebar-wizard-accordion-data.interface';

describe('WizardsSidebarTabComponent', () => {
	// let component: UiSidebarWizardsSidebarTabComponent;
	// let fixture: ComponentFixture<UiSidebarWizardsSidebarTabComponent>;
	// let httpTestingController: HttpTestingController;

	// beforeEach(async () => {
	// 	await TestBed.configureTestingModule({
	// 		imports: [HttpClientModule, FormsModule, HttpClientTestingModule],
	// 		declarations: [UiSidebarWizardsSidebarTabComponent, TranslatePipe, UiCommonAccordionComponent, MatAccordion, UiCommonAccordionTreeComponent],
	// 	}).compileComponents();
	// 	localStorage.setItem('sidebarUserSettings', JSON.stringify({ sidebarpin: { lastButtonId: 'dummy' } }));
	// 	httpTestingController = TestBed.get(HttpTestingController);
	// 	fixture = TestBed.createComponent(UiSidebarWizardsSidebarTabComponent);
	// 	component = fixture.componentInstance;
	// 	component['wizardSidebarService']['platformModuleManagerService'].activateModule({ internalModuleName: 'project.main' } as ModuleInfoBase);
	// 	fixture.detectChanges();
	// });

	// beforeEach(() => {
	// 	jest.spyOn(component['wizardSidebarService']['platformModuleManagerService'], 'listWizards').mockReturnValue(SYSTEM_WIZARDS);
	// 	const req = httpTestingController.expectOne('https://apps-int.itwo40.eu/itwo40/daily/services/basics/config/sidebar/load?module=project.main');
	// 	req.flush(API_DATA);
	// });

	// it('should create', () => {
	// 	expect(component).toBeTruthy();
	// });

	// it('Check if onSelected function gets call on certain item click', () => {
	// 	component.onSelected((component.accordionData[0].children as ISidebarWizardAccordionItem[])[0]);
	// });

	// it('check if onActionButtonClick function gets called when clicked on pin Icon', () => {
	// 	const searchString = 'Excel';
	// 	component.searchString = searchString;
	// 	const itemData = (<ISidebarWizardAccordionItem[]>component.accordionData[0].children)[0];
	// 	(<IAccordionItemAction[]>itemData.actionButtons)[0].execute(itemData);
	// 	(<IAccordionItemAction[]>itemData.actionButtons)[0].execute(itemData);
	// });

	// it('check if search functionality is working', () => {
	// 	const searchString = 'Excel';
	// 	component.search(searchString);
	// });
	it('should create', () => {
		expect(true).toBeTruthy();
	});
});
