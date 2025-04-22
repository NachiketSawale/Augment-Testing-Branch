/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonAccordionListComponent } from './accordion-list.component';

describe('UiCommonAccordionListComponent', () => {
	let component: UiCommonAccordionListComponent;
	let fixture: ComponentFixture<UiCommonAccordionListComponent>;
	const list = {
		id: 2,
		groupId: 56,
		name: '',
		text:'',
		filename:'',
		path: '',
		pending: false,
		hasError :false,
		disabled : false,
		itemIcon : '',
	};
	
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonAccordionListComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonAccordionListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('List should be defined', () => {
		component.list = list;
		fixture.detectChanges();
		expect(component.list).toBeDefined();
	});
	it('List should not be null ', () => {
		expect(component.list).not.toBeNull();
	});
	it('clickFnValue should not be null ', () => {
		expect(component.clickFnValue).not.toBeNull();
	});
	it('clickFnValue should be defined ', () => {
		expect(component.clickFnValue).toBeDefined();
	});
	it('clickFn should exist ', () => {
		expect(component.clickFn).toBeDefined();
	});

	it('clickFn should be called ', () => {
		const spy = jest.spyOn(component, 'clickFn');

		const result = component.clickFn('test');
		expect(spy).toBeCalled();
		expect(result).toEqual('test');
	});
});
