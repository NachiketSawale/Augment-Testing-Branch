/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainResourceProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * estimateMainResourceProcessor is the service to set resources dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('estimateMainResourceProcessor',
		['$q', '$injector', 'platformRuntimeDataService', 'estimateMainResourceType','estimateMainService','basicCustomizeSystemoptionLookupDataService',
			function ($q, $injector, platformRuntimeDataService, estimateMainResourceType,estimateMainService,basicCustomizeSystemoptionLookupDataService) {

				let service = {};

				let setFields = function setFields(resItem, isFixRate, isDisabled){
					if(angular.isUndefined(isDisabled)){
						isDisabled = resItem.IsDisabled;
					}
					let fields = [
						{field: 'EstResourceTypeFkExtend', readonly: !_.isEmpty(resItem.Code)},
						{field: 'EstResourceTypeShortKey', readonly: !_.isEmpty(resItem.Code)},
						{field: 'BasUomFk', readonly: resItem.EstRuleSourceFk ? true : resItem.EstResourceTypeFk !== estimateMainResourceType.SubItem},
						{field: 'CostUnit', readonly: isFixRate},
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
						{field: 'BudgetUnit', readonly: !resItem.IsFixedBudgetUnit},
						{field: 'Budget', readonly: !resItem.IsFixedBudget},
						{field: 'IsCost', readonly: true},
						{field: 'IsManual', readonly: true},
						{field: 'IsBudget', readonly: true},
						{field: 'IsEstimateCostCode', readonly: true},
						{field: 'IsRuleMarkupCostCode', readonly: true},
						{field: 'IsFixedBudget', readonly: !resItem.IsBudget},
						{field: 'IsFixedBudgetUnit', readonly: !resItem.IsBudget},
						{field: 'DayWorkRateUnit', readonly: isFixRate},
						{field: 'Co2Project', readonly: resItem.EstResourceTypeFk === estimateMainResourceType.SubItem},
						{field: 'Co2Project', readonly: resItem.EstResourceTypeFk === estimateMainResourceType.Assembly},
						{field: 'WorkOperationTypeFk', readonly: !((resItem.EstResourceTypeFk === estimateMainResourceType.Plant || resItem.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && resItem.EtmPlantFk != null) },
						{field: 'CostUom', readonly: true}					];

					platformRuntimeDataService.readonly(resItem, fields);
					service.setByEditableFlag(resItem, isFixRate);

					let lineItem;
					if(!lineItem){
						lineItem = estimateMainService.getSelected();
					}
					if(lineItem && lineItem.IsGc){
						resItem.IsIndirectCost = true;
						platformRuntimeDataService.readonly(resItem, [{field: 'IsIndirectCost', readonly: resItem.IsIndirectCost}]);
					}
				};

				function setIsDisabledReadOnly(resItem, parent) {
					if(resItem && resItem.Id && resItem.cssClass !== 'row-readonly-background row-readonly-background-composite'){
						let fields = [
							{field: 'IsDisabled', readonly: parent.IsDisabled},
							{field: 'IsDisabledPrc', readonly: parent.IsDisabledPrc}
						];
						platformRuntimeDataService.readonly(resItem, fields);
					}
				}

				function setCo2ProjectReadonly (resItem){
					let fields = [
						{field: 'Co2Project', readonly: true},
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				function setCostUnitAndEffectiveCostReadonly (resItem){
					let fields = [
						{field: 'CostUnit', readonly: true},
						{field: 'CostUom', readonly: true}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				function setCostUnitLineItemReadonly(resItem){
					let fields = [
						{field: 'CostUnitLineItem', readonly: true}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				// set the resource readonly if the resource is a child of a plant type resource
				service.doSetShortKeyReadOnly = function doSetShortKeyReadOnly(resItem, service) {
					let selectedResourceParent = service.getItemById(resItem.EstResourceFk); 
					if(selectedResourceParent && (selectedResourceParent.EstResourceTypeFk === estimateMainResourceType.Plant || selectedResourceParent.EstResourceTypeFk === estimateMainResourceType.PlantDissolved)){
						resItem.EstResourceTypeFk = estimateMainResourceType.EquipmentAssembly;
					}
				};

				service.processItem = function processItem(resItem, data, isDisabled) {
					if (resItem) {

						service.hideGaAmRp(resItem);

						let estimateMainService = $injector.get('estimateMainService');

						if (estimateMainService.isReadonly() || estimateMainService.isLineItemStatusReadonly(resItem.EstLineItemFk, resItem.EstHeaderFk) || resItem.EstRuleSourceFk){
							resItem.IsReadonlyStatus = !!resItem.EstRuleSourceFk;
							service.readOnly([resItem], true);
							return;
						}

						let protectedAssemblyAsOneRecordSystemOption = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id':10126}).ParameterValue;
						if((_.toLower(protectedAssemblyAsOneRecordSystemOption) === 'true' || protectedAssemblyAsOneRecordSystemOption === '1') && $injector.get('estimateAssembliesAssemblyTypeDataService').isPaAssembly(resItem.EstAssemblyTypeFk)){
							let exceptFields = ['EstResourceTypeShortKey', 'Code'];
							service.readOnly([resItem], true, exceptFields);
						}

						if(resItem.EstResourceTypeFk === estimateMainResourceType.ComputationalLine){
							service.processComputationalLineTypeItem(resItem);
							return;
						}

						if(resItem.EstResourceTypeFk === estimateMainResourceType.InternalTextLine){
							service.setReadOnlyProp(resItem, isDisabled);
							return service.increaseDescriptionLength(resItem);
						}

						// set resource type extend field for resource-type lookup
						resItem.EstResourceTypeFkExtend = resItem.EstAssemblyTypeFk ? (4000 + resItem.EstAssemblyTypeFk) : resItem.EstResourceTypeFk;
						let selectedLineItem = estimateMainService.getSelected();
						if(selectedLineItem && estimateMainService.isSelection(selectedLineItem)){
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
							let allFieldsReadOnly = [];
							_.forOwn(resItem, function(value, key) {
								if(!key.includes('charactercolumn_')) {
									let field = {field: key , readonly: true};
									allFieldsReadOnly.push(field);
								}
							});
							platformRuntimeDataService.readonly(resItem, allFieldsReadOnly);
						}else if(resItem && resItem.EstAssemblyTypeFk) {
							// Set Composite resource to readonly  //resItem.EstResourceFk
							service.setCompoundResourcesDisabled(resItem.EstResources);
							service.setCostUnitReadOnly(resItem, true);
							service.setLineTypeReadOnly(resItem, true);
							service.setIsBudgetIsCostCodeReadOnly(resItem);
							service.setBudgetReadOnly(resItem, true);
						}else if(resItem &&  (resItem.EstResourceTypeFk === estimateMainResourceType.Plant || resItem.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && resItem.EstResourceFk === null){
							service.setColumnReadOnly(resItem,'Code',true);
							setFields(resItem, true);
							setCo2ProjectReadonly(resItem);
							setCostUnitAndEffectiveCostReadonly(resItem);
							setCostUnitLineItemReadonly(resItem);
							service.setIsBudgetIsCostCodeReadOnly(resItem);
						}else if(resItem &&  (resItem.EstResourceTypeFk === estimateMainResourceType.Plant || resItem.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && resItem.EstResourceFk != null){
							let estMainService = $injector.get('estimateMainService');
							let sysOpt = estMainService.getSystemOptionForPlantTypeResource();

							// Set Equipment Assembly resources  to readonly
							if(!resItem.IsManual && !sysOpt){
								service.readOnly([resItem], true);
								resItem.cssClass = 'row-readonly-background row-readonly-background-composite';
								resItem.isChildOfComposite = true;
							}
							if(sysOpt){
								service.setReadOnlyProp([resItem], false);
							}
							setFields(resItem, true);
							setCo2ProjectReadonly(resItem);
							setCostUnitAndEffectiveCostReadonly(resItem);
							setCostUnitLineItemReadonly(resItem);
							service.setIsBudgetIsCostCodeReadOnly(resItem);
							service.setPlantResourcesDisabled(resItem.EstResources, sysOpt);

						}else if (resItem && resItem.cssClass === 'row-readonly-background row-readonly-background-composite'){
							// Set Composite resource to readonly  //resItem.EstResourceFk
							service.readOnly([resItem], true);
						}else{
							service.setReadOnlyProp(resItem, isDisabled);
						}

						if(resItem && (resItem.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly && resItem.EstResourceFk != null)) {
							let fields = [
								{field: 'EstResourceTypeShortKey', readonly: true}
							];
							platformRuntimeDataService.readonly(resItem, fields);
						}

						if(resItem.PackageAssignments && resItem.IsReadOnlyByPrcPackage){
							service.setColumnReadOnly(resItem,'Code',resItem.IsReadOnlyByPrcPackage);
							service.setColumnReadOnly(resItem,'DescriptionInfo',resItem.IsReadOnlyByPrcPackage);
						}

						if(!resItem.Description && resItem.DescriptionInfo && resItem.DescriptionInfo.Description === null){
							resItem.DescriptionInfo.Description = '';
							resItem.DescriptionInfo.Translated = '';
						}
						service.setBreakDownTypeReadonly(selectedLineItem, null, resItem);
					}
				};

				service.setBreakDownTypeReadonly = function setBreakDownTypeReadonly(selectedLineItem, resources, resItem) {
					let resourceList = resItem && resItem.Id ? [resItem] : resources;
					if (selectedLineItem && resourceList && resourceList.length > 0) {
						let fields = [
							{ field: 'GcBreakdownTypeFk', readonly: !selectedLineItem.IsGc }
						];
						angular.forEach(resourceList, function (resource) {
							platformRuntimeDataService.readonly(resource, fields);
						});
					}
				}

				service.setReadOnlyProp = function setReadOnlyProp(resItem, isDisabled) {
					// 1: cost code, 2: material, 3: plant, 4: assembly, 5: sub item
					if (resItem.EstResourceTypeFk === estimateMainResourceType.CostCode && resItem.Code) {
						setFields(resItem, resItem.IsRate, isDisabled);

					} else if (resItem.EstResourceTypeFk === estimateMainResourceType.Material) {
						let _readOnly = true;
						if (resItem.MdcMaterialFk === null || resItem.MdcMaterialFk === undefined) {
							return setFields(resItem, _readOnly, isDisabled);
						}
						return setFields(resItem, resItem.IsRate, isDisabled);
					}
					else {
						setFields(resItem, true, isDisabled);
					}
				};

				service.setCostUnitReadOnly = function setCostUnitReadOnly(resItem, flag) {
					service.setByEditableFlag(resItem, flag);
				};

				service.setLineTypeReadOnly = function setLineTypeReadOnly(resItem, flag) {
					let fields = [
						{field: 'EstResourceTypeFkExtend', readonly: flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setColumnReadOnly = function setColumnReadOnly(resItem, column, flag) {
					let fields = [
						{field: column, readonly: flag}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setIsBudgetIsCostCodeReadOnly = function setIsBudgetIsCostCodeReadOnly(item) {
					let fields = [];
					fields.push({field: 'IsBudget', readonly: true});
					fields.push({field: 'IsCost', readonly: true});
					fields.push({field: 'IsEstimateCostCode', readonly: true});

					platformRuntimeDataService.readonly(item, fields);
				};

				service.processItems = function processItems(items){
					let isDisabled = false;
					angular.forEach(items, function(item){
						let isItemDisabled = !! item.IsDisabled || !! item.IsDisabledPrc;
						if(item && item.Id){
							if(item.EstResourceFk > 0 && !item.EstRuleSourceFk){
								let parent = _.find(items, {Id: item.EstResourceFk});
								isDisabled = parent && (parent.IsDisabled || parent.IsDisabledPrc)? true: isItemDisabled;
								setIsDisabledReadOnly(item, parent);
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
				service.readOnly = function readOnly(items, isReadOnly, exceptFields){
					let fields = [],
						item = _.isArray(items) ? items[0]:null;

					exceptFields = exceptFields || [];

					_.forOwn(item, function(value, key) {
						if (!_.includes(exceptFields, key)) {
							let field = { field: key, readonly: isReadOnly };
							fields.push(field);
						}
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
						resItem.isChildOfComposite = true;
						if (resItem.EstResources && _.size(resItem.EstResources) > 0){
							setCompoundResourcesDisabled(resItem.EstResources);
						}
					});
				};


				service.setPlantResourcesDisabled = function setPlantResourcesDisabled(resources,sysOpt){
					if(!sysOpt){
						let nonManualResources = _.filter(resources, e => !e.IsManual);
						service.readOnly(nonManualResources, true);
						angular.forEach(nonManualResources, function(resItem){
							resItem.cssClass = 'row-readonly-background row-readonly-background-composite';
							resItem.isChildOfComposite = true;
							if (resItem.EstResources && _.size(resItem.EstResources) > 0){
								setPlantResourcesDisabled(resItem.EstResources);
							}
						});

						let isManualResources = _.filter(resources, e => e.IsManual);
						if(isManualResources){
							angular.forEach(isManualResources, function(resItem){
								let fields = [
									{field: 'Sorting', readonly: true},
								];
								platformRuntimeDataService.readonly(resItem, fields);
							});
						}
					} else {
						angular.forEach(resources, function(resItem){
							service.setReadOnlyProp(resItem,false);
						});
					}
				};

				service.setAssemblyReadonly = function setAssemblyReadonly (resItem){
					let fields = [
						{field: 'Co2Project', readonly: true},
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setBudgetReadOnly = function setBudgetReadOnly(resItem, lookupItemIsBudget) {
					let fields = [
						{field: 'BudgetUnit', readonly: !resItem.IsFixedBudgetUnit},
						{field: 'Budget', readonly: !resItem.IsFixedBudget},
						{field: 'IsFixedBudget', readonly: !lookupItemIsBudget},
						{field: 'IsFixedBudgetUnit', readonly: !lookupItemIsBudget}
					];
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setByEditableFlag = function setByEditableFlag(resItem, isFixRate) {
					let fields = [];
					if(resItem.EstResourceTypeFk === estimateMainResourceType.CostCode){
						let isEditable = resItem.IsEditable;
						fields = [
							{field: 'BasUomFk', readonly: !isEditable},
							{field: 'CostUnit', readonly: isFixRate},
							{field: 'BasCurrencyFk', readonly: !isEditable},
							{field: 'DescriptionInfo', readonly: true},
							{field: 'DescriptionInfo1', readonly: !isEditable},
							{field: 'DayWorkRateUnit', readonly: isFixRate}
						];
					}else{
						fields = [
							{field: 'CostUnit', readonly: isFixRate},
							{field: 'DayWorkRateUnit', readonly: isFixRate}
						];
						if(resItem.EstResourceTypeFk === estimateMainResourceType.SubItem){
							fields.push({field: 'DescriptionInfo', readonly: false},
								{field: 'DescriptionInfo1', readonly: false});
						}

						if(resItem.EstResourceTypeFk === estimateMainResourceType.Assembly){
							fields.push({field: 'Co2Project', readonly: true});
						}
						else if(resItem.EstResourceTypeFk === estimateMainResourceType.InternalTextLine || resItem.EstResourceTypeFk === estimateMainResourceType.TextLine){
							fields.push(
								{field: 'DescriptionInfo', readonly: false},
								{field: 'CommentText', readonly: false},
								{field :'Sorting', readonly:false}
							);
							_.forOwn(resItem, function(value, key) {
								if(key !== 'DescriptionInfo' && key !== 'CommentText' &&  key !== 'Sorting') {
									let field = {field: key , readonly: true};
									fields.push(field);
								}
							});
						}
						if(resItem.EstResourceTypeFk === estimateMainResourceType.Material || resItem.EstResourceTypeFk === estimateMainResourceType.Assembly || resItem.EstResourceTypeFk === estimateMainResourceType.Plant || resItem.EstResourceTypeFk === estimateMainResourceType.EquipmentAssembly || resItem.EstResourceTypeFk === estimateMainResourceType.PlantDissolved){
							fields.push({field: 'DescriptionInfo', readonly: true},
								{field: 'DescriptionInfo1', readonly: true});
						}
					}
					platformRuntimeDataService.readonly(resItem, fields);
				};

				service.setDisabledChildrenReadOnly = function setDisabledChildrenReadOnly(items){
					angular.forEach(items, function(item){
						if(item && item.Id && item.cssClass !== 'row-readonly-background row-readonly-background-composite' ){
							if(item.EstResourceFk > 0 && !item.EstRuleSourceFk){
								let parent = _.find(items, {Id: item.EstResourceFk});
								setIsDisabledReadOnly(item, parent);
							}
						}
					});
				};

				service.processComputationalLineTypeItem = function processComputationalLineTypeItem(item) {
					if (!item) {
						return;
					}
					let selectedLineItem = estimateMainService.getSelected();
					if (selectedLineItem && estimateMainService.isSelection(selectedLineItem)) {
						service.readOnly([item], true);
						if (!selectedLineItem.EstLineItemFk) {
							platformRuntimeDataService.readonly(item, [{ field: 'QuantityDetail', readonly: false }, { field: 'Sorting', readonly: false }, { field: 'CommentText', readonly: false }]);
						}
					}
				};

				service.increaseDescriptionLength = function increaseDescriptionLength(item){
					if(!item){
						return;
					}
				};


				service.isParentPlantTypeResource = function (resource,list) {
					return !service.checkIfTopParentIsPlantType(resource,list);
				};

				service.checkIfTopParentIsPlantType = function (resource,list){
					if (!resource
						|| (resource.EtmPlantFk != null && resource.EstResourceFk === null)
						|| !resource.EstResourceFk) {
						return false;
					}

					let parent = _.find(list, singleItem => singleItem.Id === resource.EstResourceFk,0);
					if (!parent) {
						return false;
					}

					return !((parent.EstResourceTypeFk === estimateMainResourceType.Plant || parent.EstResourceTypeFk === estimateMainResourceType.PlantDissolved) && parent.EtmPlantFk != null );// && parent.EstResourceFk === null);
				};

				service.hideGaAmRp = function(resource){
					let fields = ['Gc', 'Ga', 'Am', 'Rp'];
					const isHide = $injector.get('estimateMainContextDataService').isHideGaAmRp();
					platformRuntimeDataService.hideContent(resource, fields, isHide);
				};

				return service;
			}]);
})(angular);
