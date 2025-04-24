import {ISalesContractsEntity} from '../model/entities/gcc-sales-contracts-entity.interface';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';
import {
    ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {Injectable, InjectionToken} from '@angular/core';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';
import {
    DataServiceFlatLeaf, IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    ServiceRole
} from '@libs/platform/data-access';


export const CONTROLLING_GENERAL_CONTRACTOR_SALES_CONTRACTS_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorSalesContractsDataService>('controllingGeneralContractorSalesContractsDataService');

@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorSalesContractsDataService extends DataServiceFlatLeaf<ISalesContractsEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{


    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<ISalesContractsEntity>  = {
            apiUrl: 'sales/contract',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getlistforgcsalescontract',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<ISalesContractsEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'salesContractsDataService',
                parent: ControllingGeneralContractorCostHeaderDataService
            }
        };

        super(options);
        this.parentService = ControllingGeneralContractorCostHeaderDataService;
    }


    protected override provideLoadPayload(): object{
        const parent = this.getSelectedParent();
        return {
            ProjectId: parent?.PrjProjectFk
        };
    }

    protected override onLoadSucceeded(loaded:ISalesContractsEntity[]):ISalesContractsEntity[] {
        return loaded ! as ISalesContractsEntity[];
    }
}