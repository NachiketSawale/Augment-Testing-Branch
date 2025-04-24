/**
 * Created by wed on 20/09/2022.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonApprovalFormController', ['$scope', '$injector', 'platformDetailControllerService', 'bascisCommonApprovalDataServiceFactory', 'basicsCommonApprovalUIStandardServiceFactory', 'basicsCommonApprovalValidationServiceFactory', 'basicsCommonApprovalTranslateService', function ($scope, $injector, platformDetailControllerService, bascisCommonApprovalDataServiceFactory, basicsCommonApprovalUIStandardServiceFactory, basicsCommonApprovalValidationServiceFactory, basicsCommonApprovalTranslateService) {

		const qualifier = $scope.getContentValue('clerkQualifier'),
			parentServiceName = $scope.getContentValue('parentService'),
			configServiceName = $scope.getContentValue('configService'),
			validateServiceName = $scope.getContentValue('validateService'),
			extendServiceName = $scope.getContentValue('extendService'),
			itemName = $scope.getContentValue('itemName');
		const dataService = bascisCommonApprovalDataServiceFactory.getService(qualifier, parentServiceName, itemName, false, extendServiceName);
		const validateService = validateServiceName ? $injector.get(validateServiceName) : basicsCommonApprovalValidationServiceFactory.getService(qualifier, dataService);
		const configService = configServiceName ? $injector.get(configServiceName) : basicsCommonApprovalUIStandardServiceFactory.getService(qualifier, $injector.get(parentServiceName));
		const translateService = basicsCommonApprovalTranslateService.getService();
		platformDetailControllerService.initDetailController($scope, dataService, validateService, configService, translateService);

	}]);

})(angular);