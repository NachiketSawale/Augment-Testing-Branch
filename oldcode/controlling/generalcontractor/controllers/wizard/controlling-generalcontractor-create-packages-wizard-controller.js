
(function (angular) {
	'use strict';

	angular.module('controlling.generalcontractor').controller('controllingGeneralContractorCreatePackagesWizardController',
		['_','$http','globals', '$log', '$timeout', '$scope', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'controllingGeneralContractorCreatePackagesWizardDialogService','basicsLookupdataLookupDescriptorService',
			function (_,$http,globals, $log, $timeout, $scope, $injector, $translate, platformDataValidationService, platformRuntimeDataService, platformTranslateService, dialogConfigService,basicsLookupdataLookupDescriptorService) {


				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;
				$scope.GenerateType = $scope.dataItem.GenerateType;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};

				$scope.noPinProjectError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.noPinnedProject'),
					iconCol: 1,
					type: 3
				};
				$scope.generatenNumberFailedInfo = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.generatenNumberFailedInfo'),
					iconCol: 1,
					type: 3
				};

				$scope.budgetKindInfo = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.noBudgetKindInfo'),
					iconCol: 1,
					type: 3
				};

				$scope.budgetInfo = {
					show: false,
					messageCol: 1,
					message: $translate.instant('controlling.generalcontractor.budgetInfoShow'),
					iconCol: 1,
					type: 2
				};

				// set readonly rows and unvisbile rows
				function getFormConfig() {
					const formConfig = dialogConfigService.getFormConfig();

					const structureRow = _.find(formConfig.rows, {rid: 'structurefk'});
					structureRow.options.lookupOptions.events = [
						{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								let structure = args.selectedItem;
								if(structure && structure.Id > 0){
									dialogConfigService.getConfigurationFkPromist(structure.Id).then(function(response){
										var prcConfigurationData =  $injector.get('basicsLookupdataLookupDescriptorService').getData('prcConfiguration');
										var oldConfigHeader = _.find(prcConfigurationData, {Id: $scope.dataItem.ConfigurationFk});
										var newConfigHeader = _.find(prcConfigurationData, {Id: response.data});

										oldConfigHeader = _.isUndefined(oldConfigHeader) ? {PrcConfigHeaderFk: -1} : oldConfigHeader;
										if (oldConfigHeader.PrcConfigHeaderFk !== newConfigHeader.PrcConfigHeaderFk) {
											if ($scope.dataItem.ConfigurationFk !== response.data) {
												$scope.dataItem.ConfigurationFk = response.data;

												if(!validateDialogConfigurationFk($scope.dataItem.ConfigurationFk)){
													$scope.dataItem.ConfigurationFk = dialogConfigService.getStructureDefaultConfigurationFk();
													validateDialogConfigurationFk($scope.dataItem.ConfigurationFk);
												}
											}
										}
									});
								}
							}
						}
					]

					return formConfig;
				}

				// translate form config.
				let formConfig = getFormConfig();

				function reSet(){
					$scope.dataItem.prcPakcageFk = null;
					$scope.dataItem.StructureFk = null;
					$scope.dataItem.Remark = null;
					$scope.dataItem.Description = null;
					$scope.dataItem.PackageStatusFk = null;
				}

				function setStructureReadOnly(){
					let packageStatuss = $injector.get('basicsLookupdataLookupDescriptorService').getData('PackageStatus');
					packageStatuss = _.filter(packageStatuss,function(d){
						return d.IsReadonly;
					});

					let ids =  _.map(packageStatuss,'Id');

					_.forEach(formConfig.rows, function (row) {
						if(row.rid ==='structurefk'){
							row.readonly = _.indexOf(ids,$scope.dataItem.PackageStatusFk)>=0;
						}
					});

					$scope.$parent.$broadcast('form-config-updated', {});

				}

				$scope.onSelectionChanged = function (value) {
					const isCreate = value === '1';
					$scope.dataItem.GenerateType = $scope.GenerateType = value;
					reSet();
					setStructureReadOnly();

					_.forEach(formConfig.rows, function (row) {
						if(row.rid ==='prcpackagefk'){
							row.readonly = isCreate;
							row.required = !isCreate;
							row.visible = !isCreate;
							$scope.dataItem.PrcPackageFk=$scope.dataItem.StructureFk = null;
						}else if(row.rid ==='code'){
							row.readonly = !isCreate;
							row.required = isCreate;
							row.visible = isCreate;

							if(!isCreate) {
								$scope.dataItem.Code = null;
							}else {
								dialogConfigService.validateDialogConfigurationFk ($scope.dataItem, $scope.dataItem.ConfigurationFk);
							}
						}else if(row.rid ==='description'){
							row.readonly = !isCreate;
							row.visible = isCreate;
						}else if(row.rid ==='structurefk'){
							row.required = true;
						}else if(row.rid ==='configurationfk'){
							row.readonly = !isCreate;
						}else if(row.rid === 'budget'){
							if(!isCreate) {
								$scope.dataItem.Budget = 0;
							}else {
								dialogConfigService.getRestBudget($scope.dataItem, $scope.dataItem.prcPakcageFk);
							}
						}
					});

					if(!isCreate){
						$scope.generatenNumberFailedInfo.show = false;
						$scope.budgetKindInfo.show = false;
						$scope.budgetInfo.show = false;
					}

					$scope.$parent.$broadcast('form-config-updated', {});
				};
				platformTranslateService.translateFormConfig(formConfig);

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};

				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: []
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};
				function int(){
					$scope.noPinProjectError.show  =false;

					let cloudDesktopPinningContextService = $injector.get('cloudDesktopPinningContextService');
					let context = cloudDesktopPinningContextService.getContext();
					let item =_.find(context, {'token': 'project.main'});
					if (!item) {
						$scope.noPinProjectError.show = true;
					}

					basicsLookupdataLookupDescriptorService.loadData('prcConfiguration');
					basicsLookupdataLookupDescriptorService.loadData('PackageStatus');

					$injector.get('procurementPackageNumberGenerationSettingsService').load();

					$scope.onSelectionChanged($scope.GenerateType);

					if($scope.GenerateType === '2' && $scope.dataItem.SelectedPrcPackage){
						dialogConfigService.onSelectedPackageChanged($scope.dataItem.SelectedPrcPackage, $scope.dataItem);
						$scope.dataItem.PrcPackageFk = $scope.dataItem.SelectedPrcPackage.Id;
					}
				}

				$scope.hasErrors = function checkForErrors() {
					let hasError = false;

					if($scope.GenerateType ==='2'){
						hasError = !$scope.dataItem.PrcPackageFk ||!$scope.dataItem.StructureFk;
					}else {
						hasError =!($scope.dataItem.StructureFk && $scope.dataItem.Code);
						$scope.generatenNumberFailedInfo.show = !($scope.dataItem.Code);
					}
					return hasError || $scope.noPinProjectError.show || $scope.generatenNumberFailedInfo.show || $scope.budgetKindInfo.show || $scope.budgetInfo.show;
				};

				$scope.onOK = function () {
					if (!$scope.hasErrors()) {
						$scope.$close({ok: true, data: $scope.dataItem});
					}
				};

				$scope.onCancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close(false);
				};
				function showBudgetInfo(isFiledChange){
					let contractorCostControlDataService =  $injector.get('controllingGeneralcontractorCostControlDataService');
					let costControlSelected = contractorCostControlDataService.getSelected();
					let otherPackagesBudget = dialogConfigService.getOtherPackagesBudget();

					$scope.budgetInfo.show = $scope.dataItem.Budget < 0;
					if(isFiledChange) {
						let remainingBudget = costControlSelected.OwnBudget+ costControlSelected.OwnBudgetShift - otherPackagesBudget;
						$scope.dataItem.MaxRemainingBudget = costControlSelected.OwnBudget+ costControlSelected.OwnBudgetShift - otherPackagesBudget - $scope.dataItem.Budget;
						$scope.budgetInfo.show =  $scope.dataItem.Budget < 0? true: $scope.dataItem.MaxRemainingBudget < 0;
					}
				}

				function validateDialogConfigurationFk(configurationFk) {
					let config = _.find (basicsLookupdataLookupDescriptorService.getData ('prcConfiguration'), {Id: configurationFk});
					let procurementPackageNumberGenerationSettingsService = $injector.get('procurementPackageNumberGenerationSettingsService');
					if (config) {
						platformRuntimeDataService.readonly ($scope.dataItem, [{
							field: 'Code',
							readonly: procurementPackageNumberGenerationSettingsService.hasToGenerateForRubricCategory (config.RubricCategoryFk)
						}]);

						if($scope.dataItem.GenerateType ==='1') {
							$scope.dataItem.Code = procurementPackageNumberGenerationSettingsService.provideNumberDefaultText (config.RubricCategoryFk, $scope.dataItem.Code);
							$scope.generatenNumberFailedInfo.show = false;
							if ($scope.dataItem.Code === null || $scope.dataItem.Code === '') {
								$scope.generatenNumberFailedInfo.show = true;
								$scope.generatenNumberFailedInfo.message = $translate.instant ('controlling.generalcontractor.generatenNumberFailed');
							}
						}

						$scope.budgetKindInfo.show =false;
						$http.get(globals.webApiBaseUrl + 'procurement/package/package/GetTotalTypeWithBudgetKind?configurationFk='+configurationFk).then(function (response) {
							if(response && response.data){
								if(!response.data.HasBudgetKind){
									$scope.budgetKindInfo.show =true;
									let bugdgeKindDesc = response.data.BudgetKindDesctiption ? response.data.BudgetKindDesctiption.Translated : '';
									$scope.budgetKindInfo.message = $translate.instant('controlling.generalcontractor.noBudgetKindInfo',{code: bugdgeKindDesc});
								}
							}

						});
					}
					else{
						return false;
					}

					return true;
				}

				dialogConfigService.showBudgetInfo.register(showBudgetInfo);
				dialogConfigService.setStructureReadOnly.register(setStructureReadOnly);
				dialogConfigService.validateDialogConfiguration.register(validateDialogConfigurationFk);
				int();

				$scope.$on('$destroy', function () {
					dialogConfigService.showBudgetInfo.unregister(showBudgetInfo);
					dialogConfigService.setStructureReadOnly.unregister(setStructureReadOnly);
					dialogConfigService.validateDialogConfiguration.unregister(validateDialogConfigurationFk);
				});
			}
		]
	);
})(angular);
