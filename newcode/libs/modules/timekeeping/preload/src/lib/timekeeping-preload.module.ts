import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { TimekeepingPreloadInfo } from './model/timekeeping-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class TimekeepingPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(TimekeepingPreloadInfo.instance);
	}
}
