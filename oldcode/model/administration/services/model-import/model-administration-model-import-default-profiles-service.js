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
	 * @name modelAdministrationModelImportDefaultProfilesService
	 * @function
	 *
	 * @description
	 * Contains client-side code for handling and configuring the default model import profiles for various cases.
	 */
	modelAdministrationModule.factory('modelAdministrationModelImportDefaultProfilesService',
		modelAdministrationModelImportDefaultProfilesService);

	modelAdministrationModelImportDefaultProfilesService.$inject = ['_', '$translate', '$q',
		'$http', 'platformModalFormConfigService', 'platformTranslateService', 'basicsLookupdataConfigGenerator',
		'platformDialogService'];

	function modelAdministrationModelImportDefaultProfilesService(_, $translate, $q,
		$http, platformModalFormConfigService, platformTranslateService, basicsLookupdataConfigGenerator,
		platformDialogService) {

		const service = {};

		function configureDefaults() {
			return $http.get(globals.webApiBaseUrl + 'model/administration/defimportprf/current').then(function (response) {
				const settingsObj = {};
				response.data.forEach(function (item, index) {
					settingsObj['prf' + index] = item.ImportProfileId;
				});

				const dlgConfig = {
					title: $translate.instant('model.administration.modelImport.defaultProfilesTitle'),
					dataItem: settingsObj,
					formConfiguration: {
						fid: 'model.administration.modelimport.defprf',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: _.map(response.data, function (item, index) {
							return basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
								dataServiceName: 'modelAdministrationModelImportProfileLookupDataService',
								showClearButton: true,
								enableCache: true
							}, {
								gid: 'default',
								rid: 'prf' + index,
								model: 'prf' + index,
								label: item.DisplayName
							});
						})
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						const newData = _.map(response.data, function (item, index) {
							return {
								Key: item.Key,
								ImportProfileId: settingsObj['prf' + index]
							};
						});

						return $http.post(globals.webApiBaseUrl + 'model/administration/defimportprf/savedefs', newData).then(function () {
							return platformDialogService.showMsgBox('model.administration.modelImport.defaultsChanged', 'cloud.desktop.infoDialogHeader', 'info');
						});
					} else {
						return $q.reject('User cancelled.');
					}
				});
			});
		}

		service.addToolBarButton = function (scope) {
			scope.addTools([{
				id: 'cfgDefModelImportPrf',
				caption: 'model.administration.modelImport.cfgDefaultProfiles',
				type: 'item',
				iconClass: 'tlb-icons ico-view-profile-set',
				fn: configureDefaults
			}]);
		};

		return service;
	}
})(angular);
