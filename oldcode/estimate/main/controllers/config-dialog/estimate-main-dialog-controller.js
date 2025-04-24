/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainDialogController',[
		'_', '$q', '$timeout', '$scope', '$translate', '$modalInstance', '$injector', 'platformCreateUuid', 'estimateMainDialogUIConfigService',
		'estimateMainDialogDataService', 'estimateMainStructureConfigDetailDataService', 'estimateMainEstConfigDataService', 'platformRuntimeDataService', 'estimateMainEstRuleDataService', 'estimateMainEstStructureDataService','estimateMainEstUppDataService','estimateMainDialogProcessService',
		'estimateMainEstColumnConfigDataService','estimateMainUpp2CostcodeDetailDataService', 'estimateMainEstTotalsConfigDataService', 'estimateMainEstTotalsConfigDetailDataService', 'estimateMainEstColumnConfigDetailDataService', 'estimateMainCostBudgetDataService', 'estimateMainCostBudgetAssignDetailDataService', 'estimateMainRuleConfigDetailDataService', 'estimateMainEstRuleAssignmentParamDataService',
		'basicsLookupdataLookupFilterService', 'estimateProjectRateBookConfigDataService', 'estimateMainRoundingConfigDataService', 'estimateMainRoundingConfigDetailDataService',
		function (_, $q, $timeout, $scope, $translate, $modalInstance, $injector, platformCreateUuid, estimateMainDialogUIConfigService, estDialogDataService, estimateMainStructureConfigDetailDataService, estimateMainEstConfigDataService, platformRuntimeDataService, estimateMainEstRuleDataService, estimateMainEstStructureDataService, estimateMainEstUppDataService, estimateMainDialogProcessor,
			estimateMainEstColumnConfigDataService,estimateMainUpp2CostcodeDetailDataService, estimateMainEstTotalsConfigDataService, estimateMainEstTotalsConfigDetailDataService, estimateMainEstColumnConfigDetailDataService, estimateMainCostBudgetDataService, estimateMainCostBudgetAssignDetailDataService, estimateMainRuleConfigDetailDataService, estimateMainEstRuleAssignmentParamDataService,
			basicsLookupdataLookupFilterService, estimateProjectRateBookConfigDataService, estimateMainRoundingConfigDataService, estimateMainRoundingConfigDetailDataService) {

			let uniqId = platformCreateUuid();
			let editType = '';

			$scope.getContainerUUID = function () {
				return uniqId;
			};

			// each config type has HeaderText
			function getHeaderTextKey() {
				let dialogConfig = estimateMainDialogProcessor.getDialogConfig();
				let instantKey = '';
				switch (dialogConfig.editType){
					case 'estimate':
						instantKey = 'estimate.main.estimate';
						break;
					case 'estBoqUppConfig':
						instantKey = 'estimate.main.estConfigEstBoqUppTitle';
						break;
					case 'customizeforall':
						instantKey = 'basics.customize.estconfigtype';
						break;
					case 'customizeforcolumn':
						instantKey = 'basics.customize.columnconfigtype';
						break;
					case 'customizefortotals':
						instantKey = 'basics.customize.esttotalsconfigtype';
						break;
					case 'customizeforstructure':
						instantKey = 'basics.customize.eststructuretype';
						break;
					case 'customizeforcostbudget':
						instantKey = 'basics.customize.costBudgetType';
						break;
					case 'customizeforupp':
						instantKey = 'basics.customize.estuppconfigtype';
						break;
					case 'assemblies':
						instantKey = 'estimate.assemblies.assemblies';
						break;
					case 'customizeforruleassign':
						instantKey = 'estimate.main.ruleAssignment';
						break;
					case 'customizeforroundingconfig':
						instantKey = 'estimate.main.roundingConfigDialogForm.dialogCustomizeRoundingConfigTitle';
						break;
				}
				return instantKey;
			}

			function isTotalDetailValid(updateData){
				let isValid = true;
				if(updateData && angular.isArray(updateData.EstTotalsConfigDetails)){
					_.forEach(updateData.EstTotalsConfigDetails, function(totalsConfigDetail){
						var checkEmptyResult = $injector.get('platformDataValidationService').isMandatory(totalsConfigDetail.DescriptionInfo.Translated, 'Description');
						if(!checkEmptyResult.valid){
							isValid = false;
						}
					});
				}
				return isValid;
			}

			let dialogConfig = estimateMainDialogProcessor.getDialogConfig();
			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant(getHeaderTextKey()),

				ok : function (result) {
					let isValid = true;
					let updateData = $scope.currentItem;
					switch (dialogConfig.editType){
						case 'estimate':
						case 'assemblies':
						case 'customizeforall':
							estimateMainEstConfigDataService.provideUpdateData(updateData);
							isValid = estimateMainEstColumnConfigDataService.provideUpdateData(updateData);
							estimateMainEstStructureDataService.provideUpdateData(updateData);
							estimateMainEstTotalsConfigDataService.provideUpdateData(updateData);
							isValid = isValid && isTotalDetailValid(updateData);
							estimateMainCostBudgetDataService.provideUpdateData(updateData);
							estimateMainEstRuleDataService.provideUpdateData(updateData);
							estimateMainRoundingConfigDataService.provideUpdateData(updateData);
							break;
						case 'customizeforcolumn':
							isValid = estimateMainEstColumnConfigDataService.provideUpdateData(updateData);
							break;
						case 'customizefortotals':
							estimateMainEstTotalsConfigDataService.provideUpdateData(updateData);
							isValid = isTotalDetailValid(updateData);
							break;
						case 'customizeforstructure':
							estimateMainEstStructureDataService.provideUpdateData(updateData);
							break;
						case 'estBoqUppConfig':
							estimateMainEstUppDataService.provideUpdateData(updateData);
							updateData.EstHeaderId = $injector.get('estimateMainService').getSelectedEstHeaderId();
							if(!updateData.BoqHeaderId){
								isValid = false;
								closeDialog();
							}
							if(updateData.IsDefaultUpp && !updateData.EstUppConfig){
								isValid = false;
								closeDialog();
							}
							break;
						case 'customizeforupp':
							estimateMainEstUppDataService.provideUpdateData(updateData);
							break;
						case 'customizeforcostbudget':
							estimateMainCostBudgetDataService.provideUpdateData(updateData);
							break;
						case 'customizeforruleassign':
							estimateMainEstRuleDataService.provideUpdateData(updateData);
							break;
						case 'customizeforroundingconfig':
							estimateMainRoundingConfigDataService.provideUpdateData(updateData);
							break;
					}

					if(!isValid){
						return;
					}

					updateData.IsForCustomization = !(dialogConfig.editType === 'estimate' || dialogConfig.editType === 'assemblies');

					$modalInstance.close(result);

					estDialogDataService.update(updateData).then(function(completeData){
						clear();
						if(dialogConfig.editType === 'estimate' || dialogConfig.editType === 'assemblies') {
							if(completeData && completeData.EstRoundingConfigDetailToSave && completeData.EstRoundingConfigDetailToSave.length){
								$injector.get('estimateMainRoundingDataService').mergeEstRoundingConfig(completeData.EstRoundingConfigDetailToSave);
							}
						}
						if(dialogConfig.editType === 'estimate') {
							let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
							let estMainCombinedStandardDynamicService = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService');

							// when dialog opened from estimate then 'reloadColumnConfigAndData' called
							let columnconfigfk = completeData.EstConfig ? completeData.EstConfig.Id : null;
							$injector.get('estimateMainService').setSelectedEstHeaderColumnConfigFk(columnconfigfk);

							if(completeData && completeData.EstStructureDetails && completeData.EstStructureDetails.length){
								completeData.EstStructureDetails = _.sortBy(completeData.EstStructureDetails, 'Sorting');
							}

							let readData= $injector.get('estimateMainService').getEstiamteReadData();
							if(readData) {
								readData.EstStructureDetails = completeData.EstStructureDetails;
								$injector.get ('estimateMainService').setEstiamteReadData (readData);
							}

							let isColumnConfigActive = updateData.EstConfig.IsColumnConfig;

							syncColumnConfToGrid(updateData.EstColumnConfigComplete, completeData.EstColumnConfigComplete).then(()=>{
								$injector.get('estimateMainDynamicColumnService').reloadDynamicColumnAndData(completeData.EstConfig.IsColumnConfig).then(function(){

									if (isColumnConfigActive){
										let columnConfigDetails = $injector.get('estimateMainConfigDetailService').getColumnConfigDetails();
										let cols = $injector.get('estimateMainDynamicColumnService').generateDynamicColumns(columnConfigDetails);
										estMainStandardDynamicService.attachData({'estConfig': cols});
										estMainCombinedStandardDynamicService.attachData({'estConfig': cols});
									}else{
										estMainStandardDynamicService.detachData('estConfig');
										estMainCombinedStandardDynamicService.detachData('estConfig');
									}

									// Show loading indicator
									estMainStandardDynamicService.showLoadingOverlay();
									estMainCombinedStandardDynamicService.showLoadingOverlay();

									$timeout(function(){
										estMainStandardDynamicService.fireRefreshConfigLayout();
										estMainCombinedStandardDynamicService.fireRefreshConfigLayout();
										estMainStandardDynamicService.hideLoadingOverlay();
										estMainCombinedStandardDynamicService.hideLoadingOverlay();
									}, 400); // backdrop overlay has animation of 300, so we wait 300 and more
								});

								estDialogDataService.onDataLoaded.fire(completeData);
								/*
											  defect 76675, synchronize the label name of dynamic columns between Estimate Configuration
											  Dialog and Grid Layout Dialog in Line Items Container
										  */
								if(completeData.EstColumnConfigComplete && completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave){
									estimateMainEstColumnConfigDetailDataService.setColumnConfigDetailsToViewConfig('681223e37d524ce0b9bfa2294e18d650', completeData.EstColumnConfigComplete.estColumnConfigDetailsToSave);
								}
							});
						}
						else if(dialogConfig.editType === 'assemblies'){
							let colconfigfk = completeData.EstConfig ? completeData.EstConfig.Id : null;
							$injector.get('estimateMainService').setSelectedEstHeaderColumnConfigFk(colconfigfk);
						}
						// refresh Data Records in customizing module
						else if(dialogConfig.editType === 'estBoqUppConfig'){
							// do nothing
						}
						else {
							let customizeDataService = $injector.get('basicsCustomizeInstanceDataService');
							if (customizeDataService){
								customizeDataService.load();
							}
							if(dialogConfig.editType === 'customizeforroundingconfig'){
								$injector.get('basicsLookupdataSimpleLookupService').refreshCachedData({
									valueMember: 'Id',
									displayMember: 'Description',
									lookupModuleQualifier:'basics.customize.estimateroundingconfig'});
							}
						}
					});

					estimateMainEstColumnConfigDetailDataService.setSelected(null);
					estimateMainEstTotalsConfigDetailDataService.setSelected(null);
					estimateMainStructureConfigDetailDataService.setSelected(null);
					estimateMainCostBudgetAssignDetailDataService.setSelected(null);
					estimateMainRuleConfigDetailDataService.setSelected(null);
					estimateMainRoundingConfigDataService.setSelected(null);
				},

				close : function () {
					closeDialog();
				},

				cancel: function () {
					closeDialog();
				}
			};

			function syncColumnConfToGrid(oldColConfig, newColConfig){
				let colPreName = 'ConfDetail';
				let q = $q.when();
				if(oldColConfig.IsUpdColumnConfig || !oldColConfig.estColumnConfigDetailsToSave || !newColConfig.estColumnConfigDetailsToSave){
					return q;
				}

				let lineItemGrid = $injector.get('estimateMainService').getGridId();
				let config = $injector.get('mainViewService').getViewConfig(lineItemGrid);
				if(!config || !config.Propertyconfig){
					return q;
				}

				config.Propertyconfig = angular.isString(config.Propertyconfig) ? JSON.parse(config.Propertyconfig) : angular.isArray(config.Propertyconfig) ? config.Propertyconfig : [];

				let confColumns = _.filter(config.Propertyconfig, conf => {
					return conf.id.indexOf(colPreName) === 0;
				});

				if(!confColumns || confColumns.length <= 0){
					return q;
				}

				_.forEach(confColumns, conf => {
					let oldConf = _.find(oldColConfig.estColumnConfigDetailsToSave, {Id: conf.id.replace(colPreName,'')-0});
					if(!oldConf){
						return;
					}

					let newConf = _.find(newColConfig.estColumnConfigDetailsToSave, i=>{
						let oldKey = oldConf.ColumnId +'_'+oldConf.LineType+'_'+oldConf.MaterialLineId+'_'+(oldConf.MdcCostCodeFk||0)+'_'+(oldConf.Project2mdcCstCdeFk);
						let newKey = i.ColumnId +'_'+i.LineType+'_'+i.MaterialLineId+'_'+(i.MdcCostCodeFk||0)+'_'+(i.Project2mdcCstCdeFk);

						return oldKey === newKey;
					});

					if(!newConf){
						return;
					}

					conf.id = colPreName + newConf.Id;

				});

				$injector.get('mainViewService').setViewConfig(lineItemGrid, config.Propertyconfig , null, true);
				return q;
			}

			function closeDialog(){
				clear();

				estimateMainEstColumnConfigDetailDataService.setSelected(null);
				estimateMainEstTotalsConfigDetailDataService.setSelected(null);
				estimateMainStructureConfigDetailDataService.setSelected(null);
				estimateMainCostBudgetAssignDetailDataService.setSelected(null);
				estimateMainRuleConfigDetailDataService.setSelected(null);
				estimateMainRoundingConfigDataService.setSelected(null);

				$modalInstance.dismiss('cancel');
			}

			$scope.formContainerOptions = {
				formOptions: {
					configure: estimateMainDialogUIConfigService.getFormConfig(),
					validationMethod: function(){return true;}// todo:temp
				}
			};

			$scope.change = function change(item, model) {
				if(model === 'estConfigTypeFk') {
					estimateMainEstConfigDataService.loadComplete(item.estConfigTypeFk).then(function (data) {
						estimateMainEstStructureDataService.setData(data);
						estimateMainEstColumnConfigDataService.setData(data);
						estimateMainEstTotalsConfigDataService.setData(data);
						estimateMainCostBudgetDataService.setData(data);
						estimateMainEstRuleDataService.setData(data);
						estimateMainRoundingConfigDataService.setData(data);

						// To do:change the datasource of combox droplist by contextId
						if (editType !== 'estimate') {
							let estColumnConfigTypeService = $injector.get('estimateMainColumnConfigTypeService');
							estColumnConfigTypeService.loadData().then(function (){
								// let colConfigTypeData = estColumnConfigTypeService.getList();
								estColumnConfigTypeService.getList().then(function(data){
									let colConfigTypeData = data;
									let columnCofigTypeRow =  _.find($scope.formContainerOptions.formOptions.configure.rows, {rid: 'estColConfigType'});
									columnCofigTypeRow.options.items = colConfigTypeData;
								});
							});

							let estTotalsConfigTypeService = $injector.get('estimateMainTotalsConfigTypeService');
							estTotalsConfigTypeService.loadData().then(function () {
								// let toConfigTypeData = estTotalsConfigTypeService.getList();
								estTotalsConfigTypeService.getList().then(function(data){
									let toConfigTypeData = data;
									let totalsConfigTypeRow = _.find($scope.formContainerOptions.formOptions.configure.rows, {rid: 'estTolConfigType'});
									totalsConfigTypeRow.options.items = toConfigTypeData;
								});
							});
						}
					});
				}else if(model === 'isEditUppType'){
					processItem();
					changeUpdateStatus(item.isEditUppType);
					if(item.isEditUppType){
						item.estUppConfigTypeFk = null;
					}
				}
				else if(model === 'estColConfigTypeFk'){
					estimateMainEstColumnConfigDetailDataService.clear();
					estimateMainEstColumnConfigDataService.load(item.estColConfigTypeFk);
				}
				else if(model === 'estStructTypeFk'){
					estimateMainEstStructureDataService.load(item.estStructTypeFk);
				}
				else if(model === 'estUppConfigTypeFk'){
					if(!item.BoqHeaderId){
						estimateMainEstUppDataService.load(item.estUppConfigTypeFk);
					}else{
						estimateMainEstUppDataService.loadByEstNBoq(item.estUppConfigTypeFk,item.BoqHeaderId);
					}
				}
				else if(model === 'estTolConfigTypeFk'){
					estimateMainEstTotalsConfigDetailDataService.clear();
					estimateMainEstTotalsConfigDataService.load(item.estTolConfigTypeFk);
				}
				else if(model === 'costBudgetConfigTypeFk'){
					estimateMainCostBudgetAssignDetailDataService.clear();
					estimateMainCostBudgetDataService.load(item.estTolConfigTypeFk);
				}
				else if(model === 'estRuleAssignTypeFk'){
					estimateMainEstRuleAssignmentParamDataService.clear();
					estimateMainEstRuleDataService.load(item.estRuleAssignTypeFk);
				}
				else if(model === 'estRoundingConfigTypeFk'){
					estimateMainRoundingConfigDetailDataService.clear();
					estimateMainRoundingConfigDataService.load(item.estRoundingConfigTypeFk);
					processItem();
				}
				else if(model === 'isEditEstType'){
					if(item.isEditEstType){
						item.estConfigTypeFk = 0;
						// set the IsUpdEstConfig = false for create a new EstConfig
						estimateMainEstConfigDataService.setIsUpdEstConfig(false);
						processItem();
					}
				}
				else if(model === 'isEditColConfigType'){
					estimateMainEstColumnConfigDataService.isEditColConfigTypeChanged(item);
					if(item.isEditColConfigType){
						estimateMainEstColumnConfigDataService.setIsUpdColumnConfig(false);
						item.estColConfigTypeFk = 0;
						processItem();
					}
				}
				else if(model === 'isEditStructType'){
					if(item.isEditStructType){
						estimateMainEstStructureDataService.setIsUpdStructure(false);
						item.estStructTypeFk = 0;
						processItem();
					}
				}

				else if(model === 'isEditTolConfigType'){
					if(item.isEditTolConfigType){
						estimateMainEstTotalsConfigDataService.setIsUpdTotals(false);
						estimateMainEstTotalsConfigDataService.setDetailGridReadOnly(true);
						estimateMainEstTotalsConfigDataService.updateColumn(false);
						item.estTolConfigTypeFk = 0;
						processItem();
					}
				}
				else if (model === 'LeadingStr'){
					if (item.LeadingStr){
						processItem();
					}
				}
				else if(model === 'ActivateLeadingStr'){
					processItem();
				}else if(model === 'isEditCostBudgetConfigType'){
					if(item.isEditCostBudgetConfigType){
						estimateMainCostBudgetDataService.setIsUpdCostBudget(false);
						item.costBudgetConfigTypeFk = 0;
						processItem();
					}
				}else if(model === 'isEditRoundingConfigType'){
					if(item.isEditRoundingConfigType){
						estimateMainRoundingConfigDataService.setIsUpdRoundingConfig(false);
						item.estRoundingConfigTypeFk = 0;
						processItem();
					}
				}
			};

			$scope.currentItem = {};

			if(dialogConfig.editType === 'estBoqUppConfig'){
				estDialogDataService.setCurrentItem($scope.currentItem);
			}

			// clear all
			function clear(){
				// clear detail
				estimateMainStructureConfigDetailDataService.clear();
				estimateMainEstColumnConfigDataService.clear();
				estimateMainEstTotalsConfigDataService.clear();
				estimateMainUpp2CostcodeDetailDataService.clear();
				estimateMainCostBudgetAssignDetailDataService.clear();
				estimateMainRuleConfigDetailDataService.clear();
				estimateMainEstRuleAssignmentParamDataService.clear();
				estimateMainRoundingConfigDetailDataService.clear();

				// clear type and config description
				estimateMainEstStructureDataService.clear();
				estimateMainEstUppDataService.clear();
				estimateMainEstConfigDataService.clear();
				estimateMainCostBudgetDataService.clear();
				estimateMainEstRuleDataService.clear();
				estimateMainRoundingConfigDataService.clear();

				$scope.currentItem = {};
			}

			function updateData(item){
				if(item.editType){
					editType =item.editType;
				}

				if(item.editType && item.editType ==='estBoqUppConfig')
				{
					estimateMainEstUppDataService.clear();
					estimateMainEstUppDataService.loadByDefault();
				}
				else if(item.editType && item.editType ==='customizeforupp')
				{
					estimateMainEstUppDataService.clear();
					estimateMainEstUppDataService.load(item.uppConfigTypeId);
				}
				else if(item.editType && item.editType ==='customizeforcolumn')
				{
					estimateMainEstColumnConfigDetailDataService.setEditType(item.editType);
					estimateMainEstColumnConfigDataService.load(item.columnConfigTypeId);
				}
				else if(item.editType && item.editType ==='customizeforstructure')
				{
					estimateMainEstStructureDataService.load(item.structureConfigTypeId);
				}
				else if(item.editType && item.editType ==='customizeforruleassign')
				{
					estimateMainEstRuleDataService.load(item.rootAssignTypeId);
				}
				else  if(item.editType && item.editType === 'customizefortotals'){
					estimateMainEstTotalsConfigDetailDataService.setEditType(item.editType);
					estimateMainEstTotalsConfigDataService.load(item.totalsConfigTypeId);
				}
				else  if(item.editType && item.editType === 'customizeforcostbudget'){
					estimateMainCostBudgetDataService.load(item.costBudgetConfigTypeId);
				}
				else if(item.editType && item.editType ==='customizeforall')
				{
					// load data by configid and configTypeId
					estimateMainEstColumnConfigDetailDataService.setEditType(item.editType);
					estimateMainEstTotalsConfigDetailDataService.setEditType(item.editType);
					estimateMainRoundingConfigDetailDataService.setEditType(item.editType);
					setAllData(item);
				}
				else if(item.editType && item.editType ==='customizeforroundingconfig')
				{
					estimateMainRoundingConfigDataService.load(item.estRoundingConfigTypeFk);
				}
				else {
					estimateMainEstColumnConfigDetailDataService.setEditType('Estimate');
					estimateMainEstTotalsConfigDetailDataService.setEditType('Estimate');
					setAllData(item);
				}
			}

			function setAllData(item){
				estimateMainEstConfigDataService.setData(item);
				estimateMainEstColumnConfigDataService.setData(item);
				estimateMainEstTotalsConfigDataService.setData(item);
				estimateMainCostBudgetDataService.setData(item);
				estimateMainEstStructureDataService.setData(item);
				estimateMainEstRuleDataService.setData(item);
				estimateMainRoundingConfigDataService.setData(item);
			}

			function updateItem(item){
				angular.extend($scope.currentItem , item);
				processItem();
			}

			function processItem(){
				estimateMainDialogProcessor.processItem($scope.currentItem, $scope.formContainerOptions.formOptions.configure.rows);
			}

			function changeUpdateStatus(isValid){
				$scope.okBtnDisabled = !isValid;
			}

			let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(3);
			let filters = [
				{
					key: 'estimate-main-wic-group-master-data-filter',
					fn: function (item) {
						// using master data filter
						if(filterIds && filterIds.length > 0) {
							return _.includes(filterIds, item.Id);
						}
						return true;
					}
				}
			];

			if(dialogConfig.editType === 'estBoqUppConfig'){
				$injector.get('estimateMainSidebarWizardService').refreshGenerateLineItemsByLS();
			}

			basicsLookupdataLookupFilterService.registerFilter(filters);

			estDialogDataService.onCurrentItemChange.register(updateData);

			estimateMainEstConfigDataService.onItemChange.register(updateItem);
			estimateMainEstColumnConfigDataService.onItemChange.register(updateItem);
			estimateMainEstStructureDataService.onItemChange.register(updateItem);
			estimateMainEstUppDataService.onItemChange.register(updateItem);
			estimateMainEstTotalsConfigDataService.onItemChange.register(updateItem);
			estimateMainCostBudgetDataService.onItemChange.register(updateItem);
			estimateMainEstRuleDataService.onItemChange.register(updateItem);
			estimateMainRoundingConfigDataService.onItemChange.register(updateItem);

			estimateMainStructureConfigDetailDataService.onUpdateList.register(estimateMainEstStructureDataService.updateStrDetails);
			estimateMainStructureConfigDetailDataService.hasEstStructureErr.register(changeUpdateStatus);
			estimateMainEstTotalsConfigDetailDataService.onUpdateList.register(estimateMainEstTotalsConfigDataService.updateTolDetails);
			estimateMainRoundingConfigDetailDataService.onUpdateList.register(estimateMainRoundingConfigDataService.updateRoundingConfigDetails);

			estimateMainEstColumnConfigDetailDataService.onColumnConfigStatusChange.register(changeUpdateStatus);
			estimateMainEstTotalsConfigDetailDataService.onTotalsConfigStatusChange.register(changeUpdateStatus);

			estimateMainRuleConfigDetailDataService.onRootAssignDetailStatusChange.register(changeUpdateStatus);

			estimateMainCostBudgetAssignDetailDataService.onUpdateList.register(estimateMainCostBudgetDataService.updateCostBudgetAssignDetails);

			estimateMainEstUppDataService.setCurrentScope($scope);

			$scope.$on('$destroy', function () {

				if(dialogConfig.editType === 'estBoqUppConfig'){
					$injector.get('estimateMainEstUppConfigTypeService').clearFilterByMdcContextId();
				}

				estDialogDataService.onCurrentItemChange.unregister(updateData);

				estimateMainEstConfigDataService.onItemChange.unregister(updateItem);
				estimateMainEstColumnConfigDataService.onItemChange.unregister(updateItem);
				estimateMainEstStructureDataService.onItemChange.unregister(updateItem);
				estimateMainEstUppDataService.onItemChange.unregister(updateItem);
				estimateMainEstTotalsConfigDataService.onItemChange.unregister(updateItem);
				estimateMainCostBudgetDataService.onItemChange.unregister(updateItem);
				estimateMainEstRuleDataService.onItemChange.unregister(updateItem);
				estimateMainRoundingConfigDataService.onItemChange.unregister(updateItem);

				estimateMainCostBudgetAssignDetailDataService.onUpdateList.unregister(estimateMainCostBudgetDataService.updateCostBudgetAssignDetails);
				estimateMainStructureConfigDetailDataService.onUpdateList.unregister(estimateMainEstStructureDataService.updateStrDetails);
				estimateMainStructureConfigDetailDataService.hasEstStructureErr.unregister(changeUpdateStatus);
				estimateMainEstColumnConfigDetailDataService.onColumnConfigStatusChange.unregister(changeUpdateStatus);
				estimateMainEstTotalsConfigDetailDataService.onTotalsConfigStatusChange.unregister(changeUpdateStatus);
				estimateMainRuleConfigDetailDataService.onRootAssignDetailStatusChange.unregister(changeUpdateStatus);
				estimateMainRoundingConfigDetailDataService.onUpdateList.unregister(estimateMainRoundingConfigDataService.updateRoundingConfigDetails);

				estimateMainDialogProcessor.clearConfig();
				estDialogDataService.cleardata();
				$scope.currentItem = {};
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
				estimateMainEstUppDataService.setCurrentScope(null);
				estimateMainEstUppDataService.clear();
			});
		}
	]);
})(angular);
