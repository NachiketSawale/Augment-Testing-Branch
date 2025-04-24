/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstHeaderEntity extends IEntityBase {

/*
 * BasCurrencyFk
 */
  BasCurrencyFk: number | null;

/*
 * ClobsFk
 */
  ClobsFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Currency1Fk
 */
  Currency1Fk?: number | null;

/*
 * Currency2Fk
 */
  Currency2Fk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo: IDescriptionInfo;

/*
 * Duration
 */
  Duration?: number | null;

/*
 * EstConfigFk
 */
  EstConfigFk: number;

/*
 * EstConfigtypeFk
 */
  EstConfigtypeFk: number | null;

/*
 * EstHeaderVersionFk
 */
  EstHeaderVersionFk: number | null;


/*
 * EstStatusFk
 */
  EstStatusFk: number;

/*
 * EstTypeFk
 */
  EstTypeFk?: number | null;

/*
 * ExchangeRate1
 */
  ExchangeRate1: number | null;

/*
 * ExchangeRate2
 */
  ExchangeRate2: number | null;

/*
 * Hint
 */
  Hint?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsActive
 */
  IsActive: boolean;

/*
 * IsControlling
 */
  IsControlling?: boolean | null;

/*
 * IsGCOrder
 */
  IsGCOrder: boolean 

/*
 * LevelFk
 */
  LevelFk?: number | null;

/*
 * LgmJobFk
 */
  LgmJobFk: number | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk: number;

/*
 * PsdActivityFk
 */
  PsdActivityFk?: number | null;

/*
 * RubricCategoryFk
 */
  RubricCategoryFk?: number | null;

/*
 * VersionComment
 */
  VersionComment?: string | null;

/*
 * VersionDescription
 */
  VersionDescription?: string | null;

/*
 * VersionNo
 */
  VersionNo?: number | null;

  /*
   * IsColumnConfig
   */
  IsColumnConfig?: boolean | null;
}
