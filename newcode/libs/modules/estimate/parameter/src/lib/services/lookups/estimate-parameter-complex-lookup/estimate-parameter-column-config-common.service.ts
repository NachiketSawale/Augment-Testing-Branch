/*
 * Copyright(c) RIB Software GmbH
*/

import { Injectable } from '@angular/core';
import { EstimateRuleParameterConstant } from '@libs/estimate/rule';
import {ColumnDef, createLookup, FieldType} from '@libs/ui/common';
import { IEstimateParameter, IEstimateParameterColumn } from '../../../model/estimate-parameter.interface';

@Injectable({
    providedIn: 'root'
})

/**
 * EstimateParameterColumnConfigCommonService is the column config service for param complex lookup
 */
export class EstimateParameterColumnConfigCommonService {

    public lookupColumns : ColumnDef<object>[] = [
            {
                id: 'code',
                model: 'Code',
                type: FieldType.Code,
                label: {
                    text: 'Code',
                    key: 'cloud.common.entityCode'
                },
                visible: true,
                sortable: false,
                width: 70,
                readonly: true,
                //Todo : check grouping and editor options is required
              /*  grouping: {
                    title: 'cloud.common.entityCode',
                    getter: 'Code',
                    aggregators: [],
                    aggregateCollapsed: true
                },
                editorOptions: {
                    directive: 'basics-common-limit-input',//Todo : change the directive to service
                    validKeys: {
                        regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
                    }
                }*/
            },
            {
                id: 'desc',
                model: 'DescriptionInfo.Translated',
                type: FieldType.Translation,
                label: {
                    text: 'Description',
                    key: 'cloud.common.entityDescription'
                },
                visible: true,
                sortable: false,
                width: 120,
                readonly: true,
               // maxLength: 255,    //Todo : check max length
               // toolTip: 'Description',
               // editor : 'translation',
               //  formatter: 'translation',
                //Todo : check grouping is required
             /*  grouping: {
                    title: 'cloud.common.entityDescription',
                    getter: 'Description',
                    aggregators: [],
                    aggregateCollapsed: true
                }*/
            },
            {
             id: 'sourceId',
            // field: 'SourceId',
            // name: 'Source',
             width: 120,
             type: FieldType.Lookup,
             readonly: true,
             lookupOptions: createLookup({
                     // dataServiceToken: BasicsCostCodesPriceVersionLookupService
                 }),
             sortable: false,
              //  toolTip: 'Source',
           //  name$tr$: 'estimate.parameter.source',
             required: false,
             //sorting : 10,
             //editor: 'lookup',
             //editorOptions: {
              //   lookupDirective: 'estimate-main-param-source-lookup'
            // },
            // formatter: 'lookup',
             //formatterOptions: {
             //    dataServiceName: 'estimateMainParamSourceLookupDataService',
               //  displayMember: 'DescriptionInfo.Translated'
             //}
         }];

    public getAllColumns() {
        const addCols = [
            {
                id: 'estparamgrpfk',
                field: 'EstParameterGroupFk',
                name: 'EstParameterGroupFk',
                width: 120,
                toolTip: 'Est Parameter Group Fk',
                type: FieldType.Lookup, //Todo : check the lookup type here or integer
                editor: 'lookup',
                formatter: 'lookup',
                name$tr$: 'basics.customize.estparametergroup',
                grouping: {
                    title: 'basics.customize.estparametergroup',
                    getter: 'EstParameterGroupFk',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            },
            {
                id: 'valuedetail',
                field: 'ValueDetail',
                name: 'ValueDetail',
                width: 120,
                toolTip: 'ValueDetail',
                type: FieldType.Comment,
                editor: 'comment',
                formatter: function(row: number, cell: number, value: string | null) : void {
							//return angular.uppercase(value);
						} ,
                name$tr$: 'basics.customize.valuedetail',
                grouping: {
                    title: 'basics.customize.valuedetail',
                    getter: 'ValueDetail',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            },
            {
                id: 'uomfk',
                field: 'UomFk',
                name: 'UomFk',
                width: 120,
                toolTip: 'UomFk',
                editor: 'integer',
                formatter: 'integer',
                type: FieldType.Integer, //Todo : Check type here lookup or not
                name$tr$: 'cloud.common.entityUoM',
                grouping: {
                    title: 'cloud.common.entityUoM',
                    getter: 'UomFk',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            },
            {
                id: 'parametervalue',
                field: 'ParameterValue',
                name: 'ParameterValue',
                width: 120,
                toolTip: 'ParameterValue',
                editor: 'dynamic',
                formatter: 'dynamic', //Todo : check the types and below domains
                name$tr$: 'basics.customize.parametervalue',
                grouping: {
                    title: 'basics.customize.parametervalue',
                    getter: 'ParameterValue',
                    aggregators: [],
                    aggregateCollapsed: true
                },
                domain: function (item:IEstimateParameter, column:IEstimateParameterColumn) {
                    let domain:string;
                    if (item.ValueType === EstimateRuleParameterConstant.TextFormula) {
                        domain = 'directive';
                        column.Field = 'ParameterText';
                        column.ValueText = null;
                        column.EditorOptions = {
                            lookupDirective: 'parameter-value-type-text-formula-lookup',
                            lookupType: 'ParamValueTypeTextFormulaLookup',
                            dataServiceName: 'estimateMainParameterValueLookupService',
                            valueMember: 'Id',
                            displayMember: 'Value',
                            isTextEditable: true,
                            showClearButton: true
                        };

                        column.FormatterOptions = {
                            lookupType: 'ParamValueTypeTextFormulaLookup',
                            dataServiceName: 'estimateMainParameterValueLookupService',
                            displayMember: 'Value',
                            field: 'ParameterText',
                            isTextEditable: true,
                            multiSelect: true
                        };
                    } else if (item.ValueType === EstimateRuleParameterConstant.Boolean) {
                        domain = 'boolean';
                        column.DefaultValue = false;
                        column.Field = 'ParameterValue';
                        column.EditorOptions = null;
                        column.FormatterOptions = null;
                        column.Regex = null;
                    } else if (item.ValueType === EstimateRuleParameterConstant.Text) {
                        domain = 'description';
                        column.DefaultValue = 0;
                        column.Field = 'ParameterText';
                        column.EditorOptions = null;
                        column.FormatterOptions = null;
                        column.MaxLength = 255;
                        column.Regex = null;
                    } else {   // means the valueType is Decimal2 or the valueType is Undefined
                        domain = 'quantity';
                        column.DefaultValue = null;
                        column.Field = 'ParameterValue';
                        column.EditorOptions = {decimalPlaces: 3};
                        column.FormatterOptions = {decimalPlaces: 3};
                        column.Regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
                    }

                    return domain;
                }
            },
            {
                id: 'defaultvalue',
                field: 'DefaultValue',
                name: 'DefaultValue',
                width: 120,
                toolTip: 'DefaultValue',
                editor: 'dynamic',
                formatter: 'dynamic', //Todo : check the types and below domains
                name$tr$: 'estimate.parameter.defaultValue',
                grouping: {
                    title: 'basics.customize.defaultValue',
                    getter: 'DefaultValue',
                    aggregators: [],
                    aggregateCollapsed: true
                },
                domain: function (item:IEstimateParameter, column:IEstimateParameterColumn) {
                    let domain:string;
                    if (item.ValueType === EstimateRuleParameterConstant.Boolean) {

                        domain = 'boolean';
                        column.DefaultValue = false;
                        column.Field = 'DefaultValue';
                        column.EditorOptions = null;
                        column.FormatterOptions = null;
                        column.Regex = null;
                        column.Readonly = true;

                    } else if (item.ValueType === EstimateRuleParameterConstant.Text || item.ValueType === EstimateRuleParameterConstant.TextFormula) {

                        domain = 'description';
                        column.DefaultValue = null;
                        column.Field = 'ValueText';
                        column.EditorOptions = null;
                        column.FormatterOptions = null;
                        column.MaxLength = 255;
                        column.Regex = null;
                        column.Readonly = true;

                    } else {   // means the valueType is Decimal2 or the valueType is Undefined

                        domain = 'quantity';
                        column.DefaultValue = null;
                        column.Field = 'DefaultValue';
                        column.EditorOptions = {decimalPlaces: 3};
                        column.FormatterOptions = {decimalPlaces: 3};
                        column.Regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
                        column.Readonly = true;
                    }
                    return domain;
                }
            },
            {
                id: 'valuetype',
                field: 'ValueType',
                name: 'Value Type',
                width: 120,
                toolTip: 'Value Type',
                type: FieldType.Lookup, //Todo: change lookup service here
                name$tr$: 'estimate.parameter.valueType',
                grouping: {
                    title: 'basics.customize.valueType',
                    getter: 'ValueType',
                    aggregators: [],
                    aggregateCollapsed: true
                },
                required: false,
                editor: 'lookup',
                editorOptions: {
                    lookupDirective: 'estimate-rule-parameter-type-lookup'
                },
                formatter: 'lookup',
                formatterOptions: {
                    lookupType: 'ParameterValueType',
                    dataServiceName: 'estimateRuleParameterTypeDataService',
                    displayMember: 'Description'
                }
            },
            {
                id: 'islookup',
                field: 'IsLookup',
                name: 'IsLookup',
                width: 120,
                toolTip: 'IsLookup',
                editor: 'boolean',
                formatter: 'boolean',
                name$tr$: 'estimate.parameter.isLookup',
                type: FieldType.Boolean,
                grouping: {
                    title: 'basics.customize.isLookup',
                    getter: 'IsLookup',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            },
            {
                id: 'estruleparamvaluefk',
                field: 'EstRuleParamValueFk',
                name: 'Item Value',
                width: 100,
                toolTip: 'Item Value',
                name$tr$: 'estimate.parameter.estRuleParamValueFk',
                required: false,
                type: FieldType.Lookup, //Todo: change lookup service here
                editor: 'lookup',
                editorOptions: {
                    lookupDirective: 'estimate-main-parameter-value-lookup'
                },
                formatter: 'lookup',
                formatterOptions: {
                    lookupType: 'EstMainParameterValues',
                    dataServiceName: 'estimateMainParameterValueLookupService',
                    displayMember: 'DescriptionInfo.Translated'
                },
                grouping: {
                    title: 'estimate.parameter.estRuleParamValueFk',
                    getter: 'EstRuleParamValueFk',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            },
            {
                id: 'prjEstRuleFk',
                field: 'ProjectEstRuleFk',
                name: 'Project Rule',
                width: 120,
                toolTip: 'Project Rule',
                name$tr$: 'estimate.parameter.prjEstRule',
                readonly: true,
                type: FieldType.Integer, //Todo : Check type here lookup or not
                grouping: {
                    title: 'estimate.parameter.prjEstRule',
                    getter: 'ProjectEstRuleFk',
                    aggregators: [],
                    aggregateCollapsed: true
                }
            }
        ];

        return addCols;
    }
}

