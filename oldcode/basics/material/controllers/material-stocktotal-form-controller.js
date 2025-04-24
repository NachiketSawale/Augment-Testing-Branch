/*
 * Created by lcn on 4/18/2022.
 */

// eslint-disable-next-line no-redeclare
/* global angular */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialStockTotalDetailController',
		['$scope', 'basicsMaterialStockTotalDataService','platformDetailControllerService', 'basicsMaterialStockTotalUIStandardService', 'platformTranslateService',
			function ($scope, dataService,platformDetailControllerService, formConfig, translateService) {

				platformDetailControllerService.initDetailController($scope, dataService,{}, formConfig, translateService);
			}
		]);
})(angular);