/*
 * Copyright(c) RIB Software GmbH
 */

import { IPriceVersionUsedCompanyEntity } from './price-version-used-company-entity.interface';

export interface IPriceVersionUsedCompanyEntityGenerated {

  /**
   * Checked
   */
  Checked: boolean;

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Companies
   */
  Companies?: IPriceVersionUsedCompanyEntity[] | null;

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
	 * MaterialPriceVersionFk
	 */
	MaterialPriceVersionFk: number;

  /**
   * Id
   */
  Id: number;
}
