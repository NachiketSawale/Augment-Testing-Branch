/*
 * Copyright(c) RIB Software GmbH
 */

import {isNil} from 'lodash';
import {bignumber} from 'mathjs';
import {formatNumber} from 'accounting';
import {Component, inject, OnInit} from '@angular/core';
import {MATERIAL_SEARCH_ITEMS} from '@libs/basics/shared';
import {PlatformLanguageService} from '@libs/platform/common';

/**
 * Material item quantity in item view
 */
@Component({
  selector: 'procurement-ticket-system-item-quantity',
  templateUrl: './item-quantity.component.html',
  styleUrls: ['./item-quantity.component.scss']
})
export class ProcurementTicketSystemItemQuantityComponent implements OnInit {
  private languageService = inject(PlatformLanguageService);

  /**
   * material search item
   */
  public item = inject(MATERIAL_SEARCH_ITEMS);

  /**
   * quantity
   */
  public quantity: number = 0;

  /**
   * title
   */
  public titleMsg: string = '';

  /**
   * title
   */
  public showQuantityTip: boolean = false;

  /**
   * on initializing
   */
  public ngOnInit() {
    this.quantity = this.item.Requirequantity;
  }

  /**
   * increase item quantity
   */
  public increaseQty() {
    let sellUnit = this.item.SellUnit;
    if (sellUnit === 0) {
      sellUnit = 1;
    }
    this.quantity = bignumber(parseInt((this.quantity / sellUnit).toString()) * sellUnit).add(sellUnit).toNumber();
    this.item.Requirequantity = this.quantity;
    this.titleMsg = '';
  }

  /**
   * decrease item quantity
   */
  public decreaseQty() {
    const minQuantity = this.item.MinQuantity;
    let sellUnit = this.item.SellUnit;
    if (sellUnit === 0) {
      sellUnit = 1;
    }
    if (minQuantity === 0) {
      if (this.quantity % sellUnit === 0) {
        if (bignumber(this.quantity).sub(sellUnit).toNumber() >= sellUnit) {
          this.quantity = bignumber(this.quantity).sub(sellUnit).toNumber();
          this.titleMsg = '';
        }
      } else {
        if (bignumber((parseInt((this.quantity / sellUnit).toString()) + 1) * sellUnit).sub(sellUnit).toNumber() >= sellUnit) {
          this.quantity = bignumber((parseInt((this.quantity / sellUnit).toString()) + 1) * sellUnit).sub(sellUnit).toNumber();
          this.titleMsg = '';
        }
      }
    } else {
      if (this.quantity % sellUnit === 0) {
        if (bignumber(this.quantity).sub(sellUnit).toNumber() >= minQuantity) {
          this.quantity = bignumber(this.quantity).sub(sellUnit).toNumber();
          this.titleMsg = '';
        }
      } else {
        if (bignumber((parseInt((this.quantity / sellUnit).toString()) + 1) * sellUnit).sub(sellUnit).toNumber() >= minQuantity) {
          this.quantity = bignumber((parseInt((this.quantity / sellUnit).toString()) + 1) * sellUnit).sub(sellUnit).toNumber();
          this.titleMsg = '';
        }
      }
    }
    this.item.Requirequantity = this.quantity;
  }

  /**
   * handle on changed
   */
  public onChanged() {
    this.titleMsg = '';
    this.quantity = this.quantity ? this.quantity : 0;
    const sellUnit = this.item.SellUnit;
    const minQuantity = this.item.MinQuantity;
    const userInputValue = this.quantity;
    const msg = this.getQuantityMessage(sellUnit, minQuantity, userInputValue);
    if (msg) {
      this.titleMsg = msg;
    }
    if (this.titleMsg && (this.titleMsg + '').length >= 32) {
      this.titleMsg = (this.titleMsg + '').slice(0, 32) + '...';
    }
    this.showQuantityTip = !!this.titleMsg;
    this.item.Requirequantity = this.quantity;
  }

  /**
   * handle on key down
   * @param event
   * @param ele
   */
  public onKeydown(event: KeyboardEvent, ele: HTMLInputElement) {
    const key = event.key;
    const validatedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
      'Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight'
    ];
    const enterKey = 'Enter';
    if (!validatedKeys.find(s => s.toLowerCase() === key.toLowerCase()) ||
        (key === '.' && this.quantity.toString().indexOf('.') > 0)) {
      event.preventDefault();
    }
    if (key.toLowerCase() === enterKey.toLowerCase()) {
      this.showQuantityTip = false;
      ele.blur();
    }
  }

  /**
   * handle on key up
   */
  public onKeyup() {
    this.onChanged();
  }

  /**
   * handle on blur
   */
  public onBlur() {
    this.showQuantityTip = false;
  }

  /**
   * get quantity message
   * @param sellUnit
   * @param minQuantity
   * @param userInputValue
   */
  private getQuantityMessage(sellUnit: number, minQuantity: number, userInputValue: number) {
    let msg = '';
    let quantity: number;
    let tempMultiplier = 0;
    if (userInputValue < 0) {
      userInputValue = 0;
    }
    if (sellUnit === 0) {
      if (userInputValue < minQuantity) {
        msg = 'MoQ:' + minQuantity;
      }
    } else {
      if (userInputValue < minQuantity) {
        tempMultiplier = minQuantity / sellUnit;
        if (parseInt(tempMultiplier.toString()) === tempMultiplier) {
          quantity = minQuantity;
          msg = this.getMsgNumber(quantity) + '=SpQ ' + sellUnit + '*' + parseInt(tempMultiplier.toString()) + ', MoQ:' + minQuantity;
        } else {
          quantity = (Math.floor(tempMultiplier) + 1) * sellUnit;
          msg = this.getMsgNumber(quantity) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1) + ', MoQ:' + minQuantity;
        }
      } else {
        tempMultiplier = userInputValue / sellUnit;
        if (parseInt(tempMultiplier.toString()) !== tempMultiplier) {
          quantity = (Math.floor(tempMultiplier) + 1) * sellUnit;
          msg = this.getMsgNumber(quantity) + '=SpQ ' + sellUnit + '*' + (Math.floor(tempMultiplier) + 1);
        }
      }
    }
    return msg;
  }

  private getMsgNumber(num: number) {
    const lang = this.languageService.getLanguageInfo();
    const options = {
      'thousand': lang.numeric.thousand,
      'decimal': lang.numeric.decimal,
      'precision': 2
    };
    return !isNil(num) ? formatNumber(num, options.precision, options.thousand, options.decimal) : '';
  }
}
