/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IProjectEntity } from './project-main-entity.interface';
import { ISalesTaxMatrixEntity } from './project-main-sales-tax-matrix-entity.interface';

export interface IProject2SalesTaxCodeEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * ProjectEntity
 */
  ProjectEntity?: IProjectEntity | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * SalesTaxCodeFk
 */
  SalesTaxCodeFk: number;

/*
 * SalestaxmatrixEntities
 */
  SalestaxmatrixEntities?: ISalesTaxMatrixEntity[] | null;
}
