/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesCommonHeaderTextValidationService
	 * @require $http
	 * @description provides validation methods for a PrcHeaderText
	 */
	angular.module(moduleName).factory('salesCommonHeaderTextValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals', 'procurementCommonHelperService', 'salesCommonDataHelperService', 'PlatformMessenger',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals, procurementCommonHelperService, salesCommonDataHelperService, PlatformMessenger) {

				let status = {
					valid: 1,
					duplicate: 2,
					empty: 4
				};

				let fieldStatus = {};

				var service = {};

				service.onPrcTextTypeChanged = new PlatformMessenger();


				let isPrcrtextTypeFkAndTextModuleTypeFkUnique = procurementCommonHelperService.createIsPrcrtextTypeFkAndTextModuleTypeFkUniqueFunction(
					platformDataValidationService,
					'PrcTexttypeFk',
					'BasTextModuleTypeFk'
				);

				service.validatePrcTexttypeFkForSales = function validatePrcTexttypeFk(entity, value, model, doNotUpdateText, doNotUpdateFields, salesHeaderDataService, salesValidationService, salesHeaderTextDataService) {
					let result = platformDataValidationService.validateMandatory(entity, value, model, salesValidationService, salesHeaderDataService);

					let curStatus = getCurrentFieldStatus(entity.Id);
					curStatus.PrcTexttypeFk = result.valid ? status.valid : status.empty;
					if (!result.valid) {
						return result;
					}

					curStatus.PrcTexttypeFk = status.valid;
					result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(salesHeaderTextDataService.getList(), entity.Id, {
						PrcTexttypeFk: value,
						BasTextModuleTypeFk: entity.BasTextModuleTypeFk
					});

					if (result.valid) {
						entity.PrcTexttypeFk = value;
					}

					if (result.valid && !doNotUpdateFields) {
						$timeout(function () {
							let selectedSalesHeader = salesHeaderDataService.getSelected();
							var configFk = selectedSalesHeader.ConfigurationFk || -1;
							if (selectedSalesHeader) {
								$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/getdefaulttextmoduletypeid?configurationId=' + configFk + '&textTypeId=' + value + '&forHeader=true')
									.then(function (response) {
										let basTextModuleTypeFk = response && response.data ? response.data : null;
										service.onPrcTextTypeChanged.fire(entity, basTextModuleTypeFk);
										entity.BasTextModuleTypeFk = basTextModuleTypeFk;
										return true;
									})
									.then(function () {
										$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + configFk + '&textTypeId=' + value + '&forHeader=true')
											.then(function (response) {
												entity.TextFormatFk = response ? response.data : null;
												if (!doNotUpdateText) {
													salesCommonDataHelperService.updateByTextType(entity, true, salesHeaderDataService, salesHeaderTextDataService);
												}
												salesCommonDataHelperService.getTextModulesByTextModuleType(entity, salesHeaderDataService, salesHeaderTextDataService);
											});
									})
									.finally(function () {
										salesHeaderDataService.gridRefresh();
									});
							}
						});
					}

					curStatus.PrcTexttypeFk = result.valid ? status.valid : status.duplicate;
					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformRuntimeDataService.applyValidationResult(result, entity, 'BasTextModuleTypeFk');
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, salesValidationService, salesHeaderDataService);
					platformDataValidationService.finishValidation(angular.copy(result), entity, entity.BasTextModuleTypeFk, 'BasTextModuleTypeFk', salesValidationService, salesHeaderDataService);

					entity.keepOriginalContentString = false;
					entity.keepOriginalPlainText = false;

					return result;
				};

				service.validateTextModuleTypeFkForSales = function (entity, value, model, salesHeaderDataService, salesValidationService, salesHeaderTextDataService) {

					let curStatus = getCurrentFieldStatus(entity.Id);

					let result = isPrcrtextTypeFkAndTextModuleTypeFkUnique(salesHeaderTextDataService.getList(), entity.Id, {
						PrcTexttypeFk: entity.PrcTexttypeFk,
						BasTextModuleTypeFk: value
					});

					curStatus.BasTextModuleTypeFk = result.valid ? status.valid : status.duplicate;
					platformRuntimeDataService.applyValidationResult(result, entity, model);
					platformDataValidationService.finishValidation(angular.copy(result), entity, value, model, salesValidationService, salesHeaderDataService);

					if (curStatus.PrcTexttypeFk !== status.empty) {
						curStatus.PrcTexttypeFk = result.valid ? status.valid : status.duplicate;
						platformRuntimeDataService.applyValidationResult(result, entity, 'PrcTexttypeFk');
						platformDataValidationService.finishValidation(angular.copy(result), entity, entity.PrcTexttypeFk, 'PrcTexttypeFk', salesValidationService, salesHeaderDataService);
					}

					if (result.valid) {
						$timeout(function () {
							let selectedSalesHeader = salesHeaderDataService.getSelected();
							var configFk = selectedSalesHeader.ConfigurationFk || -1;
							if (selectedSalesHeader) {
								$http.get(globals.webApiBaseUrl + 'basics/procurementconfiguration/textmodule/gettextformatid?configurationId=' + configFk + '&textTypeId=' + entity.PrcTexttypeFk + '&forHeader=true')
									.then(function (response) {
										entity.TextFormatFk = response ? response.data : null;
										salesCommonDataHelperService.updateByTextType(entity, false, salesHeaderDataService, salesHeaderTextDataService);
									});

								salesCommonDataHelperService.getTextModulesByTextModuleType(entity, salesHeaderDataService, salesHeaderTextDataService);
							}
						});
					}
					return result;
				};

				function getCurrentFieldStatus(id) {
					if (!fieldStatus[id]) {
						fieldStatus[id] = {
							PrcTexttypeFk: status.valid,
							BasTextModuleTypeFk: status.valid
						};
					}
					return fieldStatus[id];
				}

				return service;
			}
		]);
})();
