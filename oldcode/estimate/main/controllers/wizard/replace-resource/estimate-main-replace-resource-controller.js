/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* globals globals , _ */
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainReplaceResourceWizardController',
		function ($scope, $injector, $timeout, estimateMainFilterService, cloudDesktopPinningContextService, $translate, platformGridAPI, platformContextService,
							basicsLookupdataLookupFilterService, estimateMainReplaceResourceUIService, estimateMainService, estimateMainReplaceResourceCommonService,
							estimateMainReplaceResourceFieldsGridDataService, estimateAssembliesFilterService, estimateMainResourceFrom, estimateMainWizardContext,
							estimateAssembliesService, estimateMainReplaceFunctionType, estimateMainResourceType) {

			$scope.path = globals.appBaseUrl;
			$scope.entity = {
				FunctionTypeFk: 111,
				ResourceTypeId:11
			};
			$scope.modalOptions = {};

			function getEstHeaderFk() {
				let estimateService = $injector.get('estimateMainService');
				let isAssemblyModule = platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118');
				if(estimateService && !isAssemblyModule){
					$scope.entity.EstHeaderFk = estimateService.getSelectedEstHeaderId();
				}
				else{
					$scope.entity.EstHeaderFk = null;
				}
			}

			getEstHeaderFk();

			$scope.noFilterDataError = {
				show: false,
				messageCol: 1,
				message: $translate.instant('estimate.main.replaceResourceWizard.noFilterDataError'),
				iconCol: 1,
				type: 1
			};

			// $scope.configTitle = $translate.instant('estimate.main.replaceResourceWizard.configTitle');
			$scope.modalOptions.headerText = $translate.instant('estimate.main.replaceResourceWizard.configTitle');

			let isFirtTimeLoaded = true;

			$injector.get('estimateMainPlantAssemblyDialogService').setOptions({});
			$scope.formOptionsReplacementSettings = {
				configure: estimateMainReplaceResourceUIService.getReplacementFormConfig()
			};
			setDefaultElement();

			$scope.entity.estimateScope = 1;

			// region loading status
			$scope.isLoading = false;
			$scope.loadingInfo = '';

			function loadingStatusChanged(newStatus /* Boolean: true or false */) {// jshint ignore:line
				$scope.isLoading = newStatus;
			}

			// endregion

			// region execute

			$scope.canExecute = function () {
				let result =  $scope.entity.ToBeReplacedFk && !$scope.noFilterDataError.show;
				if($scope.entity.FunctionTypeFk !== estimateMainReplaceFunctionType.RemoveResource){
					result = result && $scope.entity.BeReplacedWithFk;
					if([111, 112, 113].indexOf($scope.entity.FunctionTypeFk) >= 0){
						let wizardConfig = estimateMainWizardContext.getConfig();
						if(wizardConfig === estimateMainResourceFrom.EstimateAssemblyResource){
							return result;
						}else{
							return result && $scope.entity.SourceJobFk;
						}
					}
				}

				return result;
			};

			// execute function
			function getFilterData() {
				// get the further filter to get the resources
				let wizardConifg = estimateMainWizardContext.getConfig();
				let filterRequest =
					wizardConifg === estimateMainResourceFrom.EstimateAssemblyResource ?
						estimateAssembliesFilterService.getFilterRequest()
						: estimateMainService.getLastFilter();
				let fieldList = estimateMainReplaceResourceFieldsGridDataService.getList();
				let changeFields = _.map(_.filter(fieldList, {IsChange: true}), function (item) {
					return {
						'ChangeFieldId': item.Id,
						'ChangeFieldValue': item.ChangeFieldValue
					};
				});
				let lineItemsIds = wizardConifg === estimateMainResourceFrom.EstimateAssemblyResource ?
					_.map(estimateAssembliesService.getSelectedEntities(), 'Id')
					: _.map(estimateMainService.getSelectedEntities(), 'Id');

				return {
					CurrentElementFk: $scope.entity.ToBeReplacedFk,
					ReplacedElementFk: $scope.entity.BeReplacedWithFk,
					FunctionType: $scope.entity.FunctionTypeFk,
					ChangeFields: changeFields,
					filterRequest: filterRequest,
					AssemblyHeaderFk: $scope.entity.AssemblyHeaderFk,
					OnlyGetCount: false,
					ResourceFrom: wizardConifg,
					EstimateScope: $scope.entity.estimateScope,
					LineItemIds: lineItemsIds,
					SourceJobFk: $scope.entity.SourceJobFk,
					IgnoreJob: $scope.entity.IgnoreJob,
					TargetJobFk: $scope.entity.TargetJobFk,
					ResourceTypeId: $scope.entity.ResourceTypeId,
					SelectedPlantAssemblyIds: $scope.entity.SelectedPlantAssemblyIds
				};
			}

			$scope.execute = function () {
				let filterData = getFilterData();

				if(filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceCostCode
					|| filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceMaterialByCostCode
					|| filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceAssemblyByCostCode) {
					filterData.ReplacedElementFk = getRealReplacedElementFk(filterData.ReplacedElementFk);
				}

				loadingStatusChanged(true);
				estimateMainReplaceResourceCommonService.executeReplace(filterData).then(function () {
					loadingStatusChanged(false);
					let wizardConifg = estimateMainWizardContext.getConfig();
					if(wizardConifg=== estimateMainResourceFrom.EstimateAssemblyResource){
						estimateAssembliesService.clear();
						estimateAssembliesService.load();
						$injector.get('estimateAssembliesResourceDynamicUserDefinedColumnService').clearValueService();
					}else{
						estimateMainService.clear();
						estimateMainService.load();
						$injector.get('estimateMainResourceDynamicUserDefinedColumnService').clearValueService();
					}
					$scope.close();
				});
			};

			function getRealReplacedElementFk(replacedElementFk){
				let replaceElement = $injector.get('estimateMainJobCostcodesLookupService').getItemById(replacedElementFk);
				if(replaceElement){
					return  replaceElement.OriginalId || replaceElement.Id;
				}

				return  replacedElementFk;
			}

			// endregion

			$scope.close = function () {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.close();
			};

			// region filter

			// endregion

			function setDefaultElement() {
				if (isFirtTimeLoaded) {
					$scope.entity.ToBeReplacedFk = estimateMainReplaceResourceCommonService.getDefaultCurrentElement();
					$scope.entity.SourceJobFk = estimateMainReplaceResourceCommonService.getDefaultCurrentElementJob();
					if ($scope.entity.ToBeReplacedFk) {
						let currentElement = {Id: $scope.entity.ToBeReplacedFk};
						currentItemChange(currentElement, true);
					}
					let functionType = estimateMainReplaceResourceCommonService.getSelectedFunction();
					if(functionType && functionType.Id){
						$scope.entity.FunctionTypeFk = functionType.Id;
					}

					let resourceDataService = estimateMainWizardContext.getConfig() === estimateMainResourceFrom.EstimateAssemblyResource
						? $injector.get('estimateAssembliesResourceService')
						: $injector.get('estimateMainResourceService');

					let currentEntity = resourceDataService.getSelectedTargetReplacement();
					if(currentEntity){
						switch (currentEntity.EstResourceTypeFk){
							case estimateMainResourceType.Material:{
								$scope.entity.ResourceTypeId = estimateMainReplaceFunctionType.Material;
								break;
							}
							case estimateMainResourceType.PlantDissolved:
							case estimateMainResourceType.Plant:{
								$scope.entity.ResourceTypeId = estimateMainReplaceFunctionType.EquipmentAssembly;
								break;
							}
							case estimateMainResourceType.Assembly:
							case estimateMainResourceType.SubItem:{
								if(currentEntity.EstResourceTypeFk === estimateMainResourceType.SubItem && !currentEntity.EstAssemblyFk){
									$scope.entity.ResourceTypeId = estimateMainReplaceFunctionType.CostCode;
								}else{
									$scope.entity.ResourceTypeId = estimateMainReplaceFunctionType.Assembly;
								}
								break;
							}
							default:{
								$scope.entity.ResourceTypeId = estimateMainReplaceFunctionType.CostCode;
							}
						}
					}
				}
			}

			function isCurrentJobFkReadonly(entity){
				let materialOrCostCodeTypes = [estimateMainReplaceFunctionType.ReplaceCostCode, estimateMainReplaceFunctionType.ReplaceCostCodeByMaterial, estimateMainReplaceFunctionType.ReplaceCostCodeByAssembly,
					estimateMainReplaceFunctionType.ReplaceMaterial, estimateMainReplaceFunctionType.ReplaceMaterialByCostCode, estimateMainReplaceFunctionType.ReplaceMaterialByAssembly,
					estimateMainReplaceFunctionType.ReplaceAssembly, estimateMainReplaceFunctionType.ReplacePlantByPlant, estimateMainReplaceFunctionType.RemoveResource];

				return (!_.includes(materialOrCostCodeTypes, entity.FunctionTypeFk))
					|| (entity.FunctionTypeFk === estimateMainReplaceFunctionType.RemoveResource && entity.ResourceTypeId === estimateMainReplaceFunctionType.Assembly);
			}

			function formUpdate(functionType, resourceType) {
				if (functionType && functionType.Id) {

					// reload the replacement for config
					estimateMainReplaceResourceCommonService.setSelectedFunction(functionType);

					let replaceToType = estimateMainReplaceResourceCommonService.getReplaceToType();
					if(replaceToType === 1){
						$injector.get('estimateMainLookupService').getProjectCostCodes();
					}else if(replaceToType === 2){
						$injector.get('estimateMainPrjMaterialLookupService').loadPrjMaterialTree();
					}

					$scope.entity.FunctionTypeFk = functionType.Id;
					$scope.entity.SourceJobFk = null;
					$scope.entity.ResourceTypeId = resourceType || $scope.entity.ResourceTypeId;
					$scope.entity.SelectedPlantAssemblyCodes = '';
					$scope.entity.SelectedPlantAssemblyIds = [];
					estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(0);

					let newConfig = estimateMainReplaceResourceUIService.getReplacementFormConfig(true, $scope.entity.ResourceTypeId);

					let formConfig = $scope.formOptionsReplacementSettings.configure;
					formConfig.rows[2] = newConfig.rows[2];
					formConfig.rows[3] = newConfig.rows[3];
					formConfig.groups[1].visible = newConfig.groups[1].visible;

					// hide those dynamic rows
					_.forEach(formConfig.rows, function (item) {
						if(item.rid === 'targetJob' || item.rid === 'selectedPlantAssemblyCodes'){
							item.visible = false;
						}
					});

					let newTargetJob = _.find(newConfig.rows, function (item) {
						return item.rid === 'targetJob';
					}),
						newSelectedPlantAssCodes = _.find(newConfig.rows, function (item) {
							return item.rid === 'selectedPlantAssemblyCodes';
						});
					if(newTargetJob){
						let oldTargetJob = _.find(formConfig.rows, function (item) {
							return item.rid === 'targetJob';
						});
						if(oldTargetJob){
							oldTargetJob.visible = true;
						}else{
							newTargetJob.visible = true;
							formConfig.rows.push(newTargetJob);
						}
					}

					if(newSelectedPlantAssCodes){
						let oldSelectedPlantAssCodes = _.find(formConfig.rows, function (item) {
							return item.rid === 'selectedPlantAssemblyCodes';
						});
						if(oldSelectedPlantAssCodes){
							oldSelectedPlantAssCodes.visible = true;
						}else{
							formConfig.rows.push(newSelectedPlantAssCodes);
						}
					}

					let sourceJobFk = _.find(formConfig.rows, function (item) {
						return item.rid === 'lgmjobfk';
					});
					if(sourceJobFk) {
						sourceJobFk.readonly = !sourceJobFk
							|| isCurrentJobFkReadonly($scope.entity);

						sourceJobFk.required = [111, 112, 113].indexOf($scope.entity.FunctionTypeFk) >= 0
							|| ($scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.RemoveResource && $scope.entity.ResourceTypeId !== estimateMainReplaceFunctionType.Assembly);
						// source job lookup

						// index is 6 means  rid:lgmjobfk

						sourceJobFk.visible = !$scope.entity.IgnoreJob;
					}

					let newSourceType = _.find(newConfig.rows, function (item) {
						return item.rid === 'sourceType';
					});
					_.forEach(formConfig.rows, function (item) {
						if(item.rid === 'sourceType'){
							item.visible = newSourceType.visible;
						}
					});

					setDefaultElement();

					if(!$scope.entity.ToBeReplacedFk && sourceJobFk){
						sourceJobFk.readonly = true;
					}
				}
			}

			estimateMainReplaceResourceCommonService.onFormConfigUpdated.register(formUpdate);

			function broadcastConfigUpdated(){
				$scope.$broadcast('form-config-updated');
			}
			estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.register(broadcastConfigUpdated);

			// can't change this to let, cause function is invoke by event, and it can access this
			var checking = true;

			function currentItemChange(currentElement, setFirstTime) {
				if (currentElement) {

					if (!setFirstTime) {
						isFirtTimeLoaded = false;
					}

					let filterData = getFilterData();
					filterData.OnlyGetCount = true;
					filterData.CurrentElementFk = currentElement.Id;

					loadingStatusChanged(true);
					$scope.noFilterDataError.show = false;
					let checkSourceJob = $scope.entity.IgnoreJob ? true : $scope.entity.SourceJobFk;
					if(filterData.OnlyGetCount && filterData.CurrentElementFk && filterData.CurrentElementFk > 0 && checkSourceJob && checking) {
						checking = false;
						estimateMainReplaceResourceCommonService.postReplace(filterData).then(function (response) {
							loadingStatusChanged(false);
							checking = true;
							$scope.noFilterDataError.show = (response.data && response.data.TotalCount <= 0);
						});
					}
					else {
						loadingStatusChanged(false);
					}
				}
			}

			function reset() {
				$scope.formOptionsReplacementSettings = {
					configure: estimateMainReplaceResourceUIService.getReplacementFormConfig()
				};
				$scope.entity.FunctionTypeFk = estimateMainReplaceFunctionType.ReplaceCostCode;
				estimateMainReplaceResourceCommonService.setSelectedFunction(null);
				estimateMainReplaceResourceCommonService.onFormConfigUpdated.unregister(formUpdate);
				estimateMainReplaceResourceCommonService.onCurrentItemChange.unregister(currentItemChange);
				estimateMainReplaceResourceCommonService.onCostCodeTargetChanged.unregister(targetJobChange);
				estimateMainReplaceResourceCommonService.onBroadcastConfigUpdated.unregister(broadcastConfigUpdated);
				basicsLookupdataLookupFilterService.unregisterFilter(filters);

				$scope.entity.EstHeaderFk = null;
				$scope.entity.SourceJobFk = null;
				$scope.entity.TargetJobFk = null;
				$scope.entity.ToBeReplacedFk = null;
				$scope.entity.BeReplacedWithFk = null;
				$scope.entity.TargetProjectCostCodeId = null;
				estimateMainReplaceResourceCommonService.setDefaultCurrentElement(null);
				estimateMainReplaceResourceCommonService.setDefaulteCurrentElementJob(null);
				estimateMainReplaceResourceCommonService.setReplaceElement(null);
				estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
			}

			estimateMainReplaceResourceCommonService.onCurrentItemChange.register(currentItemChange);

			function targetJobChange(targetFk) {
				$scope.entity.BeReplacedWithFk = targetFk;
			}

			estimateMainReplaceResourceCommonService.onCostCodeTargetChanged.register(targetJobChange);

			let filters = [
				{
					key: 'estimate-main-material-project-lookup-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						let item = cloudDesktopPinningContextService.getPinningItem('project.main');
						searchOptions.Filter = {};
						if (item) {
							searchOptions.Filter.ProjectId = item.id;
							if(entity.SourceJobFk) {
								searchOptions.Filter.LgmJobFk = entity.SourceJobFk;
							}
							if(entity.EstHeaderFk){
								searchOptions.Filter.EstHeaderFk = entity.EstHeaderFk;
							}

							searchOptions.ContractName = 'EstimateResourceMaterialFilter';
						}
					}
				},
				{
					key: 'estimate-main-replace-material-lookup-filter',
					serverSide: true,
					fn: function (entity, searchOptions) {
						let item = cloudDesktopPinningContextService.getPinningItem('project.main');
						searchOptions.Filter = {};
						if (item) {
							searchOptions.Filter.ProjectId = item.id;
							if(entity.TargetJobFk) {
								searchOptions.Filter.LgmJobFk = entity.TargetJobFk;
							}
							searchOptions.ContractName = 'EstimateMaterialFilter';

							searchOptions.MaterialTypeFilter = {
								IsForEstimate: true
							};
						}
					}
				},
				{
					key: 'estimate-main-project-cost-code-job-filter',
					fn: function (item) {
						if($scope.entity.BeReplacedWithFk)
						{
							let beReplacedWithFk = getRealReplacedElementFk($scope.entity.TargetProjectCostCodeId);
							return (item.OriginalId === beReplacedWithFk);
						}
						return false;
					}
				},
				{
					key: 'estimate-main-project-material-job-filter',
					fn: function (item) {
						if($scope.entity.BeReplacedWithFk)
						{
							return (item.MdcMaterialFk === $scope.entity.BeReplacedWithFk || item.Id === 0);
						}
						return false;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			function triggerChange() {
				if ($scope.entity.ToBeReplacedFk) {
					let currentElement = {Id: $scope.entity.ToBeReplacedFk};
					if($scope.entity.ToBeReplacedElement && $scope.entity.ToBeReplacedElement.LgmJobFk){
						$scope.entity.SourceJobFk = $scope.entity.ToBeReplacedElement.LgmJobFk;
					}
					currentItemChange(currentElement, true);
				}
				else{
					$scope.entity.SourceJobFk = null;
				}
			}

			$scope.$watch('entity.estimateScope', function(){
				triggerChange();
			});

			$scope.$watch('entity.IgnoreJob', function(newValue, oldValue){
				if(newValue === oldValue){
					return;
				}
				triggerChange();
				let functionType =estimateMainReplaceResourceCommonService.getSelectedFunction();
				estimateMainReplaceResourceCommonService.onFormConfigUpdated.fire(functionType);
				if(replaceElementJobDisabled){
					setReplaceElementJobDisabled(true);
				}
				broadcastConfigUpdated();
			});

			// eslint-disable-next-line no-unused-vars
			$scope.$watch('entity.ToBeReplacedFk', function(newValue){
				triggerChange();
				estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(newValue);

				let formConfig = $scope.formOptionsReplacementSettings.configure;

				let sourceJob = _.find(formConfig.rows, function (item) {
					return item.rid === 'lgmjobfk';
				});
				if(sourceJob){
					sourceJob.readonly = !newValue;
				}

				broadcastConfigUpdated();
			});

			$scope.$watch('entity.SourceJobFk', function(){
				triggerChange();
			});

			function setReplaceElementJobDisabled(_readonly) {
				let newConfig = estimateMainReplaceResourceUIService.getReplacementFormConfig(true, $scope.entity.ResourceTypeId);
				let formConfig = $scope.formOptionsReplacementSettings.configure;

				let hasTargetJob = _.find(newConfig.rows, function (item) {
					return item.rid === 'targetJob';
				});
				if(hasTargetJob){
					_.forEach(formConfig.rows, row => {
						if(row.rid === 'targetJob'){
							row.readonly = _readonly;
						}
					});
				}
			}

			let replaceElementJobDisabled = false;

			$scope.$watch('entity.BeReplacedWithFk', function(newValue, oldValue){
				$injector.get('$timeout')(function () {
					beReplaceFkChanges(newValue, oldValue);
				});
			});

			function beReplaceFkChanges(newValue, oldValue){
				replaceElementJobDisabled = false;
				if(newValue === oldValue){
					return;
				}

				if ($scope.entity.BeReplacedWithFk) {
					// set the target job with default value(if the jobs are exist, default is estimate job)
					let wizardConifg = estimateMainWizardContext.getConfig();

					estimateMainReplaceResourceCommonService.setReplaceElement(null);
					if(wizardConifg !== estimateMainResourceFrom.EstimateAssemblyResource) {
						if ($scope.entity.FunctionTypeFk) {
							// default will set the Targetjobfk with header
							let estHeader = estimateMainService.getSelectedEstHeaderItem();
							let headerJobFk = estHeader && estHeader.LgmJobFk ? estHeader.LgmJobFk : null;

							if ($scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceCostCode
								|| $scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceMaterialByCostCode
								|| $scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceAssemblyByCostCode) {
								let prjCostCodes = $injector.get('estimateMainLookupService').getPrjCostCodesSyn();
								let findPrjCostCode = _.find(prjCostCodes, function (item) {
									return item.MdcCostCodeFk === getRealReplacedElementFk($scope.entity.BeReplacedWithFk);
								});
								if(findPrjCostCode){
									if(headerJobFk){
										let secfindPrjCostCode = _.find(prjCostCodes, function (item) {
											return item.MdcCostCodeFk === getRealReplacedElementFk($scope.entity.BeReplacedWithFk) && item.LgmJobFk === headerJobFk;
										});
										if(secfindPrjCostCode){
											findPrjCostCode = secfindPrjCostCode;
										}
									}
									$scope.entity.TargetProjectCostCodeId = findPrjCostCode.Id;
									$scope.entity.TargetJobFk = headerJobFk || findPrjCostCode.LgmJobFk;
									estimateMainReplaceResourceCommonService.setReplaceElement(findPrjCostCode);
									setReplaceElementJobDisabled(false);
								}
								else{
									// set target job disabled
									$scope.entity.TargetProjectCostCodeId = null;
									replaceElementJobDisabled = true;
									setReplaceElementJobDisabled(true);
								}
								broadcastConfigUpdated();
							}
							else if ($scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceCostCodeByMaterial
								|| $scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceMaterial
								|| $scope.entity.FunctionTypeFk === estimateMainReplaceFunctionType.ReplaceAssemblyByMaterial) {
								let prjMaterials = $injector.get('estimateMainPrjMaterialLookupService').getPrjMaterialSyn();
								let findprjMaterials = _.find(prjMaterials, function (item) {
									return item.MdcMaterialFk === $scope.entity.BeReplacedWithFk;
								});
								if(findprjMaterials){
									if(headerJobFk){
										let secfindprjMaterials = _.find(prjMaterials, function (item) {
											return item.MdcMaterialFk === $scope.entity.BeReplacedWithFk && item.LgmJobFk === headerJobFk;
										});
										if(secfindprjMaterials){
											findprjMaterials = secfindprjMaterials;
										}
									}
									$scope.entity.TargetProjectCostCodeId = findprjMaterials.Id;
									$scope.entity.TargetJobFk = headerJobFk || findprjMaterials.LgmJobFk;
									estimateMainReplaceResourceCommonService.setReplaceElement(findprjMaterials);
									setReplaceElementJobDisabled(false);
								}
								else{
									// set target job disabled
									$scope.entity.TargetProjectCostCodeId = null;
									replaceElementJobDisabled = true;
									setReplaceElementJobDisabled(true);
								}
								broadcastConfigUpdated();
							}
						}
					}
				}
				else {
					$scope.entity.TargetJobFk = null;
					$scope.entity.TargetProjectCostCodeId = null;
					$scope.entity.RepaceWithProjectCostCodeId = null;
					setReplaceElementJobDisabled(true);
					broadcastConfigUpdated();
				}
			}

			// un-register on destroy
			$scope.$on('$destroy', function () {
				reset();
			});
		});
})();
