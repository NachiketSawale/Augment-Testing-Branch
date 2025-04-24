/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSite2ExternalEntity } from './basics-site2-external-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsSite2ExternalComplete implements CompleteIdentification<BasicsSite2ExternalEntity> {
	public Id: number = 0;

	public Datas: BasicsSite2ExternalEntity[] | null = [];
}
