/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IStatusHistoryEntity } from './status-history-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBilStatusEntityGenerated extends IEntityBase {

  /**
   * AccessRightDescriptorFk
   */
  AccessRightDescriptorFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HeaderEntities
   */
  HeaderEntities?: IBilHeaderEntity[] | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsArchived
   */
  IsArchived: boolean;

  /**
   * IsBilled
   */
  IsBilled: boolean;

  /**
   * IsBtRequired
   */
  IsBtRequired: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsOnlyFwd
   */
  IsOnlyFwd: boolean;

  /**
   * IsPosted
   */
  IsPosted: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * IsRevenueRecognition
   */
  IsRevenueRecognition: boolean;

  /**
   * IsStorno
   */
  IsStorno: boolean;

  /**
   * RubricCategoryFk
   */
  RubricCategoryFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * StatushistoryEntities_StatusNewFk
   */
  StatushistoryEntities_StatusNewFk?: IStatusHistoryEntity[] | null;

  /**
   * StatushistoryEntities_StatusOldFk
   */
  StatushistoryEntities_StatusOldFk?: IStatusHistoryEntity[] | null;
}
