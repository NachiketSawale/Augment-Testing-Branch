/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCombineLineItemProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * estimateMainCombineLineItemProcessor is the service to set Combine Line Item fields readonly.
	 *
	 */
	angular.module(moduleName).factory('estimateMainCombineLineItemProcessor', ['_', '$injector', 'platformRuntimeDataService',
		function (_, $injector, platformRuntimeDataService) {

			let service = {
				processItem : processItem,
				setRuleReadonly : setRuleReadonly
			};

			function processItem(item) {
				let fields = [
					{field: 'Revenue', readonly: true},
					{field: 'Margin', readonly: true},
					{field: 'WqQuantityTargetDetail', readonly: true},
					{field: 'QuantityTargetDetail', readonly: true}
				];

				if (item.CombinedLineItemsSimple !== null) {
					platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
				}

				if (item.EstLineItemFk > 0 || item.EstRuleSourceFk > 0) {
					fields.push({field: 'EstAssemblyFk', readonly: true});
					fields.push({field: 'Rule', readonly: true});
					fields.push({field: 'Param', readonly: true});
				}

				if (item.HasSplitQuantities) {
					fields.push({field: 'QuantityTarget', readonly: true});
					fields.push({field: 'WqQuantityTarget', readonly: true});
				} else {
					setWQReadonly(item);
				}

				if (item.EstRuleSourceFk > 0) {
					fields.push({field: 'EstLineItemFk', readonly: true});
				}


				if (item && item.DynamicQuantityColumns && item.DynamicQuantityColumns.length) {
					let lookupserv = $injector.get('basicsCustomizeQuantityTypeLookupDataService');
					lookupserv.getList({disableDataCaching: false}).then(function (data) {
						let dynamicCols = item.DynamicQuantityColumns;
						_.forEach(dynamicCols, function (col) {
							if (col) {
								let colField = col.field,
									typeItem = _.find(data, {Code: col.Field});

								if (!typeItem) {
									return;
								}
								fields.push({field: colField, readonly: !typeItem.Iseditable});
							}
						});
					});

				}
				fields.push( {field: 'Budget', readonly: !item.IsFixedBudget});
				fields.push({field: 'BudgetUnit', readonly: !item.IsFixedBudgetUnit});

				// Handle extended columns (line item column configuration dynamic columns)
				let colConfigFields =  Object.keys(item).filter(function(field){
					return field.indexOf('ConfDetail') === 0;
				});

				_.forEach(colConfigFields, function(colConfigField) {
					let extVar = '__';
					let field = extVar + colConfigField;
					if (Object.prototype.hasOwnProperty.call(item, field)) {
						let columnName = item[field].columnName;
						let dayColumn = $injector.get('estimateMainConfigDetailService').getFieldByColumnId(item[field].recordsInfo.ColumnId);

						if (dayColumn === 'CostUnit') {
							platformRuntimeDataService.readonly(item, [{field: columnName, readonly: true}]);
						}
					}
				});
				
				// if the lineItem is genarated by rule, set it readonly
				if (item && item.EstRuleSourceFk) {
					_.forOwn(item, function (value, key) {
						if (!key.includes('charactercolumn_')) {
							let field = {field: key, readonly: true};
							fields.push(field);
						}
					});
				}

				let EnableInputlineitemTotalQuantity = setEnableInputlineitemTotalQuantity();
				if (EnableInputlineitemTotalQuantity) {
					fields.push({field: 'QuantityTotal', readonly: true});
				}
				else {
					fields.push({field: 'QuantityTotal', readonly: false});
				}

				if (fields.length > 0) {
					platformRuntimeDataService.readonly(item, fields);
				}
			}

			// when the customize systemoption EnableInputlineitemTotalQuantity is true, the column QuantityTotal will be editable
			// otherwise it will be readonly
			function setEnableInputlineitemTotalQuantity(){
				let basicCustomizeSystemoptionLookupDataService = $injector.get('basicCustomizeSystemoptionLookupDataService');
				if(basicCustomizeSystemoptionLookupDataService){
					let systemOptions = basicCustomizeSystemoptionLookupDataService.getList();
					if(systemOptions && systemOptions.length > 0){
						let items = _.filter(systemOptions, function(systemOption){
							if(systemOption.Id === 810){
								return systemOption;
							}
						});
						if(items && items.length > 0){
							if(items[0] && items[0].ParameterValue && (items[0].ParameterValue > 0 || items[0].ParameterValue.toLowerCase() === 'true') ){
								return false;
							}
							else{
								return true;
							}
						}
						else{
							return true;
						}
					}
				}
			}

			function setRuleReadonly(item, value){
				let fields = [];
				fields.push({field: 'Rule', readonly: value});
				fields.push({field: 'Param', readonly: value});
				platformRuntimeDataService.readonly(item, fields);
			}

			function setWQReadonly(item){
				let estCombinedLineItemService = $injector.get('estimateMainCombinedLineItemClientService');
				let isWQReadOnly = estCombinedLineItemService.getEstTypeIsWQReadOnly();
				setWQ(item, isWQReadOnly);
			}

			function setWQ(item, isWQReadOnly){
				let fields = [];
				fields.push({field: 'WqQuantityTarget', readonly: isWQReadOnly});
				platformRuntimeDataService.readonly(item, fields);
			}

			return service;
		}]);
})(angular);
