/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterResourceEntityInfoGenerated } from './generated/resource-master-resource-entity-info-generated.model';
import { IResourceMasterResourceEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterResourceEntityInfo = <Partial<IEntityInfo<IResourceMasterResourceEntity>>>{};
export const RESOURCE_MASTER_RESOURCE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterResourceEntityInfoGenerated,resourceMasterResourceEntityInfo));