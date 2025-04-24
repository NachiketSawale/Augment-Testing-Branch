/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntitySelection } from '@libs/platform/data-access';
import { OptionallyAsyncResource } from '@libs/platform/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';

/**
 * Represents the options to create entity info instance via entity info factory.
 */
export interface IRfqHeaderEntityInfoOptions {
	permissionUuid: string;
	formContainerUuid: string;
	dataService: OptionallyAsyncResource<IEntitySelection<IRfqHeaderEntity>>;
	behavior?: OptionallyAsyncResource<IEntityContainerBehavior<IGridContainerLink<IRfqHeaderEntity>, IRfqHeaderEntity>>;
	validationService?: OptionallyAsyncResource<BaseValidationService<IRfqHeaderEntity>>;
}