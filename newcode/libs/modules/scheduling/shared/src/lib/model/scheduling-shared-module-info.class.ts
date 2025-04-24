/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

export class SchedulingSharedModuleInfo extends ModuleInfoBase {

	public static readonly instance = new SchedulingSharedModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'scheduling.shared';
	}
}
