/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IBasIndexCharacteristicEntity } from './bas-index-characteristic-entity.interface';

export interface IBasIndexHeaderEntityGenerated extends IEntityBase {

  /**
   * BasIndexCharacteristicEntities
   */
  BasIndexCharacteristicEntities?: IBasIndexCharacteristicEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * RateFactorFk
   */
  RateFactorFk: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
