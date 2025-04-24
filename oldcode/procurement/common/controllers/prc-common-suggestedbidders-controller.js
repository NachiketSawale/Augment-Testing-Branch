/**
 * Created by clv on 8/1/2017.
 */
(function (){

	'use strict';
	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonSuggestedBiddersListController',procurementCommonSuggestedBiddersListController);
	procurementCommonSuggestedBiddersListController.$inject = ['$scope','procurementContextService','platformGridControllerService','procurementCommonSuggestedBiddersDataService',
		'procurementCommonSuggestedBiddersUIStandardService', 'procurementCommonSuggestedBiddersValidationService'];
	function procurementCommonSuggestedBiddersListController($scope,moduleContext,gridControllerService,dataServiceFactory,gridColumns, procurementCommonSuggestedBiddersValidationService){

		var gridConfig = {initCalles: false, columns: []};
		var dataService = dataServiceFactory.getService(moduleContext.getMainService());

		gridControllerService.initListController($scope,gridColumns,dataService,procurementCommonSuggestedBiddersValidationService(dataService),gridConfig);
	}
})();