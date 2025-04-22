/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ITreeOptions } from '../../models/tree-options';

import { UiCommonItemListTreeAccordionHeaderComponent } from './item-list-tree-accordion-header.component';

describe('UiCommonItemListTreeAccordionHeaderComponent', () => {
	let component: UiCommonItemListTreeAccordionHeaderComponent;
	let fixture: ComponentFixture<UiCommonItemListTreeAccordionHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonItemListTreeAccordionHeaderComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonItemListTreeAccordionHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('treeitem should not be null ', () => {
		expect(component.treeitem).not.toBeNull();
	});

	it('treeitem should be defined ', () => {
		expect(component.treeitem).toBeDefined();
	});
	it('treeitems should not be null ', () => {
		expect(component.treeitems).not.toBeNull();
	});

	it('treeitems should be defined ', () => {
		expect(component.treeitems).toBeDefined();
	});
	it('options should not be null ', () => {
		expect(component.options).not.toBeNull();
	});
	it('expand should not be null ', () => {
		expect(component.expand).not.toBeNull();
	});
	it('expand should be defined ', () => {
		expect(component.expand).toBeDefined();
	});
	it('header should not be null ', () => {
		expect(component.header).not.toBeNull();
	});
	it('header should be defined ', () => {
		expect(component.header).toBeDefined();
	});
	it('header() should be called ', () => {
		const options: ITreeOptions = {
			valueMember: '',
			expandFn: function (id: number | string): void {},
			collapseFn: function (id: string | number): void {},
			clickHeaderFn: function (id: string | number, event: Event): void {},
			clickTabFn: function (id: string | number, event: Event, tabId: string | number): void {},
			searchhandlerfunction: function (event: Event): void {},
		};
		component.options = options;
		fixture.detectChanges();
		const event = new Event('input', {});
		const spy = jest.spyOn(component, 'header');

		component.header('test', event);
		expect(spy).toBeCalled();
	});

	it('expand() should be called ', () => {
		const options: ITreeOptions = {
			valueMember: '',
			expandFn: function (id: number | string): void {},
			collapseFn: function (id: string | number): void {},
			clickHeaderFn: function (id: string | number, event: Event): void {},
			clickTabFn: function (id: string | number, event: Event, tabId: string | number): void {},
			searchhandlerfunction: function (event: Event): void {},
		};
		component.options = options;
		fixture.detectChanges();
		const item = {
			id: 'test',
			displayName: 'test',
			Description: 'test',
			cssClass: 'test',
			type: 1,
		};
		const mouseclick = true;
		const event = new KeyboardEvent('keydown', { code: '37' });
		const spy = jest.spyOn(component, 'expand');
		component.expand(item, mouseclick, event);
		expect(spy).toBeCalled();
	});
});
