(function (angular) {
	'use strict';

	angular.module('qto.formula').factory('qtoFormulaUomValidationService', ['platformDataValidationService', 'qtoFormulaUomDataService','platformRuntimeDataService','qtoFormulaDataService','qtoMainFormulaType',
		function (validationUtil, dataService,runtimeDataService,qtoFormulaDataService,qtoMainFormulaType) {
			let service = {};

			service.validateUomFk = function (entity, value, model) {
				return validationUtil.isUnique(dataService.getList(), model, value, entity.Id, false);
			};

			service.validateQtoFormulaTypeFk = function (entity, value) {
				entity.QtoFormulaTypeFk = value;
				dataService.changeSciptEditStatus.fire(null, entity);
				return true;
			};

			service.validateValue1IsActive = function (entity, value) {
				let parent = qtoFormulaDataService.getSelected();
				if(!(parent.QtoFormulaTypeFk === qtoMainFormulaType.Script||parent.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
					runtimeDataService.readonly(entity, [{field: 'Operator1', readonly:!value}]);
					service.applyValidationField(value,entity.Operator1,'Operator1',entity);
				}
				return true;
			};

			service.validateValue2IsActive = function (entity, value) {
				let parent = qtoFormulaDataService.getSelected();
				if(!(parent.QtoFormulaTypeFk === qtoMainFormulaType.Script||parent.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
					runtimeDataService.readonly(entity, [{field: 'Operator2', readonly:!value}]);
					service.applyValidationField(value,entity.Operator2,'Operator2',entity);
				}
				return true;

			};

			service.validateValue3IsActive = function (entity, value) {
				let parent = qtoFormulaDataService.getSelected();
				if(!(parent.QtoFormulaTypeFk === qtoMainFormulaType.Script||parent.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
					runtimeDataService.readonly(entity, [{field: 'Operator3', readonly:!value}]);
					service.applyValidationField(value,entity.Operator3,'Operator3',entity);
				}
				return true;
			};

			service.validateValue4IsActive = function (entity, value) {
				let parent = qtoFormulaDataService.getSelected();
				if(!(parent.QtoFormulaTypeFk === qtoMainFormulaType.Script||parent.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
					runtimeDataService.readonly(entity, [{field: 'Operator4', readonly:!value}]);
					service.applyValidationField(value,entity.Operator4,'Operator4',entity);
				}
				return true;
			};

			service.validateValue5IsActive = function (entity, value) {
				let parent = qtoFormulaDataService.getSelected();
				if(!(parent.QtoFormulaTypeFk === qtoMainFormulaType.Script||parent.QtoFormulaTypeFk  === qtoMainFormulaType.FreeInput)){
					runtimeDataService.readonly(entity, [{field: 'Operator5', readonly:!value}]);
					service.applyValidationField(value,entity.Operator5,'Operator5',entity);
				}
				return true;
			};


			service.applyValidationField = function (valueFiled,OperatorFieldvalue,field,entity) {
				let parent = qtoFormulaDataService.getSelected();
				let res ={apply: true, valid: true};
				if(valueFiled && parent.QtoFormulaTypeFk !== qtoMainFormulaType.Script){
					res = validationUtil.isMandatory(OperatorFieldvalue, field);
				}
				runtimeDataService.applyValidationResult(res, entity, field);
				validationUtil.finishAsyncValidation(res, entity, OperatorFieldvalue, field, null, service, dataService);
				return res;
			};

			service.validateOperator1 = function (entity, value,field) {
				return service.applyValidationField(entity.Value1IsActive,value,field,entity);
			};

			service.validateOperator2 = function (entity, value,field) {
				return service.applyValidationField(entity.Value2IsActive,value,field,entity);
			};

			service.validateOperator3 = function (entity, value,field) {
				return service.applyValidationField(entity.Value3IsActive,value,field,entity);
			};

			service.validateOperator4 = function (entity, value,field) {
				return service.applyValidationField(entity.Value4IsActive,value,field,entity);
			};

			service.validateOperator5 = function (entity, value,field) {
				return service.applyValidationField(entity.Value5IsActive,value,field,entity);
			};

			return service;
		}]);
})(angular);