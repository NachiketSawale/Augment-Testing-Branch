/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.main');
	const svcName = 'modelMainObject2LocationDataService';

	myModule.service(svcName, ModelMainObject2LocationDataService);

	ModelMainObject2LocationDataService.$inject = ['platformDataServiceFactory',
		'modelMainObjectDataService'];

	function ModelMainObject2LocationDataService(platformDataServiceFactory,
		modelMainObjectDataService) {

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: svcName,
				entityNameTranslationID: 'model.main.object2LocationEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/main/object2location/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selObject = modelMainObjectDataService.getSelected();

						const parentId = {
							modelId: selObject ? selObject.ModelFk : 0,
							objectId: selObject ? selObject.Id : 0
						};

						readData.filter = `?modelId=${parentId.modelId}&objectId=${parentId.objectId}`;
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selObject = modelMainObjectDataService.getSelected();
							creationData.PKey1 = selObject.Id;
							creationData.PKey2 = selObject.ModelFk;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelObject2Locations',
						parentService: modelMainObjectDataService
					}
				}
			}
		};

		platformDataServiceFactory.createService(serviceOptions, self);
	}
})(angular);
