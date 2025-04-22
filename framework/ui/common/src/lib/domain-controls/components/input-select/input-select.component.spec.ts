/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';

import { ActivePopup } from '../../../popup/model/active-popup';

import { PopupAlignment } from '../../../model/menu-list/enum/popup-alignment.enum';

import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { InputSelectComponent } from './input-select.component';
import { IInputSelectItems } from '../../../domain-controls/model/input-select-items.interface';
import { IPopupOptions, IPopupConfig } from '../../../popup/model/interfaces/popup-options.interface';

describe('InputSelectComponent', () => {
	let component: InputSelectComponent;
	let fixture: ComponentFixture<InputSelectComponent>;
	const mockdata: IInputSelectItems[] = [
		{
			description: 'Q1 2015',
			id: 1,
			isLive: true,
			remark: 'Q1 2015',
			sorting: 1,
			version: 1,
		},
		{
			description: 'Q2 2015',
			id: 2,
			isLive: true,
			remark: 'Q2 2015',
			sorting: 15,
			version: 2,
		},
	];

	const data = {
		id: '2',
		displayName: 'Q1 2015',
		isSelected: false,
	};

	beforeEach(async () => {
		const ctlCtx = {
			fieldId: 'IsActive',
			readonly: false,
			validationResults: [],
			entityContext: {
				totalCount: 3,
			},
			options: {
				items: mockdata,
			},
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [InputSelectComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();

		fixture = TestBed.createComponent(InputSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should  onSelectedEvent event ', () => {
		const data = {
			id: '2',
			displayName: 'Smooth',
			isSelected: false,
		};
		component.onSelectedEvent$.next(data);
		expect(component).toBeTruthy();
	});

	it('should be checked onbuttonclick function for togglePopup false ', () => {
		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		component.togglePopup = true;
		component.onbuttonclick();
	});

	it('should be checked onbuttonclick function ', () => {
		component.popupService.viewContainer = {
			createComponent: jest.fn(),
		} as unknown as ViewContainerRef;

		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		const popupOptions: IPopupOptions = {};

		popupOptions.providers = [
			{ provide: 'items', useValue: component.getItems() },
			{ provide: 'activePopup', useValue: component.getActivePopup$ },
			{ provide: 'onSelectedEvent', useValue: component.onSelectedEvent$ },
			{ provide: 'keyBoardEventSelectedItem', useValue: component.keyBoardEventItem$ },
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		const activePopup = new ActivePopup(component.container, popupOptions as unknown as IPopupConfig);
		jest.spyOn(component.popupService, 'open').mockReturnValue(activePopup);
		component.togglePopup = false;
		component.onbuttonclick();
	});

	it('should be checked onbuttonclick function for newvalue ', () => {
		component.popupService.viewContainer = {
			createComponent: jest.fn(),
		} as unknown as ViewContainerRef;

		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		const popupOptions: IPopupOptions = {};

		popupOptions.providers = [
			{ provide: 'items', useValue: component.getItems() },
			{ provide: 'activePopup', useValue: component.getActivePopup$ },
			{ provide: 'onSelectedEvent', useValue: component.onSelectedEvent$ },
			{ provide: 'keyBoardEventSelectedItem', useValue: component.keyBoardEventItem$ },
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		const activePopup = new ActivePopup(component.container, popupOptions as unknown as IPopupConfig);
		jest.spyOn(component.popupService, 'open').mockReturnValue(activePopup);
		component.togglePopup = false;
		component.onbuttonclick();
	});

	it('test keyBoardEvents ESCAPE key button', () => {
		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;
		const keyEvent = {
			keyCode: 27,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents SPACE key button', () => {
		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;
		const keyEvent = {
			keyCode: 32,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents ENTER key button', () => {
		component.activePopup = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		component.itemInfo = data;
		const keyEvent = {
			keyCode: 13,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents UP key button', () => {
		const keyEvent = {
			keyCode: 38,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents DOWN key button', () => {
		const keyEvent = {
			keyCode: 40,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.togglePopup = true;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents Page up key button', () => {
		const keyEvent = {
			keyCode: 33,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.togglePopup = true;
		component.keyBoardEvents(keyEvent);
	});

	it('test keyBoardEvents page DOWN key button', () => {
		const keyEvent = {
			keyCode: 34,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.togglePopup = true;
		component.keyBoardEvents(keyEvent);
	});

	it('test computeMovedSelectionIndex  function', () => {
		component.computeMovedSelectionIndex(1, true, 1);
		component.computeMovedSelectionIndex(1, false, 2);
		component.computeMovedSelectionIndex(-1, false, 2);
	});
});
