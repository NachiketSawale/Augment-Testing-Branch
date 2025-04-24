/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterProvidedSkillDocumentEntityInfoGenerated } from './generated/resource-master-provided-skill-document-entity-info-generated.model';
import { IResourceMasterProvidedSkillDocumentEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterProvidedSkillDocumentEntityInfo = <Partial<IEntityInfo<IResourceMasterProvidedSkillDocumentEntity>>>{};
export const RESOURCE_MASTER_PROVIDED_SKILL_DOCUMENT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterProvidedSkillDocumentEntityInfoGenerated,resourceMasterProvidedSkillDocumentEntityInfo));