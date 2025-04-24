/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360ResponseEntity } from './basics-bim360-response-entity.interface';

export interface IBasicsSaveProjectToBim360ResponseEntity extends IBasicsBim360ResponseEntity {
	prjSynInfo?: IBasicsBim360ResponseEntity | null;
	postProjectUserImport?: IBasicsBim360ResponseEntity | null;
	activateServiceInfo?: IActivateServiceResponse;
}

export interface IActivateServiceResponse {
	[key: string]: IBasicsBim360ResponseEntity;
}
