/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { RouterTestingModule } from '@angular/router/testing';
//import { UiCommonDialogService } from '@libs/ui/common';

//import { UiContainerSystemModuleTabBarComponent } from './module-tab-bar.component';

export class BaseModuleClientArea {}

describe('UiContainerSystemModuleTabBarComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	/*	let component: UiContainerSystemModuleTabBarComponent;
	let fixture: ComponentFixture<UiContainerSystemModuleTabBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule,
				RouterTestingModule,
				// TODO: remove?
				//TranslateModule.forRoot()
			],
			declarations: [UiContainerSystemModuleTabBarComponent],
			providers: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiContainerSystemModuleTabBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//Test suit for ngOnInit
	it('should call ngOnInit', () => {
		expect(component.ngOnInit).toBeTruthy();
		expect(component.ngOnInit).toBeCalled;
		expect(component.ngOnInit).toBeDefined();
	});

	it('ngOnInit should call getTitle', () => {
		const getTitle = jest.spyOn(component, 'getTitle');
		component.ngOnInit();
		expect(getTitle).toHaveBeenCalled();
	});

	it('ngOnInit should call getJsonData', () => {
		const getJson = jest.spyOn(component, 'getJsonData');
		component.ngOnInit();
		expect(getJson).toHaveBeenCalled();
	});

	it('should be checked changeTab function', () => {
		expect(component.changeTab).toBeTruthy();
		expect(component.changeTab(402)).toBeCalled;
	});

	it('should be called changeTab function', () => {
		const id: number = 402;
		const selectedItem = jest.spyOn(component, 'changeTab'); // spy first
		component.changeTab(id);
		expect(selectedItem).toHaveBeenCalledWith(id);
	});

	it('should be checked goToEditView function', () => {
		expect(component.goToEditView).toBeTruthy();
		expect(component.goToEditView).toBeDefined();

	});*/
});
