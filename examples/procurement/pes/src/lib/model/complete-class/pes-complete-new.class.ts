/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { IPesHeaderEntity, IPesItemEntity } from '../entities';
import { PesItemComplete } from './pes-item-complete.class';
import { IPesBoqEntity } from '../entities/pes-boq-entity.interface';
import { PesBoqComplete } from './pes-boq-complete.class';
import { IPesSelfBillingEntity } from '../entities/pes-self-billing-entity.interface';
import { IPrcPackage2ExtBidderEntity } from '@libs/procurement/common';
import { IPesShipmentinfoEntity } from '../entities/pes-shipmentinfo-entity.interface';

export class PesCompleteNew implements CompleteIdentification<IPesHeaderEntity>{

  /**
   * BillingSchemaToDelete
   */
  public BillingSchemaToDelete?: ICommonBillingSchemaEntity[] | null = [];

  /**
   * BillingSchemaToSave
   */
  public BillingSchemaToSave?: ICommonBillingSchemaEntity[] | null = [];

  /**
   * EntitiesCount
   */
  public EntitiesCount: number = 0;

  /**
   * Header
   */
  public Header?: IPesHeaderEntity | null;

  /**
   * ItemToDelete
   */
  public ItemToDelete?: IPesItemEntity[] | null = [];

  /**
   * ItemToSave
   */
  public ItemToSave?: PesItemComplete[] | null = [];

  /**
   * MainItemId
   */
  public MainItemId: number = 0;

  /**
   * ModelValidateError
   */
  public ModelValidateError?: string[] | null = [];

  /**
   * NotEqualWarn
   */
  public NotEqualWarn: boolean = true;

  /**
   * PesBoqToDelete
   */
  public PesBoqToDelete?: IPesBoqEntity[] | null = [];

  /**
   * PesBoqToSave
   */
  public PesBoqToSave?: PesBoqComplete[] | null = [];

  /**
   * PesSelfBillingToDelete
   */
  public PesSelfBillingToDelete?: IPesSelfBillingEntity[] | null = [];

  /**
   * PesSelfBillingToSave
   */
  public PesSelfBillingToSave?: IPesSelfBillingEntity[] | null = [];

  /**
   * PrcPackage2ExtBidderToDelete
   */
  public PrcPackage2ExtBidderToDelete?: IPrcPackage2ExtBidderEntity[] | null = [];

  /**
   * PrcPackage2ExtBidderToSave
   */
  // public PrcPackage2ExtBidderToSave?: PrcPackage2ExtBidderComplete[] | null = [];

  /**
   * PrcStockTranType2RubCat
   */
  // public PrcStockTranType2RubCat?: IPrcStckTranType2RubCatEntity[] | null = [];

  /**
   * ShipmentInfoToDelete
   */
  public ShipmentInfoToDelete?: IPesShipmentinfoEntity[] | null = [];

  /**
   * ShipmentInfoToSave
   */
  public ShipmentInfoToSave?: IPesShipmentinfoEntity[] | null = [];

  /**
   * StocktransactionSaveError
   */
  public StocktransactionSaveError: boolean = true;


  public Headers?: IPesHeaderEntity[];
}
