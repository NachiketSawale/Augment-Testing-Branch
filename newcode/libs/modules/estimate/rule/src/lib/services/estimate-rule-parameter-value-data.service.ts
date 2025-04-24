import {
    EstimateRuleParameterValueBaseDataService
} from '@libs/estimate/shared';
import {
    IEstimateRuleParameterBaseEntity,
    IEstimateRuleParameterValueBaseEntity
} from '@libs/estimate/interfaces';
import {inject, Injectable} from '@angular/core';
import {EstRuleParamComplete} from '../model/est-rule-param-complete.class';
import {EstRuleParamValueComplete} from '../model/est-rule-param-value-complete.class';
import {EstimateRuleParameterDataService} from './estimate-rule-parameter-data.service';
import {EstimateRuleDataService} from './estimate-rule-data.service';


@Injectable({
    providedIn: 'root'
})
export class EstimateRuleParameterValueDataService extends EstimateRuleParameterValueBaseDataService<IEstimateRuleParameterValueBaseEntity,EstRuleParamValueComplete, IEstimateRuleParameterBaseEntity,EstRuleParamComplete> {

    private readonly  estimateRuleDataService = inject(EstimateRuleDataService);

    public constructor() {
        super({
            itemName: 'EstRuleParamValue',
            apiUrl:'estimate/rule/parameter/value',
            readEndPoint: 'listbyparam',
            usePost: true,
            canCreate: true,
            canUpdate: true,
            canDelete: true,
            createEndPoint: 'create',
            updateEndPoint: 'update',
            parentDataService:inject(EstimateRuleParameterDataService)
        });
    }

    protected override provideLoadPayload(): object {
        const parent = this.getSelectedParent();
        const  ruleParent = this.estimateRuleDataService.getSelectedEntity();
        if (parent) {
            return {
                MainItemId: parent.Id,
                ValueType: parent.ValueType,
                code: parent.Code,
                filter: false,
                isFilter: '',
                isLookup: true,
                lineItemContextId: ruleParent? ruleParent.MdcLineItemContextFk: null
            };
        } else {
            throw new Error('There should be a selected parent  estimate rule record to load the  estimate rule parameter data');
        }
    }

    public override createUpdateEntity(modified: IEstimateRuleParameterValueBaseEntity | null): EstRuleParamValueComplete {
        const complete = new EstRuleParamValueComplete();
        const  ruleParent = this.estimateRuleDataService.getSelectedEntity();
        const parent = this.getSelectedParent();
        if (modified !== null ) {
            complete.Code = parent ? parent.Code : null;
            complete.MainItemId = parent ? parent.Id : -1;
            complete.MdcLineItemContextFk = ruleParent ? ruleParent.MdcLineItemContextFk:null;
            complete.ValueType = parent ? parent.ValueType : -1;
            complete.parentId = ruleParent ? ruleParent.Id : -1;
        }

        return complete;
    }

    public override registerNodeModificationsToParentUpdate(complete: EstRuleParamComplete, modified: EstRuleParamValueComplete[], deleted: IEstimateRuleParameterValueBaseEntity[]) {
        if (modified && modified.length > 0) {
            complete.EstRuleParamValueToSave = modified;
        }
        if (deleted && deleted.length > 0) {
            complete.EstRuleParamValueToDelete = deleted;
        }
    }

    protected override onLoadSucceeded(loaded: object): IEstimateRuleParameterValueBaseEntity[] {
        if (loaded) {
            return loaded as IEstimateRuleParameterValueBaseEntity[];
        }
        return [];
    }

    protected override onCreateSucceeded(created: IEstimateRuleParameterValueBaseEntity): IEstimateRuleParameterValueBaseEntity {
        return created;
    }

    protected override provideCreatePayload(): object {
        const parent = this.getSelectedParent();
        if (parent) {
            // set rule id
            const selectRuleItem = this.estimateRuleDataService.getSelectedEntity();
            return {
                MainItemId: parent.Id,
                Code: parent.Code,
                ValueType: parent.ValueType,
                parentId: selectRuleItem?.Id,
                MdcLineItemContextFk:selectRuleItem?.MdcLineItemContextFk
            };
        }
        return {};
    }

}