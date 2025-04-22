/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UiCommonStatusBarElementComponent } from './status-bar-element.component';

describe('UiCommonStatusBarElementComponent', () => {
	let component: UiCommonStatusBarElementComponent;
	let fixture: ComponentFixture<UiCommonStatusBarElementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonStatusBarElementComponent],
			imports: [HttpClientTestingModule, RouterTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonStatusBarElementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('switchToNewToolTipDirective() should call the Function', () => {
		const spy = jest.spyOn(component, 'switchToNewToolTipDirective');
		component.switchToNewToolTipDirective();
		expect(spy).toBeTruthy();
		expect(spy).toHaveBeenCalled();
		expect(spy).not.toBeNull();
	});
	it('ngOnInit() should call the Function', () => {
		const spy = jest.spyOn(component, 'ngOnInit');
		component.ngOnInit();
		expect(spy).toBeTruthy();
		expect(spy).toHaveBeenCalled();
		expect(spy).not.toBeNull();
	});

	it('ngOnDestroy() : should destroy function', () => {
		const spyaddDefaultSettings = jest.spyOn(component, 'ngOnDestroy');
		component.ngOnDestroy();
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});
});
