import {EstimateRuleParameterBaseComplete} from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import * as _ from 'lodash';
import {Injectable} from '@angular/core';
import {
    DataServiceFlatLeaf,
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import {ProjectEntity} from '@libs/project/shared';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';

@Injectable({ providedIn: 'root' })
export class EstimateLineItemParametersDataService extends DataServiceFlatLeaf<IEstimateRuleParameterBaseEntity,IEstLineItemEntity, EstimateRuleParameterBaseComplete>{
    public constructor(private EstimateMainService: EstimateMainService) {
        const options: IDataServiceOptions<IEstimateRuleParameterBaseEntity> = {
            apiUrl: 'estimate/main/lineitem',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getlineitemparameter',
                usePost: true
            },
            roleInfo: <IDataServiceChildRoleOptions<IEstimateRuleParameterBaseEntity, ProjectEntity, EstimateRuleParameterBaseComplete>>(<unknown>{
                role: ServiceRole.Leaf,
                itemName: 'EstRuleParam',
                parent: EstimateMainService
            }),
        };

        super(options);
    }

    protected override onLoadSucceeded(loaded: object): IEstimateRuleParameterBaseEntity[] {
        const items = _.get(loaded, 'parameters');
        if (items) {
            return items as IEstimateRuleParameterBaseEntity[];
        }
        return [];
    }

    protected override provideLoadPayload(): object {
        const parentSelection = this.getSelectedParent();
        if (parentSelection) {
            return {
                Dto: parentSelection,
                ParamLevel: 3,
                filter:''
            };
        } else {
            throw new Error('There should be a selected parent catalog to load the paramenter');
        }
    }


    public  createUpdateEntity(modified: IEstimateRuleParameterBaseEntity | null): EstimateRuleParameterBaseComplete {
        return new EstimateRuleParameterBaseComplete();
    }
}