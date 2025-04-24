/*
 * Copyright(c) RIB Software GmbH
 */
import { Component } from '@angular/core';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ColumnDef, FieldType, GridComponent, IGridConfiguration, UiCommonModule, createLookup } from '@libs/ui/common';

interface IEstRuleParam{ //TODO: waiting for PRJ_EST_RULE interface from Estimate/Rule module
	Id: number,
	Select: boolean
	Code: string,
	Description: string,
	EstParameterGroupFk: number,
	BasUomFk: number,
	ValueDetail: number,
	EstRuleParamValueFk: number,
	IsLookup: boolean,
	DefaultValue: number,
	EstRuleFk: number
}

@Component({
  selector: 'estimate-main-param-remove-grid',
  standalone: true,
  imports: [UiCommonModule, GridComponent],
  templateUrl: './estimate-main-param-remove-grid.component.html'
})

/**
 * EstimateMainParamRemoveGridComponent this component is used for Rule Parameter for Rule Remove wizard
 */
export class EstimateMainParamRemoveGridComponent {

	//TODO: waiting for estimateRuleComplexLookupCommonService for column names
	/**
	 * columns: stores columns informaation.
	 */
	private columns: ColumnDef<IEstRuleParam>[] = [
		{
			id: 'select',
			model: '',
			label: {
				text: 'select'
			},
			type: FieldType.Boolean,
			required: true,
			visible: true,
			sortable: true,
			searchable: true
		},
		{
			id: 'code',
			model: '',
			label: {
				text: 'code'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'description',
			model: '',
			label: {
				text: 'Description'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'estParameterGroupFk',
			model: 'estParameterGroupFk',
			label: {
				key: 'estimate.rule.estParameterGroupFk',
				text: 'Estimate Parameter Group'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'basUomFk',
			model: '',
			label: {
				text: 'UoM',
				key: 'cloud.common.entityUoM'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUomLookupService
			}),
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'valueDetail',
			model: 'valueDetail',
			label: {
				key: 'estimate.rule.valueDetail',
				text: 'Default Value Detail'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'estRuleParamValueFk',
			model: 'estRuleParamValueFk',
			label: {
				key: 'estimate.parameter.estRuleParamValueFk',
				text: 'Item Value'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'isLookup',
			model: 'isLookup',
			label: {
				key: 'estimate.rule.detailParameterIsLookup',
				text: 'Is Lookup'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'defaultValue',
			model: '',
			label: {
				key: 'estimate.rule.defaultValue',
				text: 'Default Value'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		},
		{
			id: 'ProjectEstRuleFk',
			model: '',
			label: {
				key: 'estimate.parameter.prjEstRule',
				text: 'Project Rule'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true,
			readonly: true
		}
	];

	/**
	 * gridConfig: stores configuration for grid.
	 */
	public gridConfig: IGridConfiguration<IEstRuleParam>;

	/**
	 *
	 */
	public constructor() {
		this.gridConfig = {
			uuid: '424c925727a24c5ab6d98f7ea81625db',
			columns: this.columns,
			skipPermissionCheck: false
		};
	}

}
