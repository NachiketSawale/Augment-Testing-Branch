(function (angular) {
	'use strict';
	/* global globals,_ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObject2LocationService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for constructionSystem main object2location list/detail controller.
	 */
	angular.module(moduleName).service('constructionSystemMainObject2LocationService', constructionSystemMainObject2LocationService);
	constructionSystemMainObject2LocationService.$inject = ['platformDataServiceFactory', 'constructionSystemMainInstance2ObjectService', '$http',
		'constructionSystemMainInstanceService', 'basicsLookupdataLookupDescriptorService', '$injector'];

	function constructionSystemMainObject2LocationService(platformDataServiceFactory, parentService, $http, headerService, lookupDesService, $injector) {
		const self = this;

		function getProjectId() {
			return headerService.getCurrentSelectedProjectId();
		}

		const serviceOption = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMainObject2LocationService',
				entityNameTranslationID: 'model.main.object2LocationEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/main/object2location/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selObject = parentService.getSelected();
						$injector.get('projectLocationLookupDataService').getList('ProjectLocation').then(function (data) {
							if (data && data.length > 0) {
								lookupDesService.updateData('ProjectLocation', data);
							}
						});
						const parentId = {
							modelId: selObject ? selObject.ModelFk : 0,
							objectId: selObject ? selObject.ObjectFk : 0
						};

						readData.filter = `?modelId=${parentId.modelId}&objectId=${parentId.objectId}`;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						incorporateDataRead: function incorporateDataRead(readData, data) {
							let projectId = getProjectId();
							let locationItems = _.filter(lookupDesService.getData('ProjectLocation'), {ProjectFk: projectId});
							let newLocationItems = getProjectLocations(locationItems);
							if (newLocationItems && newLocationItems.length > 0) {
								readData = _.filter(readData, function (item) {
									return _.find(newLocationItems, {Id: item.LocationFk});
								});
							}
							return data.handleReadSucceeded(readData, data);
						},
						initCreationData: function initCreationData(creationData) {
							const selObject = parentService.getSelected();
							creationData.PKey1 = selObject.ObjectFk;
							creationData.PKey2 = selObject.ModelFk;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelObject2Locations',
						parentService: parentService
					}
				}
			}
		};
		function getProjectLocations(locationItems) {
			let newItems = [];
			_.forEach(locationItems, function (item) {
				if (item.Locations && item.Locations.length > 0) {
					newItems = newItems.concat(getProjectLocations(item.Locations));
				}
				newItems.push(item);
			});
			return newItems;
		}
		self.saveModelObject2Location = function (items) {
			let saveObjectLocations = angular.copy(items);
			_.forEach(saveObjectLocations, function (item) {
				$http.post(globals.webApiBaseUrl + 'model/main/object2location/save', item).then(function () {
					saveObjectLocations.shift(saveObjectLocations.indexOf(item) + 1);
					if (saveObjectLocations.length < 1) {
						self.load();
					}
				});
			});
		};
		self.deleteModelObject2Location = function (items) {
			$http.post(globals.webApiBaseUrl + 'model/main/object2location/multidelete', items).then(function () {
				self.load();
			});
		};
		platformDataServiceFactory.createService(serviceOption, self);

	}
})(angular);
