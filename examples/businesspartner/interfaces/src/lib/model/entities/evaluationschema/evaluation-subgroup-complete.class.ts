/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IEvaluationItemEntity } from './evaluation-item-entity.interface';
import {IEvaluationSubgroupEntity} from './evaluation-subgroup-entity.interface';

/**
 * Represents an EvaluationSubgroupComplete object.
 */
export class EvaluationSubgroupComplete implements CompleteIdentification<IEvaluationSubgroupEntity>{
	/**
	 * MainItemId
	 */
	public MainItemId?: number;

	/**
	 * EntitiesCount
	 */
	public EntitiesCount?: number;

	/**
	 * Subgroup
	 */
	public Subgroup?: IEvaluationSubgroupEntity | null;

	/**
	 * ItemToSave
	 */
	public ItemToSave?: IEvaluationItemEntity[] = [];

	/**
	 * ItemToDelete
	 */
	public ItemToDelete?: IEvaluationItemEntity[] = [];
}
