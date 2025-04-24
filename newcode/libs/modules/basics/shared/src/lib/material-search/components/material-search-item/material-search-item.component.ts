/*
 * Copyright(c) RIB Software GmbH
 */

import {includes, remove} from 'lodash';
import {Component, Input, OnInit} from '@angular/core';
import {IMaterialSearchEntity} from '../../model/interfaces/material-search-entity.interface';
import {MaterialSearchScope} from '../../model/material-search-scope';
import {IMaterialSearchPriceList} from '../../model/interfaces/material-search-price-list.interface';

/**
 * Material item view inside material list
 */
@Component({
  selector: 'basics-shared-material-search-item',
  templateUrl: './material-search-item.component.html',
  styleUrls: ['./material-search-item.component.scss']
})
export class BasicsSharedMaterialSearchItemComponent implements OnInit {
  /**
   * Search scope
   */
  @Input()
  public scope!: MaterialSearchScope;

  /**
   * material entity
   */
  @Input()
  public dataItem!: IMaterialSearchEntity;

  /**
   * whether show operations icons
   */
  @Input()
  public showOperationIcons: boolean = true;

  /**
   * on initializing
   */
  public ngOnInit() {
    this.setIsFromFC();
  }

  /**
   * Go to material detail view.
   */
  public goToDetail() {
    if (!this.scope.showDetail) {
      this.scope.showDetail = true;
      this.scope.detailItem = this.dataItem;
    }
  }

  private canSelect() {
    return this.scope.searchOptions && this.scope.searchOptions.selectable;
  }

  /**
   * Is current material selected.
   */
  public isSelected() {
    return this.canSelect() && this.dataItem.selected;
  }

  /**
   * Select current material
   */
  public select() {
    if(this.canSelect()) {
      if (this.scope.enableMultiSelection) {
        this.dataItem.selected = !this.dataItem.selected;
        if (this.dataItem.selected) {
          this.scope.selectedItems.push(this.dataItem);
        } else {
          remove(this.scope.selectedItems, {Id: this.dataItem.Id});
        }
        this.scope.updateCheckAllStatus((this.dataItem.selected ? null : false));
      } else {
        this.scope.selectedItems.forEach(i => i.selected = false);
        this.dataItem.selected = true;
        this.scope.selectedItems = [this.dataItem];
      }
      this.scope.resetSelectedItem();
    }
  }

  /**
   * Apply selected material
   */
  public apply() {
    if(this.canSelect()) {
      this.scope.selected$.next(this.dataItem);
      this.scope.selected$.complete();
    }
  }

  /**
   * set IsFromPC flag
   * @private
   */
  private setIsFromFC() {
    const frameworkCatalogIds = this.scope.response.categories.filter(function (item) {
      return item.IsFrameworkCatalog;
    }).map(function (item) {
      return item.Id;
    });
    this.dataItem.IsFromFC = !!(this.dataItem.MdcMaterialCatalogFk && includes(frameworkCatalogIds, this.dataItem.MdcMaterialCatalogFk));
  }

  /**
   * handle Update MaterialPriceListFk
   * @param priceList
   */
  public handleUpdateMaterialPriceListFk(priceList: IMaterialSearchPriceList) {
    this.scope.loading = true;
    this.scope.overrideMaterialByPriceList(this.dataItem, priceList).subscribe(() => {
      this.scope.loading = false;
    });
  }
}