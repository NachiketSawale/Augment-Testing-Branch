(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	var angModule = angular.module(moduleName);

	angModule.controller('transportplanningTransportDetailController', transportplanningTransportDetailController);
	transportplanningTransportDetailController.$inject = ['$scope',
		'platformDetailControllerService',
		'platformPermissionService',
		'platformTranslateService',
		'transportplanningTransportMainService',
		'transportplanningTransportValidationService',
		'transportplanningTransportUIStandardService',
		'transportplanningTransportTranslationService',
		'ppsCommonLoggingHelper',
		'PpsCommonCharacteristic2RowEventsHelper'];

	function transportplanningTransportDetailController($scope,
														platformDetailControllerService,
														platformPermissionService,
														platformTranslateService,
														dataServ,
														validServ,
														confServ,
														translationServ,
														ppsCommonLoggingHelper,
														characteristic2RowEventsHelper) {
		var detailLayout = confServ.getStandardConfigForDetailView();
		if (!detailLayout.isTranslated) {
			platformTranslateService.translateFormConfig(detailLayout);
			detailLayout.isTranslated = true;
		}
		//remark:fix issue about "transportplanningTransportUIStandardService has been initialized before finishing translateLoadingSuccess of translation of transport module",
		//this issue is caused by setting generic structre configuration("platform.generic.structure" and etc) in container.json (by zweig 2018/12/29)

		// extend validation for logging
		ppsCommonLoggingHelper.extendValidationIfNeeded(
			dataServ,
			validServ,
			{
				typeName: 'TrsRouteDto',
				moduleSubModule: 'TransportPlanning.Transport'
			}
		);

		platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, translationServ);
		//remove createButton and deleteButton if hasn't permissions
		if(!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('c')) ||
			!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('c'))){
			$scope.formContainerOptions.createBtnConfig = null;
		}
		if(!platformPermissionService.has('a78a23e2b050418cb19df541ab9bf028', platformPermissionService.permissionsFromString('d')) ||
			!platformPermissionService.has('849c2206bc204a2a9684343007ce4f31', platformPermissionService.permissionsFromString('d'))){
			$scope.formContainerOptions.deleteBtnConfig = null;
		}

		// extend characteristics2
		const characteristics2Section = 73;
		const characteristic2Config = {
			sectionId: characteristics2Section,
			scope: $scope,
			formContainerId: $scope.getContainerUUID(),
			dataService: dataServ,
			containerInfoService: 'transportplanningTransportContainerInformationService',
		};
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister($scope.getContainerUUID(), characteristics2Section);
		});
	}

})(angular);