/**
 * Created by jes on 2016-09-05.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Platform */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceParameterService
	 * @function
	 * @requires Data service for instance parameter
	 *
	 * @description
	 * #
	 *  data service for constuctionsystem main instanceparameter grid/form controller.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterService', constructionSystemMainInstanceParameterService);

	constructionSystemMainInstanceParameterService.$inject = [
		'globals',
		'_',
		'$q',
		'platformDataServiceFactory',
		'constructionSystemMainInstanceService',
		'constructionSystemMainInstanceParameterFormatterProcessor',
		'constructionSystemMainJobDataService',
		'basicsLookupdataLookupDescriptorService',
		'ConstructionSystemMainPropertyNameProcessor',
		'constructionSystemMainInstanceParameterReadOnlyProcessor',
		'constructionSystemMasterParameterValidationHelperService',
		'PlatformMessenger',
		'aggregateTypeService',
		'constructionSystemMasterParameterTypeConverter',
		'constructionSystemMainInstanceParameterUserformHelpService',
		'constructionSystemMainInstanceParameterUserformPopupHelpService',
		'platformDataServiceModificationTrackingExtension',
		'platformModuleStateService',
		'ServiceDataProcessDatesExtension'
	];

	function constructionSystemMainInstanceParameterService(
		globals,
		_,
		$q,
		platformDataServiceFactory,
		parentService,
		formatterProcessor,
		constructionSystemMainJobDataService,
		basicsLookupdataLookupDescriptorService,
		ConstructionSystemMainPropertyNameProcessor,
		readOnlyProcessor,
		cosParameterValidationHelperService,
		PlatformMessenger,
		aggregateTypeService,
		parameterTypeConverter,
		userformHelpService,
		userformPopupHelpService,
		platformDataServiceModificationTrackingExtension,
		platformModuleStateService,
		ServiceDataProcessDatesExtension) {

		var serviceName = 'constructionsystem.main.instanceparameter';

		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMainInstanceParameterService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/',
					endRead: 'list',
					usePostForRead: true,
					initReadData: function (readData) {
						var obj = parentService.getSelected();
						if (obj && obj.Id && obj.InstanceHeaderFk) {
							readData.CosInsHeaderId = obj.InstanceHeaderFk;
							readData.InstanceId = obj.Id;
						} else {
							readData.CosInsHeaderId = -1;
							readData.InstanceId = -1;
						}
					}
				},
				dataProcessor: [formatterProcessor,
					new ConstructionSystemMainPropertyNameProcessor(serviceName), readOnlyProcessor,new ServiceDataProcessDatesExtension(['LastEvaluated'])],
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead
					}
				},
				entityRole: {
					leaf: {
						itemName: 'InstanceParameter',
						parentService: parentService,
						doesRequireLoadAlways: false
					}
				},
				actions: {delete: false, create: false}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		// noinspection JSUnresolvedVariable
		data.entityDeleted = new Platform.Messenger();  // as the 'actions.delete' is false, so should new the 'data.entityDeleted'

		// this function will be called in detail and grid controller before initDetailController() and initListController() get called
		// override service.registerSelectionChanged to not register loadCurrentItem() in detail-controller.service.js
		// in order to avoid recompile detail form at every selection change
		service.registerSelectionChanged2 = function (crtl) {
			if (crtl === 'detail') {
				return function doNothing() {
				};
			} else {
				return function registerSelectionChanged(callBackFn) {
					data.selectionChanged.register(callBackFn);
				};
			}
		};

		angular.extend(service, {
			name: serviceName,
			deleteList: deleteList,
			resetList: resetList,
			getFilteredList: getFilteredList,
			getMainDataForDetailForm: getMainDataForDetailForm,
			getParameterInfo: getParameterInfo,
			performScriptValidation: new PlatformMessenger(),
			updateValueByObjectParameterChanged: updateValueByObjectParameterChanged,
			setTempCache: setTempCache,
			setCosParametersForParameterInfo: setCosParametersForParameterInfo,
			setCosParameterGroupsForParameterInfo: setCosParameterGroupsForParameterInfo
		});

		function refresh(args) {
			var selectedInstance = parentService.getSelected();
			if (selectedInstance && selectedInstance.Id === args.instance.Id) {
				serviceContainer.service.load();
			}
		}

		/**
		 * reload after instance evaluation or calculation successfully.
		 */
		constructionSystemMainJobDataService.onEvaluationDone.register(refresh);
		constructionSystemMainJobDataService.onCalculationDone.register(refresh);

		service.registerListLoaded(generateMainData);

		cosParameterValidationHelperService.validationInfoChanged.register(onValidationInfoChanged);

		// todo: ???
		serviceContainer.service.registerEntityCreated = function () {
		};

		// private fields, set on data loaded
		var _cosParameters = [];
		var _cosParameterGroups = [];
		var _mainData = null;   // the entity for detail form
		var _tempCache = {};

		serviceContainer.data.cleanUpLocalData = function cleanUpBPSupplierData() {
			_tempCache = {};
		};


		service.instanceHeaderDto = null;
		service.getInstanceHeaderDto = function () {
			var defer = $q.defer();
			if (service.instanceHeaderDto === null) {
				parentService.getInstanceHeaderDto().then(function (instanceHeaderDto) {
					service.instanceHeaderDto = instanceHeaderDto;
					defer.resolve(service.instanceHeaderDto);
				}, function () {
					defer.reject(null);
				});
			} else {
				defer.resolve(service.instanceHeaderDto);
			}
			return defer.promise;
		};

		userformHelpService.formDataChanged.register(onUserFormChanged);
		userformHelpService.formDataSaved.register(onFormSaved);

		userformPopupHelpService.formDataChanged.register(onUserFormChanged);
		userformPopupHelpService.formDataSaved.register(onFormSaved);

		serviceContainer.service.enabledLoadAlways = function enabledLoadAlways() {
			serviceContainer.data.doesRequireLoadAlways = true;
		};

		serviceContainer.service.disabledLoadAlways = function disabledLoadAlways() {
			serviceContainer.data.doesRequireLoadAlways = false;
		};

		service.isGridActivated = false;
		service.isFormActivated = false;

		return service;

		// //////////////////////////////////////////////////////////////////////////////////

		function onUserFormChanged(formdata) {
			if(service.isGridActivated || service.isFormActivated){
				var formdataMap = _.keyBy(formdata, function nameMappingFn(o) {
					return o.name;
				});

				var instanceParams = serviceContainer.service.getList();
				var parameterInfo = serviceContainer.service.getParameterInfo();

				var formFieldMap = basicsLookupdataLookupDescriptorService.getData('FormFields');
				var cosParamMap = _.keyBy(parameterInfo.CosParameters, function keyMapFn(p) {
					return p.Id;
				});

				_.forEach(instanceParams, function formDataIteratorFn(mainItem) {
					var cosParam = cosParamMap[mainItem.ParameterFk];
					if (cosParam) {
						var formField = formFieldMap ? formFieldMap[cosParam.BasFormFieldFk] : null;
						if (formField && formdataMap[formField.FieldName]) {
							var itemValue = formdataMap[formField.FieldName].value;
							mainItem.ParameterValueVirtual = parameterTypeConverter.convertValue(cosParam.CosParameterTypeFk, itemValue);
							serviceContainer.service.markItemAsModified(mainItem);
							parentService.updateStatusToModified();
						}
					}
				});
			}
			else{
				if(formdata && formdata.length > 0){
					var propName = 'UserFormData2InstanceParameter';
					var modState = platformModuleStateService.state(service.getModule());
					var mods = modState.modifications;
					if(Object.prototype.hasOwnProperty.call(mods,propName)){
						for(var i = 0; i < formdata.length; ++i){
							var index = _.findIndex(mods[propName], function (item) {
								return item.name === formdata[i].name;
							});

							if(index === -1){
								mods[propName].push(formdata[i]);
								++mods.EntitiesCount;
							}
							else{
								mods[propName][index] = formdata[i];
							}
						}
					}
					else{
						mods[propName] = formdata;
						mods.EntitiesCount += formdata.length;
					}
					parentService.updateStatusToModified();
				}
			}

			parentService.markCurrentItemAsModified();
		}



		function onFormSaved(formDataId, args) {
			var isPopup = (args.formOption && args.formOption.modal) && true;
			var state = isPopup ? userformPopupHelpService.getFormSaveState() : userformHelpService.getFormSaveState();
			if (parentService.hasSelection()&&state.origin&&state.originType) {
				var mainItem = parentService.getSelected();
				var isMainEntityChanged = false;
				if (mainItem.FormDataFk !== formDataId) {
					mainItem.FormDataFk = formDataId;
					mainItem.Status = 25;
					parentService.fireItemModified(mainItem);
					isMainEntityChanged = true;
				}
				if (state.origin === 'USER_FROM') {
					onUserFormChanged(args.formData);
					if (isPopup) {
						userformHelpService.setFormSaveState(state);
					}
					else if(state.originType==='CONTAINER'){
						var formOption=args.formOption;
						if(formOption&&mainItem.Id===formOption.contextId&&null===formOption.formDataId&&formDataId){
							formOption.formDataId =formDataId;
						}
					}
					parentService.update();
				}
				else{
					if(isMainEntityChanged) {
						parentService.update();
					}
				}
			}
		}

		function incorporateDataRead(readData, data) {
			// for generating the form UI
			_cosParameters = readData.CosParameters;
			_cosParameterGroups = readData.CosParameterGroups;

			if (!_.isEmpty(readData.LookupValues) && _.isArray(readData.LookupValues.CosParameter)) {
				angular.forEach(readData.LookupValues.CosParameter, function (item) {
					item.AggregateTypeDescription = aggregateTypeService.getByIndex(Number(item.AggregateType)) || item.AggregateTypeDescription;
				});
			}
			// basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyName',
			// readData.CosMainInstanceParameterPropertyName);
			// setup some lookup data
			basicsLookupdataLookupDescriptorService.attachData(readData.LookupValues || {});
			doUpdate(readData.Main);
			// ConstructionSystemMainPropertyNameProcessor is already process the property names.
			// collectPropertyNames(readData.Main);
			collectParameterValueVirtualValues(readData.Main);

			var result = data.handleReadSucceeded(readData.Main || [], data);
			service.goToFirst();

			// script validation
			service.performScriptValidation.fire();
			return result;
		}

		function getFilteredList() {
			var list = serviceContainer.service.getList();
			return _.filter(list, function (item) {
				var flag = true;
				if (item.__rt$data) {
					if (Object.prototype.hasOwnProperty.call(item.__rt$data,'hide')) {
						flag = !item.__rt$data.hide;
					}
				}
				return flag;
			});
		}

		function resetList(result) {
			// for generating the form UI
			_cosParameters = result.CosParameters;
			_cosParameterGroups = result.CosParameterGroups;

			var data = serviceContainer.data;
			var newTemplates = result.Main;
			/** @namespace result.LookupValues */
			/* if(!_.isEmpty(result.LookupValues) && _.isArray(result.LookupValues.CosParameter)){
				angular.forEach(result.LookupValues.CosParameter,function(item){
					  item.AggregateTypeDescription = aggregateTypeService.getByIndex(Number(item.AggregateType)) || item.AggregateTypeDescription;
				})
			} */
			basicsLookupdataLookupDescriptorService.attachData(result.LookupValues || {});
			collectPropertyNames(newTemplates);
			collectParameterValueVirtualValues(newTemplates);
			var tempResult = data.handleReadSucceeded(newTemplates || [], data);

			_.forEach(newTemplates, function (temp) {
				serviceContainer.service.markItemAsModified(temp);
			});

			_.forEach(tempResult, function (item) {
				formatterProcessor.processItem(item, data);
			});

			// script validation
			service.performScriptValidation.fire();

			serviceContainer.service.goToFirst();
		}

		function deleteList(list) {
			serviceContainer.data.deleteEntities(list, serviceContainer.data);
			// _.forEach(list, function (item) {
			// serviceContainer.data.deleteItem(item, serviceContainer.data); // use deleteItem function replace deleteEntity function
			// });
		}

		function collectParameterValueVirtualValues(dataList) {
			var parameterValueVirtualValues = [];
			_.forEach(dataList, function (data) {
				if (data.IsLookup &&
					(data.ParameterValueFk === null || angular.isUndefined(data.ParameterValueFk)) &&
					(data.ParameterValueVirtual !== null && angular.isDefined(data.ParameterValueVirtual))) {
					if (!_.find(parameterValueVirtualValues, {Id: Number(data.ParameterValueVirtual)})) {
						parameterValueVirtualValues.push({
							Id: Number(data.ParameterValueVirtual),
							Description: data.ParameterValue,
							ParameterValue: data.ParameterValue
						});
					}
				}
			});
			basicsLookupdataLookupDescriptorService.attachData({CosMainInstanceParameterValue: parameterValueVirtualValues});
		}

		function onValidationInfoChanged(needToHide) {
			if (needToHide) {
				var insParams = service.getList();
				serviceContainer.data.listLoaded.fire(insParams);
			}
			service.gridRefresh();
		}

		function collectPropertyNames(dataList) {
			var newPropertyNames = [];
			var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');
			_.forEach(dataList, function (data) {
				if (data.PropertyName !== null && angular.isDefined(data) && data.PropertyName !== '') {
					var found = _.find(propertyNames, {PropertyName: data.PropertyName});
					if (found) {
						data.ModelPropertyFk = found.Id;
					} else {
						data.ModelPropertyFk = 'instanceparam' + data.Id * -1;
						newPropertyNames.push({
							Id: data.ModelPropertyFk,
							PropertyName: data.PropertyName
						});
					}
				}
			});
			basicsLookupdataLookupDescriptorService.attachData({CosMainInstanceParameterPropertyName: newPropertyNames});
		}

		function getMainDataForDetailForm() {
			if (!_mainData) {
				generateMainData();
			}
			var instance = parentService.getSelected();
			if (instance) {
				if (instance.Id !== _mainData.Id) {
					generateMainData();
				}
			}
			return _mainData;
		}

		function generateMainData() {
			var instance = parentService.getSelected();
			if (instance) {
				var mainData = {
					Id: instance.Id || 1
				};
				_.forEach(service.getList(), function (item) {
					mainData['m' + item.ParameterFk] = item;
				});
				_mainData = mainData;
			}
		}

		function getParameterInfo() {
			return {
				CosParameterGroups: _cosParameterGroups,
				CosParameters: _cosParameters,
				InsParameters: service.getList()
			};
		}

		function updateValueByObjectParameterChanged() {
			var items = service.getList();
			doUpdate(items, true);

			// script validation
			service.performScriptValidation.fire();

			service.gridRefresh();
		}

		function doUpdate(list, doProcess) {
			if (!list || list.length === 0) {
				return;
			}

			var instanceId = list[0].InstanceFk;
			var params = _tempCache[instanceId];

			if (params) {
				_.forEach(params, function (param) {
					var found = _.find(list, {Id: param.Id});
					if (found) {
						found.ParameterValue = param.ParameterValue;
						found.ParameterValueVirtual = param.ParameterValueVirtual;
						if (doProcess) {
							formatterProcessor.processItem(found, data);
						}
						// TODO chi: how about lookup
						service.markItemAsModified(found);
					}
				});
			}
			delete _tempCache[instanceId];
		}

		function setTempCache(value) {
			if (!value || angular.isUndefined(value.Id)) {
				_tempCache = {};
				return;
			}

			if (!_tempCache[value.InstanceFk]) {
				_tempCache[value.InstanceFk] = [];
				_tempCache[value.InstanceFk].push(value);
			} else {
				var found = _.find(_tempCache[value.InstanceFk], {Id: value.Id});
				if (found) {
					found = value;
				} else {
					_tempCache[value.InstanceFk].push(value);
				}
			}
		}

		function setCosParametersForParameterInfo(cosParameters) {
			_cosParameters = cosParameters;
		}

		function setCosParameterGroupsForParameterInfo(cosParameterGroups) {
			_cosParameterGroups = cosParameterGroups;
		}
	}
})(angular);
