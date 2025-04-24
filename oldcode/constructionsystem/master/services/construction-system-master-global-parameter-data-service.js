
/**
 * Created by lvy on 4/2/2018.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	/* jshint -W003 */
	/* global globals,_ */
	var moduleName = 'constructionsystem.master';
	var cosMasterGlobalParaModule = angular.module(moduleName);
	cosMasterGlobalParaModule.factory('constructionSystemMasterGlobalParameterDataService',
		['$injector','platformDataServiceFactory','PlatformMessenger','basicsCommonScriptEditorService', 'constructionSystemMasterGlobalParameterReadOnlyProcessor', 'constructionSystemMasterGlobalParameterFormatterProcessor', 'basicsLookupdataLookupDescriptorService',
			function ($injector,dataServiceFactory, PlatformMessenger, basicsCommonScriptEditorService, readOnlyProcessor, formatterProcessor, lookupDescriptorService) {
				var httpRoute = globals.webApiBaseUrl + 'constructionsystem/master/globalparameter/';
				var serviceOption = {
					flatRootItem: {
						module: moduleName+'.globalparameter',
						serviceName: 'constructionSystemMasterGlobalParameterDataService',
						entityNameTranslationID: 'constructionsystem.master.globalParameter',
						httpCRUD: {route: httpRoute},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData);
									refreshParameters(readData.Main);
									var dataRead = serviceContainer.data.handleReadSucceeded(readData.Main, data);
									return dataRead;
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
						entitySelection: {supportsMultiSelection: true},
						entityRole: {
							root: {
								itemName: 'CosGlobalParams',
								moduleName: 'Construction System Global Parameter'
							}
						},
						translation: {
							uid: 'constructionSystemMasterGlobalParameterDataService',
							title: 'constructionsystem.master.globalParameterGridContainerTitle',
							columns: [
								{header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }
							],
							dtoScheme: {
								typeName: 'CosGlobalParamDto', moduleSubModule: 'ConstructionSystem.Master'
							}
						},
						dataProcessor: [readOnlyProcessor, formatterProcessor]
					}
				};
				var scriptId = 'construction.system.master.script';
				var validateScriptId = 'construction.system.master.script.validation';

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				var service = serviceContainer.service;
				serviceContainer.data.newEntityValidator = {
					validate: function validate(newItem) {
						var validationService = $injector.get('constructionSystemMasterGlobalParameterValidationService');
						validationService.validateVariableName(newItem, newItem.VariableName, 'VariableName');
					}
				};

				service.parameterValidateComplete = new PlatformMessenger();
				service.parameterValueValidateComplete = new PlatformMessenger();
				service.parameterGetValueListComplete = new PlatformMessenger();
				service.deleteValuesComplete = new PlatformMessenger();

				service.defaultTypeChanged=new PlatformMessenger();
				service.setShowHeaderAfterSelectionChanged(null);

				function registerDefaultTypeChanged(fn){
					service.defaultTypeChanged.register(fn);
				}

				service.updateReadOnly = function (item) {
					readOnlyProcessor.processItem(item);
				};

				service.registerItemModified(function () {
					refreshParameters(service.getList());
				});

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
						var validateService = $injector.get('constructionSystemMasterGlobalParameterValidationService');
						validateService.validateCosParameterTypeFk(newItem, typeId);
					}
					var groupService = $injector.get('constructionSystemMasterGlobalParamGroupDataService');
					if(groupService && groupService.getSelected()){
						newItem.CosGlobalParamGroupFk = groupService.getSelected().Id;
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
					basicsCommonScriptEditorService.addGlobalVariable(scriptId, parameterItems);
					basicsCommonScriptEditorService.addGlobalVariable(validateScriptId, parameterItems);
				}

				return service;
			}]);
})(angular);