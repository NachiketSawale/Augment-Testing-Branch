/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialScopeEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * BusinessPartnerProdFk
   */
  BusinessPartnerProdFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsSelected
   */
  IsSelected: boolean;

  /**
   * MatScope
   */
  MatScope: number;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

   /**
   * SubsidiaryFk
   */
   SubsidiaryFk?: number | null;

  /**
   * SubsidiaryProdFk
   */
  SubsidiaryProdFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * SupplierProdFk
   */
  SupplierProdFk?: number | null ;

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
