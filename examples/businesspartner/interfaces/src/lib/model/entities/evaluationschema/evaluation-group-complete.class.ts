/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IEvaluationGroupEntity } from './evaluation-group-entity.interface';
import { IEvaluationGroupIconEntity } from './evaluation-group-icon-entity.interface';
import { EvaluationSubgroupComplete } from './evaluation-subgroup-complete.class';
import {IEvaluationSubgroupEntity} from './evaluation-subgroup-entity.interface';

/**
 * Represents an evaluationgroupcomplete object.
 */
export class EvaluationGroupComplete implements CompleteIdentification<IEvaluationGroupEntity> {

	/**
	 *
	 */
	public MainItemId?: number;

	/**
	 *
	 */
	public EntitiesCount?: number;

	/**
	 *
	 */
	public Group?: IEvaluationGroupEntity | null;

	/**
	 *
	 */
	public SubgroupToSave?: EvaluationSubgroupComplete[] = [];

	/**
	 *
	 */
	public SubgroupToDelete?: IEvaluationSubgroupEntity[] = [];

	/**
	 *
	 */
	public GroupIconToSave?: IEvaluationGroupIconEntity[] = [];

	/**
	 *
	 */
	public GroupIconToDelete?: IEvaluationGroupIconEntity[] = [];
}
