/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';

export interface getChildrenFunc{
	(parent:IEstResourceEntity) : IEstResourceEntity[]|null
}

export interface getResourcesOfLineItemFunc{
	(parent:IEstLineItemEntity) : IEstResourceEntity[]|null
}