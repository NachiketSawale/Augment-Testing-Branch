/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	/* global _ */

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceLineItemLookupController
	 * @function
	 * @description
	 * Controller for the  list view of Copy Source Line Item entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainCopySourceLineItemLookupController',
		['$q', '$scope', '$injector', '$timeout', '$translate', 'platformGridControllerService',
			'estimateMainCopySourceLineItemLookupService', 'estimateMainClipboardService', 'platformDragdropService',
			'estimateMainDynamicConfigurationService', 'estimateMainValidationService', 'estimateMainCopySourceFilterService', 'estimateMainService',
			function ($q, $scope, $injector, $timeout, $translate, platformGridControllerService, estimateMainCopySourceLineItemLookupService,
				estimateMainClipboardService, platformDragdropService, estimateMainDynamicConfigurationService, estimateMainValidationService, estimateMainCopySourceFilterService, estimateMainService) {

				let myGridConfig = {
					initCalled: false, columns: [],
					type: 'copySourceLineItems',
					dragDropService: estimateMainClipboardService
				};

				$scope.setTitle($translate.instant('estimate.main.lineItemContainer'));

				$scope.gridId = '35b7329abce3483abaffd5a437c392dc';

				platformGridControllerService.initListController($scope, estimateMainDynamicConfigurationService, estimateMainCopySourceLineItemLookupService, estimateMainValidationService, myGridConfig);

				$scope.tools.refresh();

				// To update Rule and Param service itemName and itemServiceName to solve Rule, Param issue #135709
				var updateRule = _.find($scope.gridData.config.columns, { id: 'rule' });
				if (updateRule.formatterOptions) {
					updateRule.formatterOptions.isSourceLineItem = true;
					updateRule.formatterOptions.itemServiceName = 'estimateMainCopySourceLineItemLookupService';
					updateRule.acceptFalsyValues = true;
				}

				var updateParam = _.find($scope.gridData.config.columns, { id: 'param' });
				if (updateParam.formatterOptions) {
					updateParam.formatterOptions.isSourceLineItem = true;
					updateParam.formatterOptions.itemServiceName = 'estimateMainCopySourceLineItemLookupService';
					updateParam.acceptFalsyValues = true;
				}

				var boqItem = _.find($scope.gridData.config.columns, { id: 'boqitemfk' });
				if (boqItem.formatterOptions) {
					boqItem.formatterOptions.isSourceLineItem = true;
					boqItem.formatterOptions.mainServiceName = 'estimateMainCopySourceLineItemLookupService';
				}

				var boqrootref = _.find($scope.gridData.config.columns, { id: 'boqrootref' });
				if (boqrootref.formatterOptions) {
					boqrootref.formatterOptions.isSourceLineItem = true;
					boqrootref.formatterOptions.mainServiceName = 'estimateMainCopySourceLineItemLookupService';
				}

				var activity = _.find($scope.gridData.config.columns, { id: 'psdactivityfk' });
				if (activity.formatterOptions) {
					activity.formatterOptions.isSourceLineItem = true;
				}

				var activitySch = _.find($scope.gridData.config.columns, { id: 'psdactivityschedule' });
				if (activitySch.formatterOptions) {
					activitySch.formatterOptions.isSourceLineItem = true;
				}

				var location = _.find($scope.gridData.config.columns, { id: 'prjlocationfk' });
				if (location.formatterOptions) {
					location.formatterOptions.isSourceLineItem = true;
				}

				$timeout(function () {
					$injector.get('platformTranslateService').translateGridConfig($scope.gridData.config.columns);
					$injector.get('platformGridAPI').columns.configuration($scope.gridId, $scope.gridData.config.columns, true);
					$injector.get('platformGridAPI').configuration.refresh($scope.gridId);
				});

				function loadSourceLineItems(filter) {
					estimateMainCopySourceLineItemLookupService.loadSourceLineItems(filter);
				}

				estimateMainCopySourceLineItemLookupService.gridId = $scope.gridId;

				// Display the module header info for the selected main line item
				estimateMainCopySourceLineItemLookupService.setShowHeaderAfterSelectionChanged(function (lineItemEntity) {
					estimateMainService.updateModuleHeaderInfo(estimateMainService.getSelected());
				});

				estimateMainCopySourceFilterService.loadSourceLineItems.register(loadSourceLineItems);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					estimateMainCopySourceFilterService.loadSourceLineItems.unregister(loadSourceLineItems);
				});
			}
		]);
})(angular);

