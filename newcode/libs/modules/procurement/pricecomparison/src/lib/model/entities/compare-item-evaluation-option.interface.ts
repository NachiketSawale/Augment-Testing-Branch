/*
 * Copyright(c) RIB Software GmbH
 */

import { ICustomCompareColumnEntity } from './custom-compare-column-entity.interface';
import { IItemEvaluationPrcItemEntity } from './item-evaluation-prc-item.entity.interface';
import { IItemEvaluationBoqItemEntity } from './item-evaluation-boq-item.entity.interface';

export interface IItemEvaluationOption {
	notSubmitted: boolean;
	isEvaluated: boolean;
	itemEvaluationValue: number;
	quotes: ICustomCompareColumnEntity[];
	prcItems: IItemEvaluationPrcItemEntity[];
	boqItems: IItemEvaluationBoqItemEntity[];
}
