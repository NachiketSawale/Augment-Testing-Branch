/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, Input} from '@angular/core';
import {ProcurementTicketSystemCartItemScope} from '../../model/cart-item-scope';
import {IMaterialSearchEntity} from '@libs/basics/shared';

/**
 * cart item view
 */
@Component({
    selector: 'procurement-ticket-system-cart-item',
    templateUrl: './cart-item.component.html',
    styleUrls: ['./cart-item.component.scss']
})
export class ProcurementTicketSystemCartItemComponent {
    /**
     * Search scope
     */
    @Input()
    public scope!: ProcurementTicketSystemCartItemScope;

    /**
     * material entity
     */
    @Input()
    public dataItem!: IMaterialSearchEntity;

    /**
     * whether show Delivery
     */
    public showDelivery: boolean = false;

    /**
     * initializing
     */
    public ngOnInit() {
        this.showDelivery = this.dataItem.PriceConditions && this.dataItem.PriceConditions.length > 0;
    }

    /**
     * show detail
     */
    public goToDetail() {
        if (!this.scope.showDetail) {
            this.scope.showDetail = true;
            this.scope.detailItem = this.dataItem;
        }
    }

    /**
     * delete cart item
     */
    public deleteCartItem() {
        this.scope.delete(this.dataItem.Id);
    }
}
