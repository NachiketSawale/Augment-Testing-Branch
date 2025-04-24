(function (angular) {
	'use strict';

	/**
	 * @name transportplanningRequisitionDetailsController
	 * @function
	 *
	 * */

	var moduleName = 'transportplanning.requisition';
	var RequisitionModul = angular.module(moduleName);

	RequisitionModul.controller('transportplanningRequisitionDetailsController', RequisitionDetailsController);
	RequisitionDetailsController.$inject = ['$scope', '$injector',
		'platformDetailControllerService','platformTranslateService', 'transportplanningRequisitionUIStandardService',
		'transportplanningRequisitionValidationService', 'ppsCommonLoggingHelper',
		'PpsCommonCharacteristic2RowEventsHelper'];

	function RequisitionDetailsController($scope, $injector,
										  detailControllerService,platformTranslateService, uiStandardService,
										  validationService, ppsCommonLoggingHelper,
										  characteristic2RowEventsHelper) {
		var detailLayout = uiStandardService.getStandardConfigForDetailView();
		if (!detailLayout.isTranslated) {
			platformTranslateService.translateFormConfig(detailLayout);
			detailLayout.isTranslated = true;
		}
		//remark:fix issue about "transportplanningRequisitionUIStandardService has been initialized before finishing translateLoadingSuccess of translation of transport requisition module",
		//this issue is caused by setting generic structre configuration("platform.generic.structure" and etc) in container.json (by zweig 2019/02/22)

		function getDataService() {
			var dataServiceName = $scope.getContentValue('dataService');
			if (angular.isUndefined(dataServiceName)){
				dataServiceName = 'transportplanningRequisitionMainService';
			}
			return $injector.get(dataServiceName);
		}

		var dataService = getDataService();

		// extend validation for logging
		ppsCommonLoggingHelper.extendValidationIfNeeded(
			dataService,
			validationService,
			{
				typeName: 'RequisitionDto',
				moduleSubModule: 'TransportPlanning.Requisition'
			}
		);

		detailControllerService.initDetailController($scope,
			dataService,
			validationService,
			uiStandardService,
			'transportplanningRequisitionTranslationService');

		// extend characteristics2
		const characteristics2Section = 75;
		const characteristic2Config = {
			sectionId: characteristics2Section,
			scope: $scope,
			formContainerId: $scope.getContainerUUID(),
			dataService: dataService,
			containerInfoService: 'transportplanningRequisitionContainerInformationService',
		};
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister($scope.getContainerUUID(), characteristics2Section);
		});
	}
})(angular);