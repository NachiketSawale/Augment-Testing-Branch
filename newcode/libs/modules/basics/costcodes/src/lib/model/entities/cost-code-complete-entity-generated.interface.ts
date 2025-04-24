/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostCodesUsedCompanyEntity } from './cost-codes-used-company-entity.interface';
import { ICostCodeEntity } from './cost-code-entity.interface';
import { ICostCode2ResTypeEntity } from './cost-code-2res-type-entity.interface';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';

export interface ICostCodeCompleteEntityGenerated {

/*
 * CompaniesToSave
 */
  CompaniesToSave?: ICostCodesUsedCompanyEntity[] | null;

/*
 * CostCodes
 */
  CostCodes?: ICostCodeEntity[] | null | undefined;

/*
 * CostCodes2ResTypeToDelete
 */
  CostCodes2ResTypeToDelete?: ICostCode2ResTypeEntity[] | null;

/*
 * CostCodes2ResTypeToSave
 */
  CostCodes2ResTypeToSave?: ICostCode2ResTypeEntity[] | null;

/*
 * CostCodesToDelete
 */
  CostCodesToDelete?: ICostCodeEntity | null;

/*
 * EntitiesCount
 */
  EntitiesCount?: number | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * PriceVersionListRecordToDelete
 */
  PriceVersionListRecordToDelete?: ICostcodePriceListEntity[] | null;

/*
 * PriceVersionListRecordToSave
 */
  PriceVersionListRecordToSave?: ICostcodePriceListEntity[] | null;

/*
 * SelectedCostCodes
 */
  SelectedCostCodes?: ICostCodeEntity[] | null;
}
