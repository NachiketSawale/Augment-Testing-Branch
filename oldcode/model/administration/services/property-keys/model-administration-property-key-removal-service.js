/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAdministrationModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyRemovalService
	 * @function
	 *
	 * @description
	 * Provides a UI an server communication for removing property keys.
	 */
	modelAdministrationModule.factory('modelAdministrationPropertyKeyRemovalService',
		modelAdministrationPropertyKeyRemovalService);

	modelAdministrationPropertyKeyRemovalService.$inject = ['_', '$q', '$http', '$translate',
		'platformDialogService', 'modelAdministrationPropertyKeyDataService'];

	function modelAdministrationPropertyKeyRemovalService(_, $q, $http, $translate,
		platformDialogService, modelAdministrationPropertyKeyDataService) {

		const service = {};

		service.patchRemoveButton = function (scope) {
			scope.addTools([{
				id: 'delete',
				type: 'item',
				iconClass: 'tlb-icons ico-rec-delete',
				fn: function () {
					const selPks = modelAdministrationPropertyKeyDataService.getSelectedEntities();
					return service.removePropertyKeys(_.map(selPks, function extractId(pk) {
						return pk.Id;
					}));
				},
				disabled: function () {
					return _.isEmpty(modelAdministrationPropertyKeyDataService.getSelectedEntities());
				}
			}]);

			function updateTools() {
				scope.tools.update();
			}

			modelAdministrationPropertyKeyDataService.registerSelectionChanged(updateTools);

			scope.$on('$destroy', function () {
				modelAdministrationPropertyKeyDataService.unregisterSelectionChanged(updateTools);
			});
		};

		service.removePropertyKeys = function (pkIds) {
			return $http.get(globals.webApiBaseUrl + 'model/administration/propertykey/checkdeletability', {
				params: {
					pkIds: _.join(pkIds, ':')
				}
			}).then(function (response) {
				const deletability = response.data;
				if (deletability.CanDelete) {
					return platformDialogService.showYesNoDialog(deletability.Message + '<br /><br />' + $translate.instant('model.administration.propertyKeys.confirmDeletion'),
						'model.administration.propertyKeys.deletionTitle', 'question').then(function (result) {
						if (result.yes) {
							return $http.post(globals.webApiBaseUrl + 'model/administration/propertykey/deletepk', {
								PropertyKeyIds: pkIds,
								DeleteFromModels: deletability.ConfirmDeleteAssignedPropertyValues,
								DeleteFromDataTrees: deletability.ConfirmDeleteDataTreeLevels
							}).then(function () {
								modelAdministrationPropertyKeyDataService.removePropertyKeys(pkIds);
							}, function (reason) {
								return $q.reject(reason);
							});
						}
					});
				} else {
					return platformDialogService.showMsgBox(response.data.Message, 'model.administration.propertyKeys.deletionTitle', 'error').then(function () {
						return $q.reject('Nothing was deleted.');
					});
				}
			}, function () {
				return $q.reject('Failed to retrieve deletability information.');
			});
		};

		return service;
	}
})(angular);
