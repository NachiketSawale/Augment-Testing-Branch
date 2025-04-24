/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEstRuleEntity} from './est-rule-entity.interface';
import {CompleteIdentification} from '@libs/platform/common';

export class EstimateRuleBaseComplete implements CompleteIdentification<IEstRuleEntity>{

	public Id?: number;

	public Datas: IEstRuleEntity[] | null = [];

	public projectFk?: number;

	public EstimateRule: IEstRuleEntity | null = null;


	/*
 * EntitiesCount
 */
	public EntitiesCount: number | null = 10;



}
