import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {IGccBudgetShiftEntity} from '../model/entities/gcc-budget-shift-entity.interface';
import {IGccCostControlDataEntity} from '../model/entities/gcc-cost-control-data-entity.interface';
import {
    ControllingGeneralContractorCostHeaderComplete
} from '../model/controlling-general-contractor-cost-header-complete.class';
import {Injectable, InjectionToken} from '@angular/core';
import {
    ControllingGeneralContractorCostHeaderDataService
} from './controlling-general-contractor-cost-header-data.service';


export const CONTROLLING_GENERAL_CONTRACTOR_Budget_Shift_EXPENSES_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorBudgetShiftDataService>('controllingGeneralContractorBudgetShiftDataService');


@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorBudgetShiftDataService extends DataServiceFlatLeaf<IGccBudgetShiftEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete > {

    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IGccBudgetShiftEntity>  = {
            apiUrl: 'controlling/generalcontractor/budgetshiftcontroller',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getbudgetshiftlist',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IGccBudgetShiftEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'GeneralContractorBudgetShift',
                parent: ControllingGeneralContractorCostHeaderDataService
            }
        };

        super(options);
        this.parentService = ControllingGeneralContractorCostHeaderDataService;
    }

    protected override onLoadSucceeded(loaded:IGccBudgetShiftEntity[]):IGccBudgetShiftEntity[] {
        return loaded ! as IGccBudgetShiftEntity[];
    }

    protected override provideLoadPayload(): object{
        const parent = this.getSelectedParent();
        return {
            filter:'',
            DueDate:null,
            MdcControllingUnitFk:parent!=null ? Math.abs(parent.Id):-1
        };
    }
}