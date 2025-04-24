/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingRecordingModuleInfo } from './lib/model/timekeeping-recording-module-info.class';

export * from './lib/timekeeping-recording.module';
export * from './lib/model/timekeeping-recording-report-entity-info.model';

export * from './lib/timekeeping-recording.module';
export * from './lib/model/timekeeping-recording-report-entity-info.model';
export * from './lib/model/timekeeping-recording-break-entity-info.model';
export * from './lib/model/timekeeping-recording-report-layout.model';
export * from './lib/model/timekeeping-recording-break-layout.model';
export * from './lib/model/timekeeping-recording-report-complete.class';
export * from './lib/model/wizards/timekeeping-recording-wizard.class';
export * from './lib/model/timekeeping-recording-complete.class';
export * from './lib/services/timekeeping-recording-report-validation.service';
export * from './lib/services/timekeeping-recording-break-validation.service';
export * from './lib/services/timekeeping-recording-data.service';

/**
 * Returns the module info object for the timekeeping recording module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return TimekeepingRecordingModuleInfo.instance;
}
