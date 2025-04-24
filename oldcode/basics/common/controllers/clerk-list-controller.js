/**
 * Created by wed on 07/05/2017.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('basicsCommonClerkListController', ['$scope', '$injector', 'platformGridControllerService', 'bascisCommonClerkDataServiceFactory',
		'basicsCommonClerkUIStandardServiceFactory', 'basicsCommonClerkValidationServiceFactory',
		function ($scope, $injector, platformGridControllerService, bascisCommonClerkDataServiceFactory, basicsCommonClerkUIStandardServiceFactory, basicsCommonClerkValidationServiceFactory) {

			const qualifier = $scope.getContentValue('clerkQualifier'),
				parentServiceName = $scope.getContentValue('parentService'),
				configServiceName = $scope.getContentValue('configService'),
				validateServiceName = $scope.getContentValue('validateService'),
				extendServiceName = $scope.getContentValue('extendService'),
				itemName = $scope.getContentValue('itemName');
			let doesRequireLoadAlways = false;
			if (extendServiceName) {
				doesRequireLoadAlways = true;
			}
			const dataService = bascisCommonClerkDataServiceFactory.getService(qualifier, parentServiceName, itemName, doesRequireLoadAlways, extendServiceName);
			const validateService = validateServiceName ? $injector.get(validateServiceName) : basicsCommonClerkValidationServiceFactory.getService(qualifier, dataService);
			const configService = configServiceName ? $injector.get(configServiceName) : basicsCommonClerkUIStandardServiceFactory.getService(qualifier, $injector.get(parentServiceName));

			platformGridControllerService.initListController($scope, configService, dataService, validateService, {
				initCalled: false,
				columns: []
			});

		}]);

})(angular);