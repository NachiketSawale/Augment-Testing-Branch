/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICostCodeEntity } from './entities/cost-code-entity.interface';
import { ICostCode2ResTypeEntity } from './entities/cost-code-2res-type-entity.interface';
import { ICostCodesUsedCompanyEntity } from './entities/cost-codes-used-company-entity.interface';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';

export interface IBasicsCostCodesComplete extends CompleteIdentification<ICostCodeEntity> {
	/*
	 * Id
	 */
	Id: number;
	/*
	 * MainItemId
	 */
	MainItemId: number;
	/*
	 * CostCodes
	 */
	CostCodes: ICostCodeEntity[] | null;
	/*
	 * CostCodes2ResTypeToSave
	 */
	CostCodes2ResTypeToSave: ICostCode2ResTypeEntity[] | null;
	/*
	 * CostCodes2ResTypeToDelete
	 */
	CostCodes2ResTypeToDelete: ICostCode2ResTypeEntity[] | null;
	/*
	 * CompaniesToSave
	 */
	CompaniesToSave: ICostCodesUsedCompanyEntity | null;
	/*
	 * PriceVersionListRecordToSave
	 */
	PriceVersionListRecordToSave: ICostcodePriceListEntity[] | null;
	/*
	 * PriceVersionListRecordToDelete
	 */
	PriceVersionListRecordToDelete: ICostcodePriceListEntity[];
}
