/*
 * Copyright(c) RIB Software GmbH
 */
import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { IImageSelectItem } from '../../model/image-select-item.interface';
import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';
import { IFixedSelectOptions } from '../../../model/fields/additional/fixed-select-options.interface';
import { IPopupConfig, IPopupOptions } from '../../../popup/model/interfaces/popup-options.interface';

import { ActivePopup } from '../../../popup/model/active-popup';
import { PopupAlignment } from '../../../model/menu-list/enum/popup-alignment.enum';

import { ImageSelectComponent } from './image-select.component';
import { UiCommonPopupContainerComponent } from '../../../popup/components/popup-container/popup-container.component';
import { IImageSelectControlContext } from '../../model/image-select-control-context.interface';

describe('ImageSelectComponent', () => {
	let component: ImageSelectComponent;
	let fixture: ComponentFixture<ImageSelectComponent>;
	const mockdata: IImageSelectItem[] = [
		{
			id: 1,
			displayName: 'Cross',
			iconCSS: 'status-icons ico-status01',
			isSelected: false,
		},
		{
			id: 2,
			displayName: 'Hook',
			iconCSS: 'status-icons ico-status02',
			isSelected: false,
		},
		{
			id: 3,
			displayName: 'Minus',
			iconCSS: 'status-icons ico-status03',
			isSelected: false,
		},
	];

	const data = {
		id: 3,
		displayName: 'Minus',
		iconCSS: 'status-icons ico-status03',
		isSelected: false,
	};
	beforeEach(async () => {
		const ctlCtx: IImageSelectControlContext = {
			fieldId: 'IsActive',
			readonly: false,
			validationResults: [],
			entityContext: {entity: {}, indexInSet: 0, totalCount: 0},
			itemsSource:{items: mockdata} as IFixedSelectOptions
		};
		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [ImageSelectComponent, UiCommonPopupContainerComponent],
			providers: [{provide: ControlContextInjectionToken, useValue: ctlCtx}],
		}).compileComponents();

		fixture = TestBed.createComponent(ImageSelectComponent);
		component = fixture.componentInstance;
		//component.controlContext.itemsSource = {items: mockdata} as IFixedSelectOptions;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should  onSelectedEvent event ', () => {
		const data = {
			id: 3,
			displayName: 'Minus',
			iconCSS: 'status-icons ico-status03',
			isSelected: false,
		};
		component['onSelectedEvent$'].next(data);
		expect(component).toBeTruthy();
	});

	it('should be checked onbuttonclick function for isPopupOpen false ', () => {
		component['activePopup'] = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		component['isPopupOpen'] = true;
		component.onButtonClick();
	});

	it('should be checked onbuttonclick function ', () => {
		component.controlContext.itemsSource = {items: mockdata} as IFixedSelectOptions;
		component['selectedItemInfo'] = data;

		component['popupService'].viewContainer = {
			createComponent: jest.fn(),
		} as unknown as ViewContainerRef;

		component['activePopup'] = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		const popupOptions: IPopupOptions = {};

		popupOptions.providers = [
			{provide: 'items', useValue: component.items},
			{provide: 'activePopup', useValue: component['activePopup$']},
			{provide: 'onSelectedEvent', useValue: component['onSelectedEvent$']},
			{provide: 'keyBoardEventSelectedItem', useValue: component['keyboardEventItem$']},
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		const activePopup = new ActivePopup(component.imageSelectContainer, popupOptions as unknown as IPopupConfig);
		jest.spyOn(component['popupService'], 'open').mockReturnValue(activePopup);
		component['isPopupOpen'] = false;
		component.onButtonClick();
	});

	it('should be checked onbuttonclick function for displayTitle ', () => {

		component.controlContext.itemsSource = {items: mockdata} as IFixedSelectOptions;
		component.displayTitle = data.displayName;
		component['selectedItemInfo'] = data;

		component['popupService'].viewContainer = {
			createComponent: jest.fn(),
		} as unknown as ViewContainerRef;

		component['activePopup'] = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		const popupOptions: IPopupOptions = {};

		popupOptions.providers = [
			{provide: 'items', useValue: component.items},
			{provide: 'activePopup', useValue: component['activePopup$']},
			{provide: 'onSelectedEvent', useValue: component['onSelectedEvent$']},
			{provide: 'keyBoardEventSelectedItem', useValue: component['keyboardEventItem$']},
		];

		popupOptions.hasDefaultWidth = true;
		popupOptions.resizable = false;
		popupOptions.showFooter = false;
		popupOptions.showHeader = false;
		popupOptions.alignment = PopupAlignment.vertical;
		popupOptions.multiPopup = false;

		const activePopup = new ActivePopup(component.imageSelectContainer, popupOptions as unknown as IPopupConfig);
		jest.spyOn(component['popupService'], 'open').mockReturnValue(activePopup);
		component['isPopupOpen'] = false;
		component.onButtonClick();
	});

	it('test keyboardEvent ESCAPE key button', () => {
		component['activePopup'] = {
			close: jest.fn(),
		} as unknown as ActivePopup;
		const keyEvent = {
			keyCode: 27,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent ENTER key button', () => {
		component['activePopup'] = {
			close: jest.fn(),
		} as unknown as ActivePopup;

		component['itemInfo'] = data;
		const keyEvent = {
			keyCode: 13,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent UP key button', () => {
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 38,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent DOWN key button', () => {
		component['itemInfo'] = data;
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 40,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component['isPopupOpen'] = true;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent RIGHT key button', () => {
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 39,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent LEFT key button', () => {
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 37,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent Page up key button', () => {
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 33,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component['isPopupOpen'] = true;
		component.keyboardEventItem(keyEvent);
	});

	it('test keyboardEvent page DOWN key button', () => {
		component.controlContext.itemsSource = {items: mockdata};
		const keyEvent = {
			keyCode: 34,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
		} as unknown as KeyboardEvent;
		component['isPopupOpen'] = true;
		component.keyboardEventItem(keyEvent);
	});

	it('test computeMovedSelectionIndex  function', () => {
		component.controlContext.itemsSource = {items: mockdata};

		component['computeMovedSelectionIndex'](1, true, 1);
		component['computeMovedSelectionIndex'](1, false, 2);
		component['computeMovedSelectionIndex'](-1, false, 2);
	});
});