/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.wip').directive('salesWipSelectWips', ['globals',
		function (globals) {

			var controller = ['_', '$injector', '$scope', 'salesWipConfigurationService', 'salesCommonUtilsService',
				function (_, $injector, $scope, salesWipConfigurationService, salesCommonUtilsService) {

					var wipServiceName = _.get($scope, 'options.wipServiceName');
					var getListName = _.get($scope, 'options.getListName');
					var getPreselectedName = _.get($scope, 'options.getPreselectedName');

					var columns = salesWipConfigurationService.getStandardConfigForListView().columns;

					// only specific columns and read only
					columns = salesCommonUtilsService.getReadonlyColumnsSubset(columns, [
						'code', 'descriptioninfo', 'performedfrom', 'performedto', 'isbilled', 'wipvalue', 'customerfk'
					]);

					// add Select-Column (marker)
					columns.push(salesCommonUtilsService.createMarkerColumn(wipServiceName, getListName, true));

					// prepare and set data (preselected items will be marked initially)
					var wipService = $injector.get(wipServiceName);
					var wips = wipService[getListName]();
					var preselectedWips = wipService[getPreselectedName]();
					_.each(wips, salesCommonUtilsService.clearMarker);
					_.each(preselectedWips, salesCommonUtilsService.setMarker);

					$scope.gridId = salesCommonUtilsService.createGrid($scope, columns, wips);
				}];

			return {
				restrict: 'A',

				scope: {
					ngModel: '=',
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (/* scope, ele, attrs */) {
				}
			};
		}]
	);

})();
