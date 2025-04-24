/*
 * Copyright(c) RIB Software GmbH
 */

import { IMainEntityAccess } from '@libs/platform/common';

/**
 * The untyped base interface for root role.
 */
export interface IRootRoleBase {

	/**
	 * An accessor object for commands executed on the main entity.
	 */
	readonly mainEntityAccess: IMainEntityAccess;
}
