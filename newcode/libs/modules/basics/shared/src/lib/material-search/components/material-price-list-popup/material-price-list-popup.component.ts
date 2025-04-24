/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnInit} from '@angular/core';
import {ActivePopup, ColumnDef, FieldType, IGridConfiguration, ILookupViewResult} from '@libs/ui/common';
import {IMaterialSearchPriceList, MATERIAL_SEARCH_PRICELIST } from '../../model/interfaces/material-search-price-list.interface';

/**
 * material item price list popup grid
 */
@Component({
  selector: 'basics-shared-material-price-list-popup',
  templateUrl: './material-price-list-popup.component.html',
  styleUrls: ['./material-price-list-popup.component.scss']
})
export class BasicsSharedMaterialPriceListPopupComponent implements OnInit{
  private priceList = inject(MATERIAL_SEARCH_PRICELIST);
  private activePopup = inject(ActivePopup);
  private columns:ColumnDef<IMaterialSearchPriceList>[] = [
    {
      id: 'materialPriceVersionFk',
      model: 'MaterialPriceVersionFk',
      type: FieldType.Integer,
      label: {
        text: 'Price Version',
        key: 'basics.material.priceList.materialPriceVersion'
      },
      visible: true,
      sortable: true,
      readonly: true
    }, {
      id: 'priceList',
      model: 'MaterialPriceVersionFk',
      type: FieldType.Integer,
      label: {
        text: 'Price List',
        key: 'basics.material.priceList.priceList'
      },
      visible: true,
      sortable: true,
      readonly: true
    }, {
      id: 'cost',
      model: 'Cost',
      type: FieldType.Decimal,
      label: {
        text: 'Cost Price',
        key: 'basics.material.record.costPrice'
      },
      visible: true,
      sortable: true,
      readonly: true
    }, {
      id: 'estimatePrice',
      model: 'EstimatePrice',
      type: FieldType.Decimal,
      label: {
        text: 'Estimate Price',
        key: 'basics.material.record.estimatePrice'
      },
      visible: true,
      sortable: true,
      readonly: true
    },
    {
      id: 'currencyFk',
      model: 'CurrencyFk',
      type: FieldType.Integer,
      label: {
        text: 'Currency',
        key: 'cloud.common.entityCurrency'
      },
      visible: true,
      sortable: true,
      readonly: true
    }
  ];

  /**
   * Holds the column configuration used to render the grid
   */
  public config: IGridConfiguration<IMaterialSearchPriceList> = {
    uuid: '0ce3f0cab1164242aed14e5aae47ea45',
    columns: this.columns,
    idProperty: 'Id'
  };

  /**
   * Loads the data into the grid on component initialization
   */
  public ngOnInit(): void {
    if (this.priceList && this.priceList.length > 0) {
      this.config = { ...this.config, columns: this.columns, items: this.priceList };
    }
  }

  /**
   * on data selection changed
   * @param selections
   */
  public handleSelectionChanged(selections: IMaterialSearchPriceList[]) {
    if (selections.length > 0) {
      this.activePopup.close({
        apply: true,
        result: selections[0]
      } as ILookupViewResult<IMaterialSearchPriceList>);
    }
  }
}