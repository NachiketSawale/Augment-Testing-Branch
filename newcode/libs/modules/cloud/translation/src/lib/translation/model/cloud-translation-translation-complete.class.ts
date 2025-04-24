/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ITranslationEntity } from './entities/translation-entity.interface';
/**
 * Cloud Translation Translation Complete
 */
export class CloudTranslationTranslationComplete implements CompleteIdentification<ITranslationEntity> {
	/**
	 * Id
	 */
	public Id: number = 0;

	/**
	 * Translation Entity Data
	 */
	public Datas: ITranslationEntity[] | null = [];
}
