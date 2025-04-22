/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommonGroupedAccordionListComponent } from './grouped-accordion-list.component';

describe('UiCommonGroupedAccordionListComponent', () => {
	let component: UiCommonGroupedAccordionListComponent;
	let fixture: ComponentFixture<UiCommonGroupedAccordionListComponent>;
	const groupedListMockData = [{
		id : 121,
		name : '',
		visible : true,
		icon : '',
		reports : [
			{
			id: 12,
			groupId: 23,
			name: '',
			text: '' ,
			filename: '',
			path: '',
			parameters: 4,
		},],
		count : 6,
		groupIconClass : '',
		toggleClass : 'ico-up',
	}];

	const groupedListCfg = {
		groups: [{
			id: 12,
			name: '',
			visible: false,
			icon: '',
			reports: [{
				id: 12,
				groupId: 23,
				name: '',
				text: '',
				filename: '',
				path: '',
				parameters: 4,
			}],
			count: 123,
		}],
		context: [{
			Id: 45,
			description$tr$: '',
			description: '',
		}],
		userInfo: {
			userValid: false,
			LogonName: '',
			UserId: 5,
			UserName: '',
			Email: '',
			Idp: '',
			IdpName: '',
			IsPasswordChangeRequired:  false,
			PasswordExpiration: '',
			ExplicitAccess: false,
			UserDataLanguageId: 6,
			UiLanguage: '',
			UiCulture: '',
			ExternalProviderUserId:'',
			IntegratedAccess: false,
		},
		showSelected: false,
	};
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonGroupedAccordionListComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonGroupedAccordionListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('groupedList should not be null ', () => {
		component.groupedList = groupedListMockData;
		fixture.detectChanges();
		expect(component.groupedList).not.toBeNull();
	});
	it('groupedList should be defined ', () => {
		component.groupedList = groupedListMockData;
		fixture.detectChanges();
		expect(component.groupedList).toBeDefined();
	});
	it('groupedListCfg should not be null ', () => {
		component.groupedListCfg = groupedListCfg;
		fixture.detectChanges();
		expect(component.groupedListCfg).not.toBeNull();
	});
	it('groupedListCfg should be defined ', () => {
		component.groupedListCfg = groupedListCfg;
		fixture.detectChanges();
		expect(component.groupedListCfg).toBeDefined();
	});
	it('clickFnValue should not be null ', () => {
		expect(component.clickFnValue).not.toBeNull();
	});
	it('clickFnValue should be defined ', () => {
		expect(component.clickFnValue).toBeDefined();
	});
	it('refresh should not be null ', () => {
		expect(component.refresh).not.toBeNull();
	});
	it('refresh function should be defined ', () => {
		expect(component.refresh).toBeDefined();
	});
	it('invert function should not be null ', () => {
		expect(component.invert).not.toBeNull();
	});
	it('invert function should be defined ', () => {
		expect(component.invert).toBeDefined();
	});
	it('clickFn function should not be null ', () => {
		expect(component.clickFn).not.toBeNull();
	});
	it('clickFn function should be defined ', () => {
		expect(component.clickFn).toBeDefined();
	});

	it('refresh() should be called', () => {
		const spy = jest.spyOn(component, 'refresh');

		component.refresh();
		expect(spy).toBeCalled();
	});
	it('invert() should be called ', () => {
		const spy = jest.spyOn(component, 'invert');

		component.invert(1);
		expect(spy).toBeCalled();
	});
	it('clickFn() should be called ', () => {
		const spy = jest.spyOn(component, 'clickFn');

		const result = component.clickFn(1);
		expect(spy).toBeCalled();
		expect(result).toEqual(1);
	});
});
