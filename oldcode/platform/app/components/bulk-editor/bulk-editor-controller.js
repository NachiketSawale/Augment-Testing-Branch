(function (angular) {
	'use strict';

	angular.module('platform').controller('platformBulkEditorController', ['$scope', 'basicsCommonRuleEditorService', '_', 'platformBulkEditorConfigurationService',
		function ($scope, ruleEditorService, _, configurationService) {

			var bulkConfigurations = configurationService.getConfigs();

			function initScope(item) {
				// bind the last item which is the the newly created bulkConfig
				$scope.bulkConfig = item ? item : bulkConfigurations[bulkConfigurations.length - 1];
				// for ruleEditor
				$scope.bulkGroup = $scope.bulkConfig ? $scope.bulkConfig.BulkGroup[0] : null;
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
					var result = _.get(item, $scope.inputSelectOptions.displayMember);
					if (_.isString(result) && _.isEmpty(result)) {
						result = '';
					}
					return result;
				}
			};

			$scope.count = ruleEditorService.getConfig().AffectedEntities.length;

			$scope.lastBulkConfig = {};

			// watch the model of inputSelect
			$scope.$watch('bulkConfig', function (newBulkConfig, oldBulkConfig) {

				// trigger validation
				// configurationService.configIsValid(newBulkConfig);
				// merge inputSelect Item with last item
				if (newBulkConfig && !newBulkConfig.BulkGroup && $scope.lastBulkConfig) {
					var description = newBulkConfig[$scope.inputSelectOptions.displayMember];
					$scope.lastBulkConfig[$scope.inputSelectOptions.displayMember] = description;
					newBulkConfig = $scope.lastBulkConfig;
				}
				configurationService.lastActiveConfig = $scope.bulkConfig = newBulkConfig;
				// selectedItem Changed or BulkGroup changed
				var bulkGroup = newBulkConfig && newBulkConfig.BulkGroup ? newBulkConfig.BulkGroup[0] : null;
				$scope.bulkGroup = bulkGroup;
				$scope.lastBulkConfig = newBulkConfig;
				if (_.isEmpty(bulkGroup)) {
					configurationService.deleteBulkConfig(newBulkConfig);
					$scope.lastBulkConfig = null;
					$scope.bulkGroup = null;
				} else if (newBulkConfig.Id === oldBulkConfig.Id && !_.isEmpty(bulkGroup) && ruleEditorService.checkChildren(bulkGroup[0].Children)) {
					configurationService.saveBulkConfig(newBulkConfig);
				}
			}, true);

			// create a manager with readOnly false
			$scope.manager = ruleEditorService.getDefaultManager(false);

		}
	]);
})(angular);

