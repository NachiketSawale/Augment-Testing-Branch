/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintRfqProfileBase } from './compare-print-rfq-profile.interface';
import { IComparePrintBaseTotal } from './compare-print-base-total.interface';

export interface IComparePrintBoqAbcAnalysisFilterBasis {
	selectedValue: number;
	selectedItem?: IComparePrintBaseTotal;
}

export interface IComparePrintBoqRange {
	boqHeaderId: number;
	fromBoqHeaderId?: number;
	fromId?: number;
	toBoqHeaderId?: number;
	toId?: number;
}

export interface IComparePrintBoqAnalysisCriteria {
	selectedValue: string;
	totalPercent: number;
	singlePercent: number;
	amount: number;
}

export interface IComparePrintBoqAnalysis {
	filterBasis: IComparePrintBoqAbcAnalysisFilterBasis;
	criteria: IComparePrintBoqAnalysisCriteria;
}

export interface IComparePrintBoqProfile extends IComparePrintRfqProfileBase {
	boq: {
		checkedBoqRanges: IComparePrintBoqRange[]
	},
	analysis: IComparePrintBoqAnalysis
}