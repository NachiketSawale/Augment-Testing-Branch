(function (angular) {
	'use strict';
	angular.module('basics.lookupdata').directive('basicLookupDataContainerLookup', ['$injector', 'basicsLookupDataContainerListService', 'basicsConfigMainService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, basicsLookupDataContainerListService, basicsConfigMainService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'basicLookupDataContainerLookup',
				valueMember: 'uuid',
				displayMember: 'title'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicLookupDataContainerLookup',
				dataProvider: {
					myUniqueIdentifier: 'basicLookupDataContainerLookup',
					getList: function () {
						return basicsLookupDataContainerListService.getList();
					},
					getItemByKey: function (key) {
						return basicsLookupDataContainerListService.getItemByIdAsync(key);
					}
				}
			});
		}
	]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataContainerListService', ['$http', 'basicsLookupdataConfigGenerator', 'basicsConfigMainService', '$injector', 'mainViewService', '$q', '$translate', 'platformTranslateService', 'basicsConfigGenWizardInstanceDataService', 'basicsConfigGenWizardStepDataService', 'basicsLookupDataPropertyListService', 'genericWizardUseCaseConfigService',

		function ($http, basicsLookupdataConfigGenerator, basicsConfigMainService, $injector, mainViewService, $q, $translate, platformTranslateService, instanceDataService, stepDataService, propertyListService, genericWizardUseCaseConfigService) {

			var defaultGenericWizardUuid = 'c420c85a094043d8bd9b830ba25fc334';

			var serviceInterface = {
				containerJsonMap: new Map(),
				container2ModuleMap: new Map(),
				getContainerJsonInfo: function (module, containerUuid) {
					return serviceInterface.getContainerJSON(module).then(function (containerList) {
						return _.find(containerList, function (container) {
							return container.uuid && container.uuid.toLowerCase() === containerUuid.toLowerCase();
						});
					});
				},
				getContainerJSON: function (module) {
					var internalName = module ? module : propertyListService.getInternalName();
					if (serviceInterface.containerJsonMap.has(internalName)) {
						return $q.when(serviceInterface.containerJsonMap.get(internalName));
					}

					var moduleContainerJsonList = [];
					return $http.get(globals.appBaseUrl + internalName + '/content/json/module-containers.json').then(function (containerResult) {
						return $http.get(globals.appBaseUrl + internalName + '/content/json/wizard-containers.json', {
							headers: {
								// prevent errorDialog from beeing openend as this json is only partially available
								errorDialog: false
							}
						}).then(function (wizardContainer) {
							if (wizardContainer && wizardContainer.data) {
								moduleContainerJsonList = moduleContainerJsonList.concat(wizardContainer.data);
							}
						}).finally(function () {
							moduleContainerJsonList = moduleContainerJsonList.concat(containerResult.data);
							serviceInterface.containerJsonMap.set(internalName, moduleContainerJsonList);
							return moduleContainerJsonList;
						});
					});
				},
				getList: function () {
					var selectedWizardInstance = instanceDataService.getSelected();
					var moduleList;
					var promiseList = [];

					var internalCamelName = propertyListService.getInternalName();
					moduleList = [internalCamelName];
					if (selectedWizardInstance && selectedWizardInstance.WizardConfiGuuid !== defaultGenericWizardUuid) {
						//todo Usecase Lookup on gen wiz instance to get the useCase UUid
						moduleList = genericWizardUseCaseConfigService.getUseCaseModuleList(selectedWizardInstance.WizardConfiGuuid);
					}

					if (moduleList) {
						_.each(moduleList, function (module) {
							var moduleCamelCase = _.camelCase(module);
							if (serviceInterface.container2ModuleMap.has(moduleCamelCase)) {
								return promiseList.push($q.when(serviceInterface.container2ModuleMap.get(moduleCamelCase)));
							}
							//something like scheduling.main -> schedulingMain
							var translationServiceName = moduleCamelCase + 'TranslationService';
							var defer = $q.defer();
							//load all schemas for a specific module because containerInformationService needs those
							propertyListService.loadDomainsForModule(module).then(function then() {
								var containerInfoService = $injector.get(moduleCamelCase + 'ContainerInformationService');
								serviceInterface.getContainerJSON(module).then(function then(ModuleJSONList) {
									var containerList = _.filter(ModuleJSONList, function filter(item) {
										if (item.uuid) {
											// show only those item which are handled by ContainerInformationService
											if (selectedWizardInstance.WizardConfiGuuid !== defaultGenericWizardUuid) {
												return _.includes(genericWizardUseCaseConfigService.getUseCaseContainerList(selectedWizardInstance.WizardConfiGuuid), item.uuid.toLowerCase());
											} else {
												try {
													return !_.isEmpty(containerInfoService.getContainerInfoByGuid(item.uuid));
												} catch (e) {
													return false;
												}
											}
										}
										return false;
									});
									var keysToTranslate = [];
									_.each(containerList, function (item) {
										keysToTranslate.push(item.title);
									});
									propertyListService.translateKeys(keysToTranslate, translationServiceName).then(function then(translatedKeys) {
										containerList = _.map(containerList, function (item) {
											if (translatedKeys[item.title]) {
												item.title = translatedKeys[item.title];
											}
											return item;
										});
										serviceInterface.container2ModuleMap.set(internalCamelName, containerList);
										defer.resolve(containerList);
									});
								});
							});
							promiseList.push(defer.promise);
						});
					}
					return $q.all(promiseList).then(function (arrayOfArrayResults) {
						var list = [];
						_.each(arrayOfArrayResults, function (arr) {
							list = list.concat(arr);
						});
						return list;
					});

				},
				getItemByIdAsync: function (key) {
					return this.getList().then(function then(list) {
						return _.find(list, {uuid: key});
					});
				},
				getItemById: function (module, uuid) {
					return _.find(serviceInterface.containerJsonMap.get(module), function (container) {
						return _.isString(container.uuid) ? container.uuid.toLowerCase() === uuid.toLowerCase() : false;
					});
				},
				getDataServiceNameFromContainer: function (ctn) {
					var containerInfo = $injector.get(propertyListService.getInternalUpperName(ctn.Module) + 'ContainerInformationService').getContainerInfoByGuid(ctn.ContainerUuid);
					if (!_.isEmpty(containerInfo)) {
						//cannot use dataserviceprovider function here, those names here will be used for $injector
						if (containerInfo.dataServiceName) {
							return containerInfo.dataServiceName;
						}
					}
				}
			};
			return serviceInterface;

		}]);
})(angular);

