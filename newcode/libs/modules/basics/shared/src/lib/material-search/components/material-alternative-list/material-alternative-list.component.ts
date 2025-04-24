/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, inject, OnInit} from '@angular/core';
import {ColumnDef, FieldType, IGridConfiguration} from '@libs/ui/common';
import {IMaterialAlternativeEntity, MATERIAL_SEARCH_ALTERNATIVES } from '../../model/interfaces/material-alternative-entity.interface';

/**
 * material alternative list grid
 */
@Component({
  selector: 'basics-shared-material-alternative-list',
  templateUrl: './material-alternative-list.component.html',
  styleUrls: ['./material-alternative-list.component.scss']
})
export class BasicsSharedMaterialAlternativeListComponent implements OnInit {
  private columns: ColumnDef<IMaterialAlternativeEntity>[] = [
    {
      id: 'code',
      model: 'Code',
      type: FieldType.Code,
      label: {
        text: 'Code_123',
        key: 'cloud.common.entityCode'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'description',
      model: 'DescriptionInfo',
      type: FieldType.Translation,
      label: {
        text: 'Description',
        key: 'cloud.common.entityDescription'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'priceUnitUomInfo',
      model: 'PriceUnitUomInfo',
      type: FieldType.Translation,
      label: {
        text: 'Price Unit Uom',
        key: 'cloud.common.entityPriceUnitUoM'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'catalogCode',
      model: 'CatalogCode',
      type: FieldType.Code,
      label: {
        text: 'Material Catalog',
        key: 'basics.material.record.materialCatalog'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'catalogDescriptionInfo',
      model: 'CatalogDescriptionInfo',
      type: FieldType.Translation,
      width: 160,
      label: {
        text: 'Material Catalog Description',
        key: 'basics.material.record.materialCatalogDescription'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'cost',
      model: 'Cost',
      type: FieldType.Decimal,
      label: {
        text: 'Cost',
        key: 'basics.material.record.costPrice'
      },
      visible: true,
      sortable: false,
      readonly: true
    },
    {
      id: 'currency',
      model: 'Currency',
      type: FieldType.Description,
      label: {
        text: 'Currency',
        key: 'cloud.common.entityCurrency'
      },
      visible: true,
      sortable: false,
      readonly: true
    }];

  /**
   * Holds the column configuration used to render the grid
   */
  public config: IGridConfiguration<IMaterialAlternativeEntity> = {
    uuid: '8a5bc558cac9437cbfd876b064128aad',
    columns: this.columns,
    idProperty: 'Id'
  };

  /**
   * material alternative list
   */
  public alternativeList = inject(MATERIAL_SEARCH_ALTERNATIVES);

  /**
   * Loads the data into the grid on component initialization
   */
  public ngOnInit(): void {
    if (this.alternativeList && this.alternativeList.length > 0) {
      this.config = { ...this.config, columns: this.columns, items: this.alternativeList };
    }
  }
}
