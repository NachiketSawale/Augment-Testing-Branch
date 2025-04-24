/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEventTypeEntity } from '../model/entities/event-type-entity.interface';


export class ConfigurationEventTypeBehavior implements IEntityContainerBehavior<IGridContainerLink<IEventTypeEntity>, IEventTypeEntity> {

}