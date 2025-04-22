/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.billing';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesBillingBoqStructureController',
		['boqMainNodeControllerService', '$scope', '_', 'salesBillingBoqStructureService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'salesBillingBoqStructureConfigurationService', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI', 'modelViewerStandardFilterService',
			'$rootScope', 'boqMainLinkedDispatchNoteDataService',
			function salesBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, _, salesBillingBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesBillingBoqStructureConfigurationService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI, modelViewerStandardFilterService,
														$rootScope, boqMainLinkedDispatchNoteDataService) {
				var boqStructureConfigService = salesBillingBoqStructureConfigurationService.createService(salesBillingBoqStructureService);
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
				boqMainNodeControllerService.initBoqNodeController($scope, salesBillingBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				var dynamicUserDefinedColumnsService = salesBillingBoqStructureService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
					dynamicUserDefinedColumnsService.applyToScope($scope);
				}

				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
					dynamicUserDefinedColumnsService.loadDynamicColumns();
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesBillingBoqStructureService');

				const onGridClick = (e, args) => {
					let selectedItem = args.grid.getDataItem(args.row);
					$rootScope.$emit('linked-dispatch-note-parent-grid-click', {
						clickedItem: selectedItem,
						title: $translate.instant('boq.main.boqStructure'),
						uuid: $scope.gridId,
					});
				};
				platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

				boqMainLinkedDispatchNoteDataService.register({
					uuid: $scope.gridId,
					moduleName: moduleName,
					title: $translate.instant('boq.main.boqStructure'),
					parentService: salesBillingBoqStructureService,
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
				});
			}
		]);
})();
