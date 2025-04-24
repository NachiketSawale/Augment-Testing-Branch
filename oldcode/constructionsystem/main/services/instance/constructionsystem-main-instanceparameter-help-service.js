/**
 * Created by chi on 6/3/2016.
 */
/* global globals,_ */
(function(angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	// todo-mike:Refactor and remove it. we only need one data service
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainInstanceParameterHelpService', constructionSystemMainInstanceParameterHelpService);
	constructionSystemMainInstanceParameterHelpService.$inject = [
		'$http',
		'constructionSystemMainInstanceService',
		'constructionSystemMainInstanceParameterService',
		'constructionSystemMainInstanceParameterParameterValueFilterService',
		'basicsLookupdataLookupFilterService',
		'constructionSystemMainInstanceParameterPropertyNameFilterService',
		'basicsLookupdataLookupDescriptorService',
		'constructionSystemMainInstanceParameterFormatterProcessor',
		'platformModalService',
		'parameterDataTypes',
		'platformDataServiceModificationTrackingExtension',
		'constructionSystemMainInstance2ObjectParamService'
	];
	function constructionSystemMainInstanceParameterHelpService(
		$http,
		constructionSystemMainInstanceService,
		constructionSystemMainInstanceParameterService,
		constructionSystemMainInstanceParameterParameterValueFilterService,
		basicsLookupdataLookupFilterService,
		constructionSystemMainInstanceParameterPropertyNameFilterService,
		basicsLookupdataLookupDescriptorService,
		constructionSystemMainInstanceParameterFormatterProcessor,
		platformModalService,
		parameterDataTypes,
		platformDataServiceModificationTrackingExtension,
		constructionSystemMainInstance2ObjectParamService
	){
		var service = {};

		var lookupFilters = [
			constructionSystemMainInstanceParameterParameterValueFilterService('parameterfk-for-constructionsystem-main-instanceparameter-filter', true),
			constructionSystemMainInstanceParameterPropertyNameFilterService('instanceparameter-property-name-filter', false)
		];

		basicsLookupdataLookupFilterService.registerFilter(lookupFilters);

		constructionSystemMainInstanceService.templateChangedMessenger.register(templateChangedHandler);

		service.updateModelPropertyFk = updateModelPropertyFk;
		service.updatePropertyName = updatePropertyName;
		service.updateInstanceParameterByObjectParameter = updateInstanceParameterByObjectParameter;
		service.getModifiedIns2ObjParamsByParameterId = getModifiedIns2ObjParamsByParameterId;
		return service;

		// ////////////////////////////////////////////
		// noinspection JSUnusedLocalSymbols
		function templateChangedHandler(e, changedData) {
			// delete all instance parameters
			var list = constructionSystemMainInstanceParameterService.getList();

			if(list && list.length > 0){
				updateList();
			}else{
				constructionSystemMainInstanceParameterService.load().then(function (){
					updateList();
				});
			}

			function updateList(){
				constructionSystemMainInstanceParameterService.deleteList(list);

				// create new instance parameters
				// TODO chi: how about the default type = property, quantity query?
				var obj = constructionSystemMainInstanceService.getSelected();
				var url = globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/copyparameter2templatebytemplateid?';
				url += 'templateId=' + changedData.templateId;
				url += '&instanceId=' + obj.Id;
				url += '&modelId=' + constructionSystemMainInstanceService.getCurrentSelectedModelId();
				$http.get(url).then(function (response) {
					if (!response || !response.data) {
						return;
					}
					constructionSystemMainInstanceParameterService.resetList(response.data);
				});
			}
		}

		function updateModelPropertyFk(entity, value, isDistinctInstances) {
			var propertyNames = basicsLookupdataLookupDescriptorService.getData('CosMainInstanceParameterPropertyName');

			var istanceParameterList = constructionSystemMainInstanceParameterService.getList();
			var istanceParameterItem = _.find(istanceParameterList, function (item) {
				return item.Id === entity.Id;
			});

			var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
			var parameterItem = null;
			if (parameters) {
				parameterItem = _.find(parameters, function (item) {
					return item.Id === entity.ParameterFk;
				});
			}

			var propertyName = null;
			istanceParameterItem.ModelPropertyFk = value;

			if (!istanceParameterItem.IsLookup && istanceParameterItem.CosParameterTypeFk === parameterDataTypes.Boolean) {
				istanceParameterItem.ParameterValueFk = null;
				istanceParameterItem.ParameterValueVirtual = false;
			} else if (isDistinctInstances){
				istanceParameterItem.ParameterValueFk = null;
				istanceParameterItem.ParameterValueVirtual = null;
			}
			if (value !== null && angular.isDefined(value) &&
				propertyNames && propertyNames[value]) {
				propertyName = istanceParameterItem.PropertyName = propertyNames[value].PropertyName;
			} else {
				propertyName = istanceParameterItem.PropertyName = null;
				if (!istanceParameterItem.IsLookup && istanceParameterItem.CosParameterTypeFk === parameterDataTypes.Boolean) {
					istanceParameterItem.ParameterValue = false;
				} else {
					istanceParameterItem.ParameterValue = null;
				}
			}

			if (propertyName && isDistinctInstances) {
				getAsyncParameterValueByPropertyName(entity).then(function (response) {
					var propertyValue = response.data.ObjectPropertyValue;
					var errMsgs = response.data.ErrorMessages;

					istanceParameterItem.ParameterValue = propertyValue;
					istanceParameterItem.ParameterValueVirtual = propertyValue;
					if (parameterItem && parameterItem.IsLookup && propertyValue) {
						istanceParameterItem.ParameterValueVirtual = entity.Id * -1;
						basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
							Id: Number(entity.Id * -1),
							Description: propertyValue,
							ParameterValue: propertyValue
						}]);
					}

					constructionSystemMainInstanceParameterFormatterProcessor.processItem(istanceParameterItem);
					constructionSystemMainInstanceParameterService.gridRefresh();

					if (errMsgs && errMsgs.length > 0){
						_.forEach(errMsgs, function (error) {
							platformModalService.showErrorDialog(error);
						});
					}
				});
			}

			if (!isDistinctInstances) {
				updateInstance2ObjectParameterByPropertyName(entity).then(function (response) {
					if (response.data) {
						if (response.data.InstanceParameter) {
							var found = _.find(constructionSystemMainInstanceParameterService.getList(), {Id: response.data.InstanceParameter.Id});
							if (found) {
								found.ParameterValue = response.data.InstanceParameter.ParameterValue;
								found.ParameterValueVirtual = response.data.InstanceParameter.ParameterValueVirtual;
								constructionSystemMainInstanceParameterService.markItemAsModified(found);
								constructionSystemMainInstanceParameterService.gridRefresh();
							}
						}
						constructionSystemMainInstance2ObjectParamService.setTempCache(response.data.ModifiedInstance2ObjectParameters);
						constructionSystemMainInstance2ObjectParamService.updateByInstanceParameterPropertyChanged();
						if (response.data.ErrorMessages && response.data.ErrorMessages.length > 0) {
							_.forEach(response.data.ErrorMessages, function (error) {
								platformModalService.showErrorBox(error, 'cloud.common.errorDialogTitle');
							});
						}
					}
				});
			}
		}

		function updatePropertyName(entity, value, isDistinctInstances) {
			var istanceParameterList = constructionSystemMainInstanceParameterService.getList();
			var istanceParameterItem = _.find(istanceParameterList, function (item) {
				return item.Id === entity.Id;
			});

			var parameters = basicsLookupdataLookupDescriptorService.getData('CosParameter');
			var parameterItem = null;
			if (parameters) {
				parameterItem = _.find(parameters, function (item) {
					return item.Id === entity.ParameterFk;
				});
			}

			var propertyName = value;
			istanceParameterItem.ModelPropertyFk = null;

			if (!istanceParameterItem.IsLookup && istanceParameterItem.CosParameterTypeFk === parameterDataTypes.Boolean) {
				istanceParameterItem.ParameterValueFk = null;
				istanceParameterItem.ParameterValueVirtual = false;
			} else if (isDistinctInstances){
				istanceParameterItem.ParameterValueFk = null;
				istanceParameterItem.ParameterValueVirtual = null;
			}

			istanceParameterItem.PropertyName=propertyName;

			if (!propertyName) {
				if (!istanceParameterItem.IsLookup && istanceParameterItem.CosParameterTypeFk === parameterDataTypes.Boolean) {
					istanceParameterItem.ParameterValue = false;
				} else {
					istanceParameterItem.ParameterValue = null;
				}
			}

			if (propertyName && isDistinctInstances) {
				getAsyncParameterValueByPropertyName(entity).then(function (response) {
					var propertyValue = response.data.ObjectPropertyValue;
					var errMsgs = response.data.ErrorMessages;

					istanceParameterItem.ParameterValue = propertyValue;
					istanceParameterItem.ParameterValueVirtual = propertyValue;
					if (parameterItem && parameterItem.IsLookup && propertyValue) {
						istanceParameterItem.ParameterValueVirtual = entity.Id * -1;
						basicsLookupdataLookupDescriptorService.updateData('CosMainInstanceParameterValue', [{
							Id: Number(entity.Id * -1),
							Description: propertyValue,
							ParameterValue: propertyValue
						}]);
					}

					constructionSystemMainInstanceParameterFormatterProcessor.processItem(istanceParameterItem);
					constructionSystemMainInstanceParameterService.gridRefresh();

					if (errMsgs && errMsgs.length > 0){
						_.forEach(errMsgs, function (error) {
							platformModalService.showErrorDialog(error);
						});
					}
				});
			}

			if (!isDistinctInstances) {
				updateInstance2ObjectParameterByPropertyName(entity).then(function (response) {
					if (response.data) {
						if (response.data.InstanceParameter) {
							var found = _.find(constructionSystemMainInstanceParameterService.getList(), {Id: response.data.InstanceParameter.Id});
							if (found) {
								found.ParameterValue = response.data.InstanceParameter.ParameterValue;
								found.ParameterValueVirtual = response.data.InstanceParameter.ParameterValueVirtual;
								constructionSystemMainInstanceParameterService.markItemAsModified(found);
								constructionSystemMainInstanceParameterService.gridRefresh();
							}
						}
						constructionSystemMainInstance2ObjectParamService.setTempCache(response.data.ModifiedInstance2ObjectParameters);
						constructionSystemMainInstance2ObjectParamService.updateByInstanceParameterPropertyChanged();
						if (response.data.ErrorMessages && response.data.ErrorMessages.length > 0) {
							_.forEach(response.data.ErrorMessages, function (error) {
								platformModalService.showErrorBox(error, 'cloud.common.errorDialogTitle');
							});
						}
					}
				});
			}
		}

		function getModifiedIns2ObjParamsByParameterId(parameterId){
			var modifiedItems = [];
			var updateData = platformDataServiceModificationTrackingExtension.getModifications(constructionSystemMainInstanceService);

			if (updateData && updateData.Instance2ObjectToSave && updateData.Instance2ObjectToSave.length > 0) {
				_.forEach(updateData.Instance2ObjectToSave, function (ins2Obj) {
					if (ins2Obj.Instance2ObjectParamToSave && ins2Obj.Instance2ObjectParamToSave.length > 0) {
						var found = _.find(ins2Obj.Instance2ObjectParamToSave, {ParameterFk: parameterId});
						if (found) {
							modifiedItems.push(found);
						}
					}
				});
			}
			return modifiedItems;
		}

		function getAsyncParameterValueByPropertyName(entity) {
			return $http.get(globals.webApiBaseUrl + 'constructionsystem/main/instanceparameter/getobjectpropertyvalue', {
				params: {
					modelId: constructionSystemMainInstanceService.getCurrentSelectedModelId(),
					instanceHeaderId: entity.InstanceHeaderFk,
					instanceId: entity.InstanceFk,
					instanceParameterId: entity.Id,
					propertyName: entity.PropertyName
				}
			});
		}

		function updateInstance2ObjectParameterByPropertyName(entity) {
			var modifiedItems = getModifiedIns2ObjParamsByParameterId(entity.ParameterFk);

			var parameter = {
				ModelId: constructionSystemMainInstanceService.getCurrentSelectedModelId(),
				InstanceParameter: entity,
				ModifiedIns2ObjectParams: modifiedItems
			};
			return $http.post(globals.webApiBaseUrl + 'constructionsystem/main/instance2objectparam/updatebyinstanceparameterproperty', parameter);
		}

		function updateInstanceParameterByObjectParameter(entity) {
			constructionSystemMainInstanceParameterService.setTempCache(entity);
			constructionSystemMainInstanceParameterService.updateValueByObjectParameterChanged();
		}
	}
})(angular);