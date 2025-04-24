/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsUpstreamItemTemplateEntity } from './entities/pps-upstream-item-template-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsUpstreamItemTemplateComplete implements CompleteIdentification<IPpsUpstreamItemTemplateEntity> {

	/*
	 * PpsUpstreamItemTemplate
	 */
	public PpsUpstreamItemTemplate!: IPpsUpstreamItemTemplateEntity[] | null;
}
