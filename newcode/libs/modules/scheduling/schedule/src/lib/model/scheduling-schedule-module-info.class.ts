/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

export class SchedulingScheduleModuleInfo extends ModuleInfoBase {

	public static readonly instance = new SchedulingScheduleModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'scheduling.shared';
	}

//    public override get preloadedTranslations(): string[] {
// 	   return [this.internalModuleName, 'cloud.common','scheduling.schedule'];
//    }

   public override get preloadedTranslations(): string[] {
	return [
		...super.preloadedTranslations,
		'cloud.common',
		'scheduling.schedule'
	];
}


}