/**
 * Created by leo on 18.08.2015.
 */
(function () {
	/* global Slick */
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).value('projectMainPhaseSelectionColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'selected',
						field: 'Selected',
						name: 'Selected',
						name$tr$: 'basics.common.selected',
						formatter: 'boolean',
						editor: 'boolean',
						readonly: false
					},
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'uncpath',
						field: 'UncPath',
						name: 'Unc-Path',
						name$tr$: 'cloud.common.entitySorting',
						domain: 'description',
						formatter: 'description',
						readonly: true
					}
				]
			};
		}
	});

	/**
	 * @ngdoc controller
	 * @name projectMainPhaseSelectionGridController
	 * @function
	 *
	 * @description
	 * controller for the group selection tree
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainPhaseSelectionGridController', ProjectMainPhaseSelectionGridController);

	ProjectMainPhaseSelectionGridController.$inject = ['$timeout', '$scope', 'platformGridAPI', 'platformTranslateService',
		'projectMainPhaseSelectionColumns', 'projectMainPhaseSelectionDataService'];

	function ProjectMainPhaseSelectionGridController($timeout, $scope, platformGridAPI, platformTranslateService,
		projectMainPhaseSelectionColumns, projectMainPhaseSelectionDataService) {

		$scope.gridTriggersSelectionChange = false;

		// grid's id === container's uuid
		$scope.gridId = '4a8e880107c448bf9aa4baedd32973c0';

		$scope.gridData = {
			state: $scope.gridId
		};

		function updateItemList() {
			platformGridAPI.items.data($scope.gridId, projectMainPhaseSelectionDataService.getProjectAlternatives());
		}

		// Define standard toolbar Icons and their function on the scope
		$scope.tools = {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			version: 1,
			items: []
		};

		var settings = projectMainPhaseSelectionColumns.getStandardConfigForListView();

		if (!settings.isTranslated) {
			platformTranslateService.translateGridConfig(settings.columns);
			settings.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: angular.copy(settings.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					editorLock: new Slick.EditorLock()
				}
			};

			platformGridAPI.grids.config(grid);
		}

		var gridListener = $scope.$watch(function () {
			return $scope.gridCtrl !== undefined;
		}, function () {
			$timeout(function () {
				updateItemList();

				gridListener();
			}, 10);
		});

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}
})();