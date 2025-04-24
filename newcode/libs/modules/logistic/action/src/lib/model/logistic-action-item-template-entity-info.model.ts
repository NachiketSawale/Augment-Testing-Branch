/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { logisticActionItemTemplateEntityInfoGenerated } from './generated/logistic-action-item-template-entity-info-generated.model';
import { ILogisticActionItemTemplateEntity } from '@libs/logistic/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

const logisticActionItemTemplateEntityInfo = <Partial<IEntityInfo<ILogisticActionItemTemplateEntity>>>{};
export const LOGISTIC_ACTION_ITEM_TEMPLATE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(logisticActionItemTemplateEntityInfoGenerated,logisticActionItemTemplateEntityInfo));