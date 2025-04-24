/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IResourceTypeEntity } from './resource-type-entity.interface';
import { IPlanningBoardFilterEntity } from './planning-board-filter-entity.interface';
import { IRequestedTypeEntity } from './requested-type-entity.interface';
import { IRequestedTypeUpdateEntity } from './requested-type-update-entity.interface';
import { IRequiredSkillEntity } from './required-skill-entity.interface';
import { IResourceTypeAlternativeResTypeEntity } from './resource-type-alternative-res-type-entity.interface';


//have to change the naming of file
export interface IResourceTypeUpdateEntity extends CompleteIdentification<IResourceTypeEntity> {



	PlanningBoardFiltersToDelete?: IPlanningBoardFilterEntity[] | null;
	PlanningBoardFiltersToSave?: IPlanningBoardFilterEntity[] | null;
	RequestedTypesToDelete: IRequestedTypeEntity[] | null;
	RequestedTypesToSave: IRequestedTypeUpdateEntity[] | null;
	RequiredSkillsToDelete: IRequiredSkillEntity[];
	RequiredSkillsToSave?: IRequiredSkillEntity[] | null;
	AlternativeTypesToSave?: IResourceTypeAlternativeResTypeEntity[] | null;
	AlternativeTypesToDelete: IResourceTypeAlternativeResTypeEntity[];
	MainItemId?: number;
	ResourceTypes?: IResourceTypeEntity | null;
	entities?: number | null;



}
