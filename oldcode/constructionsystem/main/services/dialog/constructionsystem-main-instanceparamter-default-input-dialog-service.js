/**
 * Created by chi on 5/23/2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterDefaultInputDialogService', constructionSystemMainInstanceParameterDefaultInputDialogService);
	constructionSystemMainInstanceParameterDefaultInputDialogService.$inject = [
		'_',
		'globals',
		'$http',
		'$translate',
		'platformDataServiceFactory',
		'constructionSystemMasterParameterFormatterProcessor',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService',
		'constructionSystemMainInstanceParameterParameterValueFilterService',
		'constructionSystemMainInstanceParameterPropertyNameFilterService',
		'platformModalService',
		'parameterDataTypes'
	];
	function constructionSystemMainInstanceParameterDefaultInputDialogService(
		_,
		globals,
		$http,
		$translate,
		platformDataServiceFactory,
		constructionSystemMasterParameterFormatterProcessor,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService,
		constructionSystemMainInstanceParameterParameterValueFilterService,
		constructionSystemMainInstanceParameterPropertyNameFilterService,
		platformModalService,
		parameterDataTypes) {

		var position = -1;
		var originalDataList = [];
		var dataList = [];
		var currentData = null;
		var objectIds = null;
		var modelId = null;
		var commonTemplates = [
			{
				Id: 'D1',
				DescriptionInfo: {
					Translated: $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialog.selectTemplate')
				},
				disabled: true
			},
			{
				Id: 'D2',
				DescriptionInfo: {
					Translated: $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialog.noTemplate')
				},
				disabled: false
			}
		];
		var serviceConfigs = {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMainInstanceParameterDefaultInputDialogService',
				entitySelection: {},
				presenter: {
					list: {}
				},
				httpRead: {
					useLocalResource: true,
					resourceFunction: getData
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},

				isInitialSorted: false,
				dataProcessor: [constructionSystemMasterParameterFormatterProcessor]
			},
			container = platformDataServiceFactory.createNewComplete(serviceConfigs),
			service = container.service;

		var lookupFilters = [
			constructionSystemMainInstanceParameterParameterValueFilterService('constructionsystem-main-instanceparameter-dialog-parameter-value-filter', false),
			constructionSystemMainInstanceParameterPropertyNameFilterService('instanceparameter-property-name-default-input-dialog-filter', false, getObjectIds)
		];

		basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

		service.initData = initData;
		service.getDataList = getDataList;
		service.getOriginalDataList = getAllOriginalDataList;
		service.getCurrentData = getCurrentData;
		service.getDataPosition = getDataPosition;
		service.next = next;
		service.previous = previous;
		service.resetParameterListByTemplateId = resetParameterListByTemplateId;
		service.resetData = resetData;
		service.getAsyncParameterValueByPropertyName = getAsyncParameterValueByPropertyName;
		service.validatePropertyName = validatePropertyName;
		service.validateParameterValue = validateParameterValue;

		return service;

		// //////////////////////////////////
		function getData() {
			var data = _.head(_.filter(dataList, function (item) {
				return item.masterData.Id === currentData.masterData.Id;
			}));

			return data ? data.parameterList : null;
		}

		function initData(data, modelSelectedId, selectedObjectIds) {
			dataList = data || [];
			modelId = modelSelectedId || null;
			objectIds = selectedObjectIds || null;
			if (dataList && dataList.length > 0) {
				var templates = basicsLookupdataLookupDescriptorService.getData('CosTemplate');
				var tempTemplates = null;
				var number = 1;
				var quantity = dataList.length;
				_.forEach(dataList, function (item) {
					// set the DefaultValue to null if the default type is not given default
					initParameterList(item.parameterList, 'D2', item.masterData.Id);

					item.selectedTemplateId = 'D1'; // default selected template

					originalDataList.push(angular.copy(item));

					// get templates according to the master
					tempTemplates = angular.copy(_.filter(templates, function (template) {
						return template.CosHeaderFk === item.masterData.Id;
					}));
					_.forEach(tempTemplates, function (temp) {
						temp.disabled = false;
					});
					item.templates = commonTemplates.concat(tempTemplates);

					// store parameter list by template for no need to visit the service frequently
					item.defaultParameterListByTemplateIdCache = [
						{
							templateId: 'D2',
							defaultParameterList: angular.copy(item.parameterList)
						}
					];

					// navigation for Construction System Master
					item.masterPositionInfo = $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialog.master', {
						number: number++,
						quantity: quantity
					});
				});
				currentData = dataList[0];
				position = 0;
			}
		}

		function getDataList() {
			return dataList;
		}

		function getAllOriginalDataList() {
			return originalDataList;
		}

		function getCurrentData() {
			return currentData;
		}

		function getDataPosition() {
			return position;
		}

		function next() {
			if ((position + 1) >= dataList.length) {
				return;
			}

			position += 1;
			currentData = dataList[position];
			service.load();
		}

		function previous() {
			if ((position - 1) <= -1) {
				return;
			}

			position -= 1;
			currentData = dataList[position];
			service.load();
		}

		function resetParameterListByTemplateId(templateId) {
			var found = null;
			if (templateId === 'D1' || templateId === 'D2') {
				found = _.find(currentData.defaultParameterListByTemplateIdCache, {templateId: templateId});
				if (found) {
					currentData.parameterList = found.defaultParameterList;
					if (found.defaultVirtualValues) {
						basicsLookupdataLookupDescriptorService.updateData(found.defaultVirtualValues.type, found.defaultVirtualValues.value);
					}
				} else {
					currentData.parameterList = [];
				}
				service.load();
				return;
			}

			currentData.defaultParameterListByTemplateIdCache = currentData.defaultParameterListByTemplateIdCache || [];

			found = _.find(currentData.defaultParameterListByTemplateIdCache, {templateId: templateId});
			if (found) {
				currentData.parameterList = found.defaultParameterList;
				if (found.defaultVirtualValues) {
					basicsLookupdataLookupDescriptorService.updateData(found.defaultVirtualValues.type, found.defaultVirtualValues.value);
				}
				service.load();
				return;
			}

			$http.get(globals.webApiBaseUrl + 'constructionsystem/master/parameter2template/copyparameter2templatebytemplate?mainItemId=' + templateId).then(function (response) {
				if (!response || !response.data) {
					currentData.parameterList = [];
					service.load();
					return;
				}

				var newTemplates = response.data;
				initParameterList(newTemplates, templateId, currentData.masterData.Id);

				currentData.defaultParameterListByTemplateIdCache.push({
					templateId: templateId,
					defaultParameterList: angular.copy(newTemplates)
				});
				currentData.parameterList = newTemplates;
				service.load();
			});
		}

		function resetData() {
			position = -1;
			originalDataList = [];
			dataList = [];
			currentData = null;
		}

		function getObjectIds() {
			return objectIds;
		}

		function initParameterList(paramList, templateId, cosHeaderId) {
			var propertyNames = [];
			_.forEach(paramList, function (param) {
				if (param.CosDefaultTypeFk !== 1) {
					if (!param.IsLookup && param.CosParameterTypeFk === parameterDataTypes.Boolean) {
						param.DefaultValue = false;
					} else {
						param.DefaultValue = null;
					}
				}

				param.ParameterFk = param.Id;
				param.modifiedValue = null;
				if (param.PropertyName) {
					param.ModelPropertyFk = 'cosparam' + param.Id * -1;
					propertyNames.push({
						Id: 'cosparam' + param.Id * -1,
						PropertyName: param.PropertyName
					});
				} else {
					param.ModelPropertyFk = null;
				}
			});
			// basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyNameTempCache', propertyNames);
			basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterPropertyName', propertyNames);

			var tempTemplateId = templateId;
			if (templateId === 'D1' || templateId === 'D2') {
				tempTemplateId = null;
			}

			var instanceParameters = angular.copy(paramList);
			_.forEach(instanceParameters, function (param) {
				param.ModelPropertyFk = null; // api doesn't support string Fk.
			});

			$http.post(globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/fillininstanceparametervaluewithobjects',
				{
					TemplateId: tempTemplateId,
					CosHeaderId: cosHeaderId,
					ModelId: modelId,
					ObjectIds: objectIds,
					InstanceParameters: instanceParameters
				}).then(function (response) {
				var list = response.data;
				var parameterValueVirtualValues = [];
				_.forEach(paramList, function (item) {
					var found = _.find(list, {Id: item.Id});
					if (found) {
						item.DefaultValue = found.ParameterValueFk ? found.ParameterValueFk : found.ParameterValue;
						item.ParameterValue = found.ParameterValue;
						item.ParameterValueFk = found.ParameterValueFk;
						if (found.IsLookup &&
							(found.ParameterValueFk === null || angular.isUndefined(found.ParameterValueFk)) &&
							(found.ParameterValue !== null && angular.isDefined(found.ParameterValue))) {
							item.DefaultValue = item.Id * -1;
							if (!_.find(parameterValueVirtualValues, {Id: item.Id * -1})) {
								parameterValueVirtualValues.push({
									Id: item.Id * -1,
									Description: found.ParameterValue,
									ParameterValue: found.ParameterValue
								});
							}
						}
					}
					constructionSystemMasterParameterFormatterProcessor.processItem(item);
				});

				basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', parameterValueVirtualValues);
				var found = _.find(currentData.defaultParameterListByTemplateIdCache, {templateId: templateId});
				if (found) {
					found.defaultParameterList = angular.copy(paramList);
					if (parameterValueVirtualValues.length > 0) {
						found.defaultVirtualValues = {
							type: 'CosMainInstanceParameterValue',
							values: parameterValueVirtualValues
						};
					}
				}
				service.gridRefresh();
			});
		}

		function getAsyncParameterValueByPropertyName(entity) {
			return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/getomodelbjectpropertyvalue', {
				ModelId: modelId,
				ParameterId: entity.Id,
				PropertyName: entity.PropertyName,
				ModelObjectIds: objectIds
			});
		}

		function validateParameterValue(entity, value) {
			entity.modifiedValue = value;
			return true;
		}


		// function validatePropertyName(entity, value) {
		//    var propertyName = null;
		//    var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');
		//
		//    if (!entity.IsLookup && entity.CosParameterTypeFk === parameterDataTypes.Boolean) {
		//         entity.DefaultValue = false;
		//         entity.ParameterValue = false;
		//    } else {
		//        entity.DefaultValue = null;
		//        entity.ParameterValue = null;
		//    }
		//    entity.ParameterValueFk = null;
		//
		//   if (value && propertyNames && propertyNames[value]) {
		//       propertyName = entity.PropertyName = propertyNames[value].PropertyName;
		//    } else {
		//      entity.PropertyName = null;
		//    }
		//
		//    if (propertyName) {
		//        getAsyncParameterValueByPropertyName(entity).then(function (response) {
		//          /** @namespace response.data.ObjectPropertyValue */
		//          var propertyValue = response.data.ObjectPropertyValue;
		//          var errMsgs = response.data.ErrorMessages;
		//
		//          entity.ParameterValue = entity.DefaultValue = propertyValue;
		//          if (entity.IsLookup && propertyValue) {
		//              entity.DefaultValue = entity.Id * -1;
		//              basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
		//                Id: entity.Id * -1,
		//                Description: propertyValue,
		//                ParameterValue: propertyValue
		//           }]);
		//          }
		//
		//          constructionSystemMasterParameterFormatterProcessor.processItem(entity);
		//          service.gridRefresh();
		//
		//          if (errMsgs && errMsgs.length > 0){
		//              _.forEach(errMsgs, function (error) {
		//                platformModalService.showErrorDialog(error);
		//            });
		//          }
		//       });
		//     }
		//
		//     return true;
		// }


		function validatePropertyName(entity, value) {
			var propertyName = value;

			if (!entity.IsLookup && entity.CosParameterTypeFk === parameterDataTypes.Boolean) {
				entity.DefaultValue = false;
				entity.ParameterValue = false;
			} else {
				entity.DefaultValue = null;
				entity.ParameterValue = null;
			}
			entity.ParameterValueFk = null;

			entity.PropertyName = propertyName;
			if (propertyName) {
				getAsyncParameterValueByPropertyName(entity).then(function (response) {
					/** @namespace response.data.ObjectPropertyValue */
					var propertyValue = response.data.ObjectPropertyValue;
					var errMsgs = response.data.ErrorMessages;

					entity.ParameterValue = entity.DefaultValue = propertyValue;
					if (entity.IsLookup && propertyValue) {
						entity.DefaultValue = entity.Id * -1;
						basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
							Id: entity.Id * -1,
							Description: propertyValue,
							ParameterValue: propertyValue
						}]);
					}

					constructionSystemMasterParameterFormatterProcessor.processItem(entity);
					service.gridRefresh();

					if (errMsgs && errMsgs.length > 0) {
						_.forEach(errMsgs, function (error) {
							platformModalService.showErrorDialog(error);
						});
					}
				});
			}

			return true;
		}
	}
})(angular);