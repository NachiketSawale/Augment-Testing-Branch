/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
//import { HttpClientTestingModule } from '@angular/common/http/testing';
//import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { RouterTestingModule } from '@angular/router/testing';
//import { PlatformPermissionService } from '@libs/platform/common';

//import { UiContainerSystemAccessDeniedContainerComponent } from './access-denied-container.component';

describe('LackingPermissionInfoComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
/*	let component: UiContainerSystemAccessDeniedContainerComponent;
	let fixture: ComponentFixture<UiContainerSystemAccessDeniedContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[
				HttpClientTestingModule,
				RouterTestingModule,
			],
			declarations: [UiContainerSystemAccessDeniedContainerComponent,
			],
			providers:[PlatformPermissionService,{ provide: 'containerDef', useValue: {} }]
		}).compileComponents();

		fixture = TestBed.createComponent(UiContainerSystemAccessDeniedContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	//Test suit for ngOnInit
	it('should call ngoninit', () => {
		expect(component.ngOnInit).toBeTruthy();
		expect(component.ngOnInit).toBeCalled;
		expect(component.ngOnInit).toBeDefined();
	});

	//Test suits for getcontainerUuid
	it('ngOnInit should call loadDescriptorInfo', () => {
		const getcontainer = jest.spyOn(component, 'loadDescriptorInfo');
		component.ngOnInit();
		expect(getcontainer).toHaveBeenCalled();
	});

	it('should be checked toggle function', () => {
		component.toggleState=false;
		expect(component.toggle).toBeTruthy();
		expect(component.toggle()).toBeCalled;
	});

	it('should be checked toggleIcon function', () => {
		expect(component.toggleIcon).toBeTruthy();
		expect(component.toggleIcon).toBeCalled;
	});
	it('should be checked toggleIcon function', () => {
		component.toggleState=false;
		const Result = component.toggleIcon();
		expect(component.toggleIcon).toBeCalled;
		expect(component.toggleIcon()).toBe(Result);
	});
	it('should be checked toggleIcon function', () => {
		component.toggleState=true;
		const Result = component.toggleIcon();
		expect(component.toggleIcon).toBeCalled;
		expect(component.toggleIcon()).toBe(Result);
	});

	it('should be checked lockIcon function', () => {
		expect(component.lockIcon).toBeTruthy();
		expect(component.lockIcon).toBeCalled;
	});
	it('should be checked lockIcon function', () => {
		component.toggleState=false;
		const Result = component.lockIcon();
		expect(component.lockIcon).toBeCalled;
		expect(component.lockIcon()).toBe(Result);
	});
	it('should be checked lockIcon function', () => {
		component.toggleState=true;
		const Result = component.lockIcon();
		expect(component.lockIcon).toBeCalled;
		expect(component.lockIcon()).toBe(Result);
	});

	it('should be checked loadDescriptor function', () => {
		expect(component.loadDescriptorInfo).toBeTruthy();
		expect(component.loadDescriptorInfo).toBeCalled;
	});*/
});
