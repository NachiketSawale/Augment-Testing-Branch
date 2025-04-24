/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosGroupEntity } from '@libs/constructionsystem/shared';
import { CompleteIdentification } from '@libs/platform/common';

export class CosGroupComplete implements CompleteIdentification<ICosGroupEntity> {
	/**
	 * CosGroup
	 */
	public CosGroup?: ICosGroupEntity | null;

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
