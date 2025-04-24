/**
 * Created by Shankar on 2022-11-30
 */
(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('project.inforequest');
	const svcName = 'projectInfoRequestReferenceToDataService';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestReferenceToDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestReferenceToDataService is a data service for contribution to information requests
	 */

	myModule.service(svcName, ProjectInfoRequestReferenceToDataService);

	ProjectInfoRequestReferenceToDataService.$inject = ['platformDataServiceFactory',
		'projectInfoRequestDataService', 'platformRuntimeDataService'];

	function ProjectInfoRequestReferenceToDataService(platformDataServiceFactory, projectInfoRequestDataService, platformRuntimeDataService){

		const self = this;
		const serviceOptions = {
			flatLeafItem: {
				module: myModule,
				serviceName: svcName,
				entityNameTranslationID: 'basics.config.entityTranslation',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'project/rfi/requestreference/',
					endRead: 'listByParent',
					initReadData: function initReadData(readData) {
						const selAnnotation = projectInfoRequestDataService.getSelected();
						readData.filter = '?requestInfoId=' + (selAnnotation ? selAnnotation.Id : 0);
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
							const selAnnotation = projectInfoRequestDataService.getSelected();
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
						itemName: 'ProjectInfoRequestReferences',
						parentService: projectInfoRequestDataService
					}
				}
			}
		};

		function updateEnabledState(item) {
			const selReference = projectInfoRequestDataService.getSelected();
			const selReferenceId = selReference ? selReference.Id : 0;
			platformRuntimeDataService.readonly(item, [{
				field: 'RequestFromFk',
				readonly: item.RequestFromFk === selReferenceId
			}, {
				field: 'RequestToFk',
				readonly: item.RequestToFk === '372'

			}]);
		}

		platformDataServiceFactory.createService(serviceOptions, self);
	}
})(angular);