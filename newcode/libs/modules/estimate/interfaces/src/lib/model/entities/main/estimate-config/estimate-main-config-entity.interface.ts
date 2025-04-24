/*
 * Copyright(c) RIB Software GmbH
 */

export interface IEstimateMainConfigEntity{
	estConfigTypeFk?: number | null;
	estConfigDesc?: string | null;
	isColumnConfig?: boolean | null;
	boqWicCatFk?: number | null;
	estStructTypeFk?: number | null;
	estUppConfigTypeFk?: number | null;
	isEditEstType?: boolean | null;
}