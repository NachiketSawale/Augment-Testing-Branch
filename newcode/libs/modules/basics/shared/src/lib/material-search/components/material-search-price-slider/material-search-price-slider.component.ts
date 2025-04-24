/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IMaterialAttributeRangeEntity} from '../../model/interfaces/material-search-attribute-range.interface';

/**
 * material search attribute price slider component
 */
@Component({
  selector: 'basics-shared-material-search-price-slider',
  templateUrl: './material-search-price-slider.component.html',
  styleUrls: ['./material-search-price-slider.component.scss']
})
export class BasicsSharedMaterialSearchPriceSliderComponent {
  /**
   * price options
   */
  @Input()
  public price!: IMaterialAttributeRangeEntity;

  /**
   * price change event for parent component
   */
  @Output()
  public filterPrice = new EventEmitter<void>();

  /**
   * price change function
   */
  public priceValueChange(minValue: number, maxValue: number) {
    if ( this.price && (this.price.Value[0] !== minValue || this.price.Value[1] !== maxValue)) {
      this.price.Value[0] = minValue;
      this.price.Value[1] = maxValue;
      this.filterPrice.emit();
    }
  }

}
