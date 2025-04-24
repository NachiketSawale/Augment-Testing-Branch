/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesPriceVersionListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of cost codes price version entities.
	 **/

	angular.module(moduleName).controller('basicsCostCodesPriceVersionListRecordDetailController',
		['$scope', 'platformDetailControllerService',
			'basicsCostCodesPriceVersionListRecordUIStandardService', 'basicsCostCodesPriceVersionListRecordDataService',
			'basicsCostCodesPriceVersionListRecordValidationService', 'basicsCostCodesPriceVersionListRecordTranslationService',
			'basicsCostcodesPriceVersionListRecordDynamicConfigurationService', 'platformFormConfigService', '$injector',
			function ($scope, platformDetailControllerService,
				uiStandardService, dataService, validationService, translationService, basicsCostcodesPriceVersionListRecordDynamicConfigurationService, platformFormConfigService, $injector) {

				platformDetailControllerService.initDetailController($scope, dataService, validationService, basicsCostcodesPriceVersionListRecordDynamicConfigurationService, translationService);

				let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
				basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.loadUserDefinedColumnDetail($scope);

			}
		]);
})(angular);

