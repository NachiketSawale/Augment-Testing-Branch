/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyBlacklistHelperService
	 * @function
	 *
	 * @description
	 * Provides utility routines that support the property key comparison blacklist.
	 */
	angular.module(moduleName).factory('modelAdministrationPropertyKeyBlacklistHelperService',
		modelAdministrationPropertyKeyBlacklistHelperService);

	modelAdministrationPropertyKeyBlacklistHelperService.$inject = ['_', '$http',
		'modelAdministrationPropertyKeyTagSelectorDialogService', 'projectMainService',
		'platformDialogService'];

	function modelAdministrationPropertyKeyBlacklistHelperService(_, $http,
		modelAdministrationPropertyKeyTagSelectorDialogService, projectMainService,
		platformDialogService) {

		const service = {};

		service.addBlacklistByTagButton = function (scope, forProject, listUpdatedFunc) {
			scope.addTools([{
				id: 'addByTag',
				caption: 'model.administration.propertyKeys.addByTag',
				type: 'item',
				iconClass: 'control-icons ico-ctrl-label',
				fn: function () {
					return modelAdministrationPropertyKeyTagSelectorDialogService.showDialog({
						acceptEmptySelection: false
					}).then(function tagsSelected(result) {
						return $http.post(globals.webApiBaseUrl + 'model/administration/blacklist/addByTags', {
							PropertyKeyTagIds: result,
							ProjectId: forProject ? projectMainService.getSelected().Id : undefined
						});
					}).then(function requestSuccessful(response) {
						if (_.isFunction(listUpdatedFunc)) {
							listUpdatedFunc();
						}

						return platformDialogService.showDialog({
							bodyText$tr$: 'model.administration.propertyKeys.pksAddedToBlacklistSummary',
							bodyText$tr$param$: {
								count: response.data.NewEntriesCount
							},
							headerText$tr$: 'model.administration.propertyKeys.pksAddedToBlacklist',
							showOkButton: true,
							iconClass: 'info'
						});
					});
				},
				disabled: forProject ? function () {
					return !projectMainService.getSelected();
				} : false
			}]);
		};

		return service;
	}
})(angular);
