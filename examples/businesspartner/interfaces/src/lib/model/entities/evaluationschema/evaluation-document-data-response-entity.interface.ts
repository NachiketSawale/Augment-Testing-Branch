/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IBasicsCustomizeDocumentTypeEntity} from '@libs/basics/interfaces';
import { IEvaluationDocumentEntity } from './evaluation-document-entity.interface';

export interface IEvaluationDocumentDataResponseEntity {
	/*
	 * GroupIcons
	 */
	DocumentType: IBasicsCustomizeDocumentTypeEntity[];

	/*
	 * dtos
	 */
	Main: IEvaluationDocumentEntity[];
}
