/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcItemAssignmentEntity } from './prc-item-assignment-entity.interface';
import { IPrcItemEntity } from './prc-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcItemAssignmentEntityGenerated extends IEntityBase {

  /**
   * BoqHeaderFk
   */
  BoqHeaderFk?: number | null;

  /**
   * BoqHeaderReference
   */
  BoqHeaderReference?: string | null;

  /**
   * BoqItemFk
   */
  BoqItemFk?: number | null;

  /**
   * EstHeaderFk
   */
  EstHeaderFk: number;

  /**
   * EstLineItemFk
   */
  EstLineItemFk: number;

  /**
   * EstResourceFk
   */
  EstResourceFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsContracted
   */
  IsContracted: boolean;

  /**
   * IsPackageStatusContracted
   */
  IsPackageStatusContracted: boolean;

  /**
   * PackageCode
   */
  PackageCode?: string | null;

  /**
   * PackageStatusFk
   */
  PackageStatusFk: number;

  /**
   * PrcItemAssignmentFk
   */
  PrcItemAssignmentFk?: number | null;

  /**
   * PrcItemAssignments
   */
  PrcItemAssignments?: IPrcItemAssignmentEntity[] | null;

  /**
   * PrcItemDescription1
   */
  PrcItemDescription1?: string | null;

  /**
   * PrcItemEntity
   */
  PrcItemEntity?: IPrcItemEntity | null;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * PrcItemMaterialCode
   */
  PrcItemMaterialCode?: string | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk: number;
}
