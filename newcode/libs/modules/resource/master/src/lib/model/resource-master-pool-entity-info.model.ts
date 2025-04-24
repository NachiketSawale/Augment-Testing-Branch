/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterPoolEntityInfoGenerated } from './generated/resource-master-pool-entity-info-generated.model';
import { IResourceMasterPoolEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterPoolEntityInfo = <Partial<IEntityInfo<IResourceMasterPoolEntity>>>{
};
export const RESOURCE_MASTER_POOL_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterPoolEntityInfoGenerated,resourceMasterPoolEntityInfo));