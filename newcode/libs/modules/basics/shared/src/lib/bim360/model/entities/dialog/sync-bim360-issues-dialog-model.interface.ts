/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360ProjectEntity } from '../basics-bim360-project-entity.interface';
import { IBasicsBim360IssueViewEntity } from '../../../lookup/entities/basics-bim360-issue-view-entity.interface';

export interface IBasicsSyncBim360IssuesDialogModel {
	prjId: number | undefined;
	projInfo: IBasicsBim360ProjectEntity | null;

	searchText?: string;

	filterStatus: string;
	showImported: boolean;

	dataList: IBasicsBim360IssueViewEntity[];

	importDocument: boolean;
}
