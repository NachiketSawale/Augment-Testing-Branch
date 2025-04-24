(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a PrcHeaderText
	 */
	angular.module('procurement.common').factory('procurementCommonHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'procurementCommonHelperService',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, procurementCommonHelperService) {

				let serviceCache = {};
				let status = {
					valid: 1,
					duplicate: 2,
					empty: 4
				};

				let fieldStatus = {};

				return function (dataService) {

					let serviceName = null;
					if (dataService && dataService.getServiceName) {
						serviceName = dataService.getServiceName();
						if (serviceName && Object.prototype.hasOwnProperty.call(serviceCache,serviceName)) {
							return serviceCache[serviceName];
						}
					}

					let service = {};
					let isPrcrtextTypeFkAndTextModuleTypeFkUnique = procurementCommonHelperService.createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(
						platformDataValidationService,
						'PrcTexttypeFk',
						'TextModuleTypeFk'
					);
					// validators
					service.validatePrcTexttypeFk = function validatePrcTexttypeFk(entity, value, model, doNotUpdateText, doNotUpdateFields) {
						let result = platformDataValidationService.validateMandatory(entity, value, model, service, dataService);

						let curStatus = getCurrentFieldStatus(entity.Id);
						curStatus.PrcTexttypeFk = result.valid ? status.valid : status.empty;
						if (!result.valid) {
							return result;
						}

						curStatus.PrcTexttypeFk = status.valid;
						result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
							PrcTexttypeFk: value,
							TextModuleTypeFk: entity.TextModuleTypeFk
						});

						if (result.valid) {
							entity.PrcTexttypeFk = value;
						}

						if (result.valid && !doNotUpdateFields) {
							$timeout(function () {
								let prcHeader = dataService.getPrcHeader();
								if (prcHeader&&!entity.IsReload) {
									changeHeaderText(entity);
									let configurationId = dataService.getPrcConfigurationId();
									$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/getdefaulttextmoduletypeid?configurationId=' + configurationId + '&textTypeId=' + value + '&forHeader=true')
										.then(function (response) {
											entity.TextModuleTypeFk = response && response.data ? response.data : null;
											service.validatePrcTexttypeFk(entity, entity.PrcTexttypeFk, model, true, true);
											return true;
										})
										.then(function () {
											var textModuleTypeId=entity.TextModuleTypeFk!==null?entity.TextModuleTypeFk:-1;
											$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + configurationId + '&textTypeId=' + value + '&textModuleTypeId='+textModuleTypeId+'&forHeader=true')
												.then(function (response) {
													if(response&&response.data&&response.data>0) {
														entity.TextFormatFk = response.data;
													}
													else{
														entity.TextFormatFk =11;
													}
													//if (!doNotUpdateText) {
														dataService.updateByTextType(entity, true);
													//}
													dataService.getTextModulesByTextModuleType(entity);
												});
										})
										.finally(function () {
											dataService.gridRefresh();
										});
								}
								if(entity.IsReload){
									entity.IsReload=false;
								}
							});
						}

						curStatus.PrcTexttypeFk = result.valid ? status.valid : status.duplicate;
						curStatus.TextModuleTypeFk = result.valid ? status.valid : status.duplicate;
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformRuntimeDataService.applyValidationResult(result, entity, 'TextModuleTypeFk');
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);
						platformDataValidationService.finishValidation(angular.copy(result), entity, entity.TextModuleTypeFk, 'TextModuleTypeFk', service, dataService);

						entity.keepOriginalContentString = false;
						entity.keepOriginalPlainText = false;

						return result;
					};
					service.validateEntity = function (entity) {
						let result = service.validatePrcTexttypeFk(entity, entity.PrcTexttypeFk, 'PrcTexttypeFk', true);
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTexttypeFk');
						dataService.gridRefresh();
					};

					service.validateTextModuleTypeFk = function (entity, value, model) {

						let curStatus = getCurrentFieldStatus(entity.Id);

						let result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(dataService.getList(), entity.Id, {
							PrcTexttypeFk: entity.PrcTexttypeFk,
							TextModuleTypeFk: value
						});

						curStatus.TextModuleTypeFk = result.valid ? status.valid : status.duplicate;
						platformRuntimeDataService.applyValidationResult(result, entity, model);
						platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, service, dataService);

						if (curStatus.PrcTexttypeFk !== status.empty) {
							curStatus.PrcTexttypeFk = result.valid ? status.valid : status.duplicate;
							platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTexttypeFk');
							platformDataValidationService.finishValidation(angular.copy(result), entity, entity.PrcTexttypeFk, 'PrcTexttypeFk', service, dataService);
						}

						if (result.valid) {

							$timeout(function () {
								let prcHeader = dataService.getPrcHeader();
								if (prcHeader) {
									changeHeaderText(entity);
									if (!(entity.IsProject && entity.PrcTexttypeFk === 10)) {
										var textModuleTypeId = value !== null ? value : -1;
										let configurationId = dataService.getPrcConfigurationId();
										$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + configurationId + '&textTypeId=' + entity.PrcTexttypeFk + '&forHeader=true&textModuleTypeId=' + textModuleTypeId)
											.then(function (response) {
												if (response && response.data && response.data > 0) {
													entity.TextFormatFk = response.data;
												} else {
													entity.TextFormatFk = 11;
												}
												dataService.updateByTextType(entity, false);
											});
									}
									dataService.getTextModulesByTextModuleType(entity);
								}
							});
						}
						return result;
					};

					function changeHeaderText(entity){
						var parent=dataService.getParentEntity();
						var parentId=parent.ProjectFk;
						var textmoduleId=entity.TextModuleTypeFk;

						if(parentId&&entity){
							if(entity.IsProject&&entity.PrcTexttypeFk!==10){
								entity.IsProject=false;
								dataService.markItemAsModified(entity);
							}
							else if(entity.PrcTexttypeFk===10) {
								$http.get(globals.webApiBaseUrl + 'project/main/headertext/list?projectId=' + parentId + '&sourceModule=project.main').then(function (response) {
									var data = response.data;
									if (data && data.Main) {
										var hasSameModuleTypeText = _.find(data.Main, function (item) {
											return item.BasTextModuleTypeFk === textmoduleId;
										});
										if (hasSameModuleTypeText) {
											entity.IsProject = true;
											entity.TextFormatFk = hasSameModuleTypeText.TextFormatFk;
											entity.Content = hasSameModuleTypeText.Content;
											entity.ContentString = hasSameModuleTypeText.ContentString;
											entity.PlainText = hasSameModuleTypeText.PlainText;
											dataService.updateByTextType(entity, false);
										} else {
											entity.IsProject = false;
										}
										dataService.markItemAsModified(entity);
									}
								});
							}
						}
					}

					// noinspection JSUnusedLocalSymbols
					function onEntityCreated(e, item) {
						service.validateEntity(item);
					}

					dataService.registerEntityCreated(onEntityCreated);

					if (serviceName) {
						serviceCache[serviceName] = service;
					}

					return service;

					function getCurrentFieldStatus(id) {
						if (!fieldStatus[id]) {
							fieldStatus[id] = {
								PrcTexttypeFk: status.valid,
								TextModuleTypeFk: status.valid
							};
						}
						return fieldStatus[id];
					}
				};
			}
		]);
})(angular);
