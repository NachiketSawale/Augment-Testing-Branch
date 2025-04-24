(function (angular) {
	'use strict';
	let moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeStringColumnConfigurationValidationService', BasicsCustomizeStringColumnConfigurationValidationService);
	BasicsCustomizeStringColumnConfigurationValidationService.$inject = ['platformValidationServiceFactory', 'platformDataValidationService',
		'basicsCustomizeInstanceDataService', 'platformRuntimeDataService'];

	function BasicsCustomizeStringColumnConfigurationValidationService(platformValidationServiceFactory, platformDataValidationService,
		basicsCustomizeInstanceDataService, platformRuntimeDataService) {

		this.validateModuleName = function validateModuleName(entity, value) {
			if (!!value && value !== '') {
				platformRuntimeDataService.readonly(entity, [{field: 'TableName', readonly: false}]);
			} else {
				entity.TableName = null;
				entity.ColumnName = null;
				entity.ColumnSize = null;
				platformRuntimeDataService.readonly(entity, [{field: 'TableName', readonly: true}, {
					field: 'ColumnName',
					readonly: true
				}, {field: 'ColumnSize', readonly: true}]);
			}
			if (value === entity.ModuleName) {
				platformRuntimeDataService.readonly(entity, [{field: 'TableName', readonly: false}]);
			} else {
				entity.TableName = null;
				entity.ColumnName = null;
				entity.ColumnSize = null;
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnName', readonly: true}, {
					field: 'ColumnSize',
					readonly: true
				}]);
			}
			return true;
		};

		this.validateTableName = function validateTableName(entity, value) {
			if (!!value && value !== '') {
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnName', readonly: false}]);
			} else {
				entity.ColumnName = null;
				entity.ColumnSize = null;
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnName', readonly: true}, {
					field: 'ColumnSize',
					readonly: true
				}]);
			}
			if (value === entity.TableName) {
				platformRuntimeDataService.readonly(entity, [{field: 'TableName', readonly: false}]);
			} else {
				entity.ColumnName = null;
				entity.ColumnSize = null;
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnSize', readonly: true}]);
			}
			return true;
		};

		this.validateColumnName = function validateColumnName(entity, value, model) {
			let result = _.find(basicsCustomizeInstanceDataService.getList(),{ModuleName:entity.ModuleName, TableName:entity.TableName, ColumnName: value});
			if (result !== undefined) {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: false,
					error$tr$: 'basics.customize.errColumnAlreadyCreated'
				}, entity, value, model, self, basicsCustomizeInstanceDataService);
			}
			if (!!value && value !== '') {
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnSize', readonly: false}]);
			} else {
				entity.ColumnSize = null;
				platformRuntimeDataService.readonly(entity, [{field: 'ColumnSize', readonly: true}]);
			}
			if (value === entity.TableName) {
				platformRuntimeDataService.readonly(entity, [{field: 'TableName', readonly: false}]);
			} else {
				entity.ColumnSize = null;
			}
			return true;
		};

		this.validateColumnSize = function validateColumnSize(entity, value, model) {
			let self = this;
			if (!!entity && value > entity.MaxLength) {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: false,
					error$tr$: 'basics.customize.errMaxLength'
				}, entity, value, model, self, basicsCustomizeInstanceDataService);
			} else {
				return platformDataValidationService.finishValidation({
					apply: true,
					valid: true
				}, entity, value, model, self, basicsCustomizeInstanceDataService);
			}
		};

	}
})(angular);
