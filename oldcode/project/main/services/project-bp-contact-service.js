(function (angular) {
	/* global globals */

	'use strict';
	const moduleName = 'project.main';
	const projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectPrj2BPContactService
	 * @function
	 *
	 * @description
	 * projectPrj2BPContactService is the data service for all generals related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectPrj2BPContactService', ['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformRuntimeDataService', 'projectPrj2BPService', 'projectMainService',

		function (_, $injector, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
			platformRuntimeDataService, projectPrj2BPService, projectMainService) {

			function processProjectBusinessPartner(bizPartner) {
				if(bizPartner.Id === 0) {
					platformRuntimeDataService.readonly(bizPartner, true);
				}
			}

			var bpServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectPrj2BPContactService',
					entityNameTranslationID: 'project.main.entityPrj2BpContact',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Project2BusinessPartnerContactDto',
						moduleSubModule: 'Project.Main'
					}), {processItem: processProjectBusinessPartner}],
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/project2bpcontact/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'project/main/project2bpcontact/',
						endRead: 'listbyparent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = projectPrj2BPService.getSelected();
							let project = projectMainService.getItemById(selected.ProjectFk);
							readData.PKey1 = selected.Id;
							if(project.BusinessPartnerFk === selected.BusinessPartnerFk) {
								readData.PKey2 = project.ContactFk;
								readData.PKey3 = project.BusinessPartnerFk;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'BusinessPartnerContacts',
							parentService: projectPrj2BPService,
							parentFilter: 'parentId'
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								const selectedItem = projectPrj2BPService.getSelected();
								creationData.Id = selectedItem.Id;
								creationData.PKey1 = selectedItem.BusinessPartnerFk;
								delete creationData.MainItemId;
							},
							handleCreateSucceeded: handleCreateBbContactSucceeded
						}
					},
					longText: {
						relatedContainerTitle: 'project.main.listPrj2BpContactTitle',
						relatedGridId: '09B099CDD4BF4AAFB4BC7D28DD8BF1C9',
						longTextProperties: [{
							displayProperty: 'Remark',
							propertyTitle: 'project.main.remarkContainerTitle'
						}]
					}
				}
			};

			function handleCreateBbContactSucceeded(entity) {
				let valSrv = $injector.get('projectPrj2BPContactValidationService');
				let value;

				valSrv.validateContactFk(entity, value, 'ContactFk');
			}

			var container = platformDataServiceFactory.createNewComplete(bpServiceInfo);

			container.service.takeOver = function takeOver(entity) {
				let data = container.data;
				let dataEntity = data.getItemById(entity.Id, data);

				data.mergeItemAfterSuccessfullUpdate(dataEntity, entity, true, data);
				data.markItemAsModified(dataEntity, data);
			};


			container.service.canCreate = function canCreate() {
				const selectedItem = projectPrj2BPService.getSelected();

				return !_.isNil(selectedItem) && selectedItem.Id !== 0;
			};


			return container.service;

		}]);
})(angular);
