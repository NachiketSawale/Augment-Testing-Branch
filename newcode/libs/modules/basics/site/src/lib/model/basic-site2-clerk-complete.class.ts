/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicSite2ClerkEntity } from './basic-site2-clerk-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicSite2ClerkComplete implements CompleteIdentification<BasicSite2ClerkEntity> {
	public Id: number = 0;

	public Datas: BasicSite2ClerkEntity[] | null = [];
}
