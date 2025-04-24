/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodeEntity } from './cost-code-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICostCodeCompanyEntityGenerated extends IEntityBase {

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * CostCodeEntity
 */
  CostCodeEntity?: ICostCodeEntity | null;

/*
 * CostCodeFk
 */
  CostCodeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsAccess
 */
  IsAccess?: boolean | null;

}
