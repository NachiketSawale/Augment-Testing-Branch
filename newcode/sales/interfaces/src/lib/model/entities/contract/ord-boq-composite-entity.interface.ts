/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqCompositeEntity } from '@libs/boq/interfaces';
import { IOrdBoqCompositeEntityGenerated } from './ord-boq-composite-entity-generated.interface';
import { IEntityIdentification } from '@libs/platform/common';

export interface IOrdBoqCompositeEntity extends IOrdBoqCompositeEntityGenerated, IBoqCompositeEntity, IEntityIdentification {

}
