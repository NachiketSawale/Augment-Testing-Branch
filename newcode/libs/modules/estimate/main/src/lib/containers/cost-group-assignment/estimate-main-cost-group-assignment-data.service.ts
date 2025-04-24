import {Injectable} from '@angular/core';
import {
    DataServiceHierarchicalNode,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import {IEstimateMainCostGroupAssignment} from '../../model/interfaces/estimate-main-cost-group-assignment.interface';
import {EstMainCostGroupAssignmentComplete} from '../../model/complete/est-main-cost-group-assignment-complete.class';
import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';
import { LineItemBaseComplete} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

@Injectable({ providedIn: 'root' })
export class EstimateMainCostGroupAssignmentDataService extends DataServiceHierarchicalNode<IEstimateMainCostGroupAssignment, EstMainCostGroupAssignmentComplete,IEstLineItemEntity, LineItemBaseComplete>  {
   public constructor(private parentDataService: EstimateMainService) {
        const options: IDataServiceOptions<IEstimateMainCostGroupAssignment> = {
            apiUrl: 'estimate/main/linitem',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'listcostgroup',
                usePost: true,
            },
            roleInfo: <IDataServiceRoleOptions<IEstimateMainCostGroupAssignment>>{
                role: ServiceRole.Leaf,
                itemName: 'CostGroupAssignments',
                parent: parentDataService
            },
        };
        super(options);
    }
    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstimateMainCostGroupAssignment> {

        //TODO: need to refactor, some function may not need anymore
        const fr = get(loaded, 'FilterResult')!;

        return {
            FilterResult: fr,
            dtos: get(loaded, 'dtos')! as IEstimateMainCostGroupAssignment[]
        };
    }
    protected override provideLoadByFilterPayload(): object {
        const filter = {
            filter: '',
            IsShowInLeading: 1,
        };
        return filter;
    }
    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if(parent){
            return {
                PKey1: parent.ProjectFk,
                PKey2:parent.EstHeaderFk,
                PKey3:parent.Id,
                filter: ''
            };
        }else {
            throw new Error('There should be a selected parent qto header record to load the Formula data');
        }
    }
}