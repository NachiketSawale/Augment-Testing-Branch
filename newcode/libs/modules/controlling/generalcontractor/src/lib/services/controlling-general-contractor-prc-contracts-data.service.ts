import {IControllingCommonPrcContractEntity} from '@libs/controlling/common';
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
import {Injectable, InjectionToken} from '@angular/core';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';

export const CONTROLLING_GENERAL_CONTRACTOR_PRC_CONTRACTS_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorPrcContractsDataService>('controllingGeneralContractorPrcContractsDataService');
@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorPrcContractsDataService extends DataServiceFlatLeaf<IControllingCommonPrcContractEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete > {
    private readonly parentService: ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IControllingCommonPrcContractEntity> = {
            apiUrl: 'Controlling/GeneralContractor/PrcContractsController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getPrcContractsByCondition',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IControllingCommonPrcContractEntity, IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'PrcContracts',
                parent: ControllingGeneralContractorCostHeaderDataService
            }
        };

        super(options);
        this.parentService = ControllingGeneralContractorCostHeaderDataService;
    }


    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        return {
            ProjectId: parent?.PrjProjectFk, // to do:Add temporary value by LQ,
            filter: '',
            PageSize: 30,
            DueDate: null,
            PageNumber: 0,
            IsControllingRoot: false,
            MdcControllingUnitFks: this.parentService.getMdcIds()
        };
    }

    protected override onLoadSucceeded(loaded: IControllingCommonPrcContractEntity[]): IControllingCommonPrcContractEntity[] {
        return loaded as IControllingCommonPrcContractEntity[];
    }
}