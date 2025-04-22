/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';

/**
 * Interface as an input parameter for configuring generic approver service.
 */
export interface IEntityApproversParam<PT extends object> {
	entityId?: number;
	entityGUID: string;
	moduleName: string;
	parentService: IEntitySelection<PT>
}

/**
 * Interface as an input parameter for configuring approver entity info.
 */
export interface IEntityApproverOptions<PT extends object> {
	entityId?: number;
	entityGUID: string;
	containerTitle?: string;
	containerUuid: string;
	permission?: string;
	moduleName: string;
	parentServiceContext: (context: IInitializationContext) => IEntitySelection<PT>;
}
