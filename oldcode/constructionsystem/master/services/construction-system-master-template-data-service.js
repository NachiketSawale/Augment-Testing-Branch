/**
 * Created by chi on 5/26/2016.
 */
(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';
	angular.module(moduleName).factory('constructionSystemMasterTemplateDataService', constructionSystemMasterTemplateDataService);
	constructionSystemMasterTemplateDataService.$inject = [
		'_',
		'platformDataServiceFactory',
		'PlatformMessenger',
		'constructionSystemMasterHeaderService',
		'basicsLookupdataLookupDescriptorService'
	];
	function constructionSystemMasterTemplateDataService(
		_,
		platformDataServiceFactory,
		PlatformMessenger,
		constructionSystemMasterHeaderService,
		basicsLookupdataLookupDescriptorService) {
		var serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMasterTemplateDataService',
				httpCreate: {route: globals.webApiBaseUrl + 'constructionsystem/master/template/', endCreate: 'createcomplete'},
				httpRead: {route: globals.webApiBaseUrl + 'constructionsystem/master/template/'},
				presenter: {
					list: {
						incorporateDataRead: incorporateDataRead,
						handleCreateSucceeded: handleCreateSucceeded
					}
				},
				entityRole: {
					node: {
						itemName: 'CosTemplate',
						parentService: constructionSystemMasterHeaderService,
						doesRequireLoadAlways: false
					}
				},
				translation: {
					uid: 'constructionSystemMasterTemplateDataService', // TODO chi: need?
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'CosTemplateDto', moduleSubModule: 'ConstructionSystem.Master'
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		serviceContainer.service.name = 'construction.system.master.template';
		serviceContainer.service.updatedDoneMessenger = new PlatformMessenger();
		serviceContainer.service.completeEntityCreated = new PlatformMessenger();
		serviceContainer.service.clearUpValidationIssues = clearUpValidationIssues;
		// var oldDeleteDone = serviceContainer.data.onDeleteDone;
		// serviceContainer.data.onDeleteDone = onDeleteDone;

		constructionSystemMasterHeaderService.updatedDoneMessenger.register(updatedDoneHandler);

		var onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
		serviceContainer.data.onCreateSucceeded = function (newData, data, creationData) {
			return onCreateSucceeded.call(serviceContainer.data, newData, data, creationData).then(function () {
				serviceContainer.service.completeEntityCreated.fire(null, newData);
			});
		};
		// /////////////////////////////////
		function incorporateDataRead(readData, data) {
			var result = serviceContainer.data.handleReadSucceeded(readData, data);
			if (readData && readData.length > 0){
				serviceContainer.service.goToFirst();
			} else {
				var childServices = serviceContainer.service.getChildServices();
				if (childServices && childServices.length > 0) {
					var found = _.find(childServices, {name: 'construction.system.master.parameter2template'});
					if (found) {
						found.loadSubItemList();
					}
				}
			}

			return result;
		}

		function handleCreateSucceeded(newData) {
			var newTemplate = newData.CosTemplate;
			var totalList = serviceContainer.service.getList();
			if (totalList.length > 0) {
				newTemplate.Sorting = _.max(_.map(totalList, 'Sorting')) + 1;
			} else {
				newTemplate.Sorting = 1;
			}

			basicsLookupdataLookupDescriptorService.attachData({CosTemplate: [newTemplate]});
			return newTemplate;
		}

		// noinspection JSUnusedLocalSymbols
		function updatedDoneHandler(e, updateData) { // TODO chi: need?
			if (!updateData) {
				return;
			}
			var lookupData = {
				CosTemplate: []
			};
			/** @namespace updateData.CosTemplateToSave */
			if (updateData.CosTemplateToSave && updateData.CosTemplateToSave.length > 0) {
				lookupData.CosTemplate = updateData.CosTemplateToSave;
			}

			basicsLookupdataLookupDescriptorService.attachData(lookupData);
			serviceContainer.service.updatedDoneMessenger.fire();
		}

		// function onDeleteDone(deleteParams, data, response) {
		//    var templates = basicsLookupdataLookupDescriptorService.getData('CosTemplate');
		//    _.forEach(templates, function(temp) {
		//      if (temp.Id === deleteParams.entity.Id) {
		//          temp.CosHeaderFk = null;
		//      }
		//    });
		//    oldDeleteDone(deleteParams, data, response);
		// }


		// (e=>null, deletedItems=>all deleted items)
		// replace the logic of onDeleteDone, done by stone.
		var onEntityDeleted = function onEntityDeleted(e, deletedItems) {
			if (deletedItems) {
				var templates = basicsLookupdataLookupDescriptorService.getData('CosTemplate');
				var deleteEntities = [];
				if (deletedItems instanceof Array) {
					deleteEntities = deletedItems;
				} else {
					deleteEntities = [deletedItems];
				}
				_.forEach(templates, function (temp) {
					if (_.find(deleteEntities, function (entity) {
						return temp.Id === entity.Id;
					})) {
						temp.CosHeaderFk = null;
					}
				});
			}

		};
		serviceContainer.service.registerEntityDeleted(onEntityDeleted);

		function clearUpValidationIssues() {
			var templates = basicsLookupdataLookupDescriptorService.getData('CosTemplate');
			_.forEach(templates, function(temp) {
				if (temp.Version === 0) {
					temp.CosHeaderFk = null;
				}
			});
		}

		return serviceContainer.service;

	}
})(angular);