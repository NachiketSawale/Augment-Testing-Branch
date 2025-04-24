import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IApplicationModule, IApplicationModuleInfo } from '@libs/platform/common';

export const moduleInfo: IApplicationModuleInfo = {
	internalModuleName: 'project.shared',
};

@NgModule({
	imports: [CommonModule],
})
export class ProjectSharedModule implements IApplicationModule {
	public getModuleInfo(): IApplicationModuleInfo {
		return moduleInfo;
	}
}
