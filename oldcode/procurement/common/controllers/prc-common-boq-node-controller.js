// / <reference path="../_references.js" />

(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	/**
	 * @ngdoc controller
	 * @name prcBoqMainNodeController
	 * @function
	 *
	 * @description
	 * Controller for the tree grid view of boq items.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection
	// noinspection JSUnusedGlobalSymbols
	angular.module('procurement.common').controller('prcBoqMainNodeController',
		['boqMainNodeControllerService', '$scope', 'procurementContextService', 'prcBoqMainService', 'platformNavBarService', 'platformGridControllerService', 'cloudDesktopHotKeyService', 'boqMainValidationServiceProvider', '$filter', 'boqMainClipboardService', 'boqMainCommonService', 'procurementCommonPrcBoqMainUIStandardService', 'boqMainTranslationService', 'platformModalService', '$translate', 'platformGridAPI',
			'modelViewerStandardFilterService',
			function prcBoqMainNodeControllerFunction(boqMainNodeControllerService, $scope, moduleContext, prcBoqMainService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI,
				modelViewerStandardFilterService) {
				prcBoqMainService = prcBoqMainService.getService(moduleContext.getMainService());
				var leadingService = moduleContext.getLeadingService();

				boqMainClipboardService.onPostClipboardSuccess.register(prcBoqMainService.onPostClopBoardSuccess);

				if (moduleContext.getModuleName() === 'procurement.package') {
					// Remove asynchronous validation of reference for this is currently not needed in package
					boqMainValidationServiceProvider.skipAsyncValidateReference(true);
				}

				boqMainNodeControllerService.initBoqNodeController($scope, prcBoqMainService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI);

				if (moduleContext.getModuleReadOnly()) {
					$scope.$parent.tools.items = _.filter($scope.$parent.tools.items, function (item) {
						return ['t1', 't111', 't7', 't8', 't9', 't10'].indexOf(item.id) !== -1;
					});
					prcBoqMainService.getCellEditable = function (item, field) {
						return !boqMainStandardConfigurationService.isReadonly({field: field});
					};
				}

				function onIsFreeItemsAllowedChanged(isFreeItemsAllowed) {
					var isDragAndDropAllowed = true;
					var isProtected = false;

					if (leadingService && _.isFunction(leadingService.getIsProtected)) {
						isProtected = leadingService.getIsProtected();
					}

					isDragAndDropAllowed = !isProtected || isFreeItemsAllowed;

					prcBoqMainService.setDragAndDropAllowed(isDragAndDropAllowed);
				}

				if (leadingService && _.isFunction(leadingService.registerIsFreeItemsAllowedChanged)) {
					leadingService.registerIsFreeItemsAllowedChanged(onIsFreeItemsAllowedChanged);
				}

				// When opening the boq structure container the status of the IsFreeItenmsAllowed flag given by the related PrcConfigHeader
				// is evaluated.
				if (leadingService && _.isFunction(leadingService.getIsFreeItemsAllowed)) {
					onIsFreeItemsAllowedChanged(leadingService.getIsFreeItemsAllowed());
				}

				modelViewerStandardFilterService.attachMainEntityFilter($scope, prcBoqMainService.getServiceName());
				prcBoqMainService.selectItemAfterReadData = true;

				prcBoqMainService.setToolItems($scope.tools.items);
				if (prcBoqMainService.updateToolsEvent) {
					prcBoqMainService.updateToolsEvent.register(updateTools);
				}

				function updateTools() {
					$scope.tools.update();
				}

				function onBoqItemEdited(propertyName) {
					if (['DiscountPercent','Discount','Price','Hours','Quantity','FinalPrice'].includes(propertyName)) {
						moduleContext.getMainService().isTotalDirty = true;
					}
				}
				prcBoqMainService.boqItemEdited.register(onBoqItemEdited);

				$scope.$on('$destroy', function () {
					if (prcBoqMainService.updateToolsEvent) {
						prcBoqMainService.updateToolsEvent.unregister(updateTools);
					}
					prcBoqMainService.boqItemEdited.unregister(onBoqItemEdited);
					boqMainClipboardService.onPostClipboardSuccess.unregister(prcBoqMainService.onPostClopBoardSuccess); // unbind listener
					prcBoqMainService.selectItemAfterReadData = false;
					if (leadingService && _.isFunction(leadingService.unregisterIsFreeItemsAllowedChanged)) {
						leadingService.unregisterIsFreeItemsAllowedChanged(onIsFreeItemsAllowedChanged);
					}
				});
			}
		]);
})();