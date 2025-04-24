import {
    EstimateRuleParameterValueBaseDataService
} from '@libs/estimate/shared';
import {
    IEstimateRuleParameterBaseEntity,
    IEstimateRuleParameterValueBaseEntity
} from '@libs/estimate/interfaces';
import {inject, Injectable} from '@angular/core';
import {ProjectRuleParamValueComplete} from '../model/project-rule-param-value-complete.class';
import {ProjectRuleParamComplete} from '../model/project-rule-param-complete.class';
import {ProjectRuleParameterDataService} from './project-rule-parameter-data.service';




@Injectable({
    providedIn: 'root'
})
export class ProjectRuleParameterValueDataService extends EstimateRuleParameterValueBaseDataService<IEstimateRuleParameterValueBaseEntity,ProjectRuleParamValueComplete, IEstimateRuleParameterBaseEntity,ProjectRuleParamComplete> {

    private readonly  projectRuleParameterDataService = inject(ProjectRuleParameterDataService);

    public constructor() {
        super({
            itemName: 'PrjRuleParamValue',
            apiUrl:'estimate/rule/projectestruleparam/value',
            readEndPoint: 'listbyprjparam',
            usePost: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            createEndPoint: 'create',
            updateEndPoint: 'update',
            parentDataService:inject(ProjectRuleParameterDataService)
        });
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
       const  ruleParent = this.projectRuleParameterDataService.getSelectedEntity();
        if (parent) {
           const param= {
                PrjProjectFk: ruleParent?.PrjProjectFk, //1008350
                ValueType: parent.ValueType,  //3
                code:parent.Code,  //'TXT2'
                filter: '',
                isFilter: false,
                isLookup: true,
                lineItemContextId:ruleParent?.MdcLineItemContextFk
            };
           return  param;
        } else {
            throw new Error('There should be a selected parent  estimate rule record to load the  estimate rule parameter data');
        }
    }

    public override createUpdateEntity(modified: IEstimateRuleParameterValueBaseEntity | null): ProjectRuleParamValueComplete {
        const complete = new ProjectRuleParamValueComplete();
        const  ruleParent = this.projectRuleParameterDataService.getSelectedEntity();
        const parent = this.getSelectedParent();
        if (modified !== null ) {
            complete.Code = parent?.Code;
            complete.PrjProjectFk = ruleParent?.PrjProjectFk ;
            complete.MdcLineItemContextFk = ruleParent?.MdcLineItemContextFk;
            complete.ValueType = parent?.ValueType;
            complete.parentId = ruleParent?.Id;
        }

        return complete;
    }

    public override registerNodeModificationsToParentUpdate(complete: ProjectRuleParamComplete, modified: ProjectRuleParamValueComplete[], deleted: IEstimateRuleParameterValueBaseEntity[]) {
        if (modified && modified.length > 0) {
            complete.PrjRuleParamValueToSave = modified;
        }
        if (deleted && deleted.length > 0) {
            complete.PrjRuleParamValueToDelete = deleted;
        }
    }

    protected override onCreateSucceeded(created: IEstimateRuleParameterValueBaseEntity): IEstimateRuleParameterValueBaseEntity {
        return created;
    }

    protected override onLoadSucceeded(loaded: object): IEstimateRuleParameterValueBaseEntity[] {
        if (loaded) {
            return loaded as IEstimateRuleParameterValueBaseEntity[];
        }
        return [];
    }

    protected override provideCreatePayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            // set rule id
            const selectRuleItem = this.projectRuleParameterDataService.getSelectedEntity();
            return {
                MainItemId: parent.Id,
                Code: parent.Code,
                ValueType: parent.ValueType,
                parentId: selectRuleItem?.Id,
                PrjProjectFk: selectRuleItem?.PrjProjectFk,
                MdcLineItemContextFk:selectRuleItem?.MdcLineItemContextFk
            };
        }
        return {};
    }

}