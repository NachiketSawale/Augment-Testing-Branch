/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IPesItemEntity } from '../entities';
import { IPesItemPriceConditionEntity } from '../entities/pes-item-price-condition-entity.interface';

export class PesItemComplete implements CompleteIdentification<IPesItemEntity>{

  /**
   * BulkEditPriceConditionToSave
   */
  // public BulkEditPriceConditionToSave?: IBulkEditPriceConditionData | null;

  /**
   * CostGroupToDelete
   */
  // public CostGroupToDelete?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * CostGroupToSave
   */
  // public CostGroupToSave?: IMainItem2CostGroupEntity[] | null = [];

  /**
   * Item
   */
  public Item?: IPesItemEntity | null;

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * PesItemPriceConditionToDelete
   */
  public PesItemPriceConditionToDelete?: IPesItemPriceConditionEntity[] | null = [];

  /**
   * PesItemPriceConditionToSave
   */
  public PesItemPriceConditionToSave?: IPesItemPriceConditionEntity[] | null = [];

  /**
   * controllingStructureGrpSetDTLToDelete
   */
  public controllingStructureGrpSetDTLToDelete?: [] | null = [];

  /**
   * controllingStructureGrpSetDTLToSave
   */
  public controllingStructureGrpSetDTLToSave?: [] | null = [];
}
