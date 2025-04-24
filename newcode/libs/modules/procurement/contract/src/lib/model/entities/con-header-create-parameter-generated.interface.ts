/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';

export interface IConHeaderCreateParameterGenerated {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * ConHeaders
   */
  ConHeaders?: IConHeaderEntity[] | null;

  /**
   * ConfigurationFk
   */
  ConfigurationFk: number;

  /**
   * ContactFk
   */
  ContactFk?: number | null;

  /**
   * DoesCopyHeaderTextFromPackage
   */
  DoesCopyHeaderTextFromPackage: boolean;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * mainItemId
   */
  mainItemId: number;
}
