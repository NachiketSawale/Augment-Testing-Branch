/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * estimateMainLineItemProcessor is the service to set LineItem readonly.
	 *
	 */
	angular.module(moduleName).factory('estimateMainLineItemProcessor', ['$injector', 'platformRuntimeDataService','platformDataServiceConfiguredReadonlyExtension',
		function ($injector, platformRuntimeDataService,platformDataServiceConfiguredReadonlyExtension) {

			let service = {
				processItem : processItem,
				setRuleReadonly : setRuleReadonly,
				setGcBreakdownTypeReadonly : setGcBreakdownTypeReadonly,
				processIsDurationQuantityActivity : processIsDurationQuantityActivity
			};

			function processItem(item) {
				if(!item){
					return;
				}

				hideGaAmRp(item);

				let estimateMainService = $injector.get('estimateMainService');

				if(estimateMainService.isLineItemStatusReadonly(item.Id, item.EstHeaderFk) || item.EstRuleSourceFk){
					setItemReadOnly(item);
					setRuleReadonly(item,false);
					return;
				}

				let isBudgetEditable = estimateMainService.getEstTypeIsBudgetEditable();
				let fields = [
					{field: 'Revenue', readonly: true},
					{field: 'RevenueUnit', readonly: true},
					{field: 'AssemblyType', readonly: item.EstAssemblyFk},
					{field: 'IsFixedBudget', readonly: !isBudgetEditable},
					{field: 'IsFixedBudgetUnit', readonly: !isBudgetEditable}
				];

				// the code will Generate by RubricCategory Number Generation Setting, set the code as 'isGenerated'
				if (item.Version === 0) {
					platformRuntimeDataService.readonly(item, [{field: 'Code', readonly: true}]);
					let translationObject = $injector.get('platformTranslateService').instant('cloud.common.isGenerated');
					item.Code = translationObject.cloud.common.isGenerated;
					item.IsGenerated = true;
				}

				if (item.EstLineItemFk > 0) {
					fields.push({field: 'EstAssemblyFk', readonly: true});
					fields.push({field: 'Rule', readonly: true});
					fields.push({field: 'Param', readonly: true});
					fields.push({field: 'AssemblyType', readonly: true});
				}


				if (item && item.DynamicQuantityColumns && item.DynamicQuantityColumns.length) {
					let lookupserv = $injector.get('basicsCustomizeQuantityTypeLookupDataService');
					lookupserv.getListForEstimate({disableDataCaching: false}).then(function (data) {
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

				fields.push({field: 'Budget', readonly: !(item.IsFixedBudget && isBudgetEditable)});
				fields.push({field: 'BudgetUnit', readonly: !(item.IsFixedBudgetUnit && isBudgetEditable)});

				// Handle extended columns (line item column configuration dynamic columns)
				let colConfigFields =  Object.keys(item).filter(function(field){
					return field.indexOf('ConfDetail') === 0;
				});
				_.forEach(colConfigFields, function(colConfigField){
					let extVar = '__';
					let field = extVar + colConfigField;
					if (Object.prototype.hasOwnProperty.call(item, field)){
						setExtendColumnReadonly(item, item[field].columnName, item[field].recordsInfo);
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

				if(item.BoqItemFk) {
					let doCalculateSplitQuantity = $injector.get('estimateMainCommonService').doCalculateSplitQuantity(item.BoqItemFk, item.BoqHeaderFk);
					fields.push({field: 'BoqSplitQuantityFk', readonly: !doCalculateSplitQuantity});
					if (fields.length > 0) {
						platformRuntimeDataService.readonly(item, fields);
					}
				}

				let isEstimateBoqDriven = estimateMainService.getSelectedProjectInfo() ? estimateMainService.getSelectedProjectInfo().IsEstimateBoqDriven : null;
				if (isEstimateBoqDriven) {
					let fields = [];
					fields.push({ field: 'QuantityTarget', readonly: true });
					fields.push({ field: 'QuantityTargetDetail', readonly: true });
					fields.push({ field: 'WqQuantityTarget', readonly: true });
					fields.push({ field: 'WqQuantityTargetDetail', readonly: true });
					platformRuntimeDataService.readonly(item, fields);
				}
				// TODO: has split quantities, should be priority
				else {
					if (item.HasSplitQuantities) {
						fields.push({ field: 'QuantityTarget', readonly: true });
						fields.push({ field: 'QuantityTargetDetail', readonly: true });
						fields.push({ field: 'WqQuantityTarget', readonly: true });
						fields.push({ field: 'WqQuantityTargetDetail', readonly: true });
					} else {
						$injector.get('estimateMainCommonService').isLumpsumUom(item.BasUomFk).then(function (isLumpsumUom) {
							if (isLumpsumUom) {
								setWQ(item, true);
							} else {
								setWQReadonly(item);
							}
						});
					}
				}

				if(item.IsNoMarkup || item.IsOptional || item.IsGc || item.IsDaywork){
					fields.push({field: 'AdvancedAllUnit', readonly: true});
					fields.push({field: 'AdvancedAll', readonly: true});
					fields.push({field: 'AdvancedAllUnitItem', readonly: true});
				}

				if(item.IsNoMarkup || item.IsGc || item.IsFixedPrice){
					fields.push({field: 'ManualMarkupUnit', readonly: true});
					fields.push({field: 'ManualMarkupUnitItem', readonly: true});
					fields.push({field: 'ManualMarkup', readonly: true});
				}

				fields.push({field: 'IsOptional', readonly: item.IsGc});
				fields.push({field: 'IsDaywork', readonly: item.IsGc});

				fields.push({field: 'IsOptionalIT', readonly: !item.IsOptional});

				fields.push({field: 'GrandCostUnitTarget', readonly: !item.IsFixedPrice});

				fields.push({field: 'IsFixedPrice', readonly: item.IsGc});

				let activeAllowance = $injector.get('estimateMainContextDataService').getAllowanceEntity();
				if(_.isEmpty(activeAllowance) && item.AdvancedAllowance !== 0){
					fields.push({field: 'AdvancedAll', readonly: true});

					fields.push({field: 'AdvancedAllUnitItem', readonly: true});

					fields.push({field: 'AdvancedAllUnit', readonly: true});
				}

				platformDataServiceConfiguredReadonlyExtension.overrideReadOnlyProperties('Estimate.Main', 'EstLineItem', fields);

				platformRuntimeDataService.readonly(item, fields);

				setGcBreakdownTypeReadonly(item);

				processIsDurationQuantityActivity(item.IsDurationQuantityActivity, item);
			}

			function setGcBreakdownTypeReadonly(lineItem, resourceList) {
				let fields = [{ field: 'GcBreakdownTypeFk', readonly: !(lineItem.IsGc) }];
				platformRuntimeDataService.readonly(lineItem, fields);
				if(resourceList && resourceList.length > 0) {
					$injector.get('estimateMainResourceProcessor').setBreakDownTypeReadonly(lineItem, resourceList);
				}
			}

			// Set FromDate and ToDate readonly based on IsDurationQuantityActivity
			function processIsDurationQuantityActivity(isReadOnly, entity) {
				platformRuntimeDataService.readonly(entity, [
					{ field: 'FromDate', readonly: isReadOnly },
					{ field: 'ToDate', readonly: isReadOnly }
				]);
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
							return !(items[0] && items[0].ParameterValue && (items[0].ParameterValue === '1' || items[0].ParameterValue === 1 || items[0].ParameterValue.toLowerCase() === 'true'));
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

			function setExtendColumnReadonly(lineItem, columnName, extendColumnValueObj) {
				if(lineItem.EstLineItemFk){
					platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: true}]);
				}else{
					if(extendColumnValueObj.ResourcesCount > 1){
						platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: true}]);
					}else{
						let field = $injector.get('estimateMainConfigDetailService').getFieldByColumnId(extendColumnValueObj.ColumnId);

						if(field === 'CostUnit'){
							platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: extendColumnValueObj.IsFixedRate}]);
						}

						if(field === 'CostTotal' || field === 'QuantityTotal' || field === 'HoursTotal' || field === 'CostUnitLineitem'){
							platformRuntimeDataService.readonly(lineItem, [{field: columnName, readonly: true}]);
						}
					}
				}
			}

			function setWQReadonly(item){
				var estMainService = $injector.get('estimateMainService');
				var isWQReadOnly = estMainService.getEstTypeIsWQReadOnly();
				setWQ(item, isWQReadOnly);
			}

			function setWQ(item, isWQReadOnly){
				let fields = [];
				fields.push({field: 'WqQuantityTarget', readonly: isWQReadOnly});
				fields.push({field: 'WqQuantityTargetDetail', readonly: isWQReadOnly});
				platformRuntimeDataService.readonly(item, fields);
			}

			function setItemReadOnly(lineItem){
				let allFieldsReadOnly = [];
				_.forOwn(lineItem, function (value, key) {
					let field = {field: key, readonly: true};
					if (field.field !== 'EstLineItemStatusFk') {
						allFieldsReadOnly.push(field);
					}
				});
				setRuleReadonly(lineItem, true);
				$injector.get('platformRuntimeDataService').readonly(lineItem, allFieldsReadOnly);
				lineItem.IsReadonlyStatus = !!lineItem.EstRuleSourceFk;
			}

			function hideGaAmRp(lineItem){
				const fields = ['GcUnitItem','GcUnit','Gc','GaUnitItem','GaUnit','Ga','AmUnitItem','AmUnit','Am','RpUnitItem','RpUnit','Rp'];
				const isHide = $injector.get('estimateMainContextDataService').isHideGaAmRp();
				platformRuntimeDataService.hideContent(lineItem, fields, isHide);
			}

			return service;

		}]);
})(angular);
