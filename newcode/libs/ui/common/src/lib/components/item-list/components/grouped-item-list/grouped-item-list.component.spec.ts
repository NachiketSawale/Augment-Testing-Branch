/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommonGroupedItemListComponent } from './grouped-item-list.component';

describe('UiCommonGroupedItemListComponent', () => {
	let component: UiCommonGroupedItemListComponent;
	let fixture: ComponentFixture<UiCommonGroupedItemListComponent>;
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
			declarations: [UiCommonGroupedItemListComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonGroupedItemListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	it('groupedList should not be null ', () => {
		expect(component.groupedList).not.toBeNull();
	});
	it('groupedList should be defined ', () => {
		component.groupedList = groupedListMockData;
		fixture.detectChanges();
		expect(component.groupedList).toBeDefined();
	});
	it('groupedListCfg should not be null ', () => {
		expect(component.groupedListCfg).not.toBeNull();
	});
	it('groupedListCfg should be defined ', () => {
		component.groupedListCfg = groupedListCfg;
		fixture.detectChanges();
		expect(component.groupedListCfg).toBeDefined();
	});
	it('groupTemplate should not be null ', () => {
		expect(component.groupTemplate).not.toBeNull();
	});
	it('groupTemplate should be defined ', () => {
		expect(component.groupTemplate).toBeDefined();
	});
	it('childProperty should not be null ', () => {
		expect(component.childProperty).not.toBeNull();
	});
	it('childProperty should be defined ', () => {
		expect(component.childProperty).toBeDefined();
	});
	it('itemTemplate should not be null ', () => {
		expect(component.itemTemplate).not.toBeNull();
	});
	it('itemTemplate should be defined ', () => {
		expect(component.itemTemplate).toBeDefined();
	});
	it('invert function should be defined ', () => {
		expect(component.invert).toBeDefined();
	});

	it('invert() should be called ', () => {
		const spy = jest.spyOn(component, 'invert');

		component.invert(1);
		expect(spy).toBeCalled();
	});
});
