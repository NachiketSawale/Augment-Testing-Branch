/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ITreeOptions } from '../../models/tree-options';
import { UiCommonItemListTreeAccordionContentComponent } from './item-list-tree-accordion-content.component';

describe('UiCommonItemListTreeAccordionContentComponent', () => {
	let component: UiCommonItemListTreeAccordionContentComponent;
	let fixture: ComponentFixture<UiCommonItemListTreeAccordionContentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonItemListTreeAccordionContentComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonItemListTreeAccordionContentComponent);
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
	it('childs should not be null ', () => {
		expect(component.childs).not.toBeNull();
	});

	it('childs should be defined ', () => {
		expect(component.childs).toBeDefined();
	});
	it('options should not be null ', () => {
		expect(component.options).not.toBeNull();
	});

	it('tabFn function should be defined ', () => {
		expect(component.tabFn).toBeDefined();
	});
	it('tabFn() should be called ', () => {
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
		const spy = jest.spyOn(component, 'tabFn');

		component.tabFn('test', 'test', event);
		expect(spy).toBeCalled();
	});
});
