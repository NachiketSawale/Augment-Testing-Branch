/**
 * Created by lnt on 3/26/2019.
 */

(function () {
	/* global _ */
	'use strict';

	var modulename = 'qto.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('qtoBoqDetailFormController', ['boqMainDetailFormControllerService', '$scope', '$timeout', 'platformDetailControllerService', 'qtoBoqStructureService',
		'boqMainValidationServiceProvider', 'salesCommonBoqMainUIStandardService', 'boqMainTranslationService', 'boqMainDetailFormConfigService', 'boqMainCommonService', 'platformModalService',
		'qtoBoqStructureConfigurationService','qtoMainHeaderDataService',
		function (boqMainDetailFormControllerService, $scope, $timeout, platformDetailControllerService, qtoBoqStructureService,
			boqMainValidationServiceProvider, salesCommonBoqMainUIStandardService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService,
			qtoBoqStructureConfigurationService,qtoMainHeaderDataService) {
			qtoBoqStructureConfigurationService.setCurrentBoqMainService(qtoBoqStructureService);
			boqMainDetailFormControllerService.initDetailFormController($scope, $timeout, platformDetailControllerService, qtoBoqStructureService, boqMainValidationServiceProvider, qtoBoqStructureConfigurationService, boqMainTranslationService, boqMainDetailFormConfigService, boqMainCommonService, platformModalService);

			function loadUserDefinedColumnDetail() {
				let dynamicUserDefinedColumnsService = qtoBoqStructureService.getDynamicUserDefinedColumnsService();
				if (dynamicUserDefinedColumnsService && angular.isFunction(dynamicUserDefinedColumnsService.loadUserDefinedColumnDetail)) {
					dynamicUserDefinedColumnsService.loadUserDefinedColumnDetail($scope);
				}
			}

			loadUserDefinedColumnDetail();

			// active tool items
			function activeToolItems() {
				if ($scope.$parent && $scope.$parent.tools && $scope.$parent.tools.items) {
					$scope.$parent.tools.items = _.filter($scope.$parent.tools.items, function (item) {
						let isFilter = item.id === 'create' || item.id === 'createChild' || item.id === 'delete';
						return !isFilter;
					});

					$scope.$parent.tools.update();
				}
			}

			$timeout(function () {
				activeToolItems();
			}, 0);

			// DynamicConfigSetUp: 5. For Detail, In case we require to change the configuration on row selected, then we will the following configuration.
			function onSelectionChanged() {

				$timeout(function () {
					qtoBoqStructureConfigurationService.refreshDetailConfig($scope);

					activeToolItems();
				}, 0);
			}

			qtoMainHeaderDataService.registerSelectionChanged(onSelectionChanged);
		}
	]);
})();