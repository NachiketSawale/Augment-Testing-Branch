/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsExternalconfigEntity } from './entities/pps-externalconfig-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsExternalconfigComplete implements CompleteIdentification<IPpsExternalconfigEntity> {

	/*
	 * PpsExternalconfig
	 */
	public PpsExternalconfig!: IPpsExternalconfigEntity | null;
}
