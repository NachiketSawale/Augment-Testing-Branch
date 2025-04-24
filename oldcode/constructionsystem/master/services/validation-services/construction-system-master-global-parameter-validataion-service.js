/**
 * Created by lvy on 4/13/2018.
 */
/* global $ */
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.master';
	/**
	 * @ngdoc service
	 * @name constructionSystemMasterGlobalParameterValidationService
	 * @description provides validation methods for constructionSystemMasterGlobalParameter
	 */
	angular.module(modulename).factory('constructionSystemMasterGlobalParameterValidationService',
		['constructionSystemMasterGlobalParameterDataService', 'platformDataValidationService',
			'constructionSystemMasterGlobalParameterReadOnlyProcessor', 'constructionSystemMasterValidationHelperService',
			'$timeout', 'parameterDataTypes', 'platformModalService', '$translate', 'basicsLookupdataLookupDescriptorService',
			/* jshint -W072 */
			function (dataService, platformDataValidationService, readOnlyProcessor, validationHelperService,
				$timeout, parameterDataTypes, platformModalService, $translate, basicsLookupdataLookupDescriptorService) {
				var service = {};

				service.validateCosParameterTypeFk = function (entity, value) {

					var parameterDescriptor = basicsLookupdataLookupDescriptorService.getData('CosMasterParameterType');
					var oldValue = entity.CosParameterTypeFk;
					entity.CosParameterTypeFk = value;
					var checkType = checkParameterType(value, oldValue);
					if(!entity.IsLookup){
						setDefaultValueByType(entity, checkType, value);
						return true;
					}

					var valuesData = dataService.parameterGetValueListComplete.fire();
					var values = $.extend(false, valuesData);
					var parameter =  dataService.getSelected();

					if (valuesData !== null && (value === parameterDataTypes.Boolean || value === parameterDataTypes.Date ||
						(value !== parameterDataTypes.Text && (oldValue === parameterDataTypes.Date)))) {

						var strContent = $translate.instant('constructionsystem.master.validationTypeAndValueContent', { value0: parameterDescriptor[oldValue].Description, value1: parameterDescriptor[value].Description });
						var strTitle =  $translate.instant('constructionsystem.master.validationTypeAndValueTitle');
						platformModalService.showYesNoDialog(strContent, strTitle, 'no').then(function (result) {

							if (result.yes) {

								readOnlyProcessor.processItem(entity);
								if(value === parameterDataTypes.Boolean){
									entity.DefaultValue = false;
									entity.IsLookup = false;

								}else {
									entity.DefaultValue = null;
								}

								if(entity.Id === dataService.getSelected().Id){

									if(value !== parameterDataTypes.Boolean){
										entity.IsLookup = false;
										entity.CosParameterTypeFk = oldValue;
										dataService.parameterValidateComplete.fire(entity);
										entity.IsLookup = true;
										entity.CosParameterTypeFk = value;
									}

								}else {
									dataService.setSelected(parameter).then(function() {
										dataService.deleteValuesComplete.fire(entity, values);
									});
								}

								dataService.gridRefresh();
								return true;
							}
							if(result.no){
								entity.CosParameterTypeFk = oldValue;
								dataService.gridRefresh();
							}
						}, function(){
							entity.CosParameterTypeFk = oldValue;
							dataService.gridRefresh();
						});
					}else {

						if(valuesData !== null){
							dataService.parameterValueValidateComplete.fire(checkType, value);
						}
						dataService.gridRefresh();
						readOnlyProcessor.processItem(entity);
						dataService.parameterValidateComplete.fire(entity);
						return true;
					}
				};

				function setDefaultValueByType(entity, checkType, value){
					if(checkType){
						if(entity.DefaultValue === undefined || isNaN(entity.DefaultValue) ||
							entity.DefaultValue === '' || entity.DefaultValue === null){
							entity.DefaultValue = 0;
						}
						var id = parseFloat(entity.DefaultValue).toFixed(value);
						id = isNaN(parseFloat(id)) ? 0 : parseFloat(id);
						entity.DefaultValue = id;
					}else if(value === parameterDataTypes.Boolean){
						entity.DefaultValue = false;
						entity.IsLookup = false;
					}else if(value === parameterDataTypes.Date){
						entity.DefaultValue = null;
					}

					readOnlyProcessor.processItem(entity);
					dataService.parameterValidateComplete.fire(entity);
					dataService.gridRefresh();
				}

				function checkParameterType(typeId, oldValue){

					return (oldValue > typeId &&(typeId === parameterDataTypes.Integer || typeId === parameterDataTypes.Decimal1 ||
					typeId === parameterDataTypes.Decimal2 || typeId === parameterDataTypes.Decimal3 ||
					typeId === parameterDataTypes.Decimal4 || typeId === parameterDataTypes.Decimal5 ||
					typeId === parameterDataTypes.Decimal6));
				}

				service.validateIsLookup = function (entity) {
					entity.DefaultValue = null;
					$timeout(function () {
						// make sure the islookup property get the right value
						dataService.parameterValidateComplete.fire();
					});

					return true;
				};

				service.validateDefaultValue = function (entity, value) {
					entity.DefaultValue = value;
					dataService.gridRefresh();

					return true;
				};

				service.validateVariableName = function validateVariableName(entity, value, model) {
					return validationHelperService.validateVariableName(entity, value, model, dataService);
				};

				return service;
			}
		]);
})(angular);

