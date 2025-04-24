(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').directive('basicLookupDataPropertyLookup', ['$injector', 'basicsLookupDataPropertyListService', 'basicsConfigMainService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, basicsLookupDataPropertyListService, basicsConfigMainService, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'basicLookupDataPropertyLookup',
				valueMember: 'id',
				displayMember: 'name'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				lookupTypesServiceName: 'basicLookupDataPropertyLookup',
				dataProvider: {
					getList: function () {
						return basicsLookupDataPropertyListService.getList();
					},
					getItemByKey: function (key) {
						return basicsLookupDataPropertyListService.getItemByIdAsync(key);
					}
				}
			});
		}
	]);
})(angular);

(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsLookupDataPropertyListService', ['$http', 'basicsLookupdataConfigGenerator', 'basicsConfigMainService', '$injector', 'mainViewService', '$q', '$translate', 'platformTranslateService', 'basicsConfigGenWizardInstanceDataService', 'basicsConfigGenWizardStepDataService', 'basicsConfigGenWizardContainerDataService', 'genericWizardUseCaseConfigService',

		function ($http, basicsLookupdataConfigGenerator, basicsConfigMainService, $injector, mainViewService, $q, $translate, platformTranslateService, wizardInstanceService, stepDataService, containerDataService, genericWizardUseCaseConfigService) {

			function translateProperties(defer, props, translationServiceName) {

				var keysToTranslate = [];
				_.each(props, function (item) {
					var key = item.label$tr$ || item.name$tr$;
					if (key) {
						keysToTranslate.push(key);
					}
				});
				translateKeys(keysToTranslate, translationServiceName).then(function then(result) {
					props = _.map(props, function (item) {
						var param = '';
						if (item.name$tr$param$) {

							param = item.name$tr$param$.number || item.name$tr$param$.p_0; // jshint ignore:line
						}
						var translated = result[item.label$tr$ || item.name$tr$] || item.name;
						item.name = translated + param;
						item.id = item.id || item.rid || item.field;
						item.id = item.id.toLowerCase();
						return item;
					});
					defer.resolve(props);
				});
			}

			function translateKeys(keysToTranslate, translationServiceName) {
				return $injector.get(translationServiceName).loadTranslations().then(function then() {
					return platformTranslateService.translate(keysToTranslate);
				});
			}

			function filterContainer(ctnList, uuid) {
				if (angular.isArray(ctnList) && uuid) {
					ctnList = _.filter(ctnList, function then(ctn) {
						return ctn.ContainerUuid === uuid;
					});
				}
				return ctnList;
			}

			var defaultGenericWizardUuid = 'c420c85a094043d8bd9b830ba25fc334';

			var serviceInterface = {
				domainsMap: new Map(),
				getRelatedContainer: function (fromLocal) {
					var result = [];
					var defer = $q.defer();
					if (fromLocal === true) {
						var selectedContainer = containerDataService.getSelected();
						if (selectedContainer && selectedContainer.ContainerUuid) {
							result.push(selectedContainer);
							defer.resolve(result);
						}
					} else {
						// Used from script container, there we need all props from a step
						var selectedStepId = stepDataService.getSelected().Id;
						serviceInterface.getAllContainerFromStep(selectedStepId).then(function (ctnList) {
							defer.resolve(ctnList);
						});
					}
					return defer.promise;
				},
				getAllContainerFromStep: function (stepId) {
					return $http.post(globals.webApiBaseUrl + 'basics/config/genwizard/instance/getAllContainerFromStep', {
						SuperEntityId: stepId
					}).then(function (result) {
						var containerList = result.data;
						return containerList;
					});
				},
				getList: function (containerUUID, fromLocal) {
					var internalNameUpper = serviceInterface.getInternalUpperName();
					var selectedWizardInstance = wizardInstanceService.getSelected() ? wizardInstanceService.getSelected() : null;
					if (selectedWizardInstance && selectedWizardInstance.WizardConfiGuuid !== defaultGenericWizardUuid) {
						//todo Usecase Lookup on gen wiz instance to get the useCase UUid
						var selectedContainer = containerDataService.getSelected();
						if (selectedContainer && selectedContainer.ContainerUuid) {
							internalNameUpper = serviceInterface.getInternalUpperName(genericWizardUseCaseConfigService.getModuleFromContainerUuid(selectedWizardInstance.WizardConfiGuuid, containerUUID));
						}
					}
					var defer = $q.defer();
					var containerInfoService = $injector.get(internalNameUpper + 'ContainerInformationService');
					if (internalNameUpper && selectedWizardInstance && containerUUID) {
						var translationServiceName = internalNameUpper + 'TranslationService';
						var props = [];
						//load all schemas for a specific module because containerInformationService needs those
						serviceInterface.loadDomainsForModule(serviceInterface.getInternalName()).then(function then() {
							serviceInterface.getRelatedContainer(fromLocal).then(function then(ctnList) {
								ctnList = filterContainer(ctnList, containerUUID);
								_.each(ctnList, function (ctn) {
									var containerInfo = containerInfoService.getContainerInfoByGuid(ctn.ContainerUuid);
									var layoutData;
									if (containerInfo.ContainerType === 'Grid') {
										layoutData = _.cloneDeep(containerInfo.layout ? containerInfo.layout.columns : containerInfo.columns);
									} else {
										layoutData = _.cloneDeep(containerInfo.rows ? containerInfo.rows : containerInfo.layout.rows);
									}
									if (layoutData) {
										props = props.concat(layoutData);
									}
								});
								// resolves the promise
								translateProperties(defer, props, translationServiceName);
							});
						});
						return defer.promise;
					}
					return $q.when([]);
				},
				getItemByIdAsync: function (ctnUUID, key) {
					key = key.toLowerCase();
					return this.getList(ctnUUID, true).then(function then(list) {
						return _.find(list, {id: key}) || _.find(list, {model: key}) || _.find(list, {field: key});
					});
				},
				getItemById: function () {
					return null;
				},
				loadDomainsForModule: function (internalName) {
					var moduleName = internalName ? internalName : serviceInterface.getInternalName();
					if (serviceInterface.domainsMap.has(moduleName)) {
						return $q.when(serviceInterface.domainsMap.get(moduleName));
					}
					return mainViewService.loadDomains(moduleName).then(function loadDomainsForModule(domains) {
						serviceInterface.domainsMap.set(moduleName, domains);
						return domains;
					});
				},
				translateProperties: translateProperties,
				translateKeys: translateKeys,
				getInternalUpperName: function getInternalUpperName(name) {
					return _.camelCase(name ? name : serviceInterface.getInternalName());
				},
				getInternalName: function getInternalName() {
					if (wizardInstanceService.getSelected().WizardConfiGuuid !== defaultGenericWizardUuid && containerDataService.getSelected()) {
						return genericWizardUseCaseConfigService.getModuleFromContainerUuid(wizardInstanceService.getSelected().WizardConfiGuuid, containerDataService.getSelected().ContainerUuid);
					}
					return basicsConfigMainService.getSelected() ? basicsConfigMainService.getSelected().InternalName : null;
				}
			};

			return serviceInterface;
		}]);
})(angular);

