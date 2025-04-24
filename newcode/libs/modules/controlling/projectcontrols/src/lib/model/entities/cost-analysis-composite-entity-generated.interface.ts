/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBisPrjClassificationEntity, IBisPrjHistoryInfoEntity } from '@libs/controlling/structure';
import { IMdcContrSacValueEntity } from '@libs/controlling/configuration';

export interface ICostAnalysisCompositeEntityGenerated {
	/*
	 * CostAnalysis
	 */
	CostAnalysis?: Map<string, number>[];

	/*
	 * CostAnalysisByPeriod
	 */
	CostAnalysisByPeriod?: { [key: string]: {} }[] | null;

	/*
	 * HistoryInfo
	 */
	HistoryInfo?: IBisPrjHistoryInfoEntity | null;

	/*
	 * PrjClassifications
	 */
	PrjClassifications?: Map<number, IBisPrjClassificationEntity>;

	/*
	 * stagingActualsValues
	 */
	stagingActualsValues?: IMdcContrSacValueEntity[];
}
