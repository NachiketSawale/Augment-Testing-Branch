/**
 * Created by lvy on 4/17/2018.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_,$ */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';
	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceHeaderParameterService
	 * @function
	 * @requires Data service for instance header parameter
	 *
	 * @description
	 * #
	 *  data service for constuctionsystem main instanceheaderparameter grid controller.
	 */
	angular.module(moduleName).factory('constructionSystemMainInstanceHeaderParameterService', constructionSystemMainInstanceParameterService);

	constructionSystemMainInstanceParameterService.$inject = ['$http', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'constructionSystemMainInstanceHeaderParameterFormatterProcessor', 'constructionSystemMainInstanceHeaderParameterReadOnlyProcessor', 'platformModuleStateService', 'platformModalService'];

	function constructionSystemMainInstanceParameterService($http, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, formatterProcessor, readOnlyProcessor, platformModuleStateService, platformModalService) {

		var httpRoute = globals.webApiBaseUrl + 'constructionsystem/main/instanceheaderparameter/';
		var insHeaderId = '';
		var filterData = {
			searchValue: '',
			cosGlobalParamGroupFk: null
		};
		var serviceOption = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMainInstanceHeaderParameterService',
				entityNameTranslationID: 'constructionsystem.main.globalParameterGroupGridContainerTitle',
				httpRead: {
					route: globals.webApiBaseUrl + 'constructionsystem/main/instanceheaderparameter/',
					endRead: 'getlistbyglobalparam',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						if (filterData.cosGlobalParamGroupFk !== null && filterData.cosGlobalParamGroupFk > 0) {
							readData.CosGlobalParamGroupFk = filterData.cosGlobalParamGroupFk;
						}
						if (!angular.isUndefined(filterData.searchValue) && filterData.searchValue !== null) {
							readData.SearchValue = filterData.searchValue;
						}
						if (insHeaderId !== '' && insHeaderId > 0) {
							readData.InsHeaderId = insHeaderId;
						}
					}
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'constructionsystem/main/instanceheaderparameter/',
					endUpdate: 'update'
				},
				dataProcessor: [formatterProcessor, readOnlyProcessor],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							setDescriptionForParameterValue(readData.cosglobalparamvalue);
							basicsLookupdataLookupDescriptorService.attachData(readData || {});
							collectParameterValueVirtualValues(readData.dtos, readData.cosglobalparam, readData.cosglobalparamvalue);
							setCosParameterTypeFkAndIslookup(readData);
							var dataRead = serviceContainer.data.handleReadSucceeded(readData.dtos, data);
							filterData.cosGlobalParamGroupFk = null;
							return dataRead;
						}
					}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'InstanceHeaderParameter',
						moduleName: 'Construction System Instance Header Parameter',
						lastObjectModuleName: moduleName,
						rootForModule: moduleName
					}
				},
				actions: {delete: false, create: false}
			}
		};

		function setDescriptionForParameterValue(cosglobalparamvalue) {
			if (cosglobalparamvalue !== null && cosglobalparamvalue.length > 0) {
				_.forEach(cosglobalparamvalue, function (paramvalue) {
					paramvalue.Description = paramvalue.DescriptionInfo.Translated;
				});
			}
		}

		function collectParameterValueVirtualValues(dtos, cosglobalparameters, cosglobalparamvalues) {
			var parameterValueVirtualValues = [];
			_.forEach(dtos, function (data) {
				var cosglobalparameter = _.find(cosglobalparameters, {Id: Number(data.CosGlobalParamFk)});
				if (cosglobalparameter && cosglobalparameter.IsLookup &&
					(data.CosGlobalParamvalueFk === null || data.CosGlobalParamvalueFk === undefined || angular.isUndefined(data.CosGlobalParamvalueFk)) &&
					(data.ParameterValueVirtual !== null && angular.isDefined(data.ParameterValueVirtual))) {
					if (!_.find(cosglobalparamvalues, {Id: Number(data.ParameterValueVirtual)})) {
						parameterValueVirtualValues.push({
							Id: Number(data.ParameterValueVirtual),
							Description: data.ParameterValue,
							ParameterValue: data.ParameterValue
						});
					}
				}
			});
			basicsLookupdataLookupDescriptorService.attachData({cosglobalparamvalue: parameterValueVirtualValues});
		}

		function setCosParameterTypeFkAndIslookup(readData) {
			$.each(readData.dtos, function (i, e) {
				var cosparametertypefk = _.find(readData.cosglobalparam, {Id: e.CosGlobalParamFk});
				if (cosparametertypefk) {
					e.CosParameterTypeFk = cosparametertypefk.CosParameterTypeFk;
					e.IsLookup = cosparametertypefk.IsLookup;
				}
			});
		}

		function saveInstanceHeaderParameter() {
			var modState = platformModuleStateService.state(service.getModule());
			if (modState.modifications.InstanceHeaderParameter) {
				var updateData = {
					InstanceHeaderParameter: modState.modifications.InstanceHeaderParameter,
					EntitiesCount: modState.modifications.InstanceHeaderParameter.length,
					MainItemId: modState.modifications.InstanceHeaderParameter[0].Id
				};
				modState.modifications.EntitiesCount = modState.modifications.EntitiesCount - updateData.EntitiesCount;
				delete modState.modifications.InstanceHeaderParameter;
				$http.post(serviceContainer.data.httpUpdateRoute + serviceContainer.data.endUpdate, updateData).then(function (response) {
					var responseData = response.data.InstanceHeaderParameter[0];
					formatterProcessor.processItem(responseData);
					var itemIndex = _.findIndex(serviceContainer.data.itemList, {Id: responseData.Id});
					serviceContainer.data.itemList[itemIndex] = responseData;
					serviceContainer.data.listLoaded.fire();
				});
			}
		}

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		var service = serviceContainer.service;
		service.setShowHeaderAfterSelectionChanged(null);
		service.confirmRefreshNew = function(){
			return platformModalService.showYesNoDialog('constructionsystem.main.confirmRefreshNew', 'platform.formContainer.refresh', 'yes');
		}
		service.refresh = function (globalParameterId, refreshNew) {
			//save changes before refresh.
			saveInstanceHeaderParameter();
			serviceContainer.data.doClearModifications(service.getSelected(), serviceContainer.data);
			var url = httpRoute + 'refresh?insHeaderId=' + insHeaderId;
			if (filterData.searchValue) {
				url = url + '&searchValue=' + filterData.searchValue;
			}
			if (filterData.cosGlobalParamGroupFk) {
				url = url + '&cosGlobalParamGroupFk=' + filterData.cosGlobalParamGroupFk;
			}
			if(refreshNew){
				url = url + '&refreshNew=true';
			}
			if (globalParameterId) {
				return $http.get(url + '&globalParameterId=' + globalParameterId);
			} else {
				return $http.get(url);
			}
		};
		service.removeModified = function(item) {
			if (!item) {
				item = service.getSelected();
			}
			serviceContainer.data.doClearModifications(item, serviceContainer.data);
		};
		service.setInstanceHeaderId = function (id) {
			insHeaderId = id;
			service.insHeaderId = insHeaderId;
		};
		service.setFilterData = function setFilterData(newFilterData) {
			angular.extend(filterData, newFilterData);
		};
		service.setDescriptionForParameterValue = setDescriptionForParameterValue;
		service.setCosParameterTypeFkAndIslookup = setCosParameterTypeFkAndIslookup;
		service.saveInstanceHeaderParameter = saveInstanceHeaderParameter;
		return service;
	}
})(angular);
