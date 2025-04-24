/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name model.simulation.controller:modelSimulationEventSourceSelectorController
	 * @description Controller for the {@link modelSimulationEventSourceSelector} directive. This code is based upon
	 *              {@see procurementPriceComparisonBoqColumnController}.
	 */
	angular.module('model.simulation').controller('modelSimulationEventSourceSelectorController',
		modelSimulationEventSourceSelectorController);

	modelSimulationEventSourceSelectorController.$inject = ['_', '$scope',
		'$timeout', 'platformGridAPI', 'platformGridControllerService', 'platformCollectionUtilitiesService'];

	function modelSimulationEventSourceSelectorController(_, $scope, $timeout, platformGridAPI, platformGridControllerService,
		platformCollectionUtilitiesService) {

		const options = $scope.options();
		if (!options.gridId) {
			throw new Error('Please set a gridId via the options for the directive.');
		}

		$scope.gridId = options.gridId;
		$scope.gridData = {
			state: $scope.gridId
		};
		$scope.onContentResized = function () {
		};

		// TODO: grid only show the first time (this feature should be fixed in platformgrid.directive.js)
		// clean the grid first due to the directive only save the grid onStateChange
		// but in the popup modal, no state change.
		if (platformGridAPI.grids.exist($scope.gridId)) {
			platformGridAPI.grids.unregister($scope.gridId);
		}

		const columns = _.concat([{
			id: 'marker',
			formatter: 'boolean',
			field: 'IsMarked',
			name$tr$: 'model.simulation.isIncluded',
			editor: 'boolean',
			readonly: false,
			disabled: false,
			width: 60
		}, {
			id: 'code',
			field: 'Code',
			formatter: 'code',
			name$tr$: 'cloud.common.entityCode',
			readonly: true,
			width: 140
		}, {
			id: 'description',
			field: 'DescriptionInfo',
			formatter: 'translation',
			name$tr$: 'cloud.common.entityDescription',
			readonly: true,
			width: 140
		}], (options.entity === 'Schedule' ? [{
			id: 'baseline',
			field: 'BaselineDescription',
			formatter: 'translation',
			name$tr$: 'scheduling.main.baseline',
			readonly: true,
			width: 180
		}] : []), [{
			id: 'eventsForModel',
			formatter: 'description',
			field: 'hasEventsForModel',
			name$tr$: 'model.simulation.eventsForModel',
			readonly: true,
			width: 100
		}]);

		const grid = {
			data: [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: options.entity === 'Schedule',
				childProp: 'children',
				parentProp: 'parent',
				indicator: true,
				idProperty: 'Id',
				skipPermissionCheck: true
			}
		};

		platformGridAPI.grids.config(grid);

		/**
		 * @ngdoc function
		 * @name onCellChanged
		 * @function
		 * @methodOf modelSimulationEventSourceSelectorController
		 * @description Notifies the model settings service about a modification to a camera position.
		 */
		function onCellChanged() {
			const allShownItems = platformGridAPI.items.data($scope.gridId);
			const result = _.map(_.filter(allShownItems, function (item) {
				return !!item.IsMarked;
			}), function (item) {
				return item.Id;
			});
			allShownItems.forEach(function (item) {
				if (_.isArray(item.children)) {
					platformCollectionUtilitiesService.appendItems(result, _.map(_.filter(item.children, function (item) {
						return !!item.IsMarked;
					}), function (item) {
						return item.Id;
					}));
				}
			});

			$scope.entity['selected' + options.entity + 'Ids'] = result;
			$scope.entity.eligible.updateFilter();
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChanged);

		/**
		 * @ngdoc function
		 * @name updateGridData
		 * @function
		 * @methodOf modelSimulationEventSourceSelectorController
		 * @description Updates the displayed items in the grid.
		 */
		function updateGridData() {
			const items = _.filter($scope.entity.eligible[options.entity + 's'], function (item) {
				return !item.IsHidden;
			});

			platformGridAPI.items.data($scope.gridId, items);
		}

		// when controller initialized, refresh to show grid (height) correctly, then load data.
		$timeout(function () {
			platformGridAPI.grids.resize($scope.gridId);
			updateGridData();

			$scope.entity.eligible.onFilterUpdated.register(updateGridData);
		});

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChanged);
		});
	}
})(angular);
