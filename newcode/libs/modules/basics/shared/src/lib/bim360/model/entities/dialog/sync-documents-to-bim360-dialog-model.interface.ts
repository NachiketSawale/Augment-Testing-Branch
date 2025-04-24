/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360DocumentDialogModel } from './basics-bim360-document-dialog-model.interface';
import { IBasicsDocumentToBim360Entity } from '../basics-document-to-bim360-entity.interface';

export interface IBasicsSyncDocumentsToBim360DialogModel extends IBasicsBim360DocumentDialogModel {
	dataList: IBasicsDocumentToBim360Entity[];
}
