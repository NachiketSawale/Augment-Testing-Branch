/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProject2SalesTaxCodeEntity } from './project-main-2-sales-tax-code-entity.interface';
import { ISalesTaxMatrixEntity } from './project-main-sales-tax-matrix-entity.interface';

export interface IProject2SalesTaxCodeComplete extends CompleteIdentification<IProject2SalesTaxCodeEntity>{

	Project2SalesTaxCodeId: number;

	Project2SalesTaxCodes: IProject2SalesTaxCodeEntity | null;

	SalesTaxMatrixToSave: ISalesTaxMatrixEntity[] | null;

	SalesTaxMatrixToDelete: ISalesTaxMatrixEntity[] | null;


}
