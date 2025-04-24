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
import {Injectable, InjectionToken} from '@angular/core';
import {IGccPackagesEntity} from '../model/entities/gcc-packages-entity.interface';

export const CONTROLLING_GENERAL_CONTRACTOR_PACKAGES_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorPackagesDataService>('controllingGeneralContractorPackagesDataService');
@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorPackagesDataService extends DataServiceFlatLeaf<IGccPackagesEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{
    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IGccPackagesEntity>  = {
            apiUrl: 'Controlling/GeneralContractor/CostControlController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getPrcPackagesByCondition',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IGccPackagesEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'Packages',
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
            IsControllingRoot:false,
            MdcControllingUnitFks: this.parentService.getMdcIds()
        };
    }

    protected override onLoadSucceeded(loaded:IGccPackagesEntity[]):IGccPackagesEntity[] {
        return loaded as IGccPackagesEntity[];
    }
}