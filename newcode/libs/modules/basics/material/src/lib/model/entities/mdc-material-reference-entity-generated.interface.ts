/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMdcMaterialReferenceEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * MdcMaterialAltFk
   */
  MdcMaterialAltFk: number;

  /**
   * MdcMaterialCatalogFk
   */
  MdcMaterialCatalogFk: number;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk: number;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;
}
