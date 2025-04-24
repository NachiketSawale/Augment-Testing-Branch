/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCostCodesPriceListForJobComponent } from './components/project-costcodes-price-list-for-job/project-costcodes-price-list-for-job.component';
import { IApplicationModule, IApplicationModuleInfo } from '@libs/platform/common';
export const moduleInfo: IApplicationModuleInfo = {
    internalModuleName: 'project.costcodes',
};
@NgModule({
	imports: [CommonModule,ProjectCostCodesPriceListForJobComponent],
	declarations: []
})

export class ProjectCostcodesModule implements IApplicationModule {
    public getModuleInfo(): IApplicationModuleInfo {
        return moduleInfo;
    }
}

