/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

export class EstimateSharedModuleInfo extends ModuleInfoBase {

	public static readonly instance = new EstimateSharedModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'estimate.shared';
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['project.structures']);
	}
}
