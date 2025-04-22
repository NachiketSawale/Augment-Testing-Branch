/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, EventEmitter, inject, Injector, Input, Output} from '@angular/core';
import {IMaterialSearchEntity, IMaterialItemOptions, MATERIAL_SEARCH_ITEMS} from '@libs/basics/shared';
import {ProcurementTicketSystemCartItemScope} from '../../model/cart-item-scope';

/**
 * cart item operation
 */
@Component({
  selector: 'procurement-ticket-system-cart-item-operation',
  templateUrl: './cart-item-operation.component.html',
  styleUrls: ['./cart-item-operation.component.scss']
})
export class ProcurementTicketSystemCartItemOperationComponent {
  private injector = inject(Injector);
  /**
   * cart item scope
   */
  @Input()
  public scope!: ProcurementTicketSystemCartItemScope;
  /**
   * material entity
   */
  @Input()
  public dataItem!: IMaterialSearchEntity;

  /**
   * item options
   */
  @Input()
  public itemOptions?: IMaterialItemOptions;

  /**
   * go to detail emitter
   */
  @Output()
  public deleteCartItemEvent = new EventEmitter<number>();

  /**
   * sub injector for content component
   */
  public dataInjector!: Injector;

  /**
   * on initializing
   */
  public ngOnInit() {
    this.dataInjector = Injector.create({
      parent: this.injector,
      providers: [{
        provide: MATERIAL_SEARCH_ITEMS,
        useValue: this.dataItem
      }]
    });
  }

  /**
   * uom
   */
  public uom() {
    if (this.dataItem.PriceUnit === 1) {
      return this.dataItem.PriceUnitUomInfo.Translated;
    }
    return this.dataItem.PriceUnit + '  ' + this.dataItem.PriceUnitUomInfo.Translated;
  }

  /**
   * list Price
   */
  public listPriceInfo() {
    this.dataItem.PriceReferenceForShow = this.dataItem.PriceReferenceForShow || this.dataItem.EstimatePrice;
    return this.scope.formatMoney(this.dataItem.PriceReferenceForShow);
  }


  /**
   * delivery Option Show
   */
  public deliveryOptionShow() {
    const arrPriceConditions = this.dataItem.PriceConditions;
    if (arrPriceConditions && arrPriceConditions.length > 0) {
      return arrPriceConditions.filter(item => item.IsActivated).length > 0;
    }
    return false;
  }

  /**
   * get delivery
   */
  public getDeliveryByPriceCondition() {
    return this.scope.getDeliveryByPriceCondition(this.dataItem);
  }

  /**
   * calculate sub total
   */
  public subTotal() {
    const total = this.scope.getSubTotal(this.dataItem);
    return this.scope.formatMoney(total);
  }

  /**
   * delete cart item
   */
  public delete() {
    this.deleteCartItemEvent.emit();
  }
}
