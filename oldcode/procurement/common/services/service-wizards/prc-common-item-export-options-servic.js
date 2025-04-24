/**
 * Created by reimer on 15.01.2020
 */

(function () {

	'use strict';

	var moduleName = 'procurement.common';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('prcCommonItemExportOptionsService', [
		function ()
		{

			var service = {};
			var _mainService;

			var exportOptions = {
				ModuleName: 'procurement.package.prcitems',
				MainContainer: { uuid: 'FB938008027F45A5804B58354026EF1C' },
				SubContainers: [],
				FilterCallback: function() {
					var selectItem = _mainService.getSelected();
					if (selectItem) {
						if (selectItem.PrcHeaderEntity) { return [selectItem.PrcHeaderEntity.Id]; }
						else                            { return [selectItem.Id]; }
					}
					else { return null; }
				},
				ExcelProfileContexts: ['MatBidder']
			};

			service.getExportOptions = function (mainService,param) {
				_mainService = mainService;
				if(param){
					angular.extend(exportOptions,param);
				}

				return exportOptions;
			};

			return service;

		}
	]);
})(angular);
