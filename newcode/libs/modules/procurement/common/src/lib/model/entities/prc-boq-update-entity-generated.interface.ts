/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';

export interface IPrcBoqUpdateEntityGenerated {

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * NeedUpdateUcFromPackage
   */
  NeedUpdateUcFromPackage?: boolean | null;

  /**
   * PackageId
   */
  PackageId?: number | null;

  /**
   * PrcBoqExtended
   */
  PrcBoqExtended?: IPrcBoqExtendedEntity | null;

  /**
   * entities
   */
  entities: number;
}
