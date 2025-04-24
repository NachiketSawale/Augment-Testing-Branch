/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceFilterController
	 * @function
	 *
	 * @description
	 * Controller for the filter in the estimate lookup view.
	 **/
	angular.module(moduleName).controller('estimateMainCopySourceFilterController',
		['$scope','$injector',
			'$translate',
			'$timeout',
			'estimateMainCopySourceFilterService',
			'platformDetailControllerService',
			'estimateMainCopySourceFilterUIStandardService',
			'estimateMainTranslationService',
			'estimateMainValidationService',
			'estimateRuleFormatterService',
			'estimateParameterFormatterService',
			'platformContextService',
			function ($scope,$injector,
				$translate,
				$timeout,
				estimateMainCopySourceFilterService,
				platformDetailControllerService,
				estimateMainCopySourceFilterUIStandardService,
				estimateMainTranslationService,
				estimateMainValidationService,
				estimateRuleFormatterService,
				estimateParameterFormatterService,
				platformContextService) {

				const localStorageKey = "EstimateSourceLineItemPrjId";

				$scope.setTitle($translate.instant('estimate.main.filterOptions'));

				// init options for the kendosplitter
				$scope.mainSplitter = {
					id: 'splitterstate',
					splitter: {
						top: 40,
						bottom: 60,
						topcollapsed: false,
						bottomcollapsed: false
					}
				};

				$scope.splitterSourceLineState = {
					id: 'splittersourcelinestate',
					splitter: {
						top: 50,
						bottom: 50,
						topcollapsed: false,
						bottomcollapsed: false
					}
				};

				$scope.splitterAssembliesState = {
					id: 'splitterassembliesstate',
					splitter: {
						top: 50,
						bottom: 50,
						topcollapsed: false,
						bottomcollapsed: false
					}
				};

				$scope.change = function (entity, field, column) {
					estimateRuleFormatterService.setSourceSelectedProject(entity.ProjectId,entity.EstHeaderId);
					estimateParameterFormatterService.setSourceSelectedProject(entity.ProjectId,entity.EstHeaderId);
					let localStorageVal = platformContextService.getApplicationValue(localStorageKey);
					let prjId = entity.ProjectId !== localStorageVal && entity.ProjectId !== null ? entity.ProjectId : localStorageVal;
					platformContextService.setApplicationValueWithSave(localStorageKey,prjId);
					estimateMainCopySourceFilterService.fieldChange(entity, field, column);
				};

				$scope.onStartSearch = function (entity, field, column) {
					// load lineitems
					estimateMainCopySourceFilterService.fieldChange(entity, field, column);
				};

				$scope.isAssembly = function () {
					estimateMainCopySourceFilterService.getIsAssembly();
				};

				platformDetailControllerService.initDetailController($scope, estimateMainCopySourceFilterService, estimateMainValidationService, estimateMainCopySourceFilterUIStandardService, estimateMainTranslationService);

				// update realfactorcost or realfactorquantity on modification
				function updateCurrentItem() {
					$timeout(function () {
						$scope.currentItem = estimateMainCopySourceFilterService.getSelected();

					}, 0);
				}

				estimateMainCopySourceFilterService.dataModified.register(updateCurrentItem);

				//  unregister subscription
				$scope.$on('$destroy', function () {
					// estimateMainCopySourceFilterService.unregisterDataModified(updateCurrentItem);

					estimateMainCopySourceFilterService.dataModified.unregister(updateCurrentItem);
				});
			}
		]);
})();
