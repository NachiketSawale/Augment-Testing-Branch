/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ILanguageEntity } from './entities/language-entity.interface';

export class CloudTranslationLanguageComplete implements CompleteIdentification<ILanguageEntity>{

	/*
 	* Id
 	*/
	public Id: number = 0;

	/*
 	* Language Entity Data
 	*/
	public Datas: ILanguageEntity[] | null = [];

	
}
