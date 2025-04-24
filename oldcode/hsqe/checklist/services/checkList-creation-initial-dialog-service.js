
(function (angular) {
	/* global globals, _ */

	'use strict';
	var moduleName = 'hsqe.checklist';
	var checkListModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name hsqeCheckListCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	checkListModule.service('hsqeCheckListCreationInitialDialogService', hsqeCheckListCreationInitialDialogService);
	hsqeCheckListCreationInitialDialogService.$inject = ['$injector', '$q', '$translate', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService', '$http','cloudDesktopPinningContextService','platformContextService','basicsClerkUtilitiesService',
		'platformTranslateService'];
	function hsqeCheckListCreationInitialDialogService($injector, $q, $translate, basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService, $http, cloudDesktopPinningContextService, platformContextService, basicsClerkUtilitiesService,
		platformTranslateService) {

		function requestDefaultForCheckList(createItem) {
			var projectId = createItem.dataItem.PrjProjectFk;
			createItem.dataItem.Version = -1;
			return $http.post(globals.webApiBaseUrl + 'hsqe/checklist/header/createdto', {PrjProjectFk: projectId}).then(function callback(response) {
				var defaultPackage = response.data;
				var checkListValidation = $injector.get('hsqeCheckListDataReadonlyProcessor');
				if (checkListValidation.hasToGenerateCode(defaultPackage)) {
					createItem.dataItem.Code = $translate.instant('cloud.common.isGenerated');
					var row = _.find(createItem.formConfiguration.rows, {rid: 'code'});
					if (!_.isNil(row)) {
						row.readonly = true;
					}
				}
				if (defaultPackage.PrjProjectFk === 0 || defaultPackage.PrjProjectFk === null || _.isUndefined(defaultPackage.PrjProjectFk)) {
					delete createItem.dataItem.PrjProjectFk;
				}
				createItem.dataItem.Id = defaultPackage.Id;
				createItem.dataItem.HsqChlStatusFk = defaultPackage.HsqChlStatusFk;
				createItem.dataItem.HsqChkListTypeFk = defaultPackage.HsqChkListTypeFk;
				createItem.dataItem.BpdBusinesspartnerFk = defaultPackage.BpdBusinesspartnerFk; // Automatically assign the values to the BP, contact, and branch fields for portal user.
				createItem.dataItem.BpdContactFk = defaultPackage.BpdContactFk;
				createItem.dataItem.BpdSubsidiaryFk = defaultPackage.BpdSubsidiaryFk;
			});
		}

		function requestLoginUserClient(modalCreateProjectConfig) {
			return basicsClerkUtilitiesService.getClientByUser().then(function (data) {
				if (data.Id !== 0) {
					modalCreateProjectConfig.dataItem.BasClerkHsqFk = data.Id;
				} else { // If the 'data.Id' is equal to 0, there is no clerk associated with the current user id. (e.g. portal user)
					modalCreateProjectConfig.dataItem.BasClerkHsqFk = null;
				}
				return true;
			}, function () {
				return true;
			});
		}

		function requestCompany(modalCreateProjectConfig) {
			modalCreateProjectConfig.dataItem.BasCompanyFk = platformContextService.getContext().signedInClientId;
			return $q.when(true);
		}

		function requestCheckListCreationData(modalCreateProjectConfig) {
			return $q.all([
				requestDefaultForCheckList(modalCreateProjectConfig),
				requestLoginUserClient(modalCreateProjectConfig),
				requestCompany(modalCreateProjectConfig)
			]);
		}

		this.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout) {
			var projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
			dlgLayout.dataItem.PrjProjectFk = projectContext ? projectContext.id : null;
			dlgLayout.title = platformTranslateService.instant('hsqe.CheckList.createCheckList', undefined, true);
			var checkListService = $injector.get('hsqeCheckListDataService');
			checkListService.deselect();

			return requestCheckListCreationData(dlgLayout).then(function () {
				return dlgLayout;
			});
		};
	}

})(angular);
