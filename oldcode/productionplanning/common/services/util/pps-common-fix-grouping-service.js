/**
 * Created by lav on 12/25/2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name ppsCommonFixGroupingService
	 * @function
	 * @requires
	 *
	 * @description provide the function to enable a fix grouping setter for grid
	 * #
	 *
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).service('ppsCommonFixGroupingService',
		['$timeout', '$interval', 'platformGridAPI',
			function ($timeout, $interval, platformGridAPI) {
				var self = this;
				var groupingIconClass = 'tlb-icons ico-group-columns';

				function disableGrouping(scope) {
					if (scope.tools && scope.tools.items) {
						var enableGrouping = _.find(scope.tools.items, {iconClass: groupingIconClass});
						if (enableGrouping) {
							scope.removeToolByClass([groupingIconClass]);
						}
					}
					var grid = platformGridAPI.grids.element('id', scope.gridId);
					if (grid && !!grid.instance) {
						if (grid.instance.groupPanelVisibility()) {
							platformGridAPI.grouping.toggleGroupPanel(scope.gridId, false);
						}
					}
				}

				self.expandGroup = function expandGroup(scope) {
					var grid = platformGridAPI.grids.element('id', scope.gridId);
					if (grid && grid.dataView) {
						grid.dataView.expandAllGroups();
					}
				};

				self.setGrouping = function (scope, groupingColumn, expandAll) {
					expandAll = expandAll !== false;
					var timeout = $timeout(function () {
						platformGridAPI.columns.setGrouping(scope.gridId, [{
							ascending: true,
							columnId: groupingColumn,
							getter: groupingColumn
						}], false, true);
						disableGrouping(scope);
						if (expandAll) {
							self.expandGroup(scope);
						}
					}, 200);

					var interval = $interval(function () {
						disableGrouping(scope);
					}, 200);

					return function () {
						$timeout.cancel(timeout);
						$interval.cancel(interval);
					};
				};
			}]);

})(angular);