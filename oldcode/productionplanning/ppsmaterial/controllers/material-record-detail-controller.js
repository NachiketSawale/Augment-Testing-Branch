(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';
	angular.module(moduleName).controller('productionplanningPpsmaterialRecordDetailController', DetailController);

	DetailController.$inject = ['$scope',
		'$injector',
		'platformDetailControllerService',
		'platformFormConfigService',
		'basicsCharacteristicDataServiceFactory',
		'productionplanningPpsMaterialUIStandardService',
		'productionplanningPpsMaterialRecordMainService',
		'productionplanningPpsMaterialTranslationService',
		'productionplanningPpsMaterialValidationService',
		'productionplanningPpsMaterialEntityPropertychangedExtension'];
	function DetailController($scope,
		$injector,
		detailControllerService,
		platformFormConfigService,
		basicsCharacteristicDataServiceFactory,
		formConfiguration,
		dataService,
		translateService,
		validationService,
		ppsMaterialExtension) {

		const formContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 60;

		detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

		// extend characteristic2
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			scope: $scope,
			formContainerId: formContainerGuid,
			dataService: dataService,
			containerInfoService: 'productionplanningPpsmaterialContainerInformationService',
			additionalCellChangeCallBackFn: null,
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		// set the rows readonly
		const exceptedRows = ['ppsProperties', 'pUCreationGroup', 'ppsUserdefinedTexts', 'characteristics'];
		angular.forEach(formConfiguration.getStandardConfigForDetailView().rows, function (row) {
			if (!exceptedRows.includes(row.gid) && row.model !== 'IsProduct'){
				row.editor = null;
				row.readonly = true;
			}
		});

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(characteristic2Config.formContainerId, characteristic2Config.sectionId);
		});
	}
})(angular);