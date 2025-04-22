/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

export class UiDesktopModuleInfo extends ModuleInfoBase {

	public override get internalModuleName(): string {
		return 'ui.desktop';
	}

	public override get preloadedTranslations(): string [] {
		return [
			'cloud.desktop',
		];
	}
}