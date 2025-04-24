/**
 * Created by clv on 8/1/2017.
 */
(function (){

	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonSuggestedBiddersFormController',procurementCommonSuggestedBiddersFormController);
	procurementCommonSuggestedBiddersFormController.$inject = ['$scope','procurementContextService','procurementCommonSuggestedBiddersDataService','platformDetailControllerService',
		'procurementCommonSuggestedBiddersUIStandardService','platformTranslateService', 'procurementCommonSuggestedBiddersValidationService'];
	function procurementCommonSuggestedBiddersFormController($scope,moduleContext,dataServiceFactory,platformDetailControllerService,itemDetailFormConfig,platformTranslateService, procurementCommonSuggestedBiddersValidationService){

		var dataService = dataServiceFactory.getService(moduleContext.getMainService());

		platformDetailControllerService.initDetailController($scope,dataService,procurementCommonSuggestedBiddersValidationService(dataService),itemDetailFormConfig,platformTranslateService);
	}
})();