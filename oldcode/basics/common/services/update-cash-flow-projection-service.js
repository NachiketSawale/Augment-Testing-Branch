(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonUpdateCashFlowProjectionService', [
		'platformModalService', '$q', '$http', '$translate', 'cloudDesktopSidebarService', 'platformTranslateService',
		'platformSidebarWizardCommonTasksService', 'basicsLookupdataLookupDescriptorService', 'moment', 'globals', '$', '_',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (
			platformModalService, $q, $http, $translate, cloudDesktopSidebarService, platformTranslateService,
			platformSidebarWizardCommonTasksService, basicsLookupdataLookupDescriptorService, moment, globals, $, _) {
			platformTranslateService.registerModule('basics.common');

			let isLinear = false;

			function showDialog(options) {
				const initValue = {
					showOkButton: true,
					showCancelButton: true,
					defaultButton: 'ok',
					iconClass: 'ico-info',
					headerTextKey: 'basics.common.updateCashFlowProjection.headerText',
					templateUrl: globals.appBaseUrl + 'basics.common/partials/update-cash-flow-projection-dialog.html',
					route: globals.webApiBaseUrl + 'basics/common/cashcalculate/calculate',
					defaultValue: options.defaultValue || {},
					totalsLookupDirective: options.totalsLookupDirective
				};
				$.extend(initValue, options.defaultValue);

				const defer = $q.defer();
				const defaultValueObject = options.defaultValue;
				if (defaultValueObject.CashProjectionFk) {
					const currentCashProjection = basicsLookupdataLookupDescriptorService.getItemByIdSync(defaultValueObject.CashProjectionFk, {lookupType: 'CashProjection'});
					$.extend(initValue, currentCashProjection);
					currentCashProjection.StartWork = moment.utc(currentCashProjection.StartWork);
					currentCashProjection.EndWork = moment.utc(currentCashProjection.EndWork);
					$.extend(options, currentCashProjection);
				}

				momentProcessor(initValue);

				platformModalService.showDialog(initValue).then(function (result) {
					if (result) {
						result.data.CashProjectionFk = result.data.CashProjectionFk || -1;

						const requestData = options;
						isLinear = result.data.OnlyLinearAdjustment;
						$.extend(requestData, result.data);
						momentProcessor(requestData);
						$http({method: 'post', url: initValue.route, data: requestData}).then(function (result) {
							if (result && result.data) {
								defer.resolve(result.data);
							}
						}, function (error) {
							console.log(error);
							defer.reject(error);
						});
					} else {
						defer.resolve(result);
					}
				});

				return defer.promise;
			}

			function momentProcessor(item) {
				item.StartWork = doProcess(item.StartWork);
				item.EndWork = doProcess(item.EndWork);
			}

			function doProcess(field) {
				if (_.isNull(field) || _.isUndefined(field)) {
					return null;
				}
				if (_.isString(field)) {
					return moment.utc(field);
				}
				if (moment.isMoment(field)) {
					return moment.utc(field.format('YYYY-MM-DDT00:00:00'));
				}
			}

			function isLinearAdjustment() {
				return isLinear;
			}

			function provideUpdateCashFlowProjectionInstance(config) {
				return {
					fn: function () {
						const MainService = config.mainService;
						let dataService = {};
						if (angular.isFunction(config.getDataService)) {
							dataService = config.getDataService();
							config.dataService = dataService;
						} else {
							dataService = config.dataService || config.mainService;
						}

						MainService.updateAndExecute(function () {
							const entity = dataService.getSelected();
							const title = config.title;
							if (platformSidebarWizardCommonTasksService.assertSelection(entity, title)) {
								const options = angular.copy(config);
								options.entity = entity;
								options.headerText = $translate.instant(title);
								showDialog(options).then(function (result) {
									$http({
										method: 'post',
										url: defaultValue.route,
										data: result.data
									}).then(function (response) {
										if (response && response.data) {
											if (angular.isFunction(config.handleSuccess)) {
												config.handleSuccess(result);
												return;
											}
											dataService.handleOk(result.data);
											// defer.resolve(result.data);
										}
									}, function (error) {
										const errorMessage = error.data ? error.data.ErrorMessage : null;
										platformModalService.showMsgBox(errorMessage || 'basics.common.updateCashFlowProjection.updateProjectionErrorMsg', 'basics.common.updateCashFlowProjection.updateFailedTitle', 'warning');
										// defer.reject(error);
									});
								});
							}
						});
					}
				};
			}

			return {
				provideUpdateCashFlowProjectionInstance: provideUpdateCashFlowProjectionInstance,
				showDialog: showDialog,
				isLinearAdjustment: isLinearAdjustment
			};
		}]);
})(angular);
