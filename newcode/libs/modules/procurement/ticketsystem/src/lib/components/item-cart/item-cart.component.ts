/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject} from '@angular/core';
import {MATERIAL_SEARCH_ITEMS} from '@libs/basics/shared';

/**
 * Material item cart in item view
 */
@Component({
  selector: 'procurement-ticket-system-item-cart',
  templateUrl: './item-cart.component.html',
  styleUrls: ['./item-cart.component.scss']
})
export class ProcurementTicketSystemItemCartComponent {
  /**
   * material search item
   */
  public item = inject(MATERIAL_SEARCH_ITEMS);

  /**
   * add material item to cart
   */
  public addToCart() {
    /*if (_.isNil(entity.InternetCatalogFk)) {
      cartService.add(entity.Id, entity.Requirequantity, entity.MaterialPriceListFk,entity.Co2Project,entity.Co2Source,entity.BasCo2SourceFk,entity.BasCo2SourceName);
    } else {
      // copy material from specified url.
      searchService.putInternetMaterial(entity).then(function (response) {
        // copy successfully, return new material id.
        if (response.data.Success) {
          var local = response.data.Materials[0];
          cartService.add(local.Id, entity.Requirequantity, entity.MaterialPriceListFk,entity.Co2Project,entity.Co2Source,entity.BasCo2SourceFk,entity.BasCo2SourceName);
        } else {
          searchService.showValidation(response.data.ValidationResults);
        }
      });
    }*/
    this.item.IsAdded = true;
  }
}
