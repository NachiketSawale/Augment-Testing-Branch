/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentBusinessPartnerEntityInfoGenerated } from './generated/resource-equipment-business-partner-entity-info-generated.model';
import { IResourceEquipmentBusinessPartnerEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const resourceEquipmentBusinessPartnerEntityInfo = <Partial<IEntityInfo<IResourceEquipmentBusinessPartnerEntity>>>{};
export const RESOURCE_EQUIPMENT_BUSINESS_PARTNER_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceEquipmentBusinessPartnerEntityInfoGenerated,resourceEquipmentBusinessPartnerEntityInfo));