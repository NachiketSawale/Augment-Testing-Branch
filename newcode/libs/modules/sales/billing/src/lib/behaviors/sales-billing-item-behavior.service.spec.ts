import { SalesBillingItemBehavior } from './sales-billing-item-behavior.service';
import { IGridContainerLink } from '@libs/ui/business-base';
import { IItemEntity } from '@libs/sales/interfaces';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';

describe('SalesBillingItemBehavior', () => {
    let service: SalesBillingItemBehavior;
    let mockContainerLink: jest.Mocked<IGridContainerLink<IItemEntity>>;

    beforeEach(() => {
        service = new SalesBillingItemBehavior();

        mockContainerLink = {
            uiAddOns: {
                toolbar: {
                    addItems: jest.fn()
                }
            }
        } as ConcreteMenuItem<void> as jest.Mocked<IGridContainerLink<IItemEntity>>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add toolbar items when onCreate is called', () => {
        service.onCreate(mockContainerLink);

        expect(mockContainerLink.uiAddOns.toolbar.addItems).toHaveBeenCalledWith([
            {
                caption: { key: 'cloud.common.bulkEditor.title' },
                hideItem: false,
                iconClass: 'type-icons ico-construction51',
                id: 'bulkEditor',
                fn: expect.any(Function),
                sort: 130,
                type: ItemType.Item,
            },
            {
                caption: { key: 'sales.billing.itemNoConfigDlgTitle' },
                iconClass: 'tlb-icons ico-settings-doc',
                id: 'Item Numbering Configuration',
                fn: expect.any(Function),
                disabled: false,
                sort: 250,
                type: ItemType.Item,
            }
        ]);
    });

    it('should call the function associated with the "bulkEditor" toolbar item', () => {
        service.onCreate(mockContainerLink);

        const addedItems = (mockContainerLink.uiAddOns.toolbar.addItems as jest.Mock).mock.calls[0][0];
        expect(addedItems).toHaveLength(2);

        const bulkEditorItem = addedItems.find(item => item.id === 'bulkEditor');
        expect(bulkEditorItem).toBeDefined();

        // Simulate calling the function
        bulkEditorItem?.fn();
        expect(typeof bulkEditorItem?.fn).toBe('function');
    });

    it('should call the function associated with the "Item Numbering Configuration" toolbar item', () => {
        service.onCreate(mockContainerLink);

        const addedItems = (mockContainerLink.uiAddOns.toolbar.addItems as jest.Mock).mock.calls[0][0];
        expect(addedItems).toHaveLength(2);

        const itemNumberConfigItem = addedItems.find(item => item.id === 'Item Numbering Configuration');
        expect(itemNumberConfigItem).toBeDefined();

        // Simulate calling the function
        itemNumberConfigItem?.fn();
        expect(typeof itemNumberConfigItem?.fn).toBe('function');
    });
});
