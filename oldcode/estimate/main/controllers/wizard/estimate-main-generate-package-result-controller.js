/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals */
(function(angular){
	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainGeneratePackageResultController',['$scope',
		'$http','$q','$translate','platformGridAPI','$timeout','estimateMainService','estimateMainPrcPackageLookupDataService','estimateMainCreateBoQPackageWizardService','platformModuleNavigationService',
		'platformTranslateService',
		function ($scope,$http,$q,$translate,platformGridAPI,$timeout,estimateMainService,estimateMainPrcPackageLookupDataService,estimateMainCreateBoQPackageWizardService,platformModuleNavigationService,
				  platformTranslateService) {


			let newPackageIds = [];
			let assignmentResultGridId = 'c7295d94067f4bd5b4c15fdd0af8b9e4';
			let createOrUpdateStatus = {
				None: 0,
				CreatePackageOnly: 1,
				UpdatePackageBoqOnly: 2,
				CreatePackageAndBoq: 3
			};
			let assignmentResultGridColumns = [
				{
					id: 'Status',
					field: 'PackageStatusFk',
					name: 'Status',
					name$tr$: 'estimate.main.createMaterialPackageWizard.status',
					width: 90,
					'formatter': 'lookup',
					'formatterOptions': {
						'lookupType': 'PackageStatus',
						'displayMember': 'DescriptionInfo.Translated'
					},
					readonly: true
				},
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					formatter: 'code',
					width: 100
				},
				{
					id: 'PackageDescription',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					width: 120,
				},
				{
					id: 'StructureCode',
					field: 'StructureFk',
					name: 'Structure Code',
					name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcStructure',
						displayMember: 'Code'
					},
					width: 100,
				},
				{
					id: 'StructureDescription',
					field: 'StructureFk',
					name: 'Structure Description',
					name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcStructure',
						displayMember: 'DescriptionInfo.Translated'
					},
				},
				{
					id: 'message',
					field: 'message',
					name: 'Create or Update Information',
					name$tr$: 'estimate.main.createBoqPackageWizard.createOrUpdateInfo',
					width: 300,
					formatter: 'remark'
				}
			];
			$scope.title = $translate.instant('estimate.main.createMaterialPackageWizard.goToPackage');
			$scope.path = globals.appBaseUrl;

			$scope.onOk = function () {
				estimateMainPrcPackageLookupDataService.resetCache({}).then(function () {
					estimateMainService.deselect();
					estimateMainService.load();
					$scope.$close();
				});
			};

			$scope.navigate = function () {
				$scope.$close(false);
				platformModuleNavigationService.navigate({
					moduleName: 'procurement.package'
				}, newPackageIds, 'PrcPackageFk');
			};

			$scope.packageAssignmentResult = {
				state: assignmentResultGridId
			};

			$scope.canShowResultGrid = canShowResultGrid;

			function  init(){
				setupAssignmentResultGrid();
				let packageResult = estimateMainCreateBoQPackageWizardService.getGeneratePakageData();
				if(packageResult) {
					if(packageResult.packages) {
						packageResult.packages.forEach(function (item) {
							newPackageIds.push(item.Id);
						});
					}

					if (packageResult.generatePackageBoQResult === 0) { // create/update Boq In package is false
						if (packageResult.packages && packageResult.packages.length > 0) {
							const packages = packageResult.packages;
							packages.forEach(function (item) {
								if(item.IsCreateNew){
									item.message = $translate.instant('estimate.main.createBoqPackageWizard.createPackageCreateNUpdateBoq',{'packageCode': item.Code});
								}else{
									item.message = $translate.instant('estimate.main.createBoqPackageWizard.updatePackageCreateNUpdateBoq',{'packageCode': item.Code});
								}
							});
							updateAssignmentResultGrid(packages);
						}
						$scope.isSuccess = true;
					}
					else if (packageResult.generatePackageBoQResult === 1) {  //  create/update Boq In package is true
						if (packageResult.packages && packageResult.packages.length > 0) {
							const packages = packageResult.packages;
							packages.forEach(function (item) {
								if (item.IsCreateNew) {
									if (item.CreateOrUpdatePackageBoqStatus === createOrUpdateStatus.CreatePackageAndBoq) {
										item.message = $translate.instant('estimate.main.createBoqPackageWizard.createPackageNotCreateNUpdateBoq', {'packageCode': item.Code});
									} else if (item.CreateOrUpdatePackageBoqStatus === createOrUpdateStatus.CreatePackageOnly) {
										item.message = $translate.instant('estimate.main.createBoqPackageWizard.createPackageCreateNUpdateBoq', {'packageCode': item.Code}) +
											$translate.instant('estimate.main.createBoqPackageWizard.noResourceAssignToPackage');
									}
								} else {
									if (item.CreateOrUpdatePackageBoqStatus === createOrUpdateStatus.UpdatePackageBoqOnly) {
										item.message = $translate.instant('estimate.main.createBoqPackageWizard.updatePackageNotCreateNUpdateBoq', {'packageCode': item.Code});
									} else if (item.CreateOrUpdatePackageBoqStatus === createOrUpdateStatus.None) {
										item.message = $translate.instant('estimate.main.createBoqPackageWizard.noAnyChange');
									}
								}
							});
							updateAssignmentResultGrid(packages);
						}
						$scope.isSuccess = true;
					}
					else if (packageResult.generatePackageBoQResult === -5) {
						$scope.message = $translate.instant('estimate.main.createBoqPackageWizard.boqPackageAssignmentBoqCreationFailed') +
							$translate.instant('estimate.main.createBoqPackageWizard.noResource4CreateBoq');
						$scope.isSuccess = false;
					}
					else if (packageResult.generatePackageBoQResult < 0) {
						$scope.message = $translate.instant('estimate.main.createBoqPackageWizard.boqPackageAssignmentBoqCreationFailed');
						$scope.isSuccess = false;
					} else if (packageResult.generatePackageBoQResult === -6) {
						$scope.message = $translate.instant('estimate.main.createBoqPackageWizard.boqPackageAssignmentBoqCreationFailed') +
							$translate.instant('estimate.main.createBoqPackageWizard.noSource4CreatePackageNBoq');
						$scope.isSuccess = false;
					}
				}
			}

			init();

			function setupAssignmentResultGrid() {
				if (!platformGridAPI.grids.exist(assignmentResultGridId)) {
					let assignmentGridConfig = {
						columns: angular.copy(assignmentResultGridColumns),
						data: [],
						id: assignmentResultGridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(assignmentGridConfig);
					platformTranslateService.translateGridConfig(assignmentGridConfig.columns);
				}
			}

			function updateAssignmentResultGrid(assignmentData) {
				platformGridAPI.grids.invalidate(assignmentResultGridId);
				platformGridAPI.items.data(assignmentResultGridId, assignmentData);
			}

			function canShowResultGrid() {
				let packageResult = estimateMainCreateBoQPackageWizardService.getGeneratePakageData();
				return (packageResult.generatePackageBoQResult === 0 || packageResult.generatePackageBoQResult === 1) && packageResult.packages && packageResult.packages.length > 0;
			}
		}]);

})(angular);
