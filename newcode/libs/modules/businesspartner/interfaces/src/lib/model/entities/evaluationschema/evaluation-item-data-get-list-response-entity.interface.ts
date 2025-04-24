/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEvaluationItemDataEntity } from './evaluation-item-data-entity.interface';
import {IDescriptorDto} from './evaluation-simple.interface';

export interface IEvaluationItemDataGetListResponseEntity {
	/*
	 * EvaluationItem
	 */
	EvaluationItem?: IDescriptorDto[] | null;

	/*
	 * dtos
	 */
	dtos?: IEvaluationItemDataEntity[] | null;

	/*
	 * isCreate
	 */
	isCreate?: boolean | null;
}
