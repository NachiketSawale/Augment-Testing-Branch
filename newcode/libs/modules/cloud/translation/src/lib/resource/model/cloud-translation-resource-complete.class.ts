/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceEntity } from './entities/resource-entity.interface';

/**
 * Cloud Translation Resource Entity Complete
 */
export class CloudTranslationResourceComplete implements CompleteIdentification<IResourceEntity> {
	/**
	 * Id
	 */
	public Id: number = 0;

	/**
	 * Resource Entity Data
	 */
	public Datas: IResourceEntity[] | null = [];
}
