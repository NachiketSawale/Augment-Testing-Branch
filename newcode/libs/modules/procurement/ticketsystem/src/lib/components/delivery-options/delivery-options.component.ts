/*
 * Copyright(c) RIB Software GmbH
 */
import * as dayjs from 'dayjs';
import {Component, inject} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {IMaterialSearchPriceCondition, MATERIAL_SEARCH_ITEMS} from '@libs/basics/shared';

/**
 * cart item Delivery options in item view
 */
@Component({
  selector: 'procurement-ticket-system-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.scss']
})
export class ProcurementTicketSystemDeliveryOptionsComponent {
  /**
   * material search item
   */
  public item = inject(MATERIAL_SEARCH_ITEMS);

  /**
   * Translation service
   */
  public translateService = inject(PlatformTranslateService);
  /**
   * translate prefix
   * @private
   */
  private htmlTranslate = 'procurement.ticketsystem.htmlTranslate';

  /**
   * Translations
   */
  public translations = {
    standardDeliveryDate: this.htmlTranslate + '.standardDeliveryDate',
    deliveryDate: this.htmlTranslate + '.deliveryDate',
    deliveryOption: this.htmlTranslate + '.deliveryOption'
  };

  /**
   * delivery event
   */
  public onDelivery(priceCondition: IMaterialSearchPriceCondition) {
    priceCondition.IsActivated = !priceCondition.IsActivated;
  }

  /**
   * get delivery date
   */
  public get standardDeliveryDate() {
    const currentDate = new Date().getTime();
    let leadTime = 0;
    if (this.item.LeadTime) {
      leadTime = this.item.LeadTime;
    }
    const deliverDate = currentDate + leadTime * 24 * 60 * 60 * 1000;
    return this.translateService.instant(this.translations.standardDeliveryDate).text + ' ' + new Date(deliverDate).toDateString();
  }

  /**
   * get price condition info
   * @param priceCondition
   */
  public priceConditionInfo(priceCondition: IMaterialSearchPriceCondition) {
    let description = priceCondition.Description ? priceCondition.Description : (priceCondition.PriceConditionType.DescriptionInfo.DescriptionTr ? priceCondition.PriceConditionType.DescriptionInfo.Translated : priceCondition.PriceConditionType.DescriptionInfo.Description);
    description = description + ' ' + '(' + priceCondition.TotalOc + this.item.Currency + ')' + this.translateService.instant(this.translations.deliveryDate).text + ' ' + this.getDeliveryDate();
    return description;
  }

  /**
   * get Delivery date
   * @private
   */
  private getDeliveryDate(): string {
    const currentDate = (new Date()).getTime();

    let leadTime = 0;
    if (this.item.LeadTime) {
      leadTime = this.item.LeadTime;
    }
    let LeadTimeExtra = 0;
    if (this.item.LeadTimeExtra) {
      LeadTimeExtra = this.item.LeadTimeExtra;
    }
    const deliverDate = currentDate + ((leadTime + LeadTimeExtra) * 24 * 60 * 60 * 1000);
    const date = dayjs(deliverDate);
    if (date.isValid()) {
      return date.format('DD/MM/YYYY');
    } else {
      return dayjs(currentDate).format('DD/MM/YYYY');
    }
  }
}
