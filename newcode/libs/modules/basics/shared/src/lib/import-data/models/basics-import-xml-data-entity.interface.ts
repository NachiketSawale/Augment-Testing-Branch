/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsSharedImportDataEntity } from './basics-import-data-entity.interface';
import { BasicsSharedImportStatus } from './basics-import-status.enums';

export interface IBasicsSharedImportXMLDataEntity extends IBasicsSharedImportDataEntity {
	importResultMessage: BasicsSharedImportMessage[]; //todo-mike: really needed? put it to form data?
	mainItemId?: number;
}

export type BasicsSharedImportMessage = {
	Id: number;
	Status: BasicsSharedImportStatus;
	Message: string;
};
