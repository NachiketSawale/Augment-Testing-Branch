/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */

	'use strict';
	let moduleName = 'estimate.project';
	/**
	 * @ngdoc service
	 * @name estimateProjectHeaderService
	 * @function
	 *
	 * @description
	 * estimateProjectHeaderService is the data service for estimate Header functionality.
	 */

	/**
	 * @ngdoc controller
	 * @name estimateProjectListController
	 * @function
	 *
	 * @description
	 * estimateProjectListController for the  list view of the project estimate header
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateProjectListController',
		['_', '$injector', '$scope', '$state', '$translate', '$http', 'platformGridControllerService', 'estimateProjectService', 'estimateProjectStandardConfigurationService', 'estimateProjectValidationService', 'platformModuleNavigationService', 'estimateProjectSpecificationService','platformGridAPI',
			function (_, $injector, $scope, $state, $translate, $http, platformGridControllerService, estimateProjectService, estimateProjectStandardConfigurationService, estimateProjectValidationService, naviService, estimateProjectSpecificationService,platformGridAPI) {

				let myGridConfig = {initCalled: false,
					columns: [],
					rowChangeCallBack: function rowChangeCallBack() {
						updateTools();
					}
				};

				platformGridControllerService.initListController($scope, estimateProjectStandardConfigurationService, estimateProjectService, estimateProjectValidationService, myGridConfig);

				let tools = [];
				let navigator = {moduleName: 'estimate.main', registerService: 'estimateMainService'};
				tools.push({
					id: 't11',
					caption: $translate.instant('estimate.project.goToEstimate'),
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openEstimate() {

						// First save current changes via parent service
						estimateProjectService.saveParentService().then(()=>{
							// Then navigate to estimation module
							let selectedItem = estimateProjectService.getSelected();

							if (estimateProjectService.isSelection(selectedItem)) {
								naviService.navigate(navigator, selectedItem);
							}
						});


					},
					disabled: function () {
						return _.isEmpty(estimateProjectService.getSelected()) || !naviService.hasPermissionForModule(navigator.moduleName);
					}
				}, {
					id: 't12CreateVersion',
					caption: $translate.instant('estimate.project.createVersion'),
					type: 'item',
					iconClass: 'tlb-icons ico-estimate-version-create',
					disabled: function () {
						let EstimateComplete = estimateProjectService.getSelected();
						return _.isEmpty(EstimateComplete) || !!EstimateComplete.EstHeader.EstHeaderVersionFk || !naviService.hasPermissionForModule(navigator.moduleName);
					},
					fn: function () {
						let compositeItem = estimateProjectService.getSelected();
						if (compositeItem && compositeItem.EstHeader) {
							let postData = {
								IsBackup: true,
								EstHeader: compositeItem.EstHeader
							};
							$http.post(globals.webApiBaseUrl + 'estimate/project/generatedversioninfo', postData).then(function (response) {
								$injector.get('estPrjCreateVersionDialogService').showDialog(response.data);
							});
						}
					}
				},{
					id: 't13',
					caption: $translate.instant('estimate.project.restoreVersionEstimate'),
					type: 'item',
					iconClass: 'tlb-icons ico-estimate-version-restore',
					fn: function () {
						let compositeItem = estimateProjectService.getSelected();
						if (compositeItem && compositeItem.EstHeader) {
							let postData = {
								IsBackup: false,
								EstHeader: compositeItem.EstHeader
							};
							$http.post(globals.webApiBaseUrl + 'estimate/project/generatedversioninfo', postData).then(function (response) {
								$injector.get('estPrjRestoreEstimateDialogService').showDialog(response.data);
							});
						}
					},
					disabled: function () {
						let EstimateComplete = estimateProjectService.getSelected();
						return _.isEmpty(EstimateComplete) || !EstimateComplete.EstHeader.EstHeaderVersionFk || !naviService.hasPermissionForModule(navigator.moduleName);
					}
				}, {
					id: 't14',
					caption: $translate.instant('estimate.project.filterVersionEstimate'),
					type: 'check',
					value: estimateProjectService.getFilterStatus(),
					iconClass: 'tlb-icons ico-filter-current-version',
					fn: function () {
						estimateProjectService.setFilterStatus(this.value);

						estimateProjectService.load();
					},
					disabled: function () {
						let project = $injector.get('projectMainService').getSelected();
						return !project;
					}
				});

				function toggleCreateButton(disabled) {
					let createButton = _.find($scope.tools.items, {id: 'create'});
					if (createButton) {
						createButton.disabled = disabled;
					}
				}
				function selectProjectToolbarStatus(){
					onGridHeaderClicked();
				}
				function onGridHeaderClicked(){
					let isDisable = _.isEmpty(estimateProjectService.getSelected()) || !naviService.hasPermissionForModule(navigator.moduleName);
					let entity = estimateProjectService.getSelected();
					let deleteButton = _.find($scope.tools.items, {id: 'delete'});
					let createDeepCopyBtn = _.find($scope.tools.items, {id: 'createDeepCopy'});
					if (deleteButton && !entity) {
						deleteButton.disabled = function () {
							return isDisable;
						};
					}

					if(createDeepCopyBtn && !entity){
						createDeepCopyBtn.disabled = function () {
							return isDisable;
						};
					}

					let filterButton = _.find($scope.tools.items, {id: 't14'});
					if (filterButton) {
						filterButton.disabled = function () {
							return false;
						};
					}

					$scope.tools.update();
				}
				estimateProjectService.onToggleCreateButton.register(toggleCreateButton);

				estimateProjectService.onSelectProjectToolbarStatus.register(selectProjectToolbarStatus);

				platformGridAPI.events.register($scope.gridId, 'onHeaderClick', onGridHeaderClicked);

				platformGridControllerService.addTools(tools);

				estimateProjectService.registerFilters();

				function updateTools() {
					let entity = estimateProjectService.getSelected();
					let deleteButton = _.find($scope.tools.items, {id: 'delete'});
					let createDeepCopyBtn = _.find($scope.tools.items, {id: 'createDeepCopy'});

					if (deleteButton) {
						deleteButton.disabled = function () {
							return entity.IsGCOrder;
						};
					}

					if(createDeepCopyBtn){
						let isVersionEstimate = entity.EstHeader && entity.EstHeader.EstHeaderVersionFk;
						createDeepCopyBtn.disabled = function () {
							return entity.IsGCOrder || isVersionEstimate;
						};
					}

					$scope.tools.update();
				}

				estimateProjectService.updateToolItems.register(updateTools);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateProjectService.unregisterFilters();
					estimateProjectSpecificationService.setCurrentSpecification(null);
					estimateProjectService.onToggleCreateButton.unregister(toggleCreateButton);
					estimateProjectService.updateToolItems.unregister(updateTools);
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderClick', onGridHeaderClicked);
					estimateProjectService.onSelectProjectToolbarStatus.unregister(selectProjectToolbarStatus);
				});
			}
		]);
})();
