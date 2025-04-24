/**
 * Created by lvi on 12/23/2014.
 */
(function (angular) {
	'use strict';

	angular.module('qto.formula').factory('qtoFormulaValidationService',
		['_', 'platformDataValidationService', 'qtoFormulaDataService', '$translate','platformRuntimeDataService','qtoMainFormulaType','$injector',
			'platformPropertyChangedUtil',
			function (_, validationUtil, dataService, $translate,runtimeDataService,qtoMainFormulaType,$injector,
				platformPropertyChangedUtil) {

				let service = {};

				service.validateCode = function (entity, value) {
					let validateResult =validationUtil.isUnique(dataService.getList(), 'Code', value, entity.Id, false);
					if (!validateResult.valid) {
						validateResult.apply= true;
						validateResult.error = $translate.instant('procurement.contract.ConHeaderReferenceUniqueError');
					}
					validationUtil.finishValidation(validateResult, entity, value, 'Code', service, dataService);
					return validateResult;
				};

				service.applyValidationField = function (valueFiled,OperatorFieldvalue,field,entity) {
					let res ={apply: true, valid: true};
					if(valueFiled && entity.QtoFormulaTypeFk !== qtoMainFormulaType.Script){
						res = validationUtil.isMandatory(OperatorFieldvalue, field);
					}
					runtimeDataService.applyValidationResult(res, entity, field);
					validationUtil.finishAsyncValidation(res, entity, OperatorFieldvalue, field, null, service, dataService);
					return res;
				};

				service.validateValue1IsActive = function (entity, value) {
					if(!(entity.QtoFormulaTypeFk === qtoMainFormulaType.Script||entity.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
						runtimeDataService.readonly(entity, [{field: 'Operator1', readonly:!value}]);
						service.applyValidationField(value,entity.Operator1,'Operator1',entity);
					}
					return true;
				};
				service.validateValue2IsActive = function (entity, value) {
					if(!(entity.QtoFormulaTypeFk === qtoMainFormulaType.Script || entity.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
						runtimeDataService.readonly(entity, [{field: 'Operator2', readonly: !value}]);
						service.applyValidationField(value,entity.Operator2,'Operator2',entity);
					}
					return true;
				};
				service.validateValue3IsActive = function (entity, value) {
					if(!(entity.QtoFormulaTypeFk === qtoMainFormulaType.Script || entity.QtoFormulaTypeFk === qtoMainFormulaType.FreeInput)){
						runtimeDataService.readonly(entity, [{field: 'Operator3', readonly: !value}]);
						service.applyValidationField(value,entity.Operator3,'Operator3',entity);
					}
					return true;
				};
				service.validateValue4IsActive = function (entity, value) {
					if(!(entity.QtoFormulaTypeFk ===  qtoMainFormulaType.Script || entity.QtoFormulaTypeFk  ===  qtoMainFormulaType.FreeInput)){
						runtimeDataService.readonly(entity, [{field: 'Operator4', readonly: !value}]);
						service.applyValidationField(value, entity.Operator4, 'Operator4', entity);
					}
					return true;
				};
				service.validateValue5IsActive = function (entity, value) {
					if(!(entity.QtoFormulaTypeFk ===  qtoMainFormulaType.Script || entity.QtoFormulaTypeFk  ===  qtoMainFormulaType.FreeInput)){
						runtimeDataService.readonly(entity, [{field: 'Operator5', readonly: !value}]);
						service.applyValidationField(value,entity.Operator5,'Operator5',entity);
					}
					return true;
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

				service.validateQtoFormulaTypeFk = function (entity, value) {
					entity.QtoFormulaTypeFk = value;

					let qtoFormulaUomValidationService = $injector.get('qtoFormulaUomValidationService');
					let items = $injector.get('qtoFormulaUomDataService').getList();

					if(value ===  qtoMainFormulaType.FreeInput){
						// the operator1-opertaor5 can not edit
						runtimeDataService.readonly(entity, [{field: 'Operator1', readonly:true}]);
						service.applyValidationField(false,entity.Operator1,'Operator1',entity);

						runtimeDataService.readonly(entity, [{field: 'Operator2', readonly:true}]);
						service.applyValidationField(false,entity.Operator2,'Operator2',entity);

						runtimeDataService.readonly(entity, [{field: 'Operator3', readonly:true}]);
						service.applyValidationField(false,entity.Operator3,'Operator3',entity);


						runtimeDataService.readonly(entity, [{field: 'Operator4', readonly:true}]);
						service.applyValidationField(false,entity.Operator4,'Operator4',entity);

						runtimeDataService.readonly(entity, [{field: 'Operator5', readonly:true}]);
						service.applyValidationField(false,entity.Operator5,'Operator5',entity);

						// control qto formula uom container
						_.forEach(items, function (item) {
							runtimeDataService.readonly(item, [{field: 'Operator1', readonly:true}]);
							service.applyValidationField(false,item.Operator1,'Operator1',item);

							runtimeDataService.readonly(item, [{field: 'Operator2', readonly:true}]);
							service.applyValidationField(false,item.Operator2,'Operator2',item);

							runtimeDataService.readonly(entity, [{field: 'Operator3', readonly:true}]);
							service.applyValidationField(false,item.Operator3,'Operator3',item);

							runtimeDataService.readonly(entity, [{field: 'Operator4', readonly:true}]);
							service.applyValidationField(false,item.Operator4,'Operator4',item);

							runtimeDataService.readonly(entity, [{field: 'Operator5', readonly:true}]);
							service.applyValidationField(false,item.Operator5,'Operator5',item);
						});

					}else if(value === qtoMainFormulaType.Predefine){

						service.validateValue1IsActive(entity,entity.Value1IsActive);
						service.validateValue2IsActive(entity,entity.Value2IsActive);
						service.validateValue3IsActive(entity,entity.Value3IsActive);
						service.validateValue4IsActive(entity,entity.Value4IsActive);
						service.validateValue5IsActive(entity,entity.Value5IsActive);

						// control qto formula uom container
						_.forEach(items, function (item) {
							qtoFormulaUomValidationService.validateValue1IsActive(item,item.Value1IsActive);
							qtoFormulaUomValidationService.validateValue2IsActive(item,item.Value2IsActive);
							qtoFormulaUomValidationService.validateValue3IsActive(item,item.Value3IsActive);
							qtoFormulaUomValidationService.validateValue4IsActive(item,item.Value4IsActive);
							qtoFormulaUomValidationService.validateValue5IsActive(item,item.Value5IsActive);
						});
					}else if(value === qtoMainFormulaType.Script){

						service.applyValidationField(false,entity.Operator1,'Operator1',entity);
						service.applyValidationField(false,entity.Operator2,'Operator2',entity);
						service.applyValidationField(false,entity.Operator3,'Operator3',entity);
						service.applyValidationField(false,entity.Operator4,'Operator4',entity);
						service.applyValidationField(false,entity.Operator5,'Operator5',entity);

						// control qto formula uom container
						_.forEach(items, function (item) {
							service.applyValidationField(false,item.Operator1,'Operator1',item);
							service.applyValidationField(false,item.Operator2,'Operator2',item);
							service.applyValidationField(false,item.Operator3,'Operator3',item);
							service.applyValidationField(false,item.Operator4,'Operator4',item);
							service.applyValidationField(false,item.Operator5,'Operator5',item);
						});
					}

					dataService.changeSciptEditStatus.fire(null, entity);
				};

				service.validateIsDefault = function (entity, value, field) {
					platformPropertyChangedUtil.onlyOneIsTrue(dataService, entity, value, field);
					return {apply: value, valid: true};
				};

				return service;

			}]);
})(angular);