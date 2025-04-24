/**
 * Created by zwz on 05/06/2019.
 */

(function (angular) {
	'use strict';
	/* global _ */
	const moduleName = 'productionplanning.producttemplate';
	const module = angular.module(moduleName);

	module.controller('productionplanningProducttemplateProductDescriptionListController', Controller);

	Controller.$inject = ['$scope', 'platformGridAPI',
		'platformGridControllerService',
		'productionplanningProducttemplateProductDescriptionUIStandardService',
		'$injector','platformContainerControllerService',
		'ppsCommonClipboardService'];
	function Controller($scope, platformGridAPI,
		platformGridControllerService,
		uiStandardService,
		$injector,platformContainerControllerService,
		ppsCommonClipboardService) {

		const characteristic2SectionId = 62;

		let dataService, validationService, uiService = uiStandardService, containerInfoService;

		const gridConfig = {
			initCalled: false,
			columns: [],
			type: 'productionplanning.producttemplate',
			dragDropService: ppsCommonClipboardService
		};

		if($scope.getContentValue('moduleName')){
			const guid = $scope.getContentValue('uuid');
			const _moduleName = $scope.getContentValue('moduleName') || moduleName;
			platformContainerControllerService.initController($scope, _moduleName, guid);

			containerInfoService = platformContainerControllerService.getModuleInformationService(_moduleName);
			const layInfo = containerInfoService.getContainerInfoByGuid(guid);
			dataService = platformContainerControllerService.getServiceByToken(layInfo.dataServiceName);
		}else {
			const serviceOptions = $scope.getContentValue('serviceOptions');
			containerInfoService = $injector.get('productionplanningProductTemplateContainerInformationService');
			if (!serviceOptions) {
				dataService = $injector.get('productionplanningProducttemplateMainService');
				validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationService');
			} else {
				dataService = $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(serviceOptions);
				validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationServiceFactory').getService(dataService);
				gridConfig.idProperty = serviceOptions.idProperty;
				uiService = uiService.getService(serviceOptions.uiServiceKey);
			}
			platformGridControllerService.initListController($scope, uiService, dataService, validationService, gridConfig);
		}

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			if (dataService.handleFieldChanged) {
				dataService.handleFieldChanged(args.item, col);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		// extend characteristic2
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		if (_.isFunction(dataService.getCharacteristicColumn)) {
			const characteristic2Config = {
				sectionId: characteristic2SectionId,
				gridContainerId: $scope.gridId,
				gridConfig: gridConfig,
				dataService: dataService,
				containerInfoService: containerInfoService,
			};
			characteristic2ColumnEventsHelper.register(characteristic2Config);
		}

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			if (_.isFunction(dataService.getCharacteristicColumn)) {
				characteristic2ColumnEventsHelper.unregister($scope.gridId, characteristic2SectionId);
			}
		});
	}
})(angular);