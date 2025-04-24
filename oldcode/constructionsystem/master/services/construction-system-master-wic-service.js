/**
 * Created by xsi on 2015-12-23.
 */

(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterWicService', [
		'globals',
		'$http',
		'platformDataServiceFactory',
		'constructionSystemMasterHeaderService',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService',
		'basicsCommonMandatoryProcessor',
		function (
			globals,
			$http,
			platformDataServiceFactory,
			constructionSystemMasterHeaderService,
			basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService,
			basicsCommonMandatoryProcessor) {

			var serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'constructionSystemMasterWicService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'constructionsystem/master/Wic/'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead,
							handleCreateSucceeded: function (newData) {
								newData.BoqItemFk = null;
								newData.BoqWicCatBoqFk = null;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'CosWic',
							parentService: constructionSystemMasterHeaderService
						}
					},
					dataProcessor: [{processItem: processData}]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;

			service.canPaste = function (type, item) {
				if (item.BriefInfo) {
					return true;
				}
			};
			service.getReadOnly = function () {
				return false;
			};

			service.getBoqWicCatBoqFk = function getBoqWicCatBoqFk(boqItem, callback) {
				var wicAssignment = service.getSelected();
				if (wicAssignment && boqItem) {
					wicAssignment.BoqHeaderFk = boqItem.BoqHeaderFk;
					var url = globals.webApiBaseUrl + 'constructionsystem/master/wic/getboqwiccatfk' + '?boqHeaderId=' + boqItem.BoqHeaderFk;
					$http.get(url).then(function (res) {
						basicsLookupdataLookupDescriptorService.updateData('BoqWicCatBoqFk', [res.data]);
						wicAssignment.BoqWicCatBoqFk = res.data.Id;
						boqItem.BoqWicCatBoqFk = res.data.Id;
						service.markItemAsModified(wicAssignment);

						if (callback && angular.isFunction(callback)) {
							callback(boqItem);
						}
					});
				}
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CosWicDto',
				moduleSubModule: 'ConstructionSystem.Master',
				validationService: 'constructionSystemMasterWicValidationService',
				mustValidateFields: ['BoqItemFk', 'Code', 'BoqWicCatBoqFk']
			});

			return service;

			function incorporateDataRead(readItems, data) {
				basicsLookupdataLookupDescriptorService.attachData(readItems || {});
				serviceContainer.data.handleReadSucceeded(readItems.dtos, data);
			}

			function processData(newItem) {
				if (newItem.BoqItemFk === 0) {
					newItem.BoqItemFk = null;
				}
				if (newItem.BoqWicCatBoqFk === 0) {
					newItem.BoqWicCatBoqFk = null;
				}
				platformRuntimeDataService.readonly(newItem, [{field: 'BoqWicCatBoqFk', readonly: true}]);
			}
		}
	]);

})(angular);
