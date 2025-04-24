/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterProvidedResourceSkillEntityInfoGenerated } from './generated/resource-master-provided-resource-skill-entity-info-generated.model';
import { IResourceMasterProvidedResourceSkillEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterProvidedResourceSkillEntityInfo = <Partial<IEntityInfo<IResourceMasterProvidedResourceSkillEntity>>>{};
export const RESOURCE_MASTER_PROVIDED_RESOURCE_SKILL_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterProvidedResourceSkillEntityInfoGenerated,resourceMasterProvidedResourceSkillEntityInfo));