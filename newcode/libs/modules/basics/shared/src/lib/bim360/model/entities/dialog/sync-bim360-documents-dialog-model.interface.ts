/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentDialogModel } from './basics-bim360-document-dialog-model.interface';
import { IBasicsBim360DocumentViewEntity } from '../../../lookup/entities/basics-bim360-document-view-entity.interface';

export interface IBasicsSyncBim360DocumentsDialogModel extends IBasicsBim360DocumentDialogModel {
	dataList: IBasicsBim360DocumentViewEntity[];

	checkBoxCompressChecked: boolean;
	zipFileName: string | null;
}
