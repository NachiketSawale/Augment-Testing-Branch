/**
 * Created by reimer on 20.12.2017
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainExportOptionsService', [
		function () {

			var service = {};

			var _boqMainService;

			var exportOptions = {
				ModuleName: moduleName,
				MainContainer: {Id: '1', Label: 'boq.main.boqStructure'},
				SubContainers: [],
				FilterCallback: function () {
					var boqItem = _boqMainService.getRootBoqItem();
					return boqItem ? [boqItem.BoqHeaderFk] : null;
				}
			};

			service.getExportOptions = function (boqMainService) {
				_boqMainService = boqMainService;

				exportOptions.ExcelProfileContexts = [];
				if (boqMainService.getServiceName().includes('Pes')) {
					exportOptions.ExcelProfileContexts.push('BoqPes');
				} else {
					exportOptions.ExcelProfileContexts.push('BoqBidder');
					exportOptions.ExcelProfileContexts.push('BoqPlanner');
					exportOptions.ExcelProfileContexts.push('BoqPlannerPrice');
				}

				return exportOptions;
			};

			return service;

		}
	]);
})(angular);
