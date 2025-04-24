/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IRubricEntity } from './rubric-entity.interface';


export interface IRubricIndexEntity extends IEntityBase {
	asRubricFk?: number | null;
	DescriptionInfo?: IDescriptionInfo | null;
	Id?: number | null;
	RubricEntity?: IRubricEntity | null;
}
