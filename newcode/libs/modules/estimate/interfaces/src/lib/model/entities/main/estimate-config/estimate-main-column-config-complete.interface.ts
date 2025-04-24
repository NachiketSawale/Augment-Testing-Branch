/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigDetailEntity } from '../est-column-config-detail-entity.interface';

export interface IEstimateMainColumnConfigComplete{
	estColConfigTypeFk?: number | null;
	isEditColConfigType?: boolean | null;
	columnConfigDesc?: string | null;
	columnConfigId?: number | null;
	estColumnConfigDetails?: IEstColumnConfigDetailEntity[] | null;
	estConfigColumnConfigFk?: number | null;
	estConfigColumnConfigTypeFk?: number | null;
	IsUpdColumnConfig?: boolean | null;
}