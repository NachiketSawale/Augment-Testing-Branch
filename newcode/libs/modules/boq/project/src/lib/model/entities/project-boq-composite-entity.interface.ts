/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectBoqCompositeEntityGenerated } from './project-boq-composite-entity-generated.interface';
import { IBoqCompositeEntity } from '@libs/boq/interfaces';
import { IEntityIdentification } from '@libs/platform/common';

export interface IProjectBoqCompositeEntity extends IProjectBoqCompositeEntityGenerated, IBoqCompositeEntity, IEntityIdentification {

}
