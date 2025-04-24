/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqCompositeEntity } from './boq-composite-entity.interface';
import { IWicBoqCompositeEntityGenerated } from './wic-boq-composite-entity-generated.interface';
import { IEntityIdentification } from '@libs/platform/common';

export interface IWicBoqCompositeEntity extends IWicBoqCompositeEntityGenerated, IBoqCompositeEntity, IEntityIdentification {
}
