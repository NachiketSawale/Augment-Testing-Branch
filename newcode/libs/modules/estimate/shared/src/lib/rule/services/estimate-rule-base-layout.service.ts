/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
    IEstimateRuleBaseLayoutServiceInterface
} from './estimate-rule-base-layout.service.interface';
import {EstimateRuleType, IEstRuleEntity} from '@libs/estimate/interfaces';



@Injectable({
    providedIn: 'root',
})
export class EstimateRuleBaseLayoutService<T extends IEstRuleEntity> implements IEstimateRuleBaseLayoutServiceInterface<T> {

    protected commonLayout(ruleType: number): ILayoutConfiguration<IEstRuleEntity> {
        const ruleLayout = {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'cloud.common.entityProperties',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'Icon',
                        'Code',
                        'DescriptionInfo',
                        'BasRubricCategoryFk',
                        'EstRuleExecutionTypeFk',
                        'EstEvaluationSequenceFk',
                        'Comment',
                        'Remark',
                        'Sorting'
                    ]
                }
            ],
            'labels': {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'Icon': {
                        'key': 'entityIcon',
                        'text': 'Icon'
                    },
                    'Code': {
                        'key': 'entityCode',
                        'text': 'Code'
                    },
                    'DescriptionInfo': {
                        'key': 'entityDescription',
                        'text': 'Description'
                    },
                    'BasRubricCategoryFk': {
                        'key': 'entityBasRubricCategoryFk',
                        'text': 'Category'
                    },
                    'Comment': {
                        'key': 'entityComment',
                        'text': 'Comment'
                    },
                    'Remark': {
                        'key': 'entityRemark',
                        'text': 'Remark'
                    },
                    'Sorting': {
                        'key': 'entitySorting',
                        'text': 'Sorting'
                    },
                    'IsLive': {
                        'key': 'entityIsLive',
                        'text': 'Active'
                    },
                    'IsForEstimate': {
                        'key': 'isForEstimate',
                        'text': 'Is For Estimate'
                    },
                    'IsForBoq': {
                        'key': 'isForBoq',
                        'text': 'Is For BoQ'
                    },
                    'Operand': {
                        'key': 'operand',
                        'text': 'Operand'
                    }
                }),
                ...prefixAllTranslationKeys('estimate.rule.', {
                    'EstRuleExecutionTypeFk': {
                        'key': 'estRuleExecutionType',
                        'text': 'Est Rule Execution Type'
                    },
                    'EstEvaluationSequenceFk': {
                        'key': 'evaluationSequence',
                        'text': 'Evaluation Sequence'
                    },
                    'IsForEstimate': {
                        'key': 'isForEstimate',
                        'text': 'Is For Estimate'
                    },
                    'FormFk': {
                        'key': 'formFk',
                        'text': 'User Form'
                    }
                }),
            },
            //base overLoad will do for next
            'overloads':{
            }
        };

        if(ruleType !== EstimateRuleType.BaseRule){
            switch (ruleType) {
                case EstimateRuleType.MasterRule:
                    ruleLayout.groups[0].attributes.push('IsLive','IsForBoq','IsForEstimate','Operand','FormFk');
                    break;
                case EstimateRuleType.ProjectRule:
                    ruleLayout.groups[0].attributes.push('IsForBoq','IsForEstimate','Operand','FormFk');
                    break;
                case EstimateRuleType.EstimateRule:
                    ruleLayout.groups[0].attributes.push('FormFk');
                    break;
            }
        }

        return ruleLayout;
    }

    /**
     * Generate layout configuration
     */
    public async generateLayout(ruleType: number): Promise<ILayoutConfiguration<T>> {
        return this.commonLayout(ruleType) as ILayoutConfiguration<T>;
    }

}