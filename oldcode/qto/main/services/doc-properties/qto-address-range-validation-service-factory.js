
(function (angular) {
	/* global */
	
	'use strict';
	
	let moduleName = 'qto.main';
	
	angular.module(moduleName).factory('qtoAddressRangeValidationServiceFactory', ['_', '$q', '$http', '$translate', '$injector','basicsLookupdataLookupDescriptorService', 'platformDataValidationService', 'platformRuntimeDataService', 'qtoMainPropertiesDialogService',
		function (_,  $q, $http, $translate, $injector, lookupDescriptorService, platformDataValidationService, platformRuntimeDataService, qtoMainPropertiesDialogService) {
			
			let factoryService = {};
			
			factoryService.createQtoAddressRangeValidationService = function (dataService) {
				
				let service = {};


				service.checkNum = function checkNum(value){
					let result = {apply: true, valid: true};
					let str = value;
					if(!str || str === '') {return result;}
					str = str.trim();
					if(!str || str === '') {return result;}
					
					let reg = new RegExp('^\\s*\\d+(-\\d+)?(\\s*,\\s*\\d+(-\\d+)?)*\\s*$');
					if(!reg.test(str)){
						result.valid = false;
						result.error = $translate.instant('qto.main.inputError');
						return result;
					}
					return result;
				};
				
				service.checkChar = function checkChar(value){
					let result = {apply: true, valid: true};
					let str = value;
					if(!str || str === '') {return result;}
					str = str.trim();
					if(!str || str === '') {return result;}
					
					str = str.toUpperCase();
					let reg = new RegExp('^\\s*[A-Z](\\s*-\\s*[A-Z])?(\\s*,\\s*[A-Z](\\s*-\\s*[A-Z])?)*\\s*$');
					if(!reg.test(str)){
						result.valid = false;
						result.error = $translate.instant('qto.main.inputError');
						return result;
					}
					return result;
				};
				
				service.validateIndexArea  = function (entity, newValue, model){
					let result = service.checkNum(newValue);
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					result = platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
					
					entity.IndexArea = newValue;
					qtoMainPropertiesDialogService.validationOkBtn.fire();
					return result;
				};
				
				service.validateLineArea  = function (entity, newValue, model){
					let result = service.checkChar(newValue);
					newValue = newValue? newValue.toUpperCase():newValue;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					result = platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
					
					entity.LineArea = newValue;
					qtoMainPropertiesDialogService.validationOkBtn.fire();
					return result;
				};
				
				service.validateSheetArea  = function (entity, newValue, model){
					let result = service.checkNum(newValue);
					
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					result = platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
					
					entity.SheetArea = newValue;
					qtoMainPropertiesDialogService.validationOkBtn.fire();
					return result;
				};
				
				service.validateBasClerkRoleFk = function (entity, newValue, model) {
					let result = {apply: true, valid: true};
					let result2 ={apply: true, valid: true};
					if(newValue && entity.BasClerkFk){
						
						result = platformDataValidationService.isMandatory(newValue, model);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}else if(newValue && !entity.BasClerkFk){
						
						result2 = platformDataValidationService.isMandatory(entity.BasClerkFk, 'BasClerkFk');
						platformRuntimeDataService.applyValidationResult(result2, entity, 'BasClerkFk');
						platformDataValidationService.finishValidation(result2, entity, entity.BasClerkFk, 'BasClerkFk', service, dataService);
					}else if(!newValue && !entity.BasClerkFk){
						
						platformRuntimeDataService.applyValidationResult(result2, entity, 'BasClerkFk');
						platformDataValidationService.finishValidation(result2, entity, entity.BasClerkFk, 'BasClerkFk', service, dataService);
					}else {
						
						result = platformDataValidationService.isMandatory(newValue, model);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}
					
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					result = platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
					
					qtoMainPropertiesDialogService.validationOkBtn.fire();
					return result;
				};
				
				service.validateBasClerkFk = function (entity, newValue, model) {
					let result = {apply: true, valid: true};
					let result2 ={apply: true, valid: true};
					if(newValue && entity.BasClerkRoleFk){
						
						result = platformDataValidationService.isMandatory(newValue, model);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}else if(newValue && !entity.BasClerkRoleFk){
						
						result2 = platformDataValidationService.isMandatory(entity.BasClerkRoleFk, 'BasClerkRoleFk');
						platformRuntimeDataService.applyValidationResult(result2, entity, 'BasClerkRoleFk');
						platformDataValidationService.finishValidation(result2, entity, entity.BasClerkRoleFk, 'BasClerkRoleFk', service, dataService);
					}else if(!newValue && !entity.BasClerkRoleFk){
						
						platformRuntimeDataService.applyValidationResult(result2, entity, 'BasClerkRoleFk');
						platformDataValidationService.finishValidation(result2, entity, entity.BasClerkRoleFk, 'BasClerkRoleFk', service, dataService);
					}else {
						
						result = platformDataValidationService.isMandatory(newValue, model);
						platformRuntimeDataService.applyValidationResult(result, entity, model);
					}
					
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					result = platformDataValidationService.finishValidation(result, entity, newValue, model, service, dataService);
					
					qtoMainPropertiesDialogService.validationOkBtn.fire();
					return result;
				};
				
				return service;
			};
			
			return factoryService;
		}]);
})(angular);
