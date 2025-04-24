/**
 * Created by chi on 3/19/2015.
 */
(function (angular, $) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,jQuery */

	angular.module('businesspartner.main').factory('businessPartnerHelper',
		['_', '$q', '$http', '$timeout', '$translate', 'platformModuleNavigationService', 'cloudDesktopSidebarService',
			'platformDataValidationService', 'businessPartnerMainDiscardDuplicateDialogService', 'platformRuntimeDataService',
			'platformObjectHelper', 'globals', '$injector', 'platformModuleStateService',
			/* jshint -W072 */
			function (_, $q, $http, $timeout, $translate, platformModuleNavigationService, cloudDesktopSidebarService,
				platformDataValidationService, businessPartnerMainDiscardDuplicateDialogService, platformRuntimeDataService,
				platformObjectHelper, globals, $injector, platformModuleStateService) {
				var service = {};
				service.fillReadonlyModels = fillReadonlyModels;
				service.packValidation = packValidation;
				service.registerNavigation = registerNavigation;
				service.extendGrouping = extendGrouping;
				service.extendSpecialGrouping = extendSpecialGrouping;

				// it is only using in BusinessParnter and Subsidiary.
				service.asyncValidationDuplicate = asyncValidationDuplicate;
				service.asyncValidationColumnsUnique = asyncValidationColumnsUnique;
				service.asyncValidateVatNoOrTaxNo = asyncValidateVatNoOrTaxNo;
				service.asyncValidateEmail = asyncValidateEmail;
				service.getDefaultContactByByConditionKey = getDefaultContactByByConditionKey;
				var fields = {
					'SubsidiaryDescriptor.TelephoneNumber1Dto': 'TelephoneNumber1Dto',
					'SubsidiaryDescriptor.TelephoneNumber2Dto': 'TelephoneNumber2Dto',
					'SubsidiaryDescriptor.TelephoneNumberTelefaxDto': 'TelephoneNumberTelefaxDto',
					'SubsidiaryDescriptor.TelephoneNumberMobileDto': 'TelephoneNumberMobileDto',
					'TelephoneNumber1Dto': 'TelephoneNumber1Dto',
					'TelephoneNumber2Dto': 'TelephoneNumber2Dto',
					'TelephoneNumberTelefaxDto': 'TelephoneNumberTelefaxDto',
					'TelephoneNumberMobileDto': 'TelephoneNumberMobileDto'
				};

				return service;

				function fillReadonlyModels(configuration, dataService) {
					dataService.canReadonlyModels = dataService.canReadonlyModels || [];

					var add = function (columns, fieldFun) {
						angular.forEach(columns, function (column) {
							if (dataService.canReadonlyModels.indexOf(fieldFun(column)) === -1) {
								dataService.canReadonlyModels.push(fieldFun(column));
							}
						});
					};

					if (configuration && configuration.columns && angular.isArray(configuration.columns)) {
						add(configuration.columns, function (column) {
							return column.field;
						});
					}
					if (configuration && configuration.rows && angular.isArray(configuration.rows)) {
						add(configuration.rows, function (column) {
							return column.model;
						});
					}
					return dataService;
				}

				function packValidation(validationService, dataService) {
					var newValidation = {};
					angular.forEach(validationService, function (v, k) {
						if (/validate/.test(k) && angular.isFunction(v)) {
							newValidation[k] = function (currentItem, value, field) {
								var result = v(currentItem, value, field);
								if ((_.isBoolean(result) && result) || (result && result.valid)) {
									if (dataService.markCurrentItemAsModified) {
										dataService.markCurrentItemAsModified();
									}
									if (dataService.gridRefresh) {
										$timeout(dataService.gridRefresh);
									}
								}
								return result;
							};
						}
					});
					return newValidation;
				}

				function registerNavigation(httpReadRoute, navigation) {
					platformModuleNavigationService.registerNavigationEndpoint({
						moduleName: navigation.moduleName,
						navFunc: function (item, triggerField) {
							var data = navigation.getNavData ? navigation.getNavData(item, triggerField) : item;
							if (angular.isNumber(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys([data]);
							} else if (angular.isString(data) && triggerField === 'Ids' && item.FromGoToBtn && _.isString(item.Ids)) {
								const ids = item.Ids.split(',');
								cloudDesktopSidebarService.filterSearchFromPKeys(ids);
							}else if (angular.isString(data)) {
								cloudDesktopSidebarService.filterSearchFromPattern(data);
							} else if (angular.isArray(data)) {
								cloudDesktopSidebarService.filterSearchFromPKeys(data);
							} else {
								$http.post(httpReadRoute + (navigation.endRead || 'navigation'), data).then(function (response) {
									cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
								});
							}
						},
						hide: function (entity) {
							if (!entity) {
								return true;
							}

							if (entity.IsHideBpNavWhenNull) {
								return !entity.BusinessPartnerFk;
							}

							return false;
						}
					});
				}

				function extendGrouping(gridColumns) {
					angular.forEach(gridColumns, function (column) {
						var attrName = column.field;
						angular.extend(column, {
							grouping: {
								title: $translate.instant(column.name$tr$),
								getter: attrName,
								aggregators: [],
								aggregateCollapsed: true
							}
						});
					});

					return gridColumns;
				}

				function extendSpecialGrouping(groupings, gridColumns) {
					angular.forEach(groupings, function (grouping) {
						var column = _.find(gridColumns, {id: grouping.id});
						if (column) {
							$.extend(true, column, grouping);
						}
					});
					return gridColumns;
				}

				function asyncValidationDuplicate(entity, value, model, request, checkData, dataService, parentDataService, validationService, updateRelatedDataFunc) {
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, model, value, dataService);
					asyncMarker.myPromise = defer.promise;
					var validationResult = null;
					if (!value || value === '') {
						validationResult = {
							apply: true,
							valid: true
						};
						if (angular.isFunction(updateRelatedDataFunc)) {
							updateRelatedDataFunc.apply(null, [entity, value, model, angular.copy(validationResult)]);
						}
						defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(validationResult), entity, value, model, asyncMarker, validationService, dataService));
						$timeout(dataService.gridRefresh, 100, false);
						return defer.promise;
					}

					$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/' + request, checkData).then(function (response) {
						var list = response.data;
						if (!list || list.length === 0) {
							validationResult = {
								apply: true,
								valid: true
							};
							if (angular.isFunction(updateRelatedDataFunc)) {
								updateRelatedDataFunc.apply(null, [entity, value, model, angular.copy(validationResult)]);
							}
							defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(validationResult), entity, value, model, asyncMarker, validationService, dataService));
							$timeout(dataService.gridRefresh, 100, false);
							return;
						}

						var oldCurrentItem = parentDataService ? parentDataService.getSelected() : entity;

						showDiscardDuplicateBusinessPartnerDialog(defer, list, entity, value, model, dataService, parentDataService, validationService, updateRelatedDataFunc, asyncMarker, validationResult, oldCurrentItem);
					});
					return defer.promise;
				}

				// check the unique columns by configuration
				function asyncValidationColumnsUnique(entity, value, columnName, uniqueColumns, dataService) {
					var defer = $q.defer();
					var httpRoute = globals.webApiBaseUrl + 'businesspartner/main/businesspartner/validate';
					var result = {apply: true, valid: true};
					var postList = [];
					var messages = columnName;

					_.forEach(uniqueColumns, function (column) {
						var postData = {
							Id: entity.Id,
							Value: column === columnName ? value : entity[column],
							Model: column
						};
						if (column !== columnName) {
							messages += ' and ' + column;
						}
						postList.push(postData);
					});

					var errorMessages = $translate.instant('businesspartner.main.configUniqueMessage', {fieldName: messages});
					var checkMessages = $translate.instant('businesspartner.main.configUniqueMessage', {fieldName: ''});
					$http.post(httpRoute, postList).then(function (response) {
						// if have other error, return and not check the unique
						if (platformDataValidationService.hasErrors(dataService)) {
							var hasOtherError = false;
							_.forEach(uniqueColumns, function (column) {
								var hasError = !!platformRuntimeDataService.hasError(entity, column);
								if (hasError) {
									var error = platformRuntimeDataService.getErrorText(entity, column);
									if (!(_.includes(error, column) && _.includes(error, checkMessages))) {
										hasOtherError = true;
									}
								}
							});
							if (hasOtherError) {
								return defer.promise;
							}
						}
						if (!response.data) {
							result.valid = false;
							result.error = errorMessages;
						} else {
							result.valid = true;
						}
						_.forEach(uniqueColumns, function (column) {
							platformRuntimeDataService.applyValidationResult(result, entity, column);
							var copyResult = angular.copy(result);
							if (column !== columnName) {
								platformDataValidationService.finishValidation(copyResult, entity, entity[column], column, service, dataService);
							}
						});
						platformDataValidationService.finishValidation(result, entity, value, columnName, service, dataService);
						defer.resolve(result);
					});

					return defer.promise;
				}

				function showDiscardDuplicateBusinessPartnerDialog(defer, list, entity, value, model, dataService, parentDataService, validationService, updateRelatedDataFunc, asyncMarker, validationResult, oldCurrentItem, customOptions) {
					/* jshint -W074 */
					businessPartnerMainDiscardDuplicateDialogService.showDialog(list, model, oldCurrentItem, customOptions).then(function (result) {
						var executionType = businessPartnerMainDiscardDuplicateDialogService.executionType;
						switch (result.executionType) {
							case executionType.discardAndDisplay: {
								var displayEntities = result.displayEntities;
								discardDuplicateBusinessPartnerDialogDiscardAndDisplay(defer, entity, value, model, dataService, parentDataService, validationService, asyncMarker, validationResult, displayEntities);
								break;
							}
							case executionType.ignore: {
								discardDuplicateBusinessPartnerDialogIgnore(defer, entity, value, model, dataService, validationResult, updateRelatedDataFunc, asyncMarker, validationService);
								break;
							}
						}
					});
				}

				function discardDuplicateBusinessPartnerDialogDiscardAndDisplay(defer, entity, value, model, dataService, parentDataService, validationService, asyncMarker, validationResult, displayEntities) {
					validationResult = {
						apply: false,
						valid: true
					};

					var itemList = parentDataService ? parentDataService.getList() : dataService.getList();
					showDuplicateItem(itemList, displayEntities, dataService, parentDataService);

					// delete entity if version is 0 firstly. prevent saving it when switch to other rows before choosing discard.
					var hasToDelete = dataService && !dataService.getParentService && entity.Version === 0;
					var isMainService = dataService && !dataService.getParentService;
					if (hasToDelete) {
						defer.resolve(validationResult);
						var doPrepareUpdateCall = dataService.doPrepareUpdateCall;
						dataService.doPrepareUpdateCall = function (updateData) {
							if (typeof doPrepareUpdateCall === 'function') {
								doPrepareUpdateCall.call(dataService, updateData);
							}
							// prevent to save deleted item.
							var properties = Object.getOwnPropertyNames(updateData);
							var pLen = properties.length;
							for (var p = 0; p < pLen; p++) {
								delete updateData[properties[p]];
							}
							updateData.EntitiesCount = 0;
							dataService.deleteItem(entity);
							dataService.doPrepareUpdateCall = doPrepareUpdateCall;
						};
					} else {

						var oldValue = platformObjectHelper.getValue(entity, model);
						var selected = dataService.getSelected();
						$timeout(function () {
							// TODO chi: workaound for the 'apply' not working
							if (selected && selected.Id) {
								platformObjectHelper.setValue(selected, model, oldValue);
							}
							dataService.gridRefresh();
						});
						var modState = platformModuleStateService.state(dataService.getModule());
						var tempResult = _.filter(modState.validation.issues, function (err) {
							return err.entity.Id === entity.Id || err.model === model;
						});
						if (angular.isArray(tempResult) && tempResult.length > 0) {
							tempResult = tempResult[0];
						} else {
							tempResult = angular.copy(validationResult);
						}
						defer.resolve(platformDataValidationService.finishAsyncValidation(tempResult, entity, value, model, asyncMarker, validationService, dataService));
					}

					if (isMainService) {
						// setSelected to displayEntities[0].
						$timeout(function () {
							dataService.setSelected(displayEntities[0]);
						}, 100);
					}
				}

				function discardDuplicateBusinessPartnerDialogIgnore(defer, entity, value, model, dataService, validationResult, updateRelatedDataFunc, asyncMarker, validationService) {
					validationResult = {
						apply: true,
						valid: true
					};
					if (angular.isFunction(updateRelatedDataFunc)) {
						updateRelatedDataFunc.apply(null, [entity, value, model, angular.copy(validationResult)]);
					}
					// TODO chi: how about the workaround
					var selected = dataService.getSelected();
					$timeout(function () {
						// TODO chi: workaound for the 'apply' not working
						if (selected && selected.Id && !fields[model]) {
							platformObjectHelper.setValue(selected, model, value);
						}
						dataService.gridRefresh();
					}, 100, false);
					defer.resolve(platformDataValidationService.finishAsyncValidation(angular.copy(validationResult), entity, value, model, asyncMarker, validationService, dataService));
				}

				function showDuplicateItem(itemList, displayEntities, dataService, parentDataService) {
					if (!angular.isArray(displayEntities) || displayEntities.length === 0) {
						return;
					}

					_.forEach(displayEntities, function (displayEntity) {
						var find = _.find(itemList, {Id: displayEntity.Id});
						if (!find) {
							itemList.push(displayEntity);
						}
					});

					$timeout(function () {
						if (parentDataService) {
							parentDataService.gridRefresh();
						}
						dataService.gridRefresh();
					}, 100, false);
				}

				function asyncValidateVatNoOrTaxNo(entity, value, model, checkData, dataService, validationService, parentDataService, asyncMarker) {

					var defer = $q.defer();
					// asyncMarker.myPromise = defer.promise;
					var validationResult = {
						apply: true,
						valid: true
					};

					$http.post(globals.webApiBaseUrl + 'businesspartner/main/businesspartner/validatevatnoortaxno', checkData).then(function (response) {
						var result = response.data;
						if (result) {
							if (checkData.IsFromBp && result.checkRegex) {
								if (result.duplicateBPs && result.duplicateBPs.length > 0 && !checkData.IsEu) {
									var oldCurrentItem = parentDataService ? parentDataService.getSelected() : entity;
									validationResult.IsBpDuplicate = true;
									validationResult.duplicateBPs = result.duplicateBPs;
									// showDiscarDuplicateBusinessPartnerDialog will return defer.resolve.
									showDiscardDuplicateBusinessPartnerDialog(defer, result.duplicateBPs, entity, value, model, dataService, parentDataService, validationService, null, asyncMarker, validationResult, oldCurrentItem);
									return;
								}
							}
							if (!result.checkRegex) {
								var errorField;
								if (checkData.IsEu) {
									errorField = $translate.instant('businesspartner.main.vatNoEu');
								} else {
									errorField = checkData.IsVatNoField ? $translate.instant('businesspartner.main.vatNo') : $translate.instant('businesspartner.main.taxNo');
								}
								validationResult = {
									apply: true,
									valid: false,
									error: result.validExample ? $translate.instant('businesspartner.main.invalidTaxNoOrVatNoWithExample', {
										field: errorField,
										example: result.validExample
									}) : $translate.instant('businesspartner.main.invalidTaxNoOrVatNo', {field: errorField})
								};

							}
						}

						platformRuntimeDataService.applyValidationResult(validationResult, entity, model);
						// platformDataValidationService.finishValidation(validationResult, entity, value, model, service, dataService);
						// cleanUpAsyncMarker;
						platformDataValidationService.finishAsyncValidation(validationResult, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(validationResult);
						$timeout(dataService.gridRefresh, 0, false);
					});

					return defer.promise;
				}

				function asyncValidateEmail(entity, value, model, checkData, dataService, validationService, parentDataService, asyncMarker, checkMode) {
					var defer = $q.defer();
					// asyncMarker.myPromise = defer.promise;
					var validationResult = {
						apply: true,
						valid: true
					};
					checkData = checkData || {MainItemId: entity.Id, Value: value};
					checkData.PageSize = 100;
					checkData.PageIndex = 0;
					if(checkMode === 2){
						checkData.CheckMode = checkMode;
					}
					let url = 'businesspartner/main/businesspartner/getduplicatebpbyemail';
					$http.post(globals.webApiBaseUrl + url, checkData).then(function (response) {
						let duplicateResult = response.data;
						let bps = null;
						let page = {};
						if (duplicateResult) {
							if (duplicateResult.Items) {
								bps = duplicateResult.Items;
							}
							page.totalLength = duplicateResult.RecordsFound;
							page.currentLength = duplicateResult.RecordsRetrieved;
						}
						if (bps && bps.length > 0) {
							let customOptions = {
								showPage: true,
								url: url,
								checkData: checkData,
								page: page
							};
							showDiscardDuplicateBusinessPartnerDialog(defer, bps, entity, value, model, dataService, parentDataService, validationService, null, asyncMarker, validationResult, entity, customOptions);
							return;
						}
						// cleanUpAsyncMarker;
						platformDataValidationService.finishAsyncValidation(validationResult, entity, value, model, asyncMarker, service, dataService);
						defer.resolve(validationResult);
					});

					return defer.promise;
				}

				function getDefaultContactByByConditionKey(contactDtos, branchFk, conditionKey) {
					const sortedContacts = _.sortBy(contactDtos, 'Id');
					let contact = _.find(sortedContacts, contact => contact.ContactRoleEntity?.[conditionKey] && contact.SubsidiaryFk === branchFk);

					if (!contact) {
						contact = _.find(sortedContacts, contact => contact.SubsidiaryFk === branchFk);
					}
					if (!contact) {
						contact = _.find(sortedContacts, contact => contact.ContactRoleEntity?.[conditionKey]);
					}
					return contact;
				}
			}]
	);
})(angular, jQuery);