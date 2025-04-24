/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRuleEntityGenerated } from './rule-entity-generated.interface';

export interface IRuleEntity extends IRuleEntityGenerated {
	TestField?: string | null;
}
