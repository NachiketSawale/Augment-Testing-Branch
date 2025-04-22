/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global globals */

	angular.module('sales.common').directive('salesCommonSelectBoqStructure',
		function () {

			var controller = ['_', '$injector', '$scope', 'platformGridAPI', 'salesCommonUtilsService', 'boqMainStandardConfigurationServiceFactory',
				function (_, $injector, $scope, platformGridAPI, salesCommonUtilsService, boqMainStandardConfigurationServiceFactory) {

					var serviceName = _.get($scope, 'options.serviceName');
					var getListName = _.get($scope, 'options.getListName');
					var markerChanged = _.get($scope, 'options.markerChanged');

					var service = $injector.get(serviceName);

					function getColumns() {
						var configService = boqMainStandardConfigurationServiceFactory.createBoqMainStandardConfigurationService();
						// only specific columns & make full readonly
						var columns = salesCommonUtilsService.getReadonlyColumnsSubset(configService.getStandardConfigForListView().columns, [
							'reference', 'briefinfo', 'basuomfk'
						]);

						// add multi-select column (marker) which is pinned
						columns.push(salesCommonUtilsService.createMarkerColumn(serviceName, getListName, true, true));
						return columns;
					}

					var grid = salesCommonUtilsService.createGridEx($scope, getColumns(), $scope.options.items, {
						parentProp: 'BoqItemFk',
						childProp: 'BoqItems'
					});


					// see also: #116825 and #117036
					// dirty quick fix :( we remove this watch causing problems later.
					// issue: grid is created twice (first time) and one watch is not notified.
					if (!$scope.$parent.boqStructureWatches) { $scope.$parent.boqStructureWatches = []; }
					if (_.size($scope.$parent.boqStructureWatches) === 1) {
						_.first($scope.$parent.boqStructureWatches)();
					}

					function updateBoqStructure() {
						var newBoqStructure = service[getListName]();
						if (_.has(_.first(newBoqStructure), '$$state')) { // is promise?
							salesCommonUtilsService.addLoadingIndicator($scope, _.first(newBoqStructure));
							grid.updateData([]); // empty on promise
						} else {
							grid.updateData(newBoqStructure);
							$scope.isLoading = false;
						}
					}

					if (_.has($scope, 'options.callBackApi')) {
						var callBackObj = _.get($scope, 'options.callBackApi');
						callBackObj.updateBoqStructure = updateBoqStructure;
					}

					$scope.$parent.boqStructureWatches.push($scope.$watch('options.events._isDirty_BoqStructure', function (/* newValue, oldValue */) {
						updateBoqStructure();
						$scope.options.events._isDirty_BoqStructure = false;
					}, false));

					// marker change event
					grid.addOnCellChangeEvent('IsMarked', function (value, item) {
						markerChanged(item, salesCommonUtilsService.flatten($scope.options.items, 'BoqItems'));
						$scope.$apply(); // TODO: why needed now?
					});

				}];

			return {
				restrict: 'A',
				scope: {
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (/* scope, ele, attrs */) {
				}
			};
		}
	);
})();
