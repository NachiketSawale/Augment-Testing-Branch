import {
    IEstimateRuleParameterBaseDataService,
} from '@libs/estimate/shared';
import {
    EstimateRuleBaseComplete,
    IEstimateRuleParameterBaseEntity,
    IEstRuleEntity
} from '@libs/estimate/interfaces';
import {EstimateRuleDataService} from './estimate-rule-data.service';
import {inject, Injectable} from '@angular/core';
import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';
import {EstRuleParamComplete} from '../model/est-rule-param-complete.class';

@Injectable({
    providedIn: 'root'
})
export class EstimateRuleParameterDataService extends IEstimateRuleParameterBaseDataService<IEstimateRuleParameterBaseEntity,EstRuleParamComplete, IEstRuleEntity,EstimateRuleBaseComplete> {
    /**
     * Creates an instance of EstimateMainService.
     *
     * @param estimateRuleDataService The service for estimate.
     */
    public constructor() {
        super({
            itemName: 'EstRuleParam',
            apiUrl:'estimate/rule/parameter',
            readEndPoint: 'list',
            usePost: false,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            createEndPoint: 'create',
            updateEndPoint: 'update',
            parentDataService:inject(EstimateRuleDataService)
        });
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                MainItemId: parent.Id,
            };
        } else {
            throw new Error('There should be a selected parent  estimate rule record to load the  estimate rule parameter data');
        }
    }

    public override createUpdateEntity(modified: IEstimateRuleParameterBaseEntity | null): EstRuleParamComplete {
        const complete = new EstRuleParamComplete();
        if (modified !== null) {
            complete.PKey1 = modified.EstRuleFk;
        }

        return complete;
    }

    protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IEstimateRuleParameterBaseEntity> {
        return {
            FilterResult: {
                ExecutionInfo: '',
                RecordsFound: 0,
                RecordsRetrieved: 0,
                ResultIds: [],
            },

            dtos: get(loaded, 'Main')! as IEstimateRuleParameterBaseEntity[]
        };
    }

    protected override provideCreatePayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            return {
                PKey1:parent.Id
            };
        }
        return {};
    }

    protected override onCreateSucceeded(created: IEstimateRuleParameterBaseEntity): IEstimateRuleParameterBaseEntity {
        return created;
    }
}