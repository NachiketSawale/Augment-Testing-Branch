/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	/**
     * @ngdoc controller
     * @name estimateMainBidCreationWizardController
     * @function
     *
     * @description
     * Controller for the wizard dialog used to collect the settings and informations to be able to create a bid
     * based on the current status of the line items in the estimation
     **/
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainCreateMaterialPackageResultController',
		['$scope',
			'$translate',
			'platformGridAPI',
			'$timeout',
			'platformTranslateService',
			'estimateMainService',
			'platformModalService',
			'estimateMainCreateMaterialPackageService',
			'estimateMainResourceService',
			'platformModuleNavigationService',

			function ($scope,// jshint ignore:line
				$translate,
				platformGridAPI,
				$timeout,
				platformTranslateService,
				estimateMainService,
				platformModalService,
				estimateMainCreateMaterialPackageService,
				estimateMainResourceService,
				navigationService) {

				let assignmentResultGridId = '28D2DF5600CA49DB812548A9E4B2638C';
				let packageIds = [];

				$scope.path = globals.appBaseUrl;

				/* angular.extend($scope.options, {
                    title: $translate.instant('estimate.main.createMaterialPackageWizard.goToPackage'),
                    body: {
                        currentPackage: $translate.instant('procurement.common.wizard.updateMaterial.identicalMaterial')
                    }
                }); */

				$scope.title = $translate.instant('estimate.main.createMaterialPackageWizard.goToPackage');

				$scope.navigate = function () {
					estimateMainResourceService.refreshData.fire();
					estimateMainService.refresh();
					$scope.$close(false);
					navigationService.navigate({
						moduleName: 'procurement.package'
					}, packageIds, 'PrcPackageFk');
				};

				let assignmentResultGridColumns = [
					{
						id: 'Status',
						field: 'StatusFk',
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
						field: 'CodeFk',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPackage',
							displayMember: 'Code'
						},
						width: 100
					},
					{
						id: 'PackageDescription',
						field: 'PackageDescriptionFk',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPackage',
							displayMember: 'Description'
						},
						width: 120,
						readonly: true
					},
					{
						id: 'StructureCode',
						field: 'StructureCodeFk',
						name: 'Structure Code',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcStructure',
							displayMember: 'Code'
						},
						width: 100,
						readonly: true
					},
					{
						id: 'StructureDescription',
						field: 'StructureCodeFk',
						name: 'Structure Description',
						name$tr$: 'estimate.main.createMaterialPackageWizard.structureDescription',
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcStructure',
							displayMember: 'DescriptionInfo.Translated'
						},
						readonly: true
					},
					{
						id: 'BusinessPartner',
						field: 'BusinessPartnerFk',
						name: 'Business Partner',
						name$tr$: 'estimate.main.createMaterialPackageWizard.businessPartner',
						width: 150,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						readonly: true
					}
				];

				$scope.packageAssignmentResult = {
					state: assignmentResultGridId
				};

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

				// region wizard navigation

				// un-register on destroy
				$scope.$on('$destroy', function () {
				});

				$scope.nextStep = function(){
					estimateMainResourceService.refreshData.fire();
					estimateMainService.refresh();
					$scope.$parent.$close(false);
				};

				$scope.close = function () {
					// $modalInstance.dismiss();
					$scope.$parent.$close(false);
					estimateMainResourceService.refreshData.fire();
					estimateMainService.refresh();
				};

				let init = function () {
					setupAssignmentResultGrid();
					let datas = estimateMainCreateMaterialPackageService.getResultData();
					let packageSelections = [];

					for(let i = 0, len = datas.length; i < len; i++ )  {
						let packageGrid = {
							Id:datas[i].Id,
							StatusFk:datas[i].PackageStatusFk,
							CodeFk:datas[i].PackageCodeFk,
							PackageDescriptionFk:datas[i].PackageDescriptionFk,
							StructureCodeFk:datas[i].StructureCodeFk,
							BusinessPartnerFk:datas[i].BusinessPartnerFk
						};

						packageIds.push(datas[i].PackageCodeFk);
						packageSelections.push(packageGrid);
					}

					$timeout(function (){
						updateAssignmentResultGrid(packageSelections);
					}, 200);
				};
				init();

			}]);
})();
