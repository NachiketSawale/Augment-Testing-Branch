import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';

import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';
import {
    ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';
import {get} from 'lodash';
import {IGccActualVEntity} from '../model/entities/gcc-actual-ventity.interface';
import {Injectable, InjectionToken} from '@angular/core';

export const CONTROLLING_GENERAL_CONTRACTOR_ACTUALS_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorActualsDataService>('controllingGeneralContractorActualsDataService');
@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorActualsDataService extends DataServiceFlatLeaf<IGccActualVEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{
    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IGccActualVEntity>  = {
            apiUrl: 'Controlling/GeneralContractor/GCActualsController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getActuals',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IGccActualVEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'GeneralContractorActuals',
                parent: ControllingGeneralContractorCostHeaderDataService
            }
        };

        super(options);
        this.parentService = ControllingGeneralContractorCostHeaderDataService;
    }


    protected override provideLoadPayload(): object{
        const parent = this.getSelectedParent();
        return {
            ProjectId: parent?.PrjProjectFk, // to do:Add temporary value by LQ,
            filter:'',
            PageSize:30,
            DueDate:null,
            PageNumber: 0,
            MdcControllingUnitFks: this.parentService.getMdcIds()
        };
    }

    protected override onLoadSucceeded(loaded:IGccActualVEntity[]):IGccActualVEntity[] {
        return get(loaded, 'dtos')! as IGccActualVEntity[];
    }
}