/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import { ProjectMainDataService} from '@libs/project/shared';
import { CostGroupComplete, EstimateShareCostGroupCatalogDataService } from '@libs/estimate/shared';
import {BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {ISearchPayload} from '@libs/platform/common';
import {IProjectEntity} from '@libs/project/interfaces';

@Injectable({
    providedIn: 'root',
})
export class EstimateMainCostGroupCatalogDataService extends EstimateShareCostGroupCatalogDataService<BasicsCostGroupCatalogEntity, CostGroupComplete,IProjectEntity> {

    public constructor() {
        super(inject(ProjectMainDataService));
    }
    protected override provideLoadByFilterPayload(payload: ISearchPayload): object {

        return {
            ConfigModuleName: '',
            ConfigModuleType: 'project',
            ProjectId:this.selectService.getSelectedEntity()?.Id?? 0
        };
    }
    public override createUpdateEntity(modified: BasicsCostGroupCatalogEntity | null): CostGroupComplete {
        return new CostGroupComplete();
    }
}