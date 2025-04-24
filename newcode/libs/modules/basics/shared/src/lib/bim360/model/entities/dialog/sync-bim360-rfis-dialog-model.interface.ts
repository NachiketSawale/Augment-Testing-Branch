/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360ProjectEntity } from '../basics-bim360-project-entity.interface';
import { IBasicsBim360RFIViewEntity } from '../../../lookup/entities/basics-bim360-rfi-view-entity.interface';

export interface IBasicsSyncBim360RFIsDialogModel {
	prjId: number | undefined;
	projInfo: IBasicsBim360ProjectEntity | null;

	searchText?: string;

	filterStatus: string;
	showImported: boolean;

	dataList: IBasicsBim360RFIViewEntity[];

	importDocument: boolean;
}
