
(function (angular) {
    /* global */
    'use strict';
    let moduleName = 'estimate.parameter';


    angular.module(moduleName).factory('estimateParameterValueAssignmentGridUIService',
        ['$injector', 'math', 'platformTranslateService', 'estimateRuleParameterConstant',
            function ($injector, math, platformTranslateService, estimateRuleParameterConstant) {

                let service = {};

                service.getColumns = function getColumns(){
                    return [
                        {
                            id: 'desc',
                            field: 'DescriptionInfo',
                            name: 'Description',
                            width: 120,
                            toolTip: 'Description',
                            editor : 'translation',
                            formatter: 'translation',
                            name$tr$: 'cloud.common.entityDescription',
                        },
                        {
                            id: 'valuedetail',
                            field: 'ValueDetail',
                            name: 'ValueDetail',
                            width: 120,
                            toolTip: 'ValueDetail',
                            editor : 'comment',
                            formatter: 'comment',
                            name$tr$: 'basics.customize.valuedetail',
                            validator: function(entity, value, field){
	                            if (entity.ValueType === estimateRuleParameterConstant.Decimal2) {
		                            let result = calculateValueByCulture(value);
		                            if(result.valueDetail !== value) {
			                            delete entity.SValueDetail;
			                            return {
				                            valid: false,
				                            error: $injector.get('$translate').instant('cloud.common.computationFormula')
			                            };
		                            }
		                            // reset value and valueDetail
		                            entity.Value = result.value;
		                            entity.ValueDetail = result.valueDetail;
		                            // cache valueDetail
		                            entity.SValueDetail = result.valueDetail;
	                            } else if (entity.ValueType === estimateRuleParameterConstant.Text) {
		                            entity.ValueText = value;
	                            } else {
		                            entity.Value = value;
	                            }
                                $injector.get('estimateParameterValueAssignmentGridService').setCurrentEstParameterValue(entity, field);
                            }
                        },
                        {
                            id: 'value',
                            field: 'value',
                            name: 'Value',
                            width: 120,
                            toolTip: 'Value',
                            editor : 'dynamic',
                            formatter: 'dynamic',
                            name$tr$: 'cloud.common.entityValue',
                            domain: function (item, column) {
                                let domain ='quantity';
                                if(item !== null) {
                                    if(item.ValueType === estimateRuleParameterConstant.Text){
                                        domain = 'description';
                                        column.field = 'ValueText';
                                        column.editorOptions = null;
                                        column.formatterOptions = null;
                                        column.maxLength=255;
                                        column.regex = null;

                                    }else{   // means the valueType is Decimal2 or is Boolean or the valueType is Undefined
                                        domain = 'quantity';
                                        column.field = 'Value';
                                        column.editorOptions = {decimalPlaces: 3};
                                        column.formatterOptions = {decimalPlaces: 3};
                                        // DEV-30425 Comma and Point for decimals in ENG and DE
													 // column.regex ='^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
                                    }

                                }
                                return domain;
                            },
                            validator: function(entity, value, field){
	                            if (entity.ValueType === estimateRuleParameterConstant.Decimal2) {
		                            entity.ValueDetail = calculateValueByCulture(value).valueDetail;
		                            entity.SValueDetail = entity.ValueDetail;
	                            }
                                $injector.get('estimateParameterValueAssignmentGridService').setCurrentEstParameterValue(entity, field);
                            }
                        },
                        {
                            id: 'isdefault',
                            field: 'IsDefault',
                            name: 'Is Default',
                            toolTip: 'Is Default',
                            editor : 'boolean',
                            formatter: 'boolean',
                            name$tr$: 'basics.costcodes.isDefault',
                            width: 120
                        }
                    ];
                };

                let gridColumns =  service.getColumns();

                platformTranslateService.translateGridConfig(gridColumns);

                service.getStandardConfigForListView = function(){
                    return{
                        addValidationAutomatically: true,
                        columns : gridColumns
                    };
                };

	            function calculateValueByCulture(value) {
		            let result = {
			            value: null,
			            valueDetail: ''
		            };
		            let val = $injector.get('estimateMainCommonCalculationService').calcuateValueByCulture(value.toString());
		            if (typeof val === 'string') {
			            result.valueDetail = val;
		            } else if (typeof value === 'string') {
			            result.valueDetail = value;
		            } else {
			            result.valueDetail = value.toString();
		            }
		            try {
			            result.value = math.eval(result.valueDetail);
		            } catch (err) {
			            if (typeof value === 'string' && result.valueDetail.indexOf(',') !== -1) {
				            try {
					            result.value = math.eval(result.valueDetail.replace(/[,]/gi, '.'));
				            } catch (er) {
					            result.value = 0;
				            }
			            } else {
				            result.value = 0;
			            }
		            }
		            return result;
	            }
                return service;

            }
        ]);

})(angular);
