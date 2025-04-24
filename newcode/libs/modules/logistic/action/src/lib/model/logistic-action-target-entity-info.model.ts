/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { logisticActionTargetEntityInfoGenerated } from './generated/logistic-action-target-entity-info-generated.model';
import { ILogisticActionTargetEntity } from '@libs/logistic/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const logisticActionTargetEntityInfo = <Partial<IEntityInfo<ILogisticActionTargetEntity>>>{};
export const LOGISTIC_ACTION_TARGET_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(logisticActionTargetEntityInfoGenerated,logisticActionTargetEntityInfo));