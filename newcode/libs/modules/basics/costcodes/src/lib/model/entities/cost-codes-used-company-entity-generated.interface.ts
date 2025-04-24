/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodesUsedCompanyEntity } from './cost-codes-used-company-entity.interface';

export interface ICostCodesUsedCompanyEntityGenerated {

/*
 * Code
 */
  Code?: string | null;

/*
 * Companies
 */
  Companies?: ICostCodesUsedCompanyEntity[] | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * CompanyName
 */
  CompanyName?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsChecked
 */
  IsChecked?: boolean | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;
}
