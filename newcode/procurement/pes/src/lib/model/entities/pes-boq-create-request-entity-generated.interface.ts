/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity, IBoqItemEntity } from '@libs/boq/interfaces';
import { IEntityBase } from '@libs/platform/common';
import { IPrcBoqLookupVEntity } from '@libs/procurement/common';

export interface IPesBoqCreateRequestEntityGenerated extends IEntityBase {

  /**
   * BoqHeader
   */
  BoqHeader?: IBoqHeaderEntity | null;

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk?: number | null;

  /**
   * BoqItemPrjBoqFk
   */
  BoqItemPrjBoqFk?: number | null;

  /**
   * BoqRootItem
   */
  BoqRootItem?: IBoqItemEntity | null;

  /**
   * BoqSource
   */
  BoqSource: number;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsIncludeNotContractedItem
   */
  IsIncludeNotContractedItem: boolean;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk: number;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PerformedFrom
   */
  PerformedFrom?: string | null;

  /**
   * PerformedTo
   */
  PerformedTo?: string | null;

  /**
   * PesHeaderFk
   */
  PesHeaderFk: number;

  /**
   * PrcBoqFk
   */
  PrcBoqFk: number;

  /**
   * PrcBoqLookup
   */
  PrcBoqLookup?: IPrcBoqLookupVEntity | null;

  /**
   * PrcItemStatusFk
   */
  PrcItemStatusFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * SubPackageFk
   */
  SubPackageFk?: number | null;

  /**
   * TakeOverOption
   */
  TakeOverOption: number;

  /**
   * WicBoqFk
   */
  WicBoqFk?: number | null;

  /**
   * WicBoqReference
   */
  WicBoqReference?: string | null;
}
