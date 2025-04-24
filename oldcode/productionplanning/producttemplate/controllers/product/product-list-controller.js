(function () {
	/* global _ */
	'use strict';
	const moduleName = 'productionplanning.producttemplate';
	const angModule = angular.module(moduleName);

	angModule.controller('productionplanningProducttemplateProductListController', ListController);

	ListController.$inject = ['$scope',
		'$injector',
		'platformGridAPI',
		'platformGridControllerService',
		'productionplanningCommonActivityDateshiftService',
		'productionplanningCommonProductUIStandardService',
		'productionplanningCommonProductValidationFactory',
		'ppsCommonModelFilterService',
		'productionplanningProductMainService',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension',
		'ppsCommonClipboardService'];
	function ListController($scope,
		$injector,
		platformGridAPI,
		platformGridControllerService,
		productionplanningCommonActivityDateshiftService,
		uiStandardServ,
		validationServiceFactory,
		ppsCommonModelFilterService,
		productionplanningProductMainService,
		productDocumentDataProviderFactory,
		ppsDocumentToolbarButtonExtension,
		ppsCommonClipboardService) {

		const containerId = $scope.getContentValue('id');
		const seviceOptions = $scope.getContentValue('serviceOptions');
		const dataServ = $injector.get(seviceOptions.dataService);
		const eventModuleName = $scope.getContentValue('eventModuleName');;
		const validationServ = validationServiceFactory.getValidationService(dataServ, eventModuleName);
		const characteristic2SectionId = 64;

		const gridConfig = {
			initCalled: false,
			columns: [],
			type: 'productionplanning.producttemplate',
			dragDropService: ppsCommonClipboardService
		};

		platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);

		if(containerId === 'productionplanning.product.product.list' || containerId === 'productionplanning.producttemplate.product.list'){
			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		}
		dataServ.registerSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
		dataServ.registerLookupFilter();

		function onCellChange(e, args) {
			const column = args.grid.getColumns()[args.cell].field;
			dataServ.onEntityPropertyChanged(args.item, column);
		}

		// extend characteristic2
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		if (_.isFunction(dataServ.getCharacteristicColumn)) {
			const characteristic2Config = {
				sectionId: characteristic2SectionId,
				gridContainerId: $scope.gridId,
				gridConfig: gridConfig,
				dataService: dataServ,
				containerInfoService: 'productionplanningProductContainerInformationService',
			};
			characteristic2ColumnEventsHelper.register(characteristic2Config);
		}

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataServ);
		})();


		const eventServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
		const eventService = eventServiceFactory.getService('ProductFk', 'productionplanning.common.product.event', dataServ);

		const toolConfig = { tools : [ { id: 'fullshift', value: true } ], configId: 'productionplanning.common' }; // 'productionplanning.product'
		productionplanningCommonActivityDateshiftService.initializeDateShiftController('productionplanning.common', eventService, $scope, toolConfig); // 'productionplanning.product'


		// un-register on destroy
		$scope.$on('$destroy', function () {
			dataServ.unregisterSelectedEntitiesChanged(ppsCommonModelFilterService.updateMainEntityFilter);
			if(containerId === 'productionplanning.product.product.list'){
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			}
			dataServ.unregisterLookupFilter();
			characteristic2ColumnEventsHelper.unregister($scope.gridId, characteristic2SectionId);
		});
	}
})();