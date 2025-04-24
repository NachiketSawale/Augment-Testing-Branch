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
	 * @name modelAdministrationViewerSettingsDataService
	 * @description Provides methods to access, create and update viewer settings profiles.
	 */
	myModule.factory('modelAdministrationViewerSettingsDataService', modelAdministrationViewerSettingsDataService);

	modelAdministrationViewerSettingsDataService.$inject = ['_', '$translate', 'platformDataServiceFactory',
		'modelAdministrationDataService', 'platformRuntimeDataService',
		'modelAdministrationViewerSettingsRuntimeService'];

	function modelAdministrationViewerSettingsDataService(_, $translate, platformDataServiceFactory,
		modelAdministrationDataService, platformRuntimeDataService,
		modelAdministrationViewerSettingsRuntimeService) {

		let serviceContainer;

		const serviceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationViewerSettingsDataService',
				entityNameTranslationID: 'model.administration.viewersettings',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/viewersettings/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						readData.filter = '';
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							if (!_.isArray(readData)) {
								data.canEditGlobal = Boolean(readData.CanEditGlobal);
								data.canServerSideRender = Boolean(readData.CanDoServerSideRendering);
								readData = _.isArray(readData.Items) ? readData.Items : [];
							}

							if (_.isArray(readData)) {
								const activeProfileId = modelAdministrationViewerSettingsRuntimeService.getActiveProfileId();
								if (activeProfileId > 0) {
									readData.forEach(function (prf) {
										prf.Active = prf.Id === activeProfileId;
									});
								}
							}

							return data.handleReadSucceeded(readData ? readData : [], data);
						},
						initCreationData: function initCreationData(creationData, data, creationOptions) {
							creationData.Id = _.get(creationOptions, 'copyCreateFromProfileId') || 0;
						},
						handleCreateSucceeded: function (newData) {
							serviceContainer.data.canServerSideRender = newData.HasServerSideRenderingPermission;

							addTransientValues(newData);
							updateReadOnlyState(newData);
							return newData;
						}
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
						return selected && selected.Id > 1;
					}
				},
				entityRole: {
					leaf: {
						itemName: 'ModelAdministrationViewerSettings',
						parentService: modelAdministrationDataService
					}
				}

			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		function addTransientValues(item) {
			item.Scope = item.UserFk ? $translate.instant('model.administration.viewerSettings.personal') : $translate.instant('model.administration.viewerSettings.global');
		}

		function removeTransientValues(item) {
			if (_.get(item, 'BackgroundColor2.backgroundColor2') || _.isNumber(_.get(item, 'BackgroundColor2.backgroundColor2'))) {
				if (item.BackgroundColor2.backgroundColor2 === 0) {
					let color = 0;
					delete item.BackgroundColor2.backgroundColor2;
					item.BackgroundColor2 = color;
				} else {
					let color = item.BackgroundColor2.backgroundColor2;
					delete item.BackgroundColor2.backgroundColor2;
					item.BackgroundColor2 = color;
				}
			}
			_.unset(item, 'Scope');
			_.unset(item, 'Active');
			_.unset(item, 'HasServerSideRenderingPermission');
		}

		function updateReadOnlyState(item) {
			if (item.UserFk) {
				if (!serviceContainer.data.canServerSideRender) {
					platformRuntimeDataService.readonly(item, [{
						field: 'RenderingMode',
						readonly: true
					}]);
					item.RenderingMode = 'c';
				}
			} else {
				if (serviceContainer.data.canEditGlobal) {
					platformRuntimeDataService.readonly(item, [{
						field: 'DescriptionInfo',
						readonly: true
					}]);
				} else {
					platformRuntimeDataService.readonly(item, true);
				}
			}
		}

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});
		serviceContainer.service.load();

		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
		});

		serviceContainer.service.markSelectedAsDefault = function () {
			const selProfile = serviceContainer.service.getSelected();
			if (selProfile) {
				serviceContainer.service.markItemAsModified(selProfile.Id);
				selProfile.IsDefault = true;
				serviceContainer.data.itemList.forEach(function (prf) {
					const newIsDefault = prf === selProfile;
					if (prf.IsDefault !== newIsDefault) {
						prf.IsDefault = newIsDefault;
					}
				});
				serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);
			}
		};

		serviceContainer.service.markSelectedAsActive = function () {
			const selProfile = serviceContainer.service.getSelected();
			if (selProfile) {
				modelAdministrationViewerSettingsRuntimeService.markSettingsProfileAsActive(selProfile.Id);
				selProfile.Active = true;
				serviceContainer.data.itemList.forEach(function (prf) {
					const newActive = prf === selProfile;
					if (Boolean(prf.Active) !== newActive) {
						prf.Active = newActive;
					}
				});
				serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);
			}
		};

		return serviceContainer.service;
	}
})(angular);
