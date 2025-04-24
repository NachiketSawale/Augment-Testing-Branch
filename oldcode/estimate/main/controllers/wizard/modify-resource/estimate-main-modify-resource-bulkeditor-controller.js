/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainModifyResourceBulkEditorController
	 * @requires $scope
	 * @description use for modify estimate bulk editor
	 */
	angular.module(moduleName).controller('estimateMainModifyResourceBulkEditorController',
		['$scope','$sce', '$translate', 'estimateMainReplaceResourceCommonService', 'platformBulkEditorConfigurationService', 'basicsCommonRuleEditorService',
			function ($scope, $sce, $translate, estimateMainReplaceResourceCommonService, configurationService, ruleEditorService) {

				let bulkConfigurations = configurationService.getConfigs();

				function initScope(item) {
					// bind the last item which is the the newly created bulkConfig
					$scope.bulkConfig = item ? item : bulkConfigurations[bulkConfigurations.length - 1];
					// for ruleEditor
					$scope.bulkGroup = $scope.bulkConfig? $scope.bulkConfig.BulkGroup[0]: null;
				}

				initScope();
				configurationService.registerConfigChanged(initScope);

				$scope.inputSelectOptions = {
					inputDomain: 'description',
					valueMember: 'Id',
					displayMember: 'Description',
					items: bulkConfigurations,
					watchItems: true,
					modelIsObject: true,
					displayTemplateProvider: function displayTemplateProvider(item) {
						let result = _.get(item, $scope.inputSelectOptions.displayMember);
						if (_.isString(result) && _.isEmpty(result)) {
							result = '';
						}
						return result;
					}
				};

				// $scope.count = ruleEditorService.getConfig().AffectedEntities.length;

				$scope.lastBulkConfig = {};

				// watch the model of inputSelect
				$scope.$watch('bulkConfig', function (newBulkConfig, oldBulkConfig) {

					// merge inputSelect Item with last item
					if (!newBulkConfig.BulkGroup && $scope.lastBulkConfig) {
						let description = newBulkConfig[$scope.inputSelectOptions.displayMember];
						$scope.lastBulkConfig[$scope.inputSelectOptions.displayMember] = description;
						newBulkConfig = $scope.lastBulkConfig;
					}
					configurationService.lastActiveConfig = $scope.bulkConfig = newBulkConfig;

					estimateMainReplaceResourceCommonService.setBulkEditorConfig($scope.bulkConfig);

					// selectedItem Changed or BulkGroup changed
					let bulkGroup = newBulkConfig && newBulkConfig.BulkGroup ? newBulkConfig.BulkGroup[0] : null;
					$scope.bulkGroup = bulkGroup;
					$scope.lastBulkConfig = newBulkConfig;
					if (_.isEmpty(bulkGroup)) {
						configurationService.deleteBulkConfig(newBulkConfig);
						$scope.lastBulkConfig = null;
						$scope.bulkGroup = null;
					} else if(newBulkConfig.Id === oldBulkConfig.Id && !_.isEmpty(bulkGroup)) {
						configurationService.saveBulkConfig(newBulkConfig);
					}
					estimateMainReplaceResourceCommonService.setCharacteristicColumn($scope.bulkGroup);

					// create a manager with readOnly false
					$scope.manager = ruleEditorService.getDefaultManager(false);

				}, true);

			}]);
})();
