/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IScriptResponseEntityGenerated } from './script-response-entity-generated.interface';

export interface IScriptResponseEntity extends IScriptResponseEntityGenerated {
	LineItems?: IEstLineItemEntity[];
}
