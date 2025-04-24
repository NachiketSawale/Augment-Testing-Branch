import {
    IEstimateRuleParameterBaseDataService,
} from '@libs/estimate/shared';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';
import {Injectable, inject} from '@angular/core';
import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';
import * as _ from 'lodash';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
import {ProjectRuleParamComplete} from '../model/project-rule-param-complete.class';
import {ProjectEstimateRulesComplete} from '../model/project-estimate-rule-complete.class';
import {ProjectEstimateRuleDataService} from './project-estimate-rule-data.service';


@Injectable({
    providedIn: 'root'
})
export class ProjectRuleParameterDataService extends IEstimateRuleParameterBaseDataService<IEstimateRuleParameterBaseEntity,ProjectRuleParamComplete, IProjectEstimateRuleEntity,ProjectEstimateRulesComplete> {

    private  readonly  projectEstimateRuleDataService =inject(ProjectEstimateRuleDataService);

    /**
     * Creates an instance of EstimateMainService.
     *
     * @param ProjectEstimateRuleDataService The service for estimate.
     */
    public constructor() {
        super({
            itemName: 'PrjEstRuleParam',
            apiUrl:'estimate/rule/projectestruleparam',
            readEndPoint: 'listbyprjrule',
            usePost: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            createEndPoint: 'create',
            updateEndPoint: 'update',
            parentDataService:inject(ProjectEstimateRuleDataService)
        });
    }


    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        const parentList = this.projectEstimateRuleDataService.getList();
        const ruleIdIds =_.map(parentList, 'Id');
        if (parent) {
            return {
                ruleId:parent.Id,
                ruleIdIds:ruleIdIds
            };
        } else {
            throw new Error('There should be a selected parent  estimate rule record to load the  estimate rule parameter data');
        }
    }

    public override createUpdateEntity(modified: IEstimateRuleParameterBaseEntity | null): ProjectRuleParamComplete {
        const complete = new ProjectRuleParamComplete();
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