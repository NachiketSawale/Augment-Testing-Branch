
(function (angular) {

	'use strict';
	var moduleName = 'defect.main';
	var defectModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name defectCreationInitialDialogService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	defectModule.service('defectCreationInitialDialogService', defectCreationInitialDialogService);
	defectCreationInitialDialogService.$inject = ['globals','_','$injector', '$q', '$translate', 'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService', '$http','cloudDesktopPinningContextService','platformContextService','basicsClerkUtilitiesService','platformTranslateService'];
	function defectCreationInitialDialogService(globals,_,$injector, $q, $translate, basicsLookupdataLookupDescriptorService,
		platformRuntimeDataService, $http, cloudDesktopPinningContextService, platformContextService, basicsClerkUtilitiesService, platformTranslateService) {
		function requestDefaultForCheckList(createItem) {
			var projectId = createItem.dataItem.PrjProjectFk;
			let modelId = createItem.dataItem.ModelFk;
			return $http.post(globals.webApiBaseUrl + 'defect/main/header/create', {ProjectFk: projectId, ModelFk: modelId}).then(function callback(response) {
				var defaultPackage = response.data;
				var validationService = $injector.get('defectMainHeaderElementValidationService');

				validationService.validateRubricCategoryFk(createItem.dataItem, defaultPackage.RubricCategoryFk, 'RubricCategoryFk');
				if (defaultPackage.PrjProjectFk === 0 || defaultPackage.PrjProjectFk === null) {
					delete createItem.dataItem.PrjProjectFk;
				}
				if(defaultPackage.Defect2ChangeTypeFk === null || defaultPackage.Defect2ChangeTypeFk === 0 || _.isUndefined(defaultPackage.Defect2ChangeTypeFk)) {
					var changeTypeData = basicsLookupdataLookupDescriptorService.getData('basics.customize.defect2projectchangetype');
					var changeType = _.find(changeTypeData, function (item) {
						return item.IsDefault === true;
					});
					if(changeType === null || angular.isUndefined(changeType)){
						changeType = _.first(changeTypeData);
					}
					createItem.dataItem.Defect2ChangeTypeFk = changeType ? changeType.Id : null;
				}
				else{
					createItem.dataItem.Defect2ChangeTypeFk = defaultPackage.Defect2ChangeTypeFk;
				}
				createItem.dataItem.Id = defaultPackage.Id;
				createItem.dataItem.DateIssued = defaultPackage.DateIssued;
				createItem.dataItem.DfmStatusFk = defaultPackage.DfmStatusFk;
				createItem.dataItem.IsEditableByStatus = defaultPackage.IsEditableByStatus;
				createItem.dataItem.DfmGroupFk = defaultPackage.DfmGroupFk;
				createItem.dataItem.BasWarrantyStatusFk = defaultPackage.BasWarrantyStatusFk;
				createItem.dataItem.BasDefectPriorityFk = defaultPackage.BasDefectPriorityFk;
				createItem.dataItem.BasDefectSeverityFk = defaultPackage.BasDefectSeverityFk;
				createItem.dataItem.DfmRaisedbyFk = defaultPackage.DfmRaisedbyFk;
				createItem.dataItem.Isexternal = defaultPackage.Isexternal;
				createItem.dataItem.BasCurrencyFk = defaultPackage.BasCurrencyFk;
				createItem.dataItem.MdlModelFk = defaultPackage.MdlModelFk;
				createItem.dataItem.RubricCategoryFk = defaultPackage.RubricCategoryFk;
				createItem.dataItem.BasDefectTypeFk = defaultPackage.BasDefectTypeFk;
			});
		}

		function requestLoginUserClient(modalCreateProjectConfig) {
			return basicsClerkUtilitiesService.getClientByUser().then(function (data) {
				modalCreateProjectConfig.dataItem.BasClerkFk = data.Id;
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
			let pinModelEntity = _.find(cloudDesktopPinningContextService.getContext(), {token: 'model.main'});
			dlgLayout.dataItem.PrjProjectFk = projectContext ? projectContext.id : null;
			dlgLayout.title = platformTranslateService.instant('defect.main.createDefect', undefined, true);
			if (!_.isNil(pinModelEntity)) {
				dlgLayout.dataItem.ModelFk = pinModelEntity.id;
			}
			var checkListService = $injector.get('defectMainHeaderDataService');
			checkListService.deselect();

			return requestCheckListCreationData(dlgLayout).then(function () {
				return dlgLayout;
			});
		};
	}

})(angular);
