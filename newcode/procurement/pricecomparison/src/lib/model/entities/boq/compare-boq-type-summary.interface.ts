/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICompareBoqTypeSummary {
	checkedLineTypes: number[];
	checkedBoqItemTypes: number[];
	checkedBoqItemTypes2: number[];
	boqItemTypesInfos?: Array<{ Id: number, UserLabelName: string }>;
	boqItemTypes2Infos?: Array<{ Id: number, UserLabelName: string }>;
	hideZeroValueLines: boolean;
	percentageLevels: boolean;
}