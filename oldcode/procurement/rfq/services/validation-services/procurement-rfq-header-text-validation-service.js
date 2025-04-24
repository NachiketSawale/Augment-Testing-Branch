/**
 * Created by wui on 3/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.rfq';

	/**
     * @ngdoc service
     * @name procurementCommonHeaderTextValidationService
     * @require $http
     * @description provides validation methods for a HeaderText
     */
	angular.module(moduleName).factory('procurementRfqHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', 'procurementRfqHeaderTextService', 'PlatformMessenger', '$timeout', '$http', 'globals', '_',
			'procurementCommonHelperService',
			function (platformDataValidationService, platformRuntimeDataService, dataService, PlatformMessenger, $timeout, $http, globals, _,
				procurementCommonHelperService) {
				var service = {};
				let status = {
					valid: 1,
					duplicate: 2,
					empty: 4
				};

				let fieldStatus = {};

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
							changeHeaderText(entity);
							var prcConfigurationFk = dataService.getConfigurationFk();
							if (!_.isNil(prcConfigurationFk)&&!entity.IsReload) {
								$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/getdefaulttextmoduletypeid?configurationId=' + prcConfigurationFk + '&textTypeId=' + value + '&forHeader=true')
									.then(function (response) {
										entity.TextModuleTypeFk = response && response.data ? response.data : null;
										service.validatePrcTexttypeFk(entity, entity.PrcTexttypeFk, model, true, true);
										return true;
									})
									.then(function () {
										$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + prcConfigurationFk + '&textTypeId=' + value + '&forHeader=true')
											.then(function (response) {
												entity.TextFormatFk = response ? response.data : null;
												if (!doNotUpdateText) {
													dataService.updateByTextType(entity, true);
												}
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
					var result = service.validatePrcTexttypeFk(entity, entity.PrcTexttypeFk, 'PrcTexttypeFk', true);
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
							changeHeaderText(entity);
							var prcConfigurationFk = dataService.getConfigurationFk();
							if (!_.isNil(prcConfigurationFk)) {
								$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + prcConfigurationFk + '&textTypeId=' + entity.PrcTexttypeFk + '&forHeader=true')
									.then(function (response) {
										entity.TextFormatFk = response ? response.data : null;
										dataService.updateByTextType(entity, false);
									});
							}
							dataService.getTextModulesByTextModuleType(entity);
						});
					}
					return result;
				};

				function changeHeaderText(entity){
					var parentEntity=dataService.parentService().getSelected();
					var projectId=parentEntity.ProjectFk;
					var textmoduleId=entity.TextModuleTypeFk;
					if(projectId&&entity){
						if(entity.IsProject&&entity.PrcTexttypeFk!==10){
							entity.IsProject=false;
							dataService.markItemAsModified(entity);
						}
						else if(entity.PrcTexttypeFk===10) {
							$http.get(globals.webApiBaseUrl + 'project/main/headertext/list?projectId=' + projectId + '&sourceModule=project.main').then(function (response) {
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
				dataService.prcHeaderTextTypeHasChange = new PlatformMessenger();
				dataService.prcHeaderTextTypeChange = new PlatformMessenger();

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
			}
		]);
})(angular);