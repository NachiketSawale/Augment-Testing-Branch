/**
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { IGridContainerLink } from '@libs/ui/business-base';
import { IInfoOverlay, IMenuItemEventInfo, IMenuList, IModuleNavigationManager, IResizeMessenger } from '@libs/ui/common';
import { IContainerUiAddOns } from '@libs/ui/container-system';

import { IBidWarrantyEntity } from '@libs/sales/interfaces';
import { SalesBidWarrantyBehavior } from './sales-bid-warranty-behavior.service';

describe('SalesBidWarrantyBehavior', () => {
    let service: SalesBidWarrantyBehavior;

    const mockToolbar: jest.Mocked<IMenuList<void>> = {
		addItems: jest.fn(),
		addItemsAtId: jest.fn(),
		deleteItems: jest.fn(),
		clear: jest.fn(),
		setVisibility: jest.fn(),
	};
	const mockStatusBar = {
		...mockToolbar,
		isVisible: true,
	};
	const mockWhiteboard: jest.Mocked<IInfoOverlay> = {
		info: { key: 'test' },
		showInfo: jest.fn(),
		visible: false,
	};
	const mockBusyOverlay: jest.Mocked<IInfoOverlay> = {
		info: { key: 'test' },
		showInfo: jest.fn(),
		visible: false,
	};
	const mockResizeMessenger: jest.Mocked<IResizeMessenger> = {
		register: jest.fn(),
		unregister: jest.fn(),
	};
	const mockNavigation: jest.Mocked<IModuleNavigationManager> = {
		addNavigator: jest.fn(),
		removeNavigator: jest.fn(),
		removeAllNavigator: jest.fn(),
	};
	const mockUiAddOns: Partial<IContainerUiAddOns> = {};
	Object.defineProperties(mockUiAddOns, {
		toolbar: { get: () => mockToolbar },
		statusBar: { get: () => mockStatusBar },
		whiteboard: { get: () => mockWhiteboard },
		busyOverlay: { get: () => mockBusyOverlay },
		resizeMessenger: { get: () => mockResizeMessenger },
		navigation: { get: () => mockNavigation },
	});
	const mockContainerLink: Partial<IGridContainerLink<IBidWarrantyEntity>> = {
		uiAddOns: mockUiAddOns as IContainerUiAddOns,
	};

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SalesBidWarrantyBehavior);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should add bulkEditor item to the toolbar on create and execute fn()', () => {
		service.onCreate(mockContainerLink as IGridContainerLink<IBidWarrantyEntity>);
		expect(mockToolbar.addItems).toHaveBeenCalled();
		const addedItems = mockToolbar.addItems.mock.calls[0][0];
		expect(Array.isArray(addedItems)).toBe(true);
		const bulkEditorItem = Array.isArray(addedItems) ? addedItems.find((item) => item.id === 'bulkEditor') : undefined;
		expect(bulkEditorItem).toBeDefined();
		expect(bulkEditorItem!.fn).toBeDefined();
		expect(typeof bulkEditorItem!.fn).toBe('function');
		bulkEditorItem!.fn({} as IMenuItemEventInfo<void>);
	});
});
