/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals, _ */
	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainModifyResourceWizardController',
		function ($scope, $injector, $timeout, estimateMainFilterService, cloudDesktopPinningContextService, $translate, platformGridAPI, platformContextService, basicsLookupdataLookupFilterService, estimateMainReplaceResourceUIService, estimateMainService, estimateMainReplaceResourceCommonService, basicsCommonRuleEditorService, configurationService, estimateAssembliesFilterService, estimateMainResourceFrom, estimateMainWizardContext, estimateAssembliesService) {

			$scope.path = globals.appBaseUrl;
			$scope.entity = {};
			$scope.modalOptions = {
				isShown: function () {
					return true;
				},
				ok: function () {
					configurationService.listToDelete = [];
					configurationService.update().then(function () {
						$scope.close();
					});
				},
				del: function(){

					$injector.get('platformModalService').showYesNoDialog($translate.instant('estimate.main.replaceResourceWizard.deleteConfigContent'), $translate.instant('estimate.main.replaceResourceWizard.deleteConfigTitle')).then(function (result) {
						if (result.yes) {
							let currentConfig = configurationService.lastActiveConfig;
							if(!!currentConfig && currentConfig.Version > 0){
								configurationService.deleteBulkConfig(currentConfig);
								configurationService.update().then(function () {
									configurationService.listToDelete = [];
								});
							}
						}
					});
				},
				isDisabled: function (btn) {
					switch (btn) {
						case 'save':
							return !configurationService.savePossible();
						case 'delete':
							return  !configurationService.lastActiveConfig || configurationService.lastActiveConfig.Version === 0;
					}
					return true;
				},
				saveText: $translate.instant('platform.bulkEditor.save'),
				deleteText: $translate.instant('cloud.common.delete')
			};


			// $scope.configTitle = $translate.instant('estimate.main.modifyResourceWizard.configTitle');
			$scope.modalOptions.headerText = $translate.instant('estimate.main.modifyResourceWizard.configTitle');

			$scope.formOptionsReplacementSettings = {
				configure: estimateMainReplaceResourceUIService.getModifyFormConfig()
			};

			// region loading status
			$scope.isLoading = false;
			$scope.loadingInfo = '';
			$scope.entity.estimateScope = 1;

			$injector.get('estimateMainResourceAssemblyLookupService').setEstimateScope($scope.entity.estimateScope);

			$scope.$watch('entity.estimateScope', function (estScope) {
				$injector.get('estimateMainResourceAssemblyLookupService').setEstimateScope(estScope);
			});

			function loadingStatusChanged(newStatus /* Boolean: true or false */) {// jshint ignore:line
				$scope.isLoading = newStatus;
			}

			// endregion

			// region execute

			$scope.canExecute = function () {
				return checkIfAnyBulkConfig();
			};

			function checkIfAnyBulkConfig() {
				try {
					let configList = estimateMainReplaceResourceCommonService.getBulkEditorConfig();
					if (configList && configList.BulkListToSave && configList.BulkListToSave.length > 0 && configList.BulkListToSave[0].BulkGroup && configList.BulkListToSave[0].BulkGroup.length > 0 && configList.BulkListToSave[0].BulkGroup[0][0].Children.length > 0) {
						let configs = configList.BulkListToSave[0].BulkGroup[0][0].Children;
						return !!_.find(configs, function (item) {
							let directOperator = [29,30,41,43,
								46,
								47,
								48,
								49];
							// 46 47 48 49 remove value
							let anyValue = item.Operands && item.Operands.length>0 && item.Operands[1] && item.Operands[1].Literal && item.Operands[1].Literal.String;
							let propertyValue = anyValue === '0';
							anyValue = (anyValue || propertyValue);

							return (anyValue || (item.OperatorFk !== null && item.OperatorFk !== 1 && (_.includes(directOperator, item.OperatorFk))));
						});
					}
				}
				catch(e) {
					return false;
				}
			}

			// execute function
			$scope.execute = function () {
				// get the further filter to get the resources
				let wizardConifg = estimateMainWizardContext.getConfig();
				let isEstAssemblyResource = wizardConifg === estimateMainResourceFrom.EstimateAssemblyResource;
				let filterRequest = isEstAssemblyResource ? estimateAssembliesFilterService.getFilterRequest() : estimateMainFilterService.getFilterRequest();
				let specifyResource = estimateMainReplaceResourceCommonService.getSpecifyResource();
				let configList = estimateMainReplaceResourceCommonService.getBulkEditorConfig();
				let lineItemsIds = isEstAssemblyResource ? _.map(estimateAssembliesService.getSelectedEntities(), 'Id') : _.map(estimateMainService.getSelectedEntities(), 'Id');

				let filterData = {
					filterRequest: filterRequest,
					SpecifyType: estimateMainReplaceResourceCommonService.getSpecifyType(),
					SpecifyResource: specifyResource ? specifyResource.Id || 0 : 0,
					SpecifyResCode: specifyResource && specifyResource.Code ? specifyResource.Code : '',
					ResourceFields: estimateMainReplaceResourceCommonService.getResourceFields(true),
					BulkCompleteData: configList,
					ResourceFrom: wizardConifg,
					EstimateScope: $scope.entity.estimateScope,
					LineItemIds: lineItemsIds,
					IgnoreJob: $scope.entity.IgnoreJob,
					TargetJobFk: $scope.entity.TargetJobFk
				};
				loadingStatusChanged(true);
				estimateMainReplaceResourceCommonService.executeModify(filterData).then(function () {
					loadingStatusChanged(false);

					if(isEstAssemblyResource){
						estimateAssembliesService.clear();
						estimateAssembliesService.load();
					}else{
						estimateMainService.clear();
						estimateMainService.load();
					}

					$scope.close();
				});
			};
			// endregion

			$scope.close = function () {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.close();
			};

			// region filter

			// endregion

			function formUpdate(functionType) {
				if(functionType && functionType.Id) {

					// reload the replace for config
					estimateMainReplaceResourceCommonService.setSelectedFunction(functionType);
					$scope.entity.FunctionTypeFk = functionType.Id;
					let newConfig = estimateMainReplaceResourceUIService.getReplacementFormConfig();

					$scope.formOptionsReplacementSettings.configure.rows[2] = newConfig.rows[2];
					$scope.formOptionsReplacementSettings.configure.rows[3] = newConfig.rows[3];

					$scope.$broadcast('form-config-updated');
				}
			}

			estimateMainReplaceResourceCommonService.onFormConfigUpdated.register(formUpdate);

			function clear() {
				basicsCommonRuleEditorService.clearRulesData();
				configurationService.clearList();

				// estimateMainReplaceResourceCommonService.clear();
				estimateMainReplaceResourceCommonService.setSelectedToBeReplaceFk(null);
			}

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
				}
			];

			function reset() {
				$scope.formOptionsReplacementSettings = {
					configure: estimateMainReplaceResourceUIService.getModifyFormConfig()
				};
				clear();

				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			}

			basicsLookupdataLookupFilterService.registerFilter(filters);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				reset();
			});
		});
})();
