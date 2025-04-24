/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaCoDataEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * Currency
 */
  Currency?: string | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * Id
 */
  Id: number;

/*
 * RelActivity
 */
  RelActivity?: string | null;

/*
 * RelBoq
 */
  RelBoq?: string | null;

/*
 * RelChangeorderPa
 */
  RelChangeorderPa?: string | null;

/*
 * RelChangeorderSp
 */
  RelChangeorderSp?: string | null;

/*
 * RelClassification1
 */
  RelClassification1?: string | null;

/*
 * RelClassification2
 */
  RelClassification2?: string | null;

/*
 * RelClassification3
 */
  RelClassification3?: string | null;

/*
 * RelClassification4
 */
  RelClassification4?: string | null;

/*
 * RelCo
 */
  RelCo?: string | null;

/*
 * RelCostcode
 */
  RelCostcode?: string | null;

/*
 * RelCostcodeCo
 */
  RelCostcodeCo?: string | null;

/*
 * RelTimeintervall
 */
  RelTimeintervall?: string | null;

/*
 * RelWic
 */
  RelWic?: string | null;

/*
 * RibPaId
 */
  RibPaId: string;

/*
 * RibSpId
 */
  RibSpId: string;

/*
 * Uom
 */
  Uom?: string | null;

/*
 * ValAccrual
 */
  ValAccrual?: number | null;

/*
 * ValActual
 */
  ValActual?: number | null;

/*
 * ValBudgetAq
 */
  ValBudgetAq?: number | null;

/*
 * ValBudgetBq
 */
  ValBudgetBq?: number | null;

/*
 * ValBudgetIq
 */
  ValBudgetIq?: number | null;

/*
 * ValBudgetWq
 */
  ValBudgetWq?: number | null;

/*
 * ValCostAq
 */
  ValCostAq?: number | null;

/*
 * ValCostBq
 */
  ValCostBq?: number | null;

/*
 * ValCostIq
 */
  ValCostIq?: number | null;

/*
 * ValCostWq
 */
  ValCostWq?: number | null;

/*
 * ValQuantityAq
 */
  ValQuantityAq?: number | null;

/*
 * ValQuantityBq
 */
  ValQuantityBq?: number | null;

/*
 * ValQuantityIq
 */
  ValQuantityIq?: number | null;

/*
 * ValQuantityWq
 */
  ValQuantityWq?: number | null;

/*
 * ValRevAqChgApp
 */
  ValRevAqChgApp?: number | null;

/*
 * ValRevAqChgNotApp
 */
  ValRevAqChgNotApp?: number | null;

/*
 * ValRevBqChgApp
 */
  ValRevBqChgApp?: number | null;

/*
 * ValRevBqChgNotApp
 */
  ValRevBqChgNotApp?: number | null;

/*
 * ValRevIqChgApp
 */
  ValRevIqChgApp?: number | null;

/*
 * ValRevIqChgNotApp
 */
  ValRevIqChgNotApp?: number | null;

/*
 * ValRevWqChgApp
 */
  ValRevWqChgApp?: number | null;

/*
 * ValRevWqChgNotApp
 */
  ValRevWqChgNotApp?: number | null;

/*
 * ValRevenueAq
 */
  ValRevenueAq?: number | null;

/*
 * ValRevenueBq
 */
  ValRevenueBq?: number | null;

/*
 * ValRevenueIq
 */
  ValRevenueIq?: number | null;

/*
 * ValRevenueWq
 */
  ValRevenueWq?: number | null;
}
