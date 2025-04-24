/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationImportProfileDataService
	 * @description Manages model import profile entries.
	 */
	myModule.service('modelAdministrationImportProfileDataService', ModelAdministrationDataService);

	ModelAdministrationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'modelAdministrationDataService', '$translate', 'platformPermissionService'];

	function ModelAdministrationDataService(_, platformDataServiceFactory, platformRuntimeDataService,
		modelAdministrationDataService, $translate, platformPermissionService) {

		const self = this;
		let serviceContainer;
		const modelAdministrationServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'modelAdministrationImportProfileDataService',
				entityNameTranslationID: 'model.administration.modelImport.entityImportProfile',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/importprf/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						readData.filter = '';
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						addTransientValues(item);
						updateReadOnlyState(item);
					},
					revertProcessItem: removeTransientValues
				}],
				actions: {
					delete: true,
					create: 'flat',
					canDeleteCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						return selected && selected.Id > 0 && _.isInteger(selected.BasCompanyFk);
					}
				},
				presenter: {
					list: {
						handleCreateSucceeded: function (newData) {
							addTransientValues(newData);
							updateReadOnlyState(newData);

							return newData;
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'ModelImportProfiles',
						parentService: modelAdministrationDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(modelAdministrationServiceOption, self);
		serviceContainer.data.Initialised = true;

		function addTransientValues(item) {
			item.Scope = item.BasCompanyFk ? $translate.instant('model.administration.modelImport.company') : $translate.instant('model.administration.modelImport.global');
		}

		function removeTransientValues(item) {
			_.unset(item, 'Scope');
		}

		function updateReadOnlyState(item) {
			if (item.BasCompanyFk) {
				platformRuntimeDataService.readonly(item, false);
			} else {
				platformRuntimeDataService.readonly(item, !canModifyGlobal());
			}
		}

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});

		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
		});

		function canModifyGlobal() {
			return platformPermissionService.hasWrite('ca493532bf0447788dafcb79a482cc6e');
		}

		serviceContainer.service.canModifyGlobal = canModifyGlobal;
	}
})(angular);
