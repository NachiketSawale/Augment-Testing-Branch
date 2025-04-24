/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import {
    ServiceRole,
    IDataServiceOptions,
    IDataServiceEndPointOptions,
    IDataServiceRoleOptions,
    DataServiceFlatNode
} from '@libs/platform/data-access';
import { ProjectEntity, ProjectMainDataService } from '@libs/project/shared';
import { IProjectMaterialComplate } from '@libs/project/interfaces';

import {IPrjMaterialEntity, IProjectComplete} from '@libs/project/interfaces';
//import {ProjectMaterialPortionDataService} from './project-material-portion-data.service';
import {
    BasicsMaterialPortionDataService
} from '@libs/basics/material';
import { IBasicsPriceConditionHeaderService } from '@libs/basics/interfaces';
import { Subject } from 'rxjs';

export const PROJECT_MATERIAL_DATA_TOKEN = new InjectionToken<ProjectMaterialDataService>('projectMaterialDataToken');

@Injectable({
    providedIn: 'root',
})
export class ProjectMaterialDataService extends DataServiceFlatNode<IPrjMaterialEntity, IProjectMaterialComplate, ProjectEntity, IProjectComplete> implements IBasicsPriceConditionHeaderService<IPrjMaterialEntity, IProjectMaterialComplate>{
    private readonly projectMainDataService = inject(ProjectMainDataService);
    //private readonly prjMaterialPortionDataService = inject(ProjectMaterialPortionDataService);
    private readonly masterPortionDataService = inject(BasicsMaterialPortionDataService);

    public constructor(projectMainDataService: ProjectMainDataService) {
        const options: IDataServiceOptions<IPrjMaterialEntity> = {
            apiUrl: 'project/material',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listMaterialByFilter',
                usePost: true
            },
            roleInfo: <IDataServiceRoleOptions<IPrjMaterialEntity>>{
                role: ServiceRole.Node,
                itemName: 'PrjMaterial',
                parent: projectMainDataService,
            }
        };

        super(options);
    }

    public override createUpdateEntity(modified: IPrjMaterialEntity | null): IProjectMaterialComplate {
        return {
            Id: modified ? modified.Id : 0,
            PrjMaterial: modified
        };
    }

    protected override provideLoadPayload(): object {
        const projectId = this.projectMainDataService.getSelection()[0];

        return {
            ProjectId: projectId.Id,
            jobIds: [],
            InitFilterMenuFlag: false
        };
    }

    protected override  onLoadSucceeded(loaded: object): IPrjMaterialEntity[] {
        if(loaded && 'dtos' in loaded){

            return loaded.dtos as IPrjMaterialEntity[];
        }
        return [];
    }

    public calculateModule?: string = undefined;

    private costCalc(selectedItem: IPrjMaterialEntity, model: string) {
        selectedItem.Cost = selectedItem.ListPrice * (100 - selectedItem.Discount) / 100 + (selectedItem.Charges) + (selectedItem.PriceExtra);

        // todo material portion service import will occur circular dependency
        let materialPortionEstimatePrice = 0; //todo wait Iron enhance this function this.prjMaterialPortionDataService.getEstimatePrice ();
        let materialPortionDayWorkRate = 0; //todo wait Iron enhance this function this.prjMaterialPortionDataService.getDayWorkRate ();

        if (this.calculateModule === 'estimate') {
            materialPortionEstimatePrice = this.masterPortionDataService.getEstimatePrice ();
            materialPortionDayWorkRate = this.masterPortionDataService.getDayWorkRate ();
        }

        if (model === 'IsEstimatePrice') {
            selectedItem.EstimatePrice = selectedItem.Cost;
            selectedItem.EstimatePrice = selectedItem.EstimatePrice + materialPortionEstimatePrice;
        } else if (model === 'IsDayWorkRate') {
            selectedItem.DayWorkRate = selectedItem.Cost;
            selectedItem.DayWorkRate = selectedItem.DayWorkRate + materialPortionDayWorkRate;
        } else {
            // Estimate price  is always set to COST whenever COST changes
            selectedItem.EstimatePrice = selectedItem.Cost;
            selectedItem.DayWorkRate = selectedItem.Cost;

            selectedItem.EstimatePrice = selectedItem.EstimatePrice + materialPortionEstimatePrice;
            selectedItem.DayWorkRate = selectedItem.DayWorkRate + materialPortionDayWorkRate;
        }

        this.setModified(selectedItem);
        // todo: seens no this function in sub container
        // service.rowRefresh(selectedItem);
    }

    public recalculateCost (item: IPrjMaterialEntity, value: number | null, model: string) {
        const selectedItem = this.getSelectedEntity();
        if(selectedItem){
           this.costCalc(selectedItem, model);
        }
    }

    public override registerByMethod(): boolean {
        return true;
    }

    public override registerNodeModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IProjectMaterialComplate[], deleted: IPrjMaterialEntity[]) {
        if(modified && modified.length > 0){
           parentUpdate.PrjMaterialToSave = modified;
        }
    }

	/**
	 * Emitter for priceCondition change
	 */
	public priceConditionChanged$ = new Subject<number | null>();
}
