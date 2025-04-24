(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	/* global globals */
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterParameterDataService',
		['$injector','platformDataServiceFactory', 'constructionSystemMasterHeaderService', 'basicsLookupdataLookupDescriptorService', 'constructionSystemMasterParameterReadOnlyProcessor',
			'PlatformMessenger', '_', 'moment', 'constructionSystemMasterParameterFormatterProcessor', 'basicsCommonScriptEditorService','$http',
			function ($injector,dataServiceFactory, parentService, lookupDescriptorService, readOnlyProcessor, PlatformMessenger,
				_, moment, formatterProcessor, basicsCommonScriptEditorService,$http) {
				var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/parameter/';
				var serviceOption = {
					flatNodeItem: {
						module: angular.module(moduleName),
						serviceName: 'constructionSystemMasterParameterDataService',
						httpCreate: {route: httpRoute},
						httpRead: {route: httpRoute},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									refreshParameters(readData.Main);
									var result = serviceContainer.data.handleReadSucceeded(readData.Main, data);
									if (result && result.length > 0) {
										// serviceContainer.service.goToFirst();
									} else {
										var childServices = serviceContainer.service.getChildServices();
										if (childServices && childServices.length > 0) {
											var found = _.find(childServices, {name: 'constructionsystem.master.parametervalue'});
											if (found) {
												found.loadSubItemList();
											}
										}
									}
									return result;
								},
								initCreationData: function initCreationData(creationData) {
									creationData.MainItemId = parentService.getSelected().Id;
								},
								handleCreateSucceeded: function (newData) {
									var totalList = service.getList();
									if (totalList.length > 0) {
										newData.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
									} else {
										newData.Sorting = 1;
									}
								}
							}
						},
						entityRole: {
							node: {
								itemName: 'CosParameter',
								parentService: parentService,
								doesRequireLoadAlways: false
							}
						},
						translation: {
							uid: 'constructionSystemMasterParameterDataService',
							title: 'constructionsystem.master.parameterGridContainerTitle',
							columns: [
								{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}
							],
							dtoScheme: {
								typeName: 'CosParameterDto', moduleSubModule: 'ConstructionSystem.Master'
							}
						},
						dataProcessor: [readOnlyProcessor, formatterProcessor]
					}
				};
				var scriptId = 'construction.system.master.script';
				var validateScriptId = 'construction.system.master.script.validation';

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;

				service.parameterValidateComplete = new PlatformMessenger();
				service.parameterValueValidateComplete = new PlatformMessenger();
				service.parameterGetValueListComplete = new PlatformMessenger();
				service.deleteValuesComplete = new PlatformMessenger();

				service.defaultTypeChanged=new PlatformMessenger();

				service.defaultValueChanged = new PlatformMessenger();

				function defaultValueChanged(e, args) {
					var selectedItem = service.getSelected();
					if (selectedItem && args.defaultValueEntity) {
						if (args.isDefault) {
							selectedItem.DefaultValue = args.defaultValueEntity.Id;
						} else {
							selectedItem.DefaultValue = null;
						}
						service.markItemAsModified(selectedItem);
					}
				}
				service.defaultValueChanged.register(defaultValueChanged);

				parentService.headerValidateComplete.register(updateBasFormFieldFk);

				function registerDefaultTypeChanged(fn){
					service.defaultTypeChanged.register(fn);
				}

				function updateBasFormFieldFk() {
					angular.forEach(service.getList(), function (item) {
						item.BasFormFieldFk = null;
						serviceContainer.data.markItemAsModified(item, serviceContainer.data);
						service.updateReadOnly(item);
					});
					serviceContainer.service.gridRefresh();
				}

				service.updateReadOnly = function (item) {
					readOnlyProcessor.processItem(item);
				};

				service.registerItemModified(function () {
					refreshParameters(service.getList());
				});

				service.getListByHeadId = function (id) {
					return $http.get(httpRoute+'list?mainItemId='+id);
				};

				service.registerDefaultTypeChanged=registerDefaultTypeChanged;

				service.fireDefaultTypeChanged=function (){
					service.defaultTypeChanged.fire();
				};


				var onEntityCreated = function onEntityCreated(e, newItem) {

					var parameterDataTypes = $injector.get('parameterDataTypes');
					var typeId = newItem.CosParameterTypeFk;

					var needSetDefault = (typeId === parameterDataTypes.Integer || typeId === parameterDataTypes.Decimal1 ||
					typeId === parameterDataTypes.Decimal2 || typeId === parameterDataTypes.Decimal3 ||
					typeId === parameterDataTypes.Decimal4 || typeId === parameterDataTypes.Decimal5 ||
					typeId === parameterDataTypes.Decimal6);
					if (needSetDefault) {
						newItem.CosParameterTypeFk = parameterDataTypes.Text;// do not chagne. only to let validate enabled.
						var validateService = $injector.get('constructionSystemMasterParameterValidationService');
						validateService.validateCosParameterTypeFk(newItem, typeId);
					}

				};
				service.registerEntityCreated(onEntityCreated);

				/**
				 * refresh parameter hints in script container.
				 * @param list
				 */
				/* jshint -W074 */
				function refreshParameters(list) {
					var parameterItems = (angular.isArray(list) ? list : []).map(function (item) {
						var type = 'string';
						switch (item.CosParameterTypeFk) {
							case 0:
							case 1:
							case 2:
							case 3:
							case 4:
							case 5:
							case 6:
								type = 'number';
								break;
							case 10:
								type = 'bool';
								break;
							case 11:
								type = 'Date';
								break;
							case 12:
								type = 'string';
								break;
						}
						return {name: item.VariableName, type: type, description: item.DescriptionInfo.Translated};
					});
					basicsCommonScriptEditorService.addVariable(scriptId, parameterItems);
					basicsCommonScriptEditorService.addVariable(validateScriptId, parameterItems);
				}

				return service;
			}]);
})(angular);