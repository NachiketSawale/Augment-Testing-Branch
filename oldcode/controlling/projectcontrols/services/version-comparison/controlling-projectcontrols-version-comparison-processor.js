(function (angular) {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectcontrolsVersionComparisonProcessor',
		[
			function () {

				let service = {};

				service.processItem = function processItem(item, data) {
					data.renderFilterOptions(item);
				};

				service.processItems = function processItems(items, gc) {
					angular.forEach(items, function (item) {
						service.processItem(item);
					});
				};

				return service;
			}]);
})(angular);