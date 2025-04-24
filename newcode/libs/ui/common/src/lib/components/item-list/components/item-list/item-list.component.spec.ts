/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonItemListComponent } from './item-list.component';

describe('UiCommonItemListComponent', () => {
	let component: UiCommonItemListComponent;
	let fixture: ComponentFixture<UiCommonItemListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonItemListComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('list should not be null ', () => {
		expect(component.list).not.toBeNull();
	});
	it('itemTemplate should be defined ', () => {
		expect(component.itemTemplate).toBeDefined();
	});
	it('itemTemplate should not be null ', () => {
		expect(component.itemTemplate).not.toBeNull();
	});
	it('clickFnValue should be defined ', () => {
		expect(component.clickFnValue).toBeDefined();
	});
	it('clickFnValue should not be null ', () => {
		expect(component.clickFnValue).not.toBeNull();
	});
	it('invert function should be defined ', () => {
		expect(component.clickFn).toBeDefined();
	});

	it('clickFn() should be called ', () => {
		const spy = jest.spyOn(component, 'clickFn');

		const result = component.clickFn(1);
		expect(spy).toBeCalled();
		expect(result).toEqual(1);
	});
});
