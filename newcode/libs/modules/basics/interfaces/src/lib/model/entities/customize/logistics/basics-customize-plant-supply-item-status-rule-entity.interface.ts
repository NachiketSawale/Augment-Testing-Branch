/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantSupplyItemStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PlantSupItemStatFk: number;
	PlantSupItemStatsTrgtFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
