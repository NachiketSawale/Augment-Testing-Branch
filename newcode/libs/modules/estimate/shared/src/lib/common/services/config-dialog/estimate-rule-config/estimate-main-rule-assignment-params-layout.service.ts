/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, IGridConfiguration } from '@libs/ui/common';
import { IEstRootAssignmentParamEntity } from '@libs/estimate/interfaces';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainRuleAssignmentParamsLayoutService {
	public static  generateConfig(): IGridConfiguration<IEstRootAssignmentParamEntity> {
		return {
			uuid: '678f6d77c77d4663fe9f1w6eec17aed3',
			columns: [
				{
					id: 'code',
					model: 'Code',
					sortable: true,
					label: {
						text: 'Code',
						key:	'cloud.common.entityCode'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'Code',
						key:	'cloud.common.entityCode'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'desc',
					model: 'DescriptionInfo.Translated',
					sortable: true,
					label: {
						text: 'Description',
						key:	'cloud.common.entityDescription'
					},
					type: FieldType.Description,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'Description',
						key:	'cloud.common.entityDescription'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'estparamgrpfk',
					model: 'EstParameterGroupFk',
					sortable: true,
					label: {
						text: 'Est Parameter Group Fk',
						key:	'basics.customize.estparametergroup'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'Est Parameter Group Fk',
						key:	'basics.customize.estparametergroup'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'valuedetail',
					model: 'ValueDetail',
					sortable: true,
					label: {
						text: 'ValueDetail',
						key:	'basics.customize.valuedetail'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'ValueDetail',
						key:	'basics.customize.valuedetail'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'uomfk',
					model: 'UomFk',
					sortable: true,
					label: {
						text: 'Code',
						key:	'cloud.common.entityCode'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'UomFk',
						key:	'cloud.common.entityUoM'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'parametervalue',
					model: 'ParameterValue',
					sortable: true,
					label: {
						text: 'ParameterValue',
						key:	'basics.customize.parametervalue'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'ParameterValue',
						key:	'basics.customize.parametervalue'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'islookup',
					model: 'IsLookup',
					sortable: true,
					label: {
						text: 'IsLookup',
						key:	'estimate.parameter.isLookup'
					},
					type: FieldType.Boolean,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'IsLookup',
						key:	'estimate.parameter.isLookup'
					},
					width: 100,
					visible: true,
				},
				{
					id: 'defaultvalue',
					model: 'DefaultValue',
					sortable: true,
					label: {
						text: 'DefaultValue',
						key:	'estimate.parameter.defaultValue'
					},
					type: FieldType.Code,
					readonly: true,
					searchable: false,
					tooltip: {
						text: 'DefaultValue',
						key:	'estimate.parameter.defaultValue'
					},
					width: 100,
					visible: true,
				}
			]
		};
	}
}