/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainModelStructureRepairWizardService
	 * @function
	 * @requires _, $translate, $http, platformListSelectionDialogService, modelViewerModelSelectionService,
	 *           platformSidebarWizardCommonTasksService
	 *
	 * @description Provides a wizard that is used for repairing some inherited properties in the object hierarchy of
	 *              the selected model.
	 */
	angular.module('model.main').factory('modelMainModelStructureRepairWizardService', ['_', '$translate', '$http',
		'platformListSelectionDialogService', 'modelViewerModelSelectionService',
		'platformSidebarWizardCommonTasksService',
		function (_, $translate, $http, platformListSelectionDialogService, modelViewerModelSelectionService,
		          platformSidebarWizardCommonTasksService) {
			var service = {};

			service.showDialog = function () {
				var selModelId = modelViewerModelSelectionService.getSelectedModelId();
				if (selModelId) {
					return $http.get(globals.webApiBaseUrl + 'model/main/modelstructurerepair/fixablemodelpropertykeys', {
						params: {
							modelId: selModelId
						}
					}).then(function (response) {
						function sortPropertyKeys(pks) {
							return _.orderBy(pks, function (item) {
								return item.name.toLowerCase();
							});
						}

						var dlgConfig = {
							dialogTitleKey: 'model.main.modelStructureRepair.title',
							availableTitleKey: 'model.main.modelStructureRepair.availablePropKeys',
							selectedTitleKey: 'model.main.modelStructureRepair.selectedPropKeys',
							allItems: sortPropertyKeys(_.map(response.data, function (pk) {
								return {
									id: pk.Id,
									name: pk.PropertyName
								};
							})),
							acceptSelection: function (selectedItems) {
								return !_.isEmpty(selectedItems);
							},
							sortItems: sortPropertyKeys
						};

						return platformListSelectionDialogService.showDialog(dlgConfig).then(function (result) {
							if (result.success && !_.isEmpty(result.value)) {
								return $http.post(globals.webApiBaseUrl + 'model/main/modelstructurerepair/sumpropsleaftoroot', {
									ModelId: selModelId,
									PropertyKeyIds: _.map(result.value, function (v) {
										return v.id;
									})
								}).then(function () {
									return platformSidebarWizardCommonTasksService.showSuccessfullyDoneMessage('model.main.modelStructureRepair.successTitle');
								});
							}
						});
					});
				} else {
					return platformSidebarWizardCommonTasksService.showErrorNoSelection('model.main.modelStructureRepair.errorTitle', $translate.instant('model.main.noModelSelected'));
				}
			};

			return service;
		}]);
})(angular);
