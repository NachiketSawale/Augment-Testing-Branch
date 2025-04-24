/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
export class TimekeepingInterfacesModuleInfo extends BusinessModuleInfoBase {
	public override get internalModuleName(): string {
		return 'timekeeping.interfaces';
	}

	public override get entities(): EntityInfo[] {
		return [];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
}
