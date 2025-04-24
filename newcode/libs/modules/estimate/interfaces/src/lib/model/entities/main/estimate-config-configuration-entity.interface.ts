/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigDetailEntity } from './est-column-config-detail-entity.interface';

export interface IEstimateConfigConfigurationEntity{
	//this properties form estimate config
	estConfigTypeFk: number | null;
	isEditEstType: boolean;
	estConfigDesc?: string | null;
	isColumnConfig?: boolean | null;
	boqWicCatFk?: number | null;
	estStructTypeFk?: number | null;
	estUppConfigTypeFk?: number | null;
	IsUpdEstConfig: boolean;

	//this properties form estimate column config
	estColConfigTypeFk?: number;
	columnConfigDesc? : string | null;
	columnConfigId?: number;
	estColumnConfigDetails?: IEstColumnConfigDetailEntity[] | null;
	estConfigColumnConfigFk?: number | null;
	estConfigColumnConfigTypeFk?: number | null;
	isEditColConfigType?: boolean;
}