/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInstance2ObjectEntity, IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';

export class Instance2ObjectComplete implements CompleteIdentification<IInstance2ObjectEntity> {
	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * Instance2Object
	 */
	public Instance2Object?: IInstance2ObjectEntity | null = null;

	/**
	 * Instance2ObjectParamToDelete
	 */
	public Instance2ObjectParamToDelete?: IInstance2ObjectParamEntity[] | null = [];

	/**
	 * Instance2ObjectParamToSave
	 */
	public Instance2ObjectParamToSave?: IInstance2ObjectParamEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
