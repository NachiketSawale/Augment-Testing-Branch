/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IPesHeaderEntity, IPesItemEntity } from '../entities';
import { IPesBoqEntity } from '../entities/pes-boq-entity.interface';
import { IPesShipmentinfoEntity } from '../entities/pes-shipmentinfo-entity.interface';
import { PesBoqComplete } from './pes-boq-complete.class';
import { ICommonBillingSchemaEntity } from '@libs/basics/shared';

export class PesComplete implements CompleteIdentification<IPesHeaderEntity>{

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
  public ItemToSave?: IPesItemEntity[] | null = [];

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
}
