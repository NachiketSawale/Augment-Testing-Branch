/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanies2MaterialCatalogEntity } from './companies-2-material-catalog-entity.interface';

export interface ICompanies2MaterialCatalogEntityGenerated {

  /**
   * CanEdit
   */
  CanEdit: boolean;

  /**
   * CanLookup
   */
  CanLookup: boolean;

  /**
   * Companies
   */
  Companies?: ICompanies2MaterialCatalogEntity[] | null;

  /**
   * CompanyCode
   */
  CompanyCode?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * CompanyName
   */
  CompanyName?: string | null;

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsOwner
   */
  IsOwner: boolean;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;
}
