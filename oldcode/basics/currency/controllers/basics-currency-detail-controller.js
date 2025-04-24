/**
 * Created by joshi on 18.11.2014.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.currency';

	angular.module(moduleName).value('basicsCurrencyDetailConfig', { groups: [], rows: [] });

	/**
	 * @ngdoc controller
	 * @name basicsCurrencyDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of Currency entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsCurrencyDetailController', ['$scope', 'platformDetailControllerService', 'basicsCurrencyMainService', 'basicsCurrencyValidationService', 'basicsCurrencyStandardConfigurationService', 'basicsCurrencyTranslationService', 'basicsCurrencyCommonService',

		function ($scope, platformDetailControllerService, basicsCurrencyMainService, basicsCurrencyValidationService, basicsCurrencyStandardConfigurationService, basicsCurrencyTranslationService, basicsCurrencyCommonService) {

			platformDetailControllerService.initDetailController($scope, basicsCurrencyMainService, basicsCurrencyValidationService, basicsCurrencyStandardConfigurationService, basicsCurrencyTranslationService);

			$scope.change= function change(item, model){
				basicsCurrencyCommonService.setDefault(item, model, basicsCurrencyMainService.getList());
				basicsCurrencyMainService.gridRefresh();
			};
		}
	]);

})(angular);