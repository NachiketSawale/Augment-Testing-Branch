/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext } from '@libs/platform/common';

export interface IBasicChangeProjectDocumentRubricCategoryService {
	/**
	 * execute change project document rubric category
	 */
	execute(context: IInitializationContext): Promise<void>;

}



