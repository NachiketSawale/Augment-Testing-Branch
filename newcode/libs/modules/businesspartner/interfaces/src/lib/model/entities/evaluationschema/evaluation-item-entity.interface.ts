/*
 * Copyright(c) RIB Software GmbH
 */
import { IEvaluationItemEntityGenerated } from './evaluation-item-entity-generated.interface';

/**
 * Represents an evaluationitem object.
 */
export interface IEvaluationItemEntity extends IEvaluationItemEntityGenerated {

	/**
	 * Remark
	 */
	Remark: string | null;
}
