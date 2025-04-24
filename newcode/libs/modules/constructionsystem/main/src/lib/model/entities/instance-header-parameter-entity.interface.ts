/*
 * Copyright(c) RIB Software GmbH
 */

import { IInstanceHeaderParameterEntityGenerated } from './instance-header-parameter-entity-generated.interface';

export interface IInstanceHeaderParameterEntity extends IInstanceHeaderParameterEntityGenerated {
	CosParameterTypeFk: number;
	Description?: string;
}
