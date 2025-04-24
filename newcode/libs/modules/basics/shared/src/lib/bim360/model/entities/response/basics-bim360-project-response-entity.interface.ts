/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360ProjectEntity } from '../basics-bim360-project-entity.interface';
import { IBasicsBim360ResponseEntity } from './basics-bim360-response-entity.interface';

export interface IBasicsBim360ProjectResponseEntity extends IBasicsBim360ResponseEntity {
	Bim360Projects: IBasicsBim360ProjectEntity[];
}
