/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICosMainObjectSetEntity } from './cos-main-object-set-entity.interface';
import { IObjectSet2ObjectEntity } from './object-set-2-object-entity.interface';

export class IObjectSetComplete implements CompleteIdentification<ICosMainObjectSetEntity> {
	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * ObjectSet
	 */
	public ObjectSet?: ICosMainObjectSetEntity | null = null;

	/**
	 * ObjectSet2ObjectToDelete
	 */
	public ObjectSet2ObjectToDelete?: IObjectSet2ObjectEntity[] | null = [];

	/**
	 * ObjectSet2ObjectToSave
	 */
	public ObjectSet2ObjectToSave?: IObjectSet2ObjectEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
}
