/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosParameterEntityGenerated } from './cos-parameter-entity-generated.interface';

export interface ICosParameterEntity extends ICosParameterEntityGenerated {
	/**
	 * nodeInfo
	 */
	nodeInfo?: {
		level: number;
		collapsed: boolean;
		lastElement?: boolean;
	} | null;
}
