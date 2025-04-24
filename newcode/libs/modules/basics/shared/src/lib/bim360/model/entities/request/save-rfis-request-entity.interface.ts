/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsBim360SaveOptionsEntity } from './save-options-entity.interface';
import { IBasicsBim360RequestEntity } from './basics-bim360-request-entity.interface';
import { IBasicsBim360RFIEntity } from '../basics-bim360-rfi-entity.interface';

export interface IBasicsBim360SaveRFIsRequestEntity extends IBasicsBim360RequestEntity {
	RfiList: IBasicsBim360RFIEntity[] | null;
	Options: IBasicsBim360SaveOptionsEntity;
}
