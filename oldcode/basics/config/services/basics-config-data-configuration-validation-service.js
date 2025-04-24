(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigDataConfigurationValidationService
	 * @description provides validation methods for wizard group entities
	 */
	angular.module(moduleName).service('basicsConfigDataConfigurationValidationService', BasicsConfigDataConfigurationValidationService);

	BasicsConfigDataConfigurationValidationService.$inject = ['$q', '$http', 'globals', 'platformRuntimeDataService', 'basicsConfigDataConfigurationDialogDataService',
		'basicsConfigConfigurableTableDataService', 'basicsConfigModuleTableInformationDataService', 'basicsConfigMainService'];

	function BasicsConfigDataConfigurationValidationService($q, $http, globals, platformRuntimeDataService, basicsConfigDataConfigurationDialogDataService,
		basicsConfigConfigurableTableDataService, basicsConfigModuleTableInformationDataService, basicsConfigMainService) {
		this.validateTableName = function(entity, value) {
			var tableSpec = basicsConfigConfigurableTableDataService.getForTable(value);

			if(tableSpec) {
				platformRuntimeDataService.readonly(entity, [{field: 'IsAddMandatoryActive', readonly: !tableSpec.CanMandatoryFieldsBeActived || entity.Version === 0}]);
				platformRuntimeDataService.readonly(entity, [{field: 'IsAddReadOnlyActive', readonly: !tableSpec.CanReadonlyFieldsBeActived || entity.Version === 0}]);
				platformRuntimeDataService.readonly(entity, [{field: 'IsNewWizardActive', readonly: !tableSpec.CanNewWizardBeActived || entity.Version === 0}]);
			} else {
				platformRuntimeDataService.readonly(entity, [{field: 'IsAddMandatoryActive', readonly: true}]);
				platformRuntimeDataService.readonly(entity, [{field: 'IsAddReadOnlyActive', readonly: true}]);
				platformRuntimeDataService.readonly(entity, [{field: 'IsNewWizardActive', readonly: true}]);
			}

			entity.IsNewWizardActive = false;
			entity.IsAddMandatoryActive = false;
			entity.IsAddReadOnlyActive = false;

			platformRuntimeDataService.readonly(entity, [{field: 'ShowInWizard', readonly: true}]);
			platformRuntimeDataService.readonly(entity, [{field: 'MandatoryColumnName', readonly: true}]);
			platformRuntimeDataService.readonly(entity, [{field: 'ReadOnlyColumnName', readonly: true}]);

			return true;
		};

		this.validateColumnName = function validateColumnName(entity/* , value, model */) {
			basicsConfigDataConfigurationDialogDataService.markItemAsModified(entity);

			return true;
		};

		this.validateSorting = function validateSorting(entity/* , value, model */) {
			basicsConfigDataConfigurationDialogDataService.markItemAsModified(entity);

			return true;
		};

		this.asyncValidateIsNewWizardActive = function asyncValidateIsNewWizardActive(entity, value) {
			if(value === false){
				var defer = $q.defer();
				platformRuntimeDataService.readonly(entity, [{field: 'CanNewWizardBeActived', readonly: !value}]);
				entity.StringWizardModuleTableNames = '';
				defer.resolve(true);
				return  defer.promise;
			} else {
				let internalName = basicsConfigMainService.getSelected().InternalName;
				return $http.get(globals.webApiBaseUrl + 'basics/config/entitycreation/columnsinfo?module=' + internalName + '&table=' + entity.TableName + '&moduleTableId=' + entity.Id)
					.then(function (response) {
						entity.StringWizardModuleTableNames = response.data.StringWizardModuleTableNames;
						basicsConfigModuleTableInformationDataService.markItemAsModified(entity);
						basicsConfigModuleTableInformationDataService.gridRefresh();
					});
			}
		};

		this.asyncValidateIsAddMandatoryActive = function asyncValidateIsAddMandatoryActive(entity, value) {
			if(value === false){
				var defer = $q.defer();
				platformRuntimeDataService.readonly(entity, [{field: 'CanMandatoryFieldsBeActived', readonly: !value}]);
				entity.StringMandatoryModuleTableNames = '';
				defer.resolve(true);
				return  defer.promise;
			} else {
				let internalName = basicsConfigMainService.getSelected().InternalName;
				return $http.get(globals.webApiBaseUrl + 'basics/config/entitycreation/columnsinfo?module=' + internalName + '&table=' + entity.TableName + '&moduleTableId=' + entity.Id)
					.then(function (response) {
						entity.StringMandatoryModuleTableNames = response.data.StringMandatoryModuleTableNames;
						basicsConfigModuleTableInformationDataService.markItemAsModified(entity);
						basicsConfigModuleTableInformationDataService.gridRefresh();
					});
			}
		};

		this.asyncValidateIsAddReadOnlyActive = function asyncValidateIsAddReadOnlyActive(entity, value) {
			if(value === false){
				var defer = $q.defer();
				platformRuntimeDataService.readonly(entity, [{field: 'CanReadonlyFieldsBeActived', readonly: !value}]);
				entity.StringReadOnlyModuleTableNames = '';
				defer.resolve(true);
				return  defer.promise;
			} else {
				let internalName = basicsConfigMainService.getSelected().InternalName;
				return $http.get(globals.webApiBaseUrl + 'basics/config/entitycreation/columnsinfo?module=' + internalName + '&table=' + entity.TableName + '&moduleTableId=' + entity.Id)
					.then(function (response) {
						entity.StringReadOnlyModuleTableNames = response.data.StringReadOnlyModuleTableNames;
						basicsConfigModuleTableInformationDataService.markItemAsModified(entity);
						basicsConfigModuleTableInformationDataService.gridRefresh();
					});
			}
		};
	}
})(angular);