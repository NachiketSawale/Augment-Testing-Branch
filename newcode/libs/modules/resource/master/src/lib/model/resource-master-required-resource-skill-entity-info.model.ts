/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterRequiredResourceSkillEntityInfoGenerated } from './generated/resource-master-required-resource-skill-entity-info-generated.model';
import { IResourceMasterRequiredResourceSkillEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterRequiredResourceSkillEntityInfo = <Partial<IEntityInfo<IResourceMasterRequiredResourceSkillEntity>>>{};
export const RESOURCE_MASTER_REQUIRED_RESOURCE_SKILL_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterRequiredResourceSkillEntityInfoGenerated,resourceMasterRequiredResourceSkillEntityInfo));