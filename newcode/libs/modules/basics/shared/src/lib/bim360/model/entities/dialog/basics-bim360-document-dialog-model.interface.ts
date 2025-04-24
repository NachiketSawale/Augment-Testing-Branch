/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360ProjectEntity } from '../basics-bim360-project-entity.interface';
import { IBasicsBim360DocumentViewEntity } from '../../../lookup/entities/basics-bim360-document-view-entity.interface';

export interface IBasicsBim360DocumentDialogModel {
	prjId: number | undefined;
	projInfo: IBasicsBim360ProjectEntity | null;

	folderId: number;
	folderInfo: IBasicsBim360DocumentViewEntity | null;

	searchText?: string;
}
