/**
 * Created by pel on 2021/05/14
 */
/* jshint -W072 */ // many parameters because of dependency injection
(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'procurement.package';
	var packageMainModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name packageCreationInitialDialogService
     * @function
     *
     * @description
     * packageCreationInitialDialogService is the data service for all creation initial dialog related functionality.
     */
	/* jshint -W072 */ // many parameters because of dependency injection
	packageMainModule.service('packageCreationInitialDialogService', PackageCreationInitialDialogService);

	PackageCreationInitialDialogService.$inject = ['_','$q','procurementContextService', '$injector', 'basicsLookupdataLookupDescriptorService','platformRuntimeDataService',
		'$http', 'platformModuleStateService', 'platformDataValidationService'];

	function PackageCreationInitialDialogService(_,$q, procurementContextService,$injector,basicsLookupdataLookupDescriptorService,platformRuntimeDataService,$http, platformModuleStateService,platformDataValidationService) {

		function requestDefaultForPackage(createItem) {
			var validationService = $injector.get('procurementPackageValidationService');
			let packageService = $injector.get('procurementPackageDataService');
			var projectId = createItem.dataItem.ProjectFk;
			var urlStr = 'procurement/package/package/getdefaultvalues';
			if(projectId !== null && projectId !== undefined){
				urlStr = urlStr + '?projectFk=' + projectId;
			}
			return  $http.get(globals.webApiBaseUrl + urlStr).then(function callback(response){
				var defaultPackage = response.data.Package;
				_.extend(createItem.dataItem, defaultPackage);
				if(defaultPackage.ProjectFk === 0){
					delete createItem.dataItem.ProjectFk;
				}
				if(defaultPackage.CurrencyFk === 0){
					delete createItem.dataItem.CurrencyFk;
				}
				if(defaultPackage.TaxCodeFk === 0){
					delete createItem.dataItem.TaxCodeFk;
				}
				var result1 = validationService.validateDialogConfigurationFk(createItem.dataItem, createItem.dataItem.ConfigurationFk, 'ConfigurationFk');
				platformRuntimeDataService.applyValidationResult(result1, createItem.dataItem, 'ConfigurationFk');

				var assetMasterRow = _.find(createItem.formConfiguration.rows, {rid: 'assetmasterfk'});
				if(!_.isNil(assetMasterRow)) {
					var result2 = validationService.validateAssetMasterFk(createItem.dataItem, createItem.dataItem.AssetMasterFk, 'AssetMasterFk');
					platformRuntimeDataService.applyValidationResult(result2, createItem.dataItem, 'AssetMasterFk');
				}

				packageService.validateNewEntity(createItem.dataItem);
			});
		}

		function requestPackageCreationData(modalCreateProjectConfig) {
			return $q.all([
				requestDefaultForPackage(modalCreateProjectConfig)

			]);
		}

		this.adjustCreateConfiguration= function adjustCreateConfiguration(dlgLayout) {

			var validationService = $injector.get('procurementPackageValidationService');
			var packageService = $injector.get('procurementPackageDataService');
			var selectedPack = packageService.getSelected();
			packageService.deselect();
			dlgLayout.dataItem.ProjectFk = procurementContextService.loginProject;
			var row = _.find(dlgLayout.formConfiguration.rows, {rid: 'configurationfk'});
			if(!_.isNil(row)) {
				//row.readonly = false;
				row.validator = validationService.validateDialogConfigurationFk;
			}

			row = _.find(dlgLayout.formConfiguration.rows, {rid: 'structurefk'});
			if(!_.isNil(row)) {
				//row.readonly = false;
				row.validator = validationService.validateDialogStructureFk;
			}
			dlgLayout.handleCancel = function handleCancel() {
				if(!_.isNil(selectedPack)){
					packageService.setSelected(selectedPack);
				}
				if (platformDataValidationService.hasErrors(packageService)) {
					var modState = platformModuleStateService.state(packageService.getModule());
					modState.validation.issues = [];
				}
				return true;
			};

			return requestPackageCreationData(dlgLayout).then(function() {
				return dlgLayout;
			});
		};
	}
})(angular);
