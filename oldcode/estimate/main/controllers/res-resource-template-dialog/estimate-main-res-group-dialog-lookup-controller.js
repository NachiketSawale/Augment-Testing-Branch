/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global Slick, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).value('estimateMainResGroupDialogLookupListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 1,
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						editor: null,
						width: 80
					},
					{
						id: 2,
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: null,
						readonly: true,
						width: 160
					}
				]
			};
		}
	});

	angular.module(moduleName).controller('estimateMainResGroupDialogLookupController',
		['$scope', '$timeout', '$injector', 'estimateMainResGroupDialogLookupService', 'estimateMainResGroupDialogLookupListColumns', 'platformGridAPI', 'platformTranslateService', 'loadingIndicatorExtendServiceFactory', 'estimateMainLookupService', 'estimateMainResourceService', 'estimateMainFilterService', 'platformGridControllerService',
			function ($scope, $timeout, $injector, estimateMainResGroupDialogLookupService, estimateMainResGroupDialogLookupListColumns, platformGridAPI, platformTranslateService, loadingIndicatorExtendServiceFactory, estimateMainLookupService, estimateMainResourceService, estimateMainFilterService, platformGridControllerService) {

				$scope.gridId = '1899e7a153bb4e3bbee8e6deaa6310f9';
				$scope.isLoading = true;

				let options = $scope.$parent.options;

				let myGridConfig = {
					parentProp: 'GroupFk',
					childProp: 'Groupchildren',
					editorLock: new Slick.EditorLock(),
					multiSelect: false,
					enableConfigSave: true,
					rowChangeCallBack: function () {
						$injector.invoke(['estimateMainResResourceDialogLookupService', function (estimateMainResResourceDialogLookupService) {
							if (estimateMainResResourceDialogLookupService.getIsInit() === false){
								estimateMainResResourceDialogLookupService.showLoadingIndicator.fire();
								estimateMainResResourceDialogLookupService.doNotLoadOnSelectionChange(false);
								estimateMainResResourceDialogLookupService.setIsListBySearch(true);
								// $scope.modalOptions.disableOkButton = false;

								$scope.modalOptions.disableOkButton = !($scope.enableMultiSelection && estimateMainResResourceDialogLookupService.getMultipleSelectedItems().length > 0);
							}
						}]);
					}
				};

				platformGridControllerService.initListController($scope, estimateMainResGroupDialogLookupListColumns, estimateMainResGroupDialogLookupService, {}, myGridConfig);

				if (platformGridAPI.grids.exist($scope.gridId)){
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					angular.extend(grid.options, myGridConfig);
				}

				function collapseAll(){
					$timeout(function () {
						platformGridAPI.rows.collapseAllNodes($scope.gridId);
					}, 75);
				}

				function reset(entity){
					estimateMainResGroupDialogLookupService.setSelected({}).then(function(){
						estimateMainResGroupDialogLookupService.clear();
						estimateMainResGroupDialogLookupService.filterResGroups(options, entity);
						estimateMainResGroupDialogLookupService.collapseAll.fire();
						$scope.modalOptions.disableOkButton = $scope.enableMultiSelection ? _.isEmpty($injector.get('estimateMainResResourceDialogLookupService').getMultipleSelectedItems()) : true;
					});
				}

				function onListLoaded(){
					$timeout(function () {
						$scope.isLoading = false;
					}, 75);
				}

				estimateMainResGroupDialogLookupService.collapseAll.register(collapseAll);
				estimateMainResGroupDialogLookupService.reset.register(reset);

				estimateMainResGroupDialogLookupService.registerListLoaded(onListLoaded);
				loadingIndicatorExtendServiceFactory.createServiceForDataServiceFactory($scope, 500, estimateMainResGroupDialogLookupService);

				onListLoaded();

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);

					estimateMainResGroupDialogLookupService.collapseAll.unregister(collapseAll);
					estimateMainResGroupDialogLookupService.reset.unregister(reset);
					estimateMainResGroupDialogLookupService.unregisterListLoaded(onListLoaded);
				});

			}]);
})();
