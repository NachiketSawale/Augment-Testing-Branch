/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

export class BusinesspartnerSharedModuleInfo extends ModuleInfoBase {

	public static readonly instance = new BusinesspartnerSharedModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'businesspartner.shared';
	}
}
