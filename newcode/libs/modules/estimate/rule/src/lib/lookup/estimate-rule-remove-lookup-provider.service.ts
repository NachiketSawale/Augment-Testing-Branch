import { inject, Injectable } from '@angular/core';
import { IPrjEstRuleEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
  providedIn: 'root'
})
export class EstimateRuleRemoveLookupProviderService<TEntity extends object> extends UiCommonLookupEndpointDataService<IPrjEstRuleEntity, TEntity> {

	private readonly estimateMainContextService = inject(EstimateMainContextService);
	public constructor() {
		super(
			{
				httpRead: { route: 'estimate/rule/projectestimaterule/', endPointRead: 'getPrjEstRulesOfCurrentEstHeader', usePostForRead: true },
				filterParam: true,
				prepareListFilter: context => {
					return {
						projectFk: this.estimateMainContextService.getSelectedProjectId(),
						estHeaderFks: [this.estimateMainContextService.getSelectedEstHeaderId()],
						filterValue: ''
					};
				}
			},
			{
				uuid: '38916bbf30c341478296d0b8e147e849',
				idProperty: 'Id',
				readonly: false,
				valueMember: 'Id',
				displayMember: '',
				gridConfig: {
					uuid: '38916bbf30c341478296d0b8e147e849',
					columns: [
						{
							id: 'icon', //TODO: waiting for basicsCustomizeRuleIconService service
							model: 'Icon',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityIcon' },
							visible: true,
							readonly: true,
							sortable: true
						},
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityCode' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'desc',
							model: 'DescriptionInfo.Translated',
							type: FieldType.Description,
							label: { key: 'cloud.common.entityDescription' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'comment',
							model: 'Comment',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityComment' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'estevalseqfk', //TODO - waiting for estimateSequenceLookupProcessService service
							model: 'EstEvaluationSequenceFk',
							type: FieldType.Code,
							label: { key: 'estimate.rule.evaluationSequence' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'estruleexecutiontypefk',
							model: 'EstRuleExecutionTypeFk',
							type: FieldType.Integer,
							label: { key: 'estimate.rule.estRuleExecutionType' },
							visible: true,
							readonly: true,
							sortable: true,
							width: 70,
							tooltip: 'EstRuleExecutionType',
							formatterOptions: {
								field: 'EstRuleExecutionTypeFk'
							},
							grouping: {
								title: 'estimate.rule.estRuleExecutionType',
								getter: 'EstRuleExecutionTypeFk',
								aggregators: [],
								aggregateCollapsed: true,
								generic: false
							}
						},
						{
							id: 'estrubriccatfk',
							model: 'BasRubricCategoryFk',
							type: FieldType.Integer,
							label: { key: 'cloud.common.entityBasRubricCategoryFk' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'operand',
							model: 'Operand',
							type: FieldType.Decimal,
							label: { key: 'cloud.common.operand' },
							visible: true,
							readonly: true,
							sortable: true,
						},
						{
							id: 'formfk',
							model: 'FormFk',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityCode' },
							visible: true,
							readonly: true,
							sortable: true,
						}
					]
				},
				dialogOptions: {
					headerText: 'Rule'
				},
				showDialog: true
			}
		);


	}
}
