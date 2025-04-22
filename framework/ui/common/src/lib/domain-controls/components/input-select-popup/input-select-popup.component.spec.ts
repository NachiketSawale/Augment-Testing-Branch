/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { InputSelectPopupComponent } from './input-select-popup.component';
import { ActivePopup } from '../../../popup/model/active-popup';

import { IUiInputSelectItem } from '../../../domain-controls/model/ui-input-select-item.interface';

const data = {
	id: '2',
	displayName: 'Q1 2015',
	isSelected: false,
};

describe('InputSelectPopupComponent', () => {
	let component: InputSelectPopupComponent;
	let fixture: ComponentFixture<InputSelectPopupComponent>;

	const selectedItem = new EventEmitter<IUiInputSelectItem>();
	selectedItem.next(data);
	const keyBoardEventItem = new Subject<IUiInputSelectItem>();
	keyBoardEventItem.next(data);
	const activePopup = {
		close: jest.fn(),
	};
	const activePopup1 = {
		subscribe: jest.fn().mockReturnValue(activePopup),
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [InputSelectPopupComponent],
			providers: [
				{ provide: 'items', useValue: [] },
				{ provide: 'activePopup', useValue: activePopup1 },
				{ provide: 'onSelectedEvent', useValue: selectedItem },
				{ provide: 'keyBoardEventSelectedItem', useValue: keyBoardEventItem },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(InputSelectPopupComponent);
		component = fixture.componentInstance;
		component.popupSubscription$ = new Subscription();
		component.keyBoardEventItemSubscription$ = new Subscription();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should  activePopup and keyBoardEventSelectedItem event ', () => {
		component.keyBoardEventItem.next(data);
		expect(component).toBeTruthy();
	});

	it('test onItemSelect function', () => {
		component.activePopupData = {
			close: jest.fn(),
		} as unknown as ActivePopup;
		component.onItemSelect(data);
	});

	it('test onItemHover function', () => {
		component.items = [data];
		component.onItemHover(data);
	});

	it('test onItemHover function for else part', () => {
		const item = {
			id: '2',
			displayName: 'Q1',
			isSelected: false,
		};
		component.items = [data];
		component.onItemHover(item);
	});
});
