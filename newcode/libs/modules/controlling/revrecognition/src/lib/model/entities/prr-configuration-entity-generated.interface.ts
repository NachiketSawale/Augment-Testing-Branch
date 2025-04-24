/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrHeader2transheaderEntity } from './prr-header-2-transheader-entity.interface';
import { IPrrItemEntity } from './prr-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrrConfigurationEntityGenerated extends IEntityBase {

  /**
   * Account
   */
  Account?: string | null;

  /**
   * AccrualType
   */
  AccrualType: number;

  /**
   * BasTransactionTypeFk
   */
  BasTransactionTypeFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionTr
   */
  DescriptionTr?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Isaccrual
   */
  Isaccrual: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * MdcLedgerContextFk
   */
  MdcLedgerContextFk: number;

  /**
   * NominalDimension1
   */
  NominalDimension1?: string | null;

  /**
   * NominalDimension2
   */
  NominalDimension2?: string | null;

  /**
   * NominalDimension3
   */
  NominalDimension3?: string | null;

  /**
   * Offsetaccount
   */
  Offsetaccount?: string | null;

  /**
   * PrcStructrueAccountFk
   */
  PrcStructrueAccountFk?: number | null;

  /**
   * PrcStructrueOffsetaccountFk
   */
  PrcStructrueOffsetaccountFk?: number | null;

  /**
   * PrrHeader2transheaderEntities
   */
  PrrHeader2transheaderEntities?: IPrrHeader2transheaderEntity[] | null;

  /**
   * PrrItemEntities
   */
  PrrItemEntities?: IPrrItemEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
