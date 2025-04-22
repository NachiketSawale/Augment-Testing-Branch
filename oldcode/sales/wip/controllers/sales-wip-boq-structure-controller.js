/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	var moduleName = 'sales.wip';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('salesWipBoqStructureController',
		['boqMainNodeControllerService', '$scope', '$timeout', '_', 'salesWipBoqStructureService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'salesWipBoqStructureConfigurationService', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI', 'modelViewerStandardFilterService',
			'$rootScope', 'boqMainLinkedDispatchNoteDataService',
			function salesBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, $timeout, _, salesWipBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesWipBoqStructureConfigurationService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI, modelViewerStandardFilterService,
														$rootScope, boqMainLinkedDispatchNoteDataService) {
				var boqStructureConfigService = salesWipBoqStructureConfigurationService.createService(salesWipBoqStructureService);
				salesCommonBoqMainUIStandardService.setBaseBoqMainConfigurationsService(boqStructureConfigService);
				boqMainNodeControllerService.initBoqNodeController($scope, salesWipBoqStructureService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, salesCommonBoqMainUIStandardService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				salesWipBoqStructureService.setGridId($scope.gridId);

				var dynamicUserDefinedColumnsService = salesWipBoqStructureService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.applyToScope)) {
					dynamicUserDefinedColumnsService.applyToScope($scope);
				}
				if (dynamicUserDefinedColumnsService && _.isFunction(dynamicUserDefinedColumnsService.loadDynamicColumns)) {
					dynamicUserDefinedColumnsService.loadDynamicColumns();
				}
				function init() {

				}

				$timeout(function () {
					init();
				}, 200);

				modelViewerStandardFilterService.attachMainEntityFilter($scope, 'salesWipBoqStructureService');

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
					parentService: salesWipBoqStructureService,
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
				});
			}
		]);
})();
