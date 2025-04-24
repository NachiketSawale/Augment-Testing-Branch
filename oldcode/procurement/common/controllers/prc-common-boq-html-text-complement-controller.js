(function () {

	'use strict';
	var moduleName = 'procurement.common';

	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/
	angModule.controller('prcCommonBoqHtmlTextComplementController',
		['$scope',
			'prcBoqMainService',
			'boqMainTextComplementControllerFactory',
			'procurementContextService',
			function ($scope,
				prcBoqMainService,
				controllerServiceFactory,
				moduleContext) {

				var useHtmlText = true;
				var boqService = prcBoqMainService.getService(moduleContext.getMainService());
				var textComplementServiceKey = moduleContext.getModuleName();

				controllerServiceFactory.initController($scope, boqService, textComplementServiceKey, useHtmlText);

			}
		]);
})();
