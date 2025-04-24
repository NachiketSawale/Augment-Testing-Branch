(function (angular) {
	'use strict';
	angular.module('basics.config').factory('genericWizardUseCaseConfigService', genericWizardUseCaseConfigService);
	genericWizardUseCaseConfigService.$inject = ['_', 'genericWizardUseCaseContractApproval', 'genericWizardUseCaseRfQBidderWizard', 'genericWizardUseCaseContractConfirm', 'genericWizardUseCaseRfQApprovalWizard'];

	function genericWizardUseCaseConfigService(_, genericWizardUseCaseContractApproval, genericWizardUseCaseRfQBidderWizard, genericWizardUseCaseContractSendMail, genericWizardUseCaseRfQApprovalWizard) {
		var service = {};
		var defaultConfig = {Id: 'c420c85a094043d8bd9b830ba25fc334', name: 'Standard Generic Wizard'};
		service.useCaseWizardList = [defaultConfig, genericWizardUseCaseContractApproval, genericWizardUseCaseRfQBidderWizard, genericWizardUseCaseContractSendMail, genericWizardUseCaseRfQApprovalWizard];

		service.getUseCaseConfiguration = function getUseCaseConfiguration(wizardUseCaseUuid) {
			return _.find(service.useCaseWizardList, function (wizard) {
				return wizard.Id === wizardUseCaseUuid;
			});
		};

		service.getStartEntityConfig = function getStartEntityConfig(wizardUseCaseUuid) {
			var config = service.getUseCaseConfiguration(wizardUseCaseUuid);
			var container;
			_.forOwn(config.moduleDependencies, function (value, key) {
				var containerFound = _.find(config.moduleDependencies[key].containerList, function (container) {
					return container.isStartEntity === true;
				});
				if (containerFound) {
					container = containerFound;
					return;
				}
			});
			return container;
		};

		service.getUseCaseContainer = function getUseCaseContainer(wizardUseCaseUuid, containerUuid) {
			var config = service.getUseCaseConfiguration(wizardUseCaseUuid);
			var container;
			_.forOwn(config.moduleDependencies, function (value, key) {
				var containerFound = _.find(config.moduleDependencies[key].containerList, function (container) {
					return container.uuid.toLowerCase() === containerUuid.toLowerCase();
				});
				if (containerFound) {
					container = containerFound;
					return;
				}
			});
			return container;
		};

		service.getUseCaseContainerList = function getUseCaseContainerList(uuid) {
			var containerList = [];
			var useCaseConfig = service.getUseCaseConfiguration(uuid);
			_.forOwn(useCaseConfig.moduleDependencies, function (value, key) {
				var containerUuidList = _.map(useCaseConfig.moduleDependencies[key].containerList, function (container) {
					return container.uuid.toLowerCase();
				});
				containerList = containerList.concat(containerUuidList);
			});
			return containerList;
		};

		service.getModuleFromContainerUuid = function getModuleFromContainerUuid(wizardUseCaseUuid, containerUuid) {
			var module = '';
			if (!containerUuid) {
				return module;
			}
			var useCaseConfig = service.getUseCaseConfiguration(wizardUseCaseUuid);
			_.forOwn(useCaseConfig.moduleDependencies, function (value, key) {
				var containerUuidList = _.map(useCaseConfig.moduleDependencies[key].containerList, function (container) {
					return container.uuid.toLowerCase();
				});
				if (_.includes(containerUuidList, containerUuid.toLowerCase())) {
					module = key;
					return false;
				}
			});
			return module;
		};

		service.getUseCaseModuleList = function getUseCaseModuleList(uuid) {
			var moduleList = [];
			var useCaseCOnfig = service.getUseCaseConfiguration(uuid);
			_.forOwn(useCaseCOnfig.moduleDependencies, function (value, key) {
				moduleList.push(key);
			});
			return moduleList;
		};

		service.isUseCaseWizard = function (uuid) {
			return uuid !== defaultConfig.useCaseUuid;
		};

		return service;
	}
})(angular);