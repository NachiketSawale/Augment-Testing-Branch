/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBusinessPartnerAssignmentEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ContactFk
   */
  ContactFk: number;

  /**
   * ContactRoleFk
   */
  ContactRoleFk?: number | null;

  /**
   * FrmUserExtProviderFk
   */
  FrmUserExtProviderFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsMain
   */
  IsMain: boolean;

  /**
   * IsPortal
   */
  IsPortal: boolean;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;
}
