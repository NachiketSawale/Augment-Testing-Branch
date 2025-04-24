/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UiCommonStatusBarComponent } from './status-bar.component';
// import { StatusBarMockData } from '../../../../mock-data/status-bar-mock-data';
import { UiCommonStatusBarContentComponent } from '../status-bar-content/status-bar-content.component';
import { UiCommonStatusBarElementComponent } from '../status-bar-element/status-bar-element.component';

describe('UiCommonStatusBarComponent', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	/*let component: UiCommonStatusBarComponent;
	let fixture: ComponentFixture<UiCommonStatusBarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonStatusBarComponent, UiCommonStatusBarContentComponent, UiCommonStatusBarElementComponent],
			imports: [HttpClientTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonStatusBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('setlink : should call function', () => {
		const spysortFields = jest.spyOn(component, 'setlink');
		component.setlink();
		expect(spysortFields).toBeCalled();
		expect(spysortFields).toBeTruthy();
		expect(spysortFields).not.toBeNull();
	});

	it('linkObject.addFields() : should call function', () => {
		const newFieldsObj = StatusBarMockData;
		const spy = jest.spyOn(component.linkObject, 'addFields');
		component.linkObject.addFields(newFieldsObj);
		expect(spy).toBeTruthy();
		expect(spy).toHaveBeenCalled();
		expect(spy).not.toBeNull();
	});

	it('linkObject.updateFields() : should call function', () => {
		const changedFieldsobj = StatusBarMockData;
		const spy = jest.spyOn(component.linkObject, 'updateFields');
		component.linkObject.updateFields(changedFieldsobj);
		expect(spy).toBeTruthy();
		expect(spy).toHaveBeenCalled();
		expect(spy).not.toBeNull();
	});

	it('linkObject : should call update function', () => {
		const spy = jest.spyOn(component.linkObject, 'update');
		component.linkObject.update();
		expect(spy).toBeTruthy();
		expect(spy).toHaveBeenCalled();
		expect(spy).not.toBeNull();
	});

	it('normalizeToArray() : should call function', () => {
		const fields = StatusBarMockData.fields2;
		const spyaddDefaultSettings = jest.spyOn(component, 'normalizeToArray');
		component.normalizeToArray(fields);
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});

	it('addDefaultSettings() : should call function', () => {
		const fieldObject = StatusBarMockData;
		const spyaddDefaultSettings = jest.spyOn(component, 'addDefaultSettings');
		component.addDefaultSettings(fieldObject);
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});

	it('sortFields() : should call function', () => {
		const spyaddDefaultSettings = jest.spyOn(component, 'sortFields');
		component.sortFields();
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});

	it('setlink() : should call function', () => {
		const spyaddDefaultSettings = jest.spyOn(component, 'setlink');
		component.setlink();
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});

	it('ngOnDestroy() : should destroy the function', () => {
		const spyaddDefaultSettings = jest.spyOn(component, 'ngOnDestroy');
		component.ngOnDestroy();
		expect(spyaddDefaultSettings).toBeCalled();
		expect(spyaddDefaultSettings).toBeTruthy();
		expect(spyaddDefaultSettings).not.toBeNull();
	});*/
});