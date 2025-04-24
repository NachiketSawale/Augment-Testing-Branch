(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonItemReplacementService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service of pricecomparison item replacement grid.
	 */
	angular.module(moduleName).factory('procurementPriceComparisonItemReplacementService', ['_', 'platformDataServiceFactory',
		function (_, platformDataServiceFactory) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonItemReplacementService',
				httpRead: {
					useLocalResource: true,
					resourceFunction: function () {
					}
				},
				entitySelection: {},
				presenter: {list: {}},
				modification: {multi: {}}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = container.service;
			var data = container.data;

			// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
			data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};

			service.validateReduplicateField = function (item) {
				var rs = false,
					arrScripts = _.map(service.getList(), 'Script'),
					objScript2Count = _.groupBy(arrScripts, function (e) {
						return e;
					});
				try {
					if (_.isArray(objScript2Count[item.Script]) && objScript2Count[item.Script].length > 1) {
						rs = true;
					}
				} catch (e) {
					rs = true;
				}

				return rs;
			};

			return service;
		}]);
})(angular);
