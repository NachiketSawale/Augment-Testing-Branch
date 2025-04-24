import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { LogisticPreloadInfo } from './model/logistic-preload-info.class';


@NgModule({
	imports: [CommonModule],
})
export class LogisticPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(LogisticPreloadInfo.instance);
	}
}
