/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSite2TksShiftEntity } from './basics-site2-tks-shift-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsSite2TksShiftComplete implements CompleteIdentification<BasicsSite2TksShiftEntity> {
	public Id: number = 0;

	public Datas: BasicsSite2TksShiftEntity[] | null = [];
}
