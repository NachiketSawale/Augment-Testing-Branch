/**
 * Created by amruta.bansode on 08.11.2023
 */

(function () {

	'use strict';

	var moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateMainExportOptionsService', [
		function () {

			var service = {};

			var _estimateMainService;

			var exportOptions = {
				ModuleName: moduleName,
				WizardId: 'ExcelExport',
				MainContainer: {Id: '1', Label: 'estimate.main.lineItemContainer'},
				SubContainers: [],
				FilterCallback: function () {
					let estHeaderFk = _estimateMainService.getSelectedEstHeaderId();
					if (estHeaderFk) {
						return [estHeaderFk];
					}
					else {
						return null;
					}
				}
			};

			service.getExportOptions = function (estimateMainService)
			{
				_estimateMainService = estimateMainService;
				exportOptions.ExcelProfileContexts = [];
				return exportOptions;
			};



			return service;

		}
	]);
})(angular);