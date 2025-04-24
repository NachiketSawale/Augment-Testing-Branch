/*
 * Copyright(c) RIB Software GmbH
 */



import { CompleteIdentification } from '@libs/platform/common';
import { IMaterialPriceListEntity } from '../entities/material-price-list-entity.interface';
import { IMaterialPriceListConditionEntity } from '../entities/material-price-list-condition-entity.interface';

export class MaterialPriceListComplete implements CompleteIdentification<IMaterialPriceListEntity>{

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * MaterialPriceList
   */
  public MaterialPriceList?: IMaterialPriceListEntity | null;

  /**
   * MaterialPriceListConditionToDelete
   */
  public MaterialPriceListConditionToDelete?: IMaterialPriceListConditionEntity[] | null = [];

  /**
   * MaterialPriceListConditionToSave
   */
  public MaterialPriceListConditionToSave?: IMaterialPriceListConditionEntity[] | null = [];

  public MaterialPriceLists?: IMaterialPriceListEntity[] | null = [];
}
