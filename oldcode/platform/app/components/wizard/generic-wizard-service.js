(function (angular) {
	'use strict';

	angular.module('platform').service('genericWizardService', WizardService);

	WizardService.$inject = ['_', 'globals', '$http', 'platformModalService', 'basicsConfigMainService', '$injector', 'genericWizardContainerLayoutService', '$q', 'WizardHandler', '$rootScope', '$timeout', 'basicsLookupDataPropertyListService', 'genericWizardUseCaseConfigService', 'basicsLookupDataContainerListService', 'platformObjectHelper', 'genericWizardServiceCreator', 'genericWizardNamingParameterConstantService', 'basicsWorkflowTaskPopUpService'];

	function WizardService(_, globals, $http, platformModalService, basicsConfigMainService, $injector, layoutService, $q, wizardHandler, $rootScope, $timeout, basicsLookupDataPropertyListService, genericWizardUseCaseConfigService, basicsLookupDataContainerListService, platformObjectHelper, genericWizardServiceCreator, genericWizardNamingParameterConstantService, basicsWorkflowTaskPopUpService) {
		var self = this;

		self.config = {};
		self.providerData = {};
		self.dataServiceCache = {};

		self.clear = function clear() {
			self.dataServiceCache = {};
			self.config = {};
			self.providerData = {};
		};

		self.getStartEntityId = function getStartEntityId() {
			return parseInt(self.config[self.config.startEntity]);
		};

		self.getDataServiceByName = function (dataServiceName, useCaseConfig) {
			var service = self.dataServiceCache[dataServiceName];
			if (!service) {
				var serviceInjected = $injector.get(dataServiceName);
				if (!_.isFunction(serviceInjected.getSelected)) {
					serviceInjected = serviceInjected.getService({moduleName: useCaseConfig.internalName});
				}
				var dataService = genericWizardServiceCreator.createWizardService(serviceInjected, useCaseConfig);
				self.setDataService(dataService, dataServiceName);
			}
			return self.dataServiceCache[dataServiceName];
		};

		self.setDataService = function (dataService, serviceName) {
			var dataServiceName = serviceName ? serviceName : dataService.getServiceName() ? dataService.getServiceName() : dataService.getItemName();
			if (!self.dataServiceCache[dataServiceName]) {
				self.dataServiceCache[dataServiceName] = dataService;
			}
		};

		self.getWizardInstanceById = function getWizardInstanceById(id) {
			if (self.config.Instance && !_.isEmpty(self.config.Steps) && self.config.Instance.Id === _.toInteger(id)) {
				_.extend(self.config, self.providerData);
				return $q.when(self.config);
			}
			return $http({
				url: globals.webApiBaseUrl + 'basics/config/genwizard/instance/getbyid',
				method: 'GET',
				params: {instanceId: id}
			}).then(function (result) {
				_.extend(self.config, result.data, self.providerData);
				return self.config;
			});
		};

		var modalOptions = {
			templateUrl: globals.appBaseUrl + 'app/components/wizard/generic-wizard-tpl.html',
			width: '75%',
			height: '90%',
			resizeable: true
		};

		self.getStepById = function getStepById(stepId) {
			return _.find(self.config.Steps, function (step) {
				return step.Instance.Id === stepId;
			});
		};

		self.isContainerInCurrentStep = function isContainerInCurrentStep(containerUuid) {

			var step = self.getStepById(self.getWizardController().currentStep().wzData);
			var containerInStep = _.find(step.Container, function (container) {
				return container.Instance.ContainerUuid === containerUuid;
			});
			return platformObjectHelper.isSet(containerInStep);
		};

		self.getContainerById = function getContainerById(containerId) {
			var container;
			_.each(self.config.Steps, function (step) {
				var ctn = _.find(step.Container, function (Container) {
					return Container.Instance.Id === containerId;
				});
				if (ctn) {
					container = ctn;
				}
			});
			return container;
		};

		self.getWizardController = function getWizardController() {
			return wizardHandler.wizard(self.config.Instance.Id);
		};

		self.updateStepInfo = function updateStepInfo($scope) {
			$timeout(function updateStepInfo() {
				var controller = self.getWizardController();
				$scope.stepInfo.currentStepNum = controller.currentStepNumber();
				$scope.stepInfo.totalStepNum = controller.totalStepCount();
				$scope.stepInfo.currentTitle = controller.currentStepTitle();
				$rootScope.$emit('stepChanged');
			});
		};

		function getDataServicesNamesFromStep(currentStepConfig) {
			var dataServices = [];
			_.each(currentStepConfig.Container, function loop(ctn) {
				var info = layoutService.getContainerLayoutByContainerId(ctn.Instance.Id);
				var serviceName = info.ctnrInfo.dataServiceName ? info.ctnrInfo.dataServiceName : null;
				if (serviceName) {
					dataServices.push(serviceName);
				}
			});
			return _.uniq(dataServices);
		}

		self.getAllDataServiceNames = function getAllDataServiceNames() {
			var dataServices = [];
			_.each(self.config.Steps, function (step) {
				dataServices = dataServices.concat(getDataServicesNamesFromStep(step));
			});
			return _.uniq(dataServices);
		};

		self.openWizard = function openWizard(options) {

			// instanceId has to be configured in bas module.
			if (!options || !options.InstanceId || !parseInt(options.InstanceId)) {
				throw new Error('wizardParameter instanceId missing');
			}
			modalOptions.defaultButton = options.defaultButton;
			modalOptions.showCancelButton = options.showCancelButton;
			modalOptions.genericWizardOptions = options;
			modalOptions.InstanceId = options.InstanceId;
			modalOptions.windowClass = 'generic-wizard-dialog';

			return platformModalService.showDialog(modalOptions);
		};

		self.loadConfigProviderData = function (configProvider, wizardConfig) {

			var startEntityId = wizardConfig[wizardConfig.startEntity];
			var paramObject = {};
			setParamObjectPropertiesForConfigProvider(configProvider.params, paramObject, wizardConfig);
			paramObject.Value = startEntityId;

			if (wizardConfig.actionInstance) {
				paramObject.InstanceFk = wizardConfig.actionInstance.WorkflowInstanceId;
				paramObject.ActionInstanceFk = wizardConfig.actionInstance.Id;
				paramObject.MainEntityId = startEntityId;
				paramObject.UseCaseUuid = wizardConfig.Instance.WizardConfiGuuid;
			}

			return $http({
				url: globals.webApiBaseUrl + configProvider.dataUrl,
				method: configProvider.useGet ? 'GET' : 'POST',
				data: paramObject,
				params: paramObject
			}).then(function (result) {
				var data = result.data;
				if (configProvider.dtoAccess) {
					data = _.get(data, configProvider.dtoAccess);
				}
				if (_.isFunction(configProvider.validationFn)) {
					try {
						configProvider.validationFn(data);
					} catch (e) {
						basicsWorkflowTaskPopUpService.start();
					}
				}
				self.providerData[configProvider.configName] = data;
			});
		};

		function setParamObjectPropertiesForConfigProvider(params, paramObject, wizardConfig) {
			if (params) {
				_.forEach(params, function (value, key) {
					if (_.isString(value)) {
						let valueToSet = _.get(wizardConfig, value) || _.get(self.providerData, value);
						_.set(paramObject, key, valueToSet);
					} else if (_.isObject(value)) {
						paramObject[key] = {};
						setParamObjectPropertiesForConfigProvider(value, paramObject[key], wizardConfig);
					} else {
						_.set(paramObject, key, value);
					}
				});
			}
		}

		self.canActivate = function canActivate(setupData, actionInstance) {
			var defer = $q.defer();
			var promiseList = [];
			layoutService.clearLayout();
			setupData.genWizConfig.Steps = _.sortBy(setupData.genWizConfig.Steps, function (step) {
				return step.Instance.Sorting;
			});
			var uuid = setupData.genWizConfig.Instance.WizardConfiGuuid;
			self.config.actionInstance = actionInstance;
			var moduleList = genericWizardUseCaseConfigService.getUseCaseModuleList(uuid);
			basicsConfigMainService.getByModuleNames(moduleList).then(function (configModuleList) {
				moduleList = configModuleList;
				_.each(moduleList, function (module) {
					var internalName = module.InternalName;
					promiseList.push(basicsLookupDataContainerListService.getContainerJSON(internalName));
					promiseList.push(basicsLookupDataPropertyListService.loadDomainsForModule(internalName));
				});

				var context = actionInstance.Context;
				// set communication channel

				_.extend(self.config, context);
				if (!self.config.communicationChannel) {
					self.config.communicationChannel = 2;
				}

				let configProviders = genericWizardUseCaseConfigService.getUseCaseConfiguration(uuid).configProviders;
				let callOrderToConfigProvider = _.groupBy(configProviders, function (configProvider) {
					return _.isNumber(configProvider.callOrder) ? configProvider.callOrder : 0;
				});

				loadAllConfigProviders(setupData, defer, promiseList, callOrderToConfigProvider, uuid, moduleList);
			});
			return defer.promise;
		};

		function loadAllConfigProviders(setupData, defer, promiseList, callOrderToConfigProvider, uuid, moduleList) {
			let callOrderToProcess = _.min(Object.keys(callOrderToConfigProvider));

			if (!_.isNil(callOrderToProcess)) {
				_.forEach(callOrderToConfigProvider[callOrderToProcess], function (configProvider) {
					promiseList.push(self.loadConfigProviderData(configProvider, self.config));
				});

				$q.all(promiseList).then(function () {
					loadAllConfigProviders(setupData, defer, [], _.omit(callOrderToConfigProvider, callOrderToProcess), uuid, moduleList);
				});
			} else {
				genericWizardNamingParameterConstantService.setInfoObject(setupData.genWizConfig.Instance.WizardConfiGuuid, self.providerData);
				_.forEach(moduleList, function (module) {
					let internalName = module.InternalName;
					let upperName = basicsLookupDataPropertyListService.getInternalUpperName(internalName);
					promiseList.push($injector.get(upperName + 'TranslationService').loadTranslations());
				});
				$q.all(promiseList).then(function () {
					if (setupData.genWizConfig.Instance && genericWizardUseCaseConfigService.isUseCaseWizard(uuid)) {

						_.extend(self.config, genericWizardUseCaseConfigService.getUseCaseConfiguration(uuid), self.providerData);
						if (!self.config[self.config.startEntity]) {
							let startEntityConfig = genericWizardUseCaseConfigService.getStartEntityConfig(uuid);
							let startEntityService = basicsLookupDataContainerListService.getDataServiceNameFromContainer({
								Module: genericWizardUseCaseConfigService.getModuleFromContainerUuid(uuid, startEntityConfig.uuid),
								ContainerUuid: startEntityConfig.uuid
							});
							if (startEntityService) {
								self.config[self.config.startEntity] = $injector.get(startEntityService).getSelected() ? $injector.get(startEntityService).getSelected().Id : null;
							}
						}
					}
					if (!setupData || !setupData.genWizConfig || !self.config[self.config.startEntity]) {
						console.error('Missing setupData');
						console.error('StartEntity:' + self.config.startEntity);
						return defer.reject(false);
					}

					_.forEach(setupData.genWizConfig.Steps, function loopCallback(step) {
						if (_.isEmpty(step.Container)) {
							defer.reject(false);
							console.error('Cannot execute Wizard: ' + setupData.genWizConfig.Instance.Comment + '\nStep: ' + step.Instance.Title + ' Id:' + step.Instance.Id + ' has no configured Container');
							return;
						}
						_.forEach(step.Container, function loopCallback(ctn) {
							let useCaseContainer = genericWizardUseCaseConfigService.getUseCaseContainer(uuid, ctn.Instance.ContainerUuid);
							if (useCaseContainer) {
								_.extend(ctn.Instance, useCaseContainer);
							}
							layoutService.createContainerLayout(ctn, genericWizardUseCaseConfigService.getModuleFromContainerUuid(setupData.genWizConfig.Instance.WizardConfiGuuid, ctn.Instance.ContainerUuid));
						});
					});
					defer.resolve(true);
				});
			}
		}
	}

})(angular);
