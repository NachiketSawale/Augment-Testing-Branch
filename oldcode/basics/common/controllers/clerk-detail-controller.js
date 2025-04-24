/**
 * Created by wed on 07/20/2017.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonClerkFormController', ['$scope', '$injector', 'platformDetailControllerService', 'bascisCommonClerkDataServiceFactory', 'basicsCommonClerkUIStandardServiceFactory', 'basicsCommonClerkValidationServiceFactory', 'basicsCommonClerkTranslateService', function ($scope, $injector, platformDetailControllerService, bascisCommonClerkDataServiceFactory, basicsCommonClerkUIStandardServiceFactory, basicsCommonClerkValidationServiceFactory, basicsCommonClerkTranslateService) {

		const qualifier = $scope.getContentValue('clerkQualifier'),
			parentServiceName = $scope.getContentValue('parentService'),
			configServiceName = $scope.getContentValue('configService'),
			validateServiceName = $scope.getContentValue('validateService'),
			extendServiceName = $scope.getContentValue('extendService'),
			itemName = $scope.getContentValue('itemName');
		const dataService = bascisCommonClerkDataServiceFactory.getService(qualifier, parentServiceName, itemName, false, extendServiceName);
		const validateService = validateServiceName ? $injector.get(validateServiceName) : basicsCommonClerkValidationServiceFactory.getService(qualifier, dataService);
		const configService = configServiceName ? $injector.get(configServiceName) : basicsCommonClerkUIStandardServiceFactory.getService(qualifier, $injector.get(parentServiceName));

		const parentService = $injector.get(parentServiceName);
		let translationInfos;
		if (parentService.getClerkContextFkUIConfig && angular.isFunction(parentService.getClerkContextFkUIConfig)) {

			translationInfos = parentService.getClerkContextFkUIConfig().translationInfos;
		}

		const translateService = basicsCommonClerkTranslateService.getService({translationInfos: translationInfos});
		platformDetailControllerService.initDetailController($scope, dataService, validateService, configService, translateService);

	}]);

})(angular);