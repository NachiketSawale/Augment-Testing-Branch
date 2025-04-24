(function (angular) {
	'use strict';

	// noinspection JSValidateTypes
	angular.module('platform').service('platformBulkEditorConfigurationService', platformBulkEditorConfigurationService);

	platformBulkEditorConfigurationService.$inject = ['_', 'globals', 'basicsCommonRuleEditorService', '$q', '$translate', '$rootScope', '$timeout', '$http', 'basicsCommonBulkEditProcessor'];

	function platformBulkEditorConfigurationService(_, globals, ruleEditorService, $q, $translate, $rootScope, $timeout, $http, basicsCommonBulkEditProcessor) {
		const self = this;

		self.list = [];
		self.listToSave = [];
		self.listToDelete = [];
		self.lastActiveConfig = null;
		self.ConfigChangedFn = _.noop;

		self.clearList = function () {
			self.list = [];
			self.listToSave = [];
			self.listToDelete = [];
			self.lastActiveConfig = null;
		};

		self.savePossible = function () {
			// trigger validation
			if (self.lastActiveConfig && self.lastActiveConfig.Version > 0) {
				return self.configIsValid(self.lastActiveConfig);
			}
			return (!_.isEmpty(self.listToSave) || !_.isEmpty(self.listToDelete) || !_.isEmpty(ruleEditorService.getConfig().RuleDefinitionsToDelete)) && areAllConfigsValid();
		};

		self.registerConfigChanged = function registerConfigChanged(fn) {
			self.ConfigChangedFn = fn;
		};

		self.createBulkConfig = function createBulkConfig(entityIdentifier, selectedColumn) {
			if (!_.isUndefined(entityIdentifier)) {
				return $http({
					url: globals.webApiBaseUrl + 'basics/common/bulk/createWithCondition',
					method: 'GET',
					params: {
						entityId: entityIdentifier
					}
				})
					.then((result) => {
						// result.data.Description = $translate.instant('platform.bulkEditor.configName');
						result.data.valid = true;
						if (selectedColumn && ruleEditorService.checkColumn(selectedColumn) && selectedColumn.bulkSupport !== false) {
							result.data.BulkGroup[0][0].Children[0].Operands.push({NamedProperty: {FieldName: selectedColumn.id}});
						}
						self.list.push(result.data);
						return result.data;
					});
			}
			return $q.when(false);
		};

		self.getBulkConfiguraion = function getBulkConfigurations(entityIdentifier, validationService) {
			if (!_.isUndefined(entityIdentifier)) {
				return $http({
					url: globals.webApiBaseUrl + 'basics/common/bulk/getBulkConfigurationByEntityId',
					method: 'POST',
					data: {
						Entityidentifier: entityIdentifier
					}
				})
					.then(function (result) {
						const promiseList = [];
						_.each(result.data, function (bulkConfig) {
							bulkConfig.valid = true;
							basicsCommonBulkEditProcessor.removeOperands(bulkConfig, entityIdentifier);

							_.each(bulkConfig.BulkGroup, function (bulkArray) {
								promiseList.push(ruleEditorService.processIncomingRules(bulkArray, validationService));
							});
							self.list.push(bulkConfig);
						});

						return $q.all(promiseList).then(function () {
							return result.data;
						});
					});
			}
			return $q.when(false);
		};

		self.update = function update() {
			const conditionsToDelete = ruleEditorService.getConfig().RuleDefinitionsToDelete;
			if (!_.isEmpty(self.listToSave) || !_.isEmpty(self.listToDelete) || !_.isEmpty(conditionsToDelete)) {

				_.each(self.listToSave, function (bulkConfig) {
					ruleEditorService.processOutgoingRules(bulkConfig.BulkGroup);
				});

				_.each(self.listToDelete, function (bulkConfig) {
					ruleEditorService.processOutgoingRules(bulkConfig.BulkGroup);
				});

				ruleEditorService.processOutgoingRules([conditionsToDelete]);

				return $http({
					url: globals.webApiBaseUrl + 'basics/common/bulk/update',
					method: 'POST',
					data: {
						BulkListToSave: self.listToSave,
						BulkListToDelete: self.listToDelete,
						ConditionsToDelete: conditionsToDelete
					}
				});
			}
			return $q.when(false);
		};

		self.saveBulkConfig = function saveBulkConfig(config) {

			if (config.BulkGroup && config.BulkGroup[0] && config.BulkGroup[0][0] && config.BulkGroup[0][0].Children && self.configIsValid(config)) {
				const saved = _.find(self.listToSave, function (savedConfig) {
					return config.Id === savedConfig.Id;
				});

				if (!saved) {
					self.listToSave.push(config);
				}
			}
		};

		self.deleteBulkConfig = function deleteBulkConfig(config) {

			if (!config) {
				return;
			}

			const index = _.findIndex(self.list, function (savedConfig) {
				return savedConfig.Id === config.Id;
			});

			// remove it from list
			_.remove(self.list, function (savedConfig) {
				return savedConfig.Id === config.Id;
			});
			// remove it from toSave
			_.remove(self.listToSave, function (savedConfig) {
				return savedConfig.Id === config.Id;
			});

			const deleted = _.find(self.listToDelete, function (deletedConfig) {
				return config.Id === deletedConfig.Id;
			});

			if (!deleted && config.Version > 0) {
				self.listToDelete.push(config);
			}

			let newIndex = index - 1;
			newIndex = (newIndex < 0) ? newIndex + 1 : newIndex;
			const newItem = self.list[newIndex] ? self.list[newIndex] : null;
			self.ConfigChangedFn(newItem);
		};

		self.getConfigs = function getConfigs() {
			return self.list;
		};

		function areAllConfigsValid() {
			const invalidConfigs = _.find(self.listToSave, {valid: false});
			return _.isEmpty(invalidConfigs);
		}

		self.configIsValid = function configIsValid(config2Check) {
			if (!config2Check || config2Check && !config2Check.BulkGroup || _.isEmpty(config2Check.Description)) {
				config2Check.valid = false;
				return config2Check.valid;
			}
			const configWithSameName = _.find(self.list, function (config) {
				// find a config with the same Description which is not the current Function ParamObject
				return (config.Description === config2Check.Description) && config2Check.Id !== config.Id;
			});
			const children = (config2Check.BulkGroup[0] && config2Check.BulkGroup[0][0]) ? config2Check.BulkGroup[0][0].Children : [];
			const valid = _.isEmpty(configWithSameName) && !_.isEmpty(config2Check.Description) && ruleEditorService.checkChildren(children);
			config2Check.valid = valid;
			return valid;
		};

		self.configIsValidForRun = function configIsValid() {
			const config2Check = self.lastActiveConfig;
			if (!config2Check || !config2Check.BulkGroup) {
				return false;
			}

			const children = (config2Check.BulkGroup[0] && config2Check.BulkGroup[0][0]) ? config2Check.BulkGroup[0][0].Children : [];
			const valid = ruleEditorService.checkChildren(children);
			config2Check.valid = valid;
			return valid;
		};
	}
})(angular);
