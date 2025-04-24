/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';
import { IProject2SalesTaxCodeEntity } from './project-main-2-sales-tax-code-entity.interface';

export interface ISalesTaxMatrixEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * LedgerContextFk
 */
  LedgerContextFk?: number | null;

/*
 * PrjTaxPercent
 */
  PrjTaxPercent: number;

/*
 * Project2SalesTaxCodeFk
 */
  Project2SalesTaxCodeFk: number;

/*
 * Project2salestaxcodeEntity
 */
  Project2salestaxcodeEntity?: IProject2SalesTaxCodeEntity | null;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * SalesTaxGroupFk
 */
  SalesTaxGroupFk: number;

/*
 * TaxPercent
 */
  TaxPercent?: number | null;
}
