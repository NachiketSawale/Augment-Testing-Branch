/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsProdPlaceChildrenEntity } from './pps-prod-place-children-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class PpsProdPlaceChildrenComplete implements CompleteIdentification<PpsProdPlaceChildrenEntity> {
	public Id: number = 0;

	public Datas: PpsProdPlaceChildrenEntity[] | null = [];
}
