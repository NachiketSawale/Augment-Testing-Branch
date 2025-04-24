/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IResourceMasterResourceEntityGenerated } from './resource-master-resource-entity-generated.interface';

export interface IResourceMasterResourceEntity extends IResourceMasterResourceEntityGenerated {
	Rate: number;
	IsRateReadOnly: boolean;
}