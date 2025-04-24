/*
 * Copyright(c) RIB Software GmbH
 */
import { TestBed } from '@angular/core/testing';
import { SalesBillingAccrualBehavior } from './sales-billing-accrual-behavior.service';
import { IGridContainerLink } from '@libs/ui/business-base';
import { IAccrualEntity } from '@libs/sales/interfaces';
import { ItemType } from '@libs/ui/common';

describe('SalesBillingAccrualBehavior', () => {
    let service: SalesBillingAccrualBehavior;
    let containerLinkMock: IGridContainerLink<IAccrualEntity>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SalesBillingAccrualBehavior]
        });
        service = TestBed.inject(SalesBillingAccrualBehavior);

        containerLinkMock = {
            uiAddOns: {
                toolbar: {
                    addItems: jest.fn()
                }
            }
        } as unknown as IGridContainerLink<IAccrualEntity>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add custom toolbar items on create', () => {
        service.onCreate(containerLinkMock);

        expect(containerLinkMock.uiAddOns.toolbar.addItems).toHaveBeenCalledWith([
            {
                caption: { key: 'cloud.common.bulkEditor.title' as string },
                hideItem: false,
                iconClass: 'type-icons ico-construction51',
                id: 'bulkEditor',
                sort: 130,
                type: ItemType.Item,
            }
        ]);
    });

    it('should add toolbar item with correct properties', () => {
        service.onCreate(containerLinkMock);

        const addedItem = (containerLinkMock.uiAddOns.toolbar.addItems as jest.Mock).mock.calls[0][0][0];
        expect(addedItem.caption.key).toBe('cloud.common.bulkEditor.title');
        expect(addedItem.hideItem).toBe(false);
        expect(addedItem.iconClass).toBe('type-icons ico-construction51');
        expect(addedItem.id).toBe('bulkEditor');
        expect(addedItem.sort).toBe(130);
        expect(addedItem.type).toBe(ItemType.Item);
    });
});