/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterResourcePartEntityInfoGenerated } from './generated/resource-master-resource-part-entity-info-generated.model';
import { IResourceMasterResourcePartEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterResourcePartEntityInfo = <Partial<IEntityInfo<IResourceMasterResourcePartEntity>>>{};
export const RESOURCE_MASTER_RESOURCE_PART_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterResourcePartEntityInfoGenerated,resourceMasterResourcePartEntityInfo));