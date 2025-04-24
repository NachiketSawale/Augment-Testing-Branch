/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPPSEventEntity } from '@libs/productionplanning/shared';

export class PpsCommonEventBehavior implements IEntityContainerBehavior<IGridContainerLink<IPPSEventEntity>, IPPSEventEntity> {}
