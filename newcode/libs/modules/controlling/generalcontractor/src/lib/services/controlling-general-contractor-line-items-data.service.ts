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
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

export const CONTROLLING_GENERAL_CONTRACTOR_LINE_ITEMS_DATA_TOKEN = new InjectionToken<ControllingGeneralContractorLineItemsDataService>('controllingGeneralContractorLineItemsDataService');
@Injectable({
    providedIn: 'root'
})
export class ControllingGeneralContractorLineItemsDataService extends DataServiceFlatLeaf<IEstLineItemEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete >{
    private readonly  parentService :ControllingGeneralContractorCostHeaderDataService;

    public constructor(ControllingGeneralContractorCostHeaderDataService: ControllingGeneralContractorCostHeaderDataService) {

        const options: IDataServiceOptions<IEstLineItemEntity>  = {
            apiUrl: 'estimate/main/lineitem',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getLineItemByCondition',
                usePost: true
            },

            roleInfo: <IDataServiceChildRoleOptions<IEstLineItemEntity,IGccCostControlDataEntity, ControllingGeneralContractorCostHeaderComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'GeneralContractorLineItems',
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

    protected override onLoadSucceeded(loaded:IEstLineItemEntity[]):IEstLineItemEntity[] {
        return get(loaded, 'dtos')! as IEstLineItemEntity[];
    }
}