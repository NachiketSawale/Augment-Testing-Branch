/*
 * Copyright(c) RIB Software GmbH
 */

import {BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {CostGroupComplete, EstimateShareCostGroupCatalogDataService} from '@libs/estimate/shared';
import {inject, Injectable} from '@angular/core';
import {ISearchPayload} from '@libs/platform/common';
import {QtoMainHeaderGridDataService} from '../header/qto-main-header-grid-data.service';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
@Injectable({
    providedIn: 'root',
})
export class QtoMainCostGroupCatalogDataService extends EstimateShareCostGroupCatalogDataService<BasicsCostGroupCatalogEntity, CostGroupComplete,IQtoMainHeaderGridEntity> {
    /**
     * The constructor
     * @param dataService
     */
    public constructor() {
        super(inject(QtoMainHeaderGridDataService));
    }
    protected override provideLoadByFilterPayload(payload: ISearchPayload): object {

        return {
            ConfigModuleName: '',
            ConfigModuleType: 'project',
            ProjectId:this.selectService.getSelectedEntity()?.ProjectFk?? 0
        };
    }
    public override createUpdateEntity(modified: BasicsCostGroupCatalogEntity | null): CostGroupComplete {
        return new CostGroupComplete();
    }
}