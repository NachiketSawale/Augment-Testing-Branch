/**
 * Created by pel on 19/09/2022.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonApprovalListController', ['$scope', '$injector', 'platformGridControllerService', 'bascisCommonApprovalDataServiceFactory',
		'basicsCommonApprovalUIStandardServiceFactory', 'basicsCommonApprovalValidationServiceFactory',
		function ($scope, $injector, platformGridControllerService, bascisCommonApprovalDataServiceFactory, basicsCommonApprovalUIStandardServiceFactory, basicsCommonApprovalValidationServiceFactory) {

			const qualifier = $scope.getContentValue('clerkQualifier'),
				parentServiceName = $scope.getContentValue('parentService'),
				configServiceName = $scope.getContentValue('configService'),
				validateServiceName = $scope.getContentValue('validateService'),
				itemName = $scope.getContentValue('itemName');
			let doesRequireLoadAlways = false;

			const dataService = bascisCommonApprovalDataServiceFactory.getService(qualifier, parentServiceName, itemName, doesRequireLoadAlways);
			const validateService = validateServiceName ? $injector.get(validateServiceName) : basicsCommonApprovalValidationServiceFactory.getService(qualifier, dataService);
			const configService = configServiceName ? $injector.get(configServiceName) : basicsCommonApprovalUIStandardServiceFactory.getService(qualifier, $injector.get(parentServiceName));

			platformGridControllerService.initListController($scope, configService, dataService, validateService, {
				initCalled: false,
				columns: []
			});

		}]);

})(angular);