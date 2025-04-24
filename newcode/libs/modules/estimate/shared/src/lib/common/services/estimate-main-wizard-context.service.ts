/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {EstimateMainResourceForm} from '../enums/estimate-main-resource-form.enum';

@Injectable({
    providedIn: 'root',
})
export class EstimateMainWizardContextService{
    private curModuleName?: string;
    public setConfig(moduleName: string){
        this.curModuleName = moduleName;
    }

    public getConfig(){
        switch (this.curModuleName){
            case 'estimate.assemblies':
                return EstimateMainResourceForm.EstimateAssemblyResource;
            case 'estimate.main':
                return EstimateMainResourceForm.EstimateMainResource;
            case 'project.assemblies':
                return EstimateMainResourceForm.ProjectAssemblyResource;
            default:
                return EstimateMainResourceForm.EstimateMainResource;
        }
    }
}