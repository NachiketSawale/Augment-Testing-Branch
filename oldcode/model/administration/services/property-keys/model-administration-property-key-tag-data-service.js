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
	 * @name modelAdministrationPropertyKeyTagDataService
	 * @description pprovides methods to access, create and update model administration property key tag entities
	 */
	myModule.service('modelAdministrationPropertyKeyTagDataService', ModelAdministrationDataService);

	ModelAdministrationDataService.$inject = ['_', '$http', '$translate', 'platformDataServiceFactory',
		'modelAdministrationPropertyKeyTagCategoryDataService'];

	function ModelAdministrationDataService(_, $http, $translate, platformDataServiceFactory,
		modelAdministrationPropertyKeyTagCategoryDataService) {

		const self = this;
		const modelAdministrationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationPropertyKeyTagDataService',
				entityNameTranslationID: 'model.administration.propertyKeys.entityPropertyKeyTag',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/propkeytag/',
					endRead: 'list',
					initReadData: function initReadData(readData) {
						const selectedCategory = modelAdministrationPropertyKeyTagCategoryDataService.getSelected();
						readData.filter = '?categoryId=' + (selectedCategory ? selectedCategory.Id : 0);
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: function () {
						const selectedCategory = modelAdministrationPropertyKeyTagCategoryDataService.getSelected();
						return selectedCategory && selectedCategory.Id > 0;
					}
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelAdministrationPropertyKeyTagCategoryDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PropertyKeyTags',
						parentService: modelAdministrationPropertyKeyTagCategoryDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(modelAdministrationServiceOption, self);
		serviceContainer.data.Initialised = true;

		const emptyCategorySelectedOverlayTargets = [];

		serviceContainer.service.addEmptyCategorySelectedOverlay = function (uiAddOnManager) {
			emptyCategorySelectedOverlayTargets.push(uiAddOnManager);
			updateEmptyCategorySelectedOverlay(uiAddOnManager, shouldDisplayEmptyCategorySelectedWarning());
		};

		serviceContainer.service.removeEmptyCategorySelectedOverlay = function (uiAddOnManager) {
			const idx = _.findIndex(emptyCategorySelectedOverlayTargets, uiAddOnManager);
			if (idx >= 0) {
				updateEmptyCategorySelectedOverlay(uiAddOnManager, false);
				emptyCategorySelectedOverlayTargets.splice(idx, 1);
			}
		};

		function shouldDisplayEmptyCategorySelectedWarning() {
			const selCategory = modelAdministrationPropertyKeyTagCategoryDataService.getSelected();
			return selCategory && selCategory.Id <= 0;
		}

		function updateEmptyCategorySelectedOverlay(uiAddOnManager, displayWarning) {
			if (displayWarning) {
				uiAddOnManager.getWhiteboard().showInfo($translate.instant('model.administration.propertyKeys.emptyCategory'));
			} else {
				uiAddOnManager.getWhiteboard().setVisible(false);
			}
		}

		modelAdministrationPropertyKeyTagCategoryDataService.registerSelectionChanged(function () {
			if (emptyCategorySelectedOverlayTargets.length > 0) {
				const displayWarning = shouldDisplayEmptyCategorySelectedWarning();
				emptyCategorySelectedOverlayTargets.forEach(function (target) {
					updateEmptyCategorySelectedOverlay(target, displayWarning);
				});
			}
		});

		serviceContainer.service.getDisplayTextForTagIds = function (tagIds) {
			return $http.get(globals.webApiBaseUrl + 'model/administration/propkeytag/displaynames', {
				params: {
					tagIds: _.isArray(tagIds) ? _.join(tagIds, ':') : ''
				}
			}).then(function (response) {
				return _.join(response.data, ', ');
			});
		};
	}
})(angular);
