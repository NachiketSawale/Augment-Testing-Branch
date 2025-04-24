/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('model.administration');

	const svcName = 'modelAdministrationModelImportPropertyProcessorDataService';

	/**
	 * @ngdoc service
	 * @name modelAdministrationModelImportPropertyProcessorDataService
	 * @description Manages model import property processor entries.
	 */
	myModule.service(svcName,
		ModelAdministrationModelImportPropertyProcessorDataService);

	ModelAdministrationModelImportPropertyProcessorDataService.$inject = ['_', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'modelAdministrationImportProfileDataService'];

	function ModelAdministrationModelImportPropertyProcessorDataService(_, platformDataServiceFactory, platformRuntimeDataService,
		modelAdministrationImportProfileDataService) {

		const self = this;
		let serviceContainer;
		const modelAdministrationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: svcName,
				entityNameTranslationID: 'model.administration.modelImport.entityImportPropertyProcessor',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/importpropprocessor/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selProfile = modelAdministrationImportProfileDataService.getSelected();
						readData.filter = '?profileId=' + (selProfile ? selProfile.Id : 0);
					}
				},
				dataProcessor: [{
					processItem: updateReadOnlyState
				}],
				actions: {
					delete: true,
					create: 'flat',
					canDeleteCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						const selProfile = modelAdministrationImportProfileDataService.getSelected();
						return Boolean(selected && selected.Id > 0 &&
							(selProfile.BasCompanyFk || modelAdministrationImportProfileDataService.canModifyGlobal()));
					},
					canCreateCallBackFunc: function () {
						const selProfile = modelAdministrationImportProfileDataService.getSelected();
						return Boolean(selProfile.BasCompanyFk || modelAdministrationImportProfileDataService.canModifyGlobal());
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selProfile = modelAdministrationImportProfileDataService.getSelected();
							creationData.PKey1 = selProfile ? selProfile.Id : null;
						},
						handleCreateSucceeded: function (newData) {
							if (serviceContainer.data.itemList && (serviceContainer.data.itemList.length > 0)) {
								newData.Sorting = _.max(_.map(serviceContainer.data.itemList, function (existingItem) {
									return existingItem.Sorting;
								})) + 1;
							} else {
								newData.Sorting = 1;
							}

							updateReadOnlyState(newData);

							return newData;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ImportPropertyProcessors',
						parentService: modelAdministrationImportProfileDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(modelAdministrationServiceOption, self);

		function updateReadOnlyState(item) {
			const selProfile = modelAdministrationImportProfileDataService.getSelected();
			if (selProfile.BasCompanyFk) {
				platformRuntimeDataService.readonly(item, false);
			} else {
				platformRuntimeDataService.readonly(item, !modelAdministrationImportProfileDataService.canModifyGlobal());
			}
		}
	}
})(angular);
