/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationReferenceDataService';

	myModule.service(svcName, ModelAnnotationReferenceDataService);

	ModelAnnotationReferenceDataService.$inject = ['platformDataServiceFactory',
		'modelAnnotationDataService', 'platformRuntimeDataService'];

	function ModelAnnotationReferenceDataService(platformDataServiceFactory,
		modelAnnotationDataService, platformRuntimeDataService) {

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: svcName,
				entityNameTranslationID: 'model.annotation.referenceEntityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/annotation/ref/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selAnnotation = modelAnnotationDataService.getSelected();
						readData.filter = '?annotationId=' + (selAnnotation ? selAnnotation.Id : 0);
					}
				},
				actions: {
					delete: true,
					create: 'flat'
				},
				dataProcessor: [{
					processItem: updateEnabledState
				}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selAnnotation = modelAnnotationDataService.getSelected();
							creationData.PKey1 = selAnnotation.Id;
						}
					},
					handleCreateSucceeded: function (newData) {
						updateEnabledState(newData);
						return newData;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelAnnotationReferences',
						parentService: modelAnnotationDataService
					}
				}
			}
		};

		function updateEnabledState(item) {
			const selAnnotation = modelAnnotationDataService.getSelected();
			const selAnnotationId = selAnnotation ? selAnnotation.Id : 0;
			platformRuntimeDataService.readonly(item, [{
				field: 'FromAnnotationFk',
				readonly: item.FromAnnotationFk === selAnnotationId
			}, {
				field: 'ToAnnotationFk',
				readonly: item.ToAnnotationFk === selAnnotationId
			}]);
		}

		platformDataServiceFactory.createService(serviceOptions, self);
	}
})(angular);
