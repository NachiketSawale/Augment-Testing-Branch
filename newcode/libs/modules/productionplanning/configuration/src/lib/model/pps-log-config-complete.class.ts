/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsLogConfigEntity } from './entities/pps-log-config-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsLogConfigComplete implements CompleteIdentification<IPpsLogConfigEntity> {

	/*
	 * LogConfig
	 */
	public LogConfig!: IPpsLogConfigEntity | null;
}
