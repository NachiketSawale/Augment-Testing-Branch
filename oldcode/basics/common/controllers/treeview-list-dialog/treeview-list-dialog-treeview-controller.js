/**
 * Created by lid on 8/3/2017.
 */
/**
 * Created by lid on 7/4/2017.
 */
/* global Slick */
(function () {

	'use strict';

	const moduleName = 'basics.common';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('treeviewListDialogTreeviewController', TreeviewListDialogTreeviewController);
	TreeviewListDialogTreeviewController.$inject = ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformTranslateService', 'loadingIndicatorExtendServiceFactory', 'platformGridControllerService', '_'];

	function TreeviewListDialogTreeviewController($scope, $timeout, $injector, platformGridAPI, platformTranslateService, loadingIndicatorExtendServiceFactory, platformGridControllerService, _) {

		const treeviewService = $injector.get($scope.modalOptions.treeviewServiceName);
		const treeviewColumns = $injector.get($scope.modalOptions.treeviewColumnsServiceName);

		$scope.gridId = $scope.modalOptions.treeviewGridID;

		$scope.isLoading = true;

		const options = $scope.$parent.options;
		const listServiceName = $scope.modalOptions.listServiceName;
		const myGridConfig = {
			parentProp: $scope.modalOptions.treeviewParentProp,
			childProp: $scope.modalOptions.treeviewChildProp,
			editorLock: new Slick.EditorLock(),
			multiSelect: false,
			rowChangeCallBack: function () {
				$injector.invoke([listServiceName, function (listService) {
					if (listService.getIsInit() === false) {
						listService.showLoadingIndicator.fire();
						listService.doNotLoadOnSelectionChange(false);
						listService.setIsListBySearch(true);

						$scope.modalOptions.disableOkButton = !($scope.enableMultiSelection && listService.getMultipleSelectedItems().length > 0);
					}
				}]);
			}
		};

		platformGridControllerService.initListController($scope, treeviewColumns, treeviewService, {}, myGridConfig);

		if (platformGridAPI.grids.exist($scope.gridId)) {
			const grid = platformGridAPI.grids.element('id', $scope.gridId);
			grid.isStaticGrid = true;// set isStaticGrid to true to avoid load configuration
			angular.extend(grid.options, myGridConfig);
		}

		function collapseAll() {
			$timeout(function () {
				platformGridAPI.rows.collapseAllNodes($scope.gridId);
			}, 75);
		}

		function reset() {
			treeviewService.setSelected({}).then(function () {
				treeviewService.clear();
				treeviewService.filterStructureCategories(options);
				treeviewService.collapseAll.fire();
				$scope.modalOptions.disableOkButton = $scope.enableMultiSelection ? _.isEmpty($injector.get(listServiceName).getMultipleSelectedItems()) : true;
			});
		}

		function onListLoaded() {
			$timeout(function () {
				$scope.isLoading = false;
			}, 75);
		}

		treeviewService.collapseAll.register(collapseAll);
		treeviewService.reset.register(reset);

		treeviewService.registerListLoaded(onListLoaded);
		loadingIndicatorExtendServiceFactory.createServiceForDataServiceFactory($scope, 500, treeviewService);

		onListLoaded();

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);

			treeviewService.collapseAll.unregister(collapseAll);
			treeviewService.reset.unregister(reset);
			treeviewService.unregisterListLoaded(onListLoaded);
		});

	}
})();