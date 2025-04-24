(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterTestInputValidationService',
		['$translate',
			'_',
			'constructionSystemMasterTestDataService',
			'basicsLookupdataLookupDescriptorService',
			'constructionSystemMasterParameterTypeConverter',
			'constructionsystemMasterScriptDataService',
			'constructionsystemMasterScriptEvalService',
			'constructionSystemMasterParameterValidationHelperService',
			function (
				$translate,
				_,
				constructionSystemMasterTestDataService,
				basicsLookupdataLookupDescriptorService,
				parameterTypeConverter,
				constructionsystemMasterScriptDataService,
				constructionsystemMasterScriptEvalService,
				cosParameterValidationHelperService) {

				var service = {};

				angular.extend(service,
					{
						validateValue: validateValue,
						validateFormValue: validateFormValue,
						validateProjectFk: validateProjectFk,
						validateModelFk: validateModelFk,
						validateCosInsHeaderFk:validateCosInsHeaderFk,
						validateEstHeaderFk:validateEstHeaderFk,
						validatePsdScheduleFk:validatePsdScheduleFk
					});

				return service;

				function validateValue(entity, value, model) {
					validator({'entity': entity, 'value': value, 'model': model});
				}

				function validateFormValue(entity, value, model) {
					if(model) {
						var prop = model.slice(0, model.indexOf('.'));
						var parameter = entity[prop];
						if (parameter) {
							validator({'entity': parameter, 'value': value, 'model': 'Value'});
						}
					}
				}

				function validateProjectFk(entity) {
					var result = { apply: true, valid: true };

					entity.CosInsHeaderFk = null;
					entity.ModelFk = null;
					entity.EstHeaderFk=null;
					entity.PsdScheduleFk=null;
					constructionSystemMasterTestDataService.CosInsHeaderFkSelectionChanged.fire();
					constructionSystemMasterTestDataService.gridRefresh();

					return result;
				}

				function validateModelFk(entity, value) {
					var result = { apply: true, valid: true };
					entity.ModelFk = value;

					var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('modelProjectModelLookupDataService');
					if(!entity.ProjectFk && lookupDataCache){
						var modelProject = lookupDataCache[value];
						entity.ProjectFk = modelProject ? modelProject.ProjectFk : null;
					}
					constructionSystemMasterTestDataService.gridRefresh();

					return result;
				}

				function validateCosInsHeaderFk(entity, value) {
					var result = { apply: true, valid: true };
					entity.CosInsHeaderFk = value;

					var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('InstanceHeader');
					if(!entity.ProjectFk &&lookupDataCache){
						var cosInsHeaderProject = lookupDataCache[value];
						entity.ProjectFk = cosInsHeaderProject ? cosInsHeaderProject.ProjectFk : null;
						entity.ModelFk = cosInsHeaderProject ? cosInsHeaderProject.ModelFk : null;
						entity.EstHeaderFk = cosInsHeaderProject ? cosInsHeaderProject.EstHeaderFk : null;
						entity.PsdScheduleFk = cosInsHeaderProject ? cosInsHeaderProject.PsdScheduleFk : null;
						entity.BoqHeaderFk = cosInsHeaderProject ? cosInsHeaderProject.BoqHeaderFk : null;
					}
					if(entity.ProjectFk&&lookupDataCache){
						var cosInsHeaderProject1 = lookupDataCache[value];
						entity.ModelFk = cosInsHeaderProject1 ? cosInsHeaderProject1.ModelFk : null;
						entity.EstHeaderFk = cosInsHeaderProject1 ? cosInsHeaderProject1.EstHeaderFk : null;
						entity.PsdScheduleFk = cosInsHeaderProject1 ? cosInsHeaderProject1.PsdScheduleFk : null;
						entity.BoqHeaderFk = cosInsHeaderProject1 ? cosInsHeaderProject1.BoqHeaderFk : null;
					}
					constructionSystemMasterTestDataService.CosInsHeaderFkSelectionChanged.fire();
					constructionSystemMasterTestDataService.gridRefresh();

					return result;
				}


				function validateEstHeaderFk(entity, value ){
					var result = { apply: true, valid: true };

					var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('estimateMainHeaderLookupDataService');

					if (lookupDataCache) {
						for (var item in lookupDataCache) {
							if (Object.prototype.hasOwnProperty.call(lookupDataCache,item) && item === value.toString()) {
								entity.ProjectFk = lookupDataCache[item].ProjectFk;
								entity.ModelFk=lookupDataCache[item].ModelFk;
								break;
							}
						}
					}
					constructionSystemMasterTestDataService.gridRefresh();

					return result;
				}

				function validatePsdScheduleFk(entity, value) {
					var result = { apply: true, valid: true };

					var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('schedulingLookupScheduleDataService');

					if (lookupDataCache) {
						for (var item in lookupDataCache) {
							if (Object.prototype.hasOwnProperty.call(lookupDataCache,item) && item === value.toString()) {
								entity.ProjectFk = lookupDataCache[item].ProjectFk;
								entity.ModelFk=lookupDataCache[item].ModelFk;
								break;
							}
						}
					}
					constructionSystemMasterTestDataService.gridRefresh();

					return result;
				}

				function validator(e) {
					var parameters = constructionSystemMasterTestDataService.getParameterList();
					if(e && e.entity) {
						if(e.entity.IsLookup) {
							var lookupDataCache = basicsLookupdataLookupDescriptorService.getData('ParameterValue');
							var temp = (lookupDataCache && lookupDataCache[e.value]) ? lookupDataCache[e.value].ParameterValue : '';
							e.entity.InputValue = parameterTypeConverter.convertValue(e.entity.CosParameterTypeFk, temp);
						} else {
							e.entity.InputValue = e.value;
						}
					}
					var scriptData = {
						ParameterList: parameters,
						ValidateScriptData: constructionsystemMasterScriptDataService.currentItem.ValidateScriptData || ''
					};
					constructionsystemMasterScriptEvalService.validate(scriptData).then(function (response) {
						if (response && response.length > 0) {
							cosParameterValidationHelperService.handleValidatorInfo(response, parameters, 'Value');
						}
					});
				}

			}]);
})(angular);