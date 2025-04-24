(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'procurement.common';

	angular.module(moduleName).factory('procurementCommonControllingUnitFactory',
		['$timeout', '$q', '$http', '$injector', '$translate', 'procurementCommonCodeHelperService', 'platformModalService',
			function ($timeout, $q, $http, $injector, $translate, codeHelperService, platformModalService) {
				var service = {};

				/**
				 * @ngdoc event
				 * @name getControllingUnit
				 * @methodOf procurement:procurementCommonControllingUnitFactory
				 * @description IsDefault == true && IsAccountingElement == true
				 * @param value {int} ControllingUnitFk
				 * @param oldFk {int} the old data about ControllingUnitFk
				 */
				service.getControllingUnit = function getControllingUnit(value, oldFk) {
					var loadval = $q.defer();
					codeHelperService.getIsAutoSelectCU().then(function (val) {
						if (val) {
							// set default controlling unit
							codeHelperService.getControllingUnits(value).then(function (controllingUnits) {
								if (controllingUnits) {
									var ctrlUnits = [];
									codeHelperService.getAllLevelUnits(controllingUnits, ctrlUnits);
									$http.get(globals.webApiBaseUrl + 'controlling/structure/lookup/controllingunitstatus')
										.then(function (response) {
											var controllingUnitStatuses = response.data;
											if (controllingUnitStatuses) {
												var filterByProjectId = _.filter(ctrlUnits, function (item) {
													var found = _.find(controllingUnitStatuses, {
														Id: item.ControllingunitstatusFk,
														IsOpen: true
													});
													return item.IsDefault && item.IsAccountingElement && found;
												});
												var sortedData = _.sortBy(filterByProjectId, function (n) {
													return n.Id;
												});

												var firstItem = sortedData[0];
												if (firstItem) {
													if (oldFk === firstItem.Id) {
														loadval.resolve('');
													} else {
														var question = $translate.instant('procurement.common.yesNoDialogQuestion', {
															code: firstItem.Code
														});
														if (!oldFk) {
															loadval.resolve(firstItem.Id);
														} else {
															platformModalService.showYesNoDialog(question, '', 'yes').then(function (result) {
																if (result.yes) {
																	loadval.resolve(firstItem.Id);
																} else {
																	loadval.resolve('');
																}
															});
														}
													}
												} else {
													loadval.resolve(null);
												}
											}
										});
								} else {
									loadval.resolve(null);
								}
							});
						} else {
							loadval.resolve('');
						}
					});
					return loadval.promise;
				};


				/**
				 * @ngdoc function
				 * @name checkIsAccountingElement
				 * @function
				 * @methodOf procurement:procurementCommonControllingUnitFactory
				 * @description check the controllingUnit record's Isaccountingelement is not false
				 * @param {*} dataItem controllingUnit defined data
				 * @param {*} dataService header data
				 */
				service.checkIsAccountingElement = function checkIsAccountingElement(dataItem, dataService) {
					return dataItem.Isaccountingelement !== false;
				};

				return service;

			}]);
})(angular);