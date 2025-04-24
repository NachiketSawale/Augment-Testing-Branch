/**
 * Created by anl on 7/2/2019.
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.eventconfiguration';
	angular.module(moduleName).factory('productionplanningEventconfigurationMaterialGroupFilterDataService', MaterialFilterDataService);

	MaterialFilterDataService.$inject = ['ppsCommonMaterialGroupFilterDataServiceFactory'];

	function MaterialFilterDataService(materialFilterDataFactory) {

		return materialFilterDataFactory.getMaterialFilterService(moduleName,
			'productionplanningEventconfigurationMaterialGroupFilterDataService');
	}

})();