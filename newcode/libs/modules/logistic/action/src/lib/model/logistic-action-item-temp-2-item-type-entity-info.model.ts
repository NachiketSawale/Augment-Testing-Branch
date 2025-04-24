/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { logisticActionItemTemp2ItemTypeEntityInfoGenerated } from './generated/logistic-action-item-temp-2-item-type-entity-info-generated.model';
import { ILogisticActionItemTemp2ItemTypeEntity } from '@libs/logistic/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const logisticActionItemTemp2ItemTypeEntityInfo = <Partial<IEntityInfo<ILogisticActionItemTemp2ItemTypeEntity>>>{};
export const LOGISTIC_ACTION_ITEM_TEMP_2_ITEM_TYPE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(logisticActionItemTemp2ItemTypeEntityInfoGenerated,logisticActionItemTemp2ItemTypeEntityInfo));