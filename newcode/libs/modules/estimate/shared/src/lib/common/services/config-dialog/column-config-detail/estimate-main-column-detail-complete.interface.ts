/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigDetailEntity, IEstColumnConfigEntity, IEstColumnConfigTypeEntity } from '@libs/estimate/interfaces';

export interface IEstColumnConfigDetailComplete {
	IsDefaultColConfig?: boolean;
	IsUpdColumnConfig?: boolean;
	estColumnConfig?: IEstColumnConfigEntity;
	estColumnConfigDetailsToSave?: IEstColumnConfigDetailEntity[] | null;
	estColumnConfigDetailsToDelete?: IEstColumnConfigDetailEntity[] | null;
	estColumnConfigType?: IEstColumnConfigTypeEntity | null;
}