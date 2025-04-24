/**
 * Created by waldrop on 01.15.2019
 */

// eslint-disable-next-line no-redeclare
/* global angular,_ */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionsystemMainResourceProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * constructionsystemMainResourceProcessor is the service to set resources dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('constructionsystemMainResourceProcessor',
		['$q', '$injector', 'platformRuntimeDataService', 'estimateMainLookupService','basicsMaterialLookupService',
			function ($q, $injector, platformRuntimeDataService, estimateMainLookupService,basicsMaterialLookupService) {

				var service = {};

				var setFields = function setFields(resItem, flag, isDisabled){
					if(angular.isUndefined(isDisabled)){
						isDisabled = resItem.IsDisabled;
					}
					var fields = [
						{field: 'EstResourceTypeFkExtend', readonly: !_.isEmpty(resItem.Code)},
						{field: 'BasUomFk', readonly: resItem.EstRuleSourceFk ? true : resItem.EstResourceTypeFk !== 5},
						{field: 'CostUnit', readonly: flag},
						{field: 'BasCurrencyFk', readonly: true},
						{field: 'CostFactorCc', readonly: true},
						{field: 'QuantityFactorCc', readonly: true},
						{field: 'QuantityUnitTarget', readonly: true},
						{field: 'QuantityTotal', readonly: true},
						{field: 'CostUnitTarget', readonly: true},
						{field: 'CostTotal', readonly: true},
						{field: 'HoursUnit', readonly: true},
						{field: 'HoursUnitTarget', readonly: true},
						{field: 'HoursUnitSubItem', readonly: true},
						{field: 'HoursUnitLineItem', readonly: true},
						{field: 'HoursTotal', readonly: true},
						{field: 'QuantityReal', readonly: true},
						{field: 'QuantityInternal', readonly: true},
						{field: 'CostUnitSubItem', readonly: true},
						{field: 'CostUnitLineItem', readonly: true},
						// {field: 'IsDisabled', readonly: isDisabled},//parent item isDisabled
						{field: 'BudgetUnit', readonly: !resItem.IsFixedBudget},
						{field: 'Budget', readonly: !resItem.IsFixedBudget}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.processItem = function processItem(resItem, data, isDisabled) {
					if (resItem) {
						// set resource type extend field for resource-type lookup
						resItem.EstResourceTypeFkExtend = resItem.EstAssemblyTypeFk ? (4000 + resItem.EstAssemblyTypeFk) : resItem.EstResourceTypeFk;
						var cosMainService = $injector.get('constructionsystemMainLineItemService');
						var selectedLineItem = cosMainService.getSelected();
						if(selectedLineItem && cosMainService.isSelection(selectedLineItem)){
							if (selectedLineItem.EstLineItemFk > 0) {
								resItem.cssClass = 'row-readonly-background';
								service.readOnly([resItem], true);
								return;
							}
							else{
								// if user remove the reference item from the selectedLineItem, make the resource editable
								if(resItem.cssClass === 'row-readonly-background'){
									resItem.cssClass = '';
									service.readOnly([resItem], false);
								}
							}

						}

						// if the resource is genarated by rule, set it readonly
						if(resItem && resItem.EstRuleSourceFk)
						{
							var allFieldsReadOnly = [];
							_.forOwn(resItem, function(value, key) {
								if(!key.includes('charactercolumn_')) {
									var field = {field: key , readonly: true};
									allFieldsReadOnly.push(field);
								}
							});
							platformRuntimeDataService.readonly(resItem, allFieldsReadOnly);
						}else if(resItem && resItem.EstAssemblyTypeFk) {
							// Set Composite resource to readonly  //resItem.EstResourceFk
							service.setCompoundResourcesDisabled(resItem.EstResources);
							service.setCostUnitReadOnly(resItem, true);
							service.setLineTypeReadOnly(resItem, true);
						}else if (resItem && resItem.cssClass === 'row-readonly-background row-readonly-background-composite'){
							// Set Composite resource to readonly  //resItem.EstResourceFk
							service.readOnly([resItem], true);
						}else{
							service.setReadOnlyProp(resItem, isDisabled);
						}
					}
				};

				service.setReadOnlyProp = function setReadOnlyProp(resItem, isDisabled) {
					var estimateMainService = $injector.get('estimateMainService');
					// 1: cost code, 2: material, 3: plant, 4: assembly, 5: sub item
					if (resItem.EstResourceTypeFk === 1 && resItem.Code)  {
						setFields(resItem, resItem.IsRate, isDisabled);
					}else if (resItem.EstResourceTypeFk === 2 ){
						var _readOnly = true;
						if(resItem.MdcMaterialFk === null || resItem.MdcMaterialFk === undefined) {
							return setFields(resItem, _readOnly, isDisabled);
						}
						var options={};
						options.projectId =estimateMainService.getSelectedProjectId();
						return basicsMaterialLookupService.getItemByKey(resItem.MdcMaterialFk,options).then(function(data){
							_readOnly = data && data.IsLabour && !data.IsRate ? false : true;
							return setFields(resItem, _readOnly, isDisabled);
						});
					}
					else {
						setFields(resItem, true, isDisabled);
					}
				};

				service.setCostUnitReadOnly = function setCostUnitReadOnly(resItem, flag) {
					var fields = [
						{field: 'CostUnit', readonly: flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setLineTypeReadOnly = function setLineTypeReadOnly(resItem, flag) {
					var fields = [
						{field: 'EstResourceTypeFkExtend', readonly: flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setColumnReadOnly = function setColumnReadOnly(resItem, column, flag) {
					var fields = [
						{field: column, readonly: flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setPrcPackage2HeaderReadOnly = function setPrcPackage2HeaderReadOnly(resItem, selectedLineItem) {

				};

				service.processItems = function processItems(items){
					var isDisabled = false;
					angular.forEach(items, function(item){
						var isItemDisabled = !! item.IsDisabled || !! item.IsDisabledPrc;
						if(item && item.Id){
							if(item.EstResourceFk > 0){
								var parent = _.find(items, {Id: item.EstResourceFk});
								isDisabled = parent && (parent.IsDisabled || parent.IsDisabledPrc)? true: isItemDisabled;
							}else{
								isDisabled = isItemDisabled;
							}
						}
						service.processItem(item, null, isDisabled);
					});
				};

				service.processItemsAsync = function processItemsAsync(items){
					return $q.when(service.processItems(items));
				};

				// set all items readonly or editable
				service.readOnly = function readOnly(items, isReadOnly){
					var fields = [],
						item = _.isArray(items) ? items[0]:null;

					_.forOwn(item, function(value, key) {
						var field = {field: key , readonly: isReadOnly};
						fields.push(field);
					});

					angular.forEach(items, function(resItem){
						if(resItem && resItem.Id){
							platformRuntimeDataService.readonly(resItem, fields);
						}
					});
				};

				service.setCompoundResourcesDisabled = function setCompoundResourcesDisabled(resources){
					service.readOnly(resources, true);
					angular.forEach(resources, function(resItem){
						resItem.cssClass = 'row-readonly-background row-readonly-background-composite';
						if (resItem.EstResources && _.size(resItem.EstResources) > 0){
							setCompoundResourcesDisabled(resItem.EstResources);
						}
					});
				};

				service.setBudgetReadOnly = function setBudgetReadOnly(resItem, flag) {
					var fields = [
						{field: 'BudgetUnit', readonly: !flag},
						{field: 'Budget', readonly: !flag},
						{field: 'IsFixedBudget', readonly: !flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				return service;
			}]);
})(angular);