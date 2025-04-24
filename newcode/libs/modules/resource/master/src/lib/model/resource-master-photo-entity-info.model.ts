/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceMasterPhotoEntityInfoGenerated } from './generated/resource-master-photo-entity-info-generated.model';
import { IResourceMasterPhotoEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceMasterPhotoEntityInfo = <Partial<IEntityInfo<IResourceMasterPhotoEntity>>>{};
export const RESOURCE_MASTER_PHOTO_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceMasterPhotoEntityInfoGenerated,resourceMasterPhotoEntityInfo));