import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';

import {IGccAddExpenseEntity} from '../model/entities/gcc-add-expense-entity.interface';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';
import {
    ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {Injectable, InjectionToken} from '@angular/core';
import {get} from 'lodash';

export const CONTROLLING_GENERAL_CONTRACTOR_ADDITIONAL_EXPENSES_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorAddExpensesDataService>('controllingGeneralContractorAddExpensesDataService');


@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorAddExpensesDataService extends DataServiceFlatLeaf<IGccAddExpenseEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{


    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IGccAddExpenseEntity>  = {
            apiUrl: 'Controlling/GeneralContractor/GCAdditionalExpensesController',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getAdditionalList',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IGccAddExpenseEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'GeneralContractorAdditionalExpenses',
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

    protected override onLoadSucceeded(loaded:IGccAddExpenseEntity[]):IGccAddExpenseEntity[] {
        return get(loaded, 'dtos')! as IGccAddExpenseEntity[];
    }


}