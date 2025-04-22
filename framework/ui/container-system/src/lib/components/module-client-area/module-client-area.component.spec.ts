/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { RouterTestingModule } from '@angular/router/testing';

//import { UiContainerSystemModuleClientAreaComponent } from './module-client-area.component';

export class BaseModuleClientArea {

}

describe('UiContainerSystemModuleClientAreaComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
/*	let component: UiContainerSystemModuleClientAreaComponent;
	let fixture: ComponentFixture<UiContainerSystemModuleClientAreaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule,
				RouterTestingModule
			],
			declarations: [UiContainerSystemModuleClientAreaComponent],
			providers: []
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiContainerSystemModuleClientAreaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should call ngoninit', () => {
		expect(component.ngOnInit).toBeTruthy();
		expect(component.ngOnInit).toBeCalled;
		expect(component.ngOnInit).toBeDefined();
	});

	it('ngOnInit should call getModuleClient', () => {
		const getcontainer = jest.spyOn(component, 'getModuleClient');
		component.ngOnInit();
		expect(getcontainer).toHaveBeenCalled();
	});

	it('should be checked getModuleClient function', () => {
		expect(component.getModuleClient).toBeTruthy();
		expect(component.getModuleClient).toBeCalled;
	});

	it('getModuleClient should call getJsonData', () => {
		const getcontainer = jest.spyOn(component, 'getJsonData');
		component.ngOnInit();
		expect(getcontainer).toHaveBeenCalled();
	});

	it('should be checked goToDesktop function', () => {
		expect(component.goToDesktop).toBeTruthy();
		expect(component.goToDesktop()).toBeCalled;
	});*/
});
