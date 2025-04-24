
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
	 * @name modelAdministrationDataFilterTreeTemplateDataService
	 * @description Provides methods to access, create and update tree template.
	 */
	myModule.factory('modelAdministrationDataFilterTreeTemplateDataService', modelAdministrationDataFilterTreeTemplateDataService);

	modelAdministrationDataFilterTreeTemplateDataService.$inject = ['_', 'platformDataServiceFactory',
		'projectMainService', 'modelAdministrationDataService', '$q', '$http', '$translate', 'platformModalService', '$injector', 'platformDataServiceProcessDatesBySchemeExtension'];

	function modelAdministrationDataFilterTreeTemplateDataService(_, platformDataServiceFactory,
		projectMainService, modelAdministrationDataService, $q, $http, $translate, platformModalService, $injector, platformDataServiceProcessDatesBySchemeExtension) {

		const serviceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'modelAdministrationDataFilterTreeTemplateDataService',
				entityNameTranslationID: 'model.administration.ModelFilterTreeTemplates',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/treetemplate/',
					endRead: 'list',
				},
				actions: {
					delete: true,
					create: 'flat'
				},

				entityRole: {
					node: {
						itemName: 'ModelFilterTreeTemplates',
						parentService: modelAdministrationDataService
					}
				},
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});
		serviceContainer.service.registerSelectionChanged(onSelectionChanged);

		function onSelectionChanged(e, entity) {
			if (!entity) {
				return;
			}
			modelAdministrationDataService.update();
		}
		function isValidForDeepCopy() {
			var selectedMainItem = serviceContainer.service.getSelected();
			if (!selectedMainItem || selectedMainItem.length === 0) {
				var message = $translate.instant('model.administration.filterTreeTemplate.deepCopyValidationMessage');
				showMessage(message);
				return false;
			}
			return true;
		}

		serviceContainer.service.copyPaste = function copyPaste() {
			if (!isValidForDeepCopy()) {
				return;
			}
			processYesNoDialog();
		};
		function processYesNoDialog() {
			return platformModalService.showYesNoDialog($translate.instant('model.administration.filterTreeTemplate.deepCopyBodyText'), $translate.instant('model.administration.filterTreeTemplate.deepCopyHeaderText'), 'yes').then(function (result) {
				if (result.yes) {
					if (!isValidForDeepCopy()) {
						return;
					}

					deepcopy();
				}
			});
		};
		function showMessage(message, headerText) {
			return platformModalService.showDialog({
				headerTextKey: headerText || 'Deep copy',
				bodyTextKey: $translate.instant(message),
				iconClass: 'ico-info'
			});
		}
		serviceContainer.service.showMessage = showMessage;
		function deepcopy() {
			var selectedMainItem = serviceContainer.service.getSelected();
			var requestParam = {
				TemplateId: selectedMainItem.Id
			};

			return $http.post(globals.webApiBaseUrl + 'model/administration/treetemplate/deepcopy', requestParam)
				.then(function (response) {
					if (response && response.status === 200) {
						var message = $translate.instant('model.administration.filterTreeTemplate.deepCopyResponseMessage');
						serviceContainer.service.load();
						return showMessage(message).then(() => response.data); // Return the promise chain
					} else {
						var errorMessage = $translate.instant('model.administration.filterTreeTemplate.deepCopyErrorMessage');
						return platformModalService.showErrorBox(errorMessage, 'cloud.common.errorMessage');
					}
				})
				.catch(function (error) {
					var errorMessage = $translate.instant('model.administration.filterTreeTemplate.deepCopyErrorMessage', { error: error });
					return platformModalService.showErrorBox(errorMessage, 'cloud.common.errorMessage');
				});


		}


		return serviceContainer.service;
	}
})(angular);


