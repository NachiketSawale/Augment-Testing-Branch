(function (angular) {
	'use strict';
	var modName = 'basics.pricecondition';

	angular.module(modName).controller('basicsPriceConditionParamController',
		['$scope', '$translate', '$injector',
			'platformGridControllerService',
			'basicsPriceConditionParamDataService',
			'basicsPriceConditionParamValidationService',
			'basicsPriceConditionParamUIStandardService',
			'platformGridAPI',
			'platformPermissionService',
			function ($scope, $translate,$injector,
				platformGridControllerService,
				paramDataService,
				validationService,
				uiService,
				platformGridAPI,
				platformPermissionService) {

				var serviceName = $scope.getContentValue('mainService'),
					paramTypeId = Number($scope.getContentValue('paramTypeId')),
					uuid = $scope.getContentValue('uuid'),
					title = $scope.getContentValue('title'),
					parentService = $injector.get(serviceName),
					gridConfig = {initCalled: false, columns: []},
					permissionGUID = $scope.getContentValue('permission');

				parentService.uuid = uuid;

				var dataService = paramDataService.getService(parentService, {
					uuid: uuid,
					paramTypeId: paramTypeId,
					title: title
				});

				platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);


				function init() {
					platformPermissionService.loadPermissions([permissionGUID]).then(function() {
						angular.noop();
					});
				}
				init();

				$scope.$on('$destroy', function () {

				});
			}]);
})(angular);