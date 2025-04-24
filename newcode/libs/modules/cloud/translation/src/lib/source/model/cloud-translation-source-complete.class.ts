/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ISourceEntity } from './entities/source-entity.interface';

/**
 * Cloud Translation Source Complete
 */
export class CloudTranslationSourceComplete implements CompleteIdentification<ISourceEntity> {
	/**
	 * Id
	 */
	public Id: number = 0;

	/**
	 * Source Entity
	 */
	public Datas: ISourceEntity[] | null = [];
}
