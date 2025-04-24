/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterResResource2mdcContextEntityInfoGenerated } from './generated/resource-master-res-resource-2mdc-context-entity-info-generated.model';
import { IResourceMasterResResource2mdcContextEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterResResource2mdcContextEntityInfo = <Partial<IEntityInfo<IResourceMasterResResource2mdcContextEntity>>>{};
export const RESOURCE_MASTER_RES_RESOURCE_2MDC_CONTEXT_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterResResource2mdcContextEntityInfoGenerated,resourceMasterResResource2mdcContextEntityInfo));