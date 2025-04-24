(function (angular) {
	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonMainService', [
		'_', 'globals', '$http', '$q', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService', 'ServiceDataProcessDatesExtension', 'basicsLookupdataLookupFilterService',
		'SchedulingDataProcessTimesExtension', 'procurementCommonDataEnhanceProcessor', 'cloudDesktopSidebarService', 'PlatformMessenger', 'procurementPriceComparisonCommonService',
		'commonBusinessPartnerEvaluationModificationKeeper',
		'cloudCommonGridService','platformModalService', '$injector', '$state', 'treeStateHelperService','procurementCommonOverrideHeaderInfoService',
		function (_, globals, $http, $q, platformDataServiceFactory, basicsLookupdataLookupDescriptorService, ServiceDataProcessDatesExtension, lookupFilterService,
			SchedulingDataProcessTimesExtension, procurementCommonDataEnhanceProcessor, cloudDesktopSidebarService, PlatformMessenger, commonService, modificationKeeper,
			cloudCommonGridService, platformModalService, $injector, $state, treeStateHelperService,procurementCommonOverrideHeaderInfoService) {

			let serviceContainer;
			let service;

			let sidebarSearchOptions = {
				moduleName: moduleName,  // required for filter initialization
				enhancedSearchEnabled: true,
				pattern: '',
				pageSize: 100,
				useCurrentClient: null,
				includeNonActiveItems: null,
				showOptions: true,
				includeChainedItems: true,
				showProjectContext: false, // TODO: rei remove it
				pinningOptions: {
					isActive: true, showPinningContext: [{token: 'project.main', show: true}],
					setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
				},
				withExecutionHints: true,
				enhancedSearchVersion: '2.0',
				includeDateSearch: true
			};
			let serviceOption = {
				hierarchicalRootItem: {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonMainService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/rfq/header/', // reuse rfq web api
						endRead: 'listrfq',
						usePostForRead: true
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'procurement/pricecomparison/',
						endUpdate: 'update'
					},
					entitySelection: {},
					modification: {multi: {}},
					presenter: {
						tree: {
							parentProp: '',
							childProp: 'Children',
							incorporateDataRead: function (readData, data) {
								// process "basics.itemtype85". displayMember is Description.
								// related to dynamicFormatterFn , editorOptions, formatterOptions of alternativeBid.
								processBscsItemType85(readData['basics.itemtype85']);

								basicsLookupdataLookupDescriptorService.attachData(readData);

								let mainData = angular.copy(readData.Main);
								let baseRfqs = [];
								let changeRfqs = [];
								_.forEach(mainData, function (item) {
									if (!item.RfqHeaderFk) {
										baseRfqs.push(item);
									} else {
										changeRfqs.push(item);
									}
								});

								_.forEach(baseRfqs, function (base) {
									base.Children = [];
									_.forEach(changeRfqs, function (child) {
										child.Children = [];
										if (child.RfqHeaderFk === base.Id) {
											base.Children.push(child);
										}
									});
								});

								let items = {
									FilterResult: readData.FilterResult,
									dtos: baseRfqs || []
								};
								// clear the boq, item modified data
								commonService.clearData();

								// clear the boq, item node cache
								treeStateHelperService.cleanNodesCache();
								return data.handleReadSucceeded(items, data);
							}
						}
					},
					entityRole: {
						root: {
							moduleName: 'cloud.desktop.moduleDisplayNamePriceComparison',
							itemName: 'RfqHeader',
							codeField: 'Code',
							descField: 'Description',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							responseDataEntitiesPropertyName: 'Main',
							showProjectHeader: {
								getProject: function (entity) {
									if (!entity || !entity.ProjectFk) {
										return null;
									}
									return basicsLookupdataLookupDescriptorService.getLookupItem('Project', entity.ProjectFk);
								}
							}
						}
					},
					sidebarSearch: {options: sidebarSearchOptions},
					sidebarWatchList: {active: true},  // @11.12.2015 enable watchlist support for this module
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['DateRequested', 'DateCanceled', 'DateQuoteDeadline', 'DateAwardDeadline', 'PlannedStart', 'PlannedEnd', 'DateDelivery']),
						new SchedulingDataProcessTimesExtension(['TimeQuoteDeadline']),
						dataProcessItem()
					],
					actions: {delete: false, create: false}
				}
			};

			serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			service = serviceContainer.service;
			serviceContainer.data.doUpdate = function (data) {
				if (data.clearDependentCaches) {
					data.clearDependentCaches(data);
				}
				return $q.when(true);
			};
			service.onQuoteSelectedLoadEvaluation = new PlatformMessenger();
			service.navigationCompleted = navigationCompleted;
			service.onEvaluationChanged = new PlatformMessenger();
			service.evaluationModificationKeeper = modificationKeeper.createKeeper({
				equals: function (a, b) {
					return a.Id === b.Id;
				}
			});
			service.lastSelectedQuote = null;

			function dataProcessItem() {
				let dataProcessService = function () {
					return {dataService: service, validationService: {}};
				};
				// set all fields readonly and others..
				return procurementCommonDataEnhanceProcessor(dataProcessService, 'procurementPriceComparisonHeaderUIStandardService', true);
			}

			function navigationCompleted(entity, field) {
				let parameters = {}, hasParameters = false;

				// navigate from 'procurement.rfq'
				// eslint-disable-next-line no-prototype-builtins
				if (entity && entity.hasOwnProperty('RfqStatusFk')) {
					parameters.RfqHeaderId = entity.Id;
					hasParameters = true;
				}
				// navigate from 'procurememnt.quote'
				else if (entity && Object.hasOwnProperty.call(entity, 'QuoteVersion')) {
					parameters.QtnHeaderId = entity.Id;
					parameters.RfqHeaderId = entity.RfqHeaderFk;
					hasParameters = true;
				} else if (entity && field === 'Id') {
					let keys = [];
					if (angular.isObject(entity)) {
						keys.push(entity[field]);
					}
					if (angular.isString(entity)) {
						keys.push(parseInt(entity));
					}
					cloudDesktopSidebarService.filterSearchFromPKeys(keys);
				} else if (field === 'Ids' && entity.FromGoToBtn) {
					let ids = entity.Ids.split(',');
					cloudDesktopSidebarService.filterSearchFromPKeys(ids);
				}
				if (hasParameters) {
					$http.post(globals.webApiBaseUrl + 'procurement/rfq/header/navigation', parameters).then(function (response) {
						cloudDesktopSidebarService.filterSearchFromPKeys(response.data);
					});
				}
			}

			service.doPrepareUpdateCall = function doPrepareUpdateCall(updateData, modifiedData, idealQuoteCopiedData) {
				let completeDto = {
					ModifiedData: _.cloneDeep(modifiedData),
					IdealQuoteCopiedData: idealQuoteCopiedData,
					PrcItemToSave: [],
					BoqItemToSave: [],
					PrcHeaderBlobToSave: [],
					PrcHeaderBlobToDelete: [],
					BusinessPartnerEvaluationToSave: [],
					BusinessPartnerEvaluationToDelete: [],
					EvaluationDocumentToSave: [],
					EvaluationDocumentToDelete: [],
					BillingSchemaToSave: [],
					BillingSchemaToDelete: [],
					ModifiedQuote: {},
					PrcGeneralsToSave: []
				};

				// Clear unnecessary properties cause type mismatch will thrown error in .NET Core.
				_.forEach(['characteristic'], (prop) => {
					if (completeDto.ModifiedData[prop]) {
						completeDto.ModifiedData[prop] = undefined;
					}
				});

				if (modifiedData && modifiedData.characteristic && modifiedData.characteristic.length > 0) {
					completeDto.CharacteristicToSave = modifiedData.characteristic;
				}

				// collect the common fields in BOQ and Item
				if (commonService.commonModifiedData) {
					_.forIn(commonService.commonModifiedData, function (value, key) {
						if (_.includes(commonService.commonEditableFields, key)) {
							if (!completeDto[key + 'ToSave']) {
								completeDto[key + 'ToSave'] = [];
							}
							completeDto[key + 'ToSave'] = value;
						}
					});
				}

				if (commonService.boqModifiedData) {
					_.forIn(commonService.boqModifiedData, function (value, key) {
						if (!completeDto[key + 'ToSave']) {
							completeDto[key + 'ToSave'] = [];
						}
						completeDto[key + 'ToSave'] = value;
					});
				}

				if (commonService.PrcGeneralsToSave) {
					completeDto.PrcGeneralsToSave = commonService.PrcGeneralsToSave;
				}

				if (!_.isEmpty(commonService.modifiedQuote)) {
					completeDto.ModifiedQuote = commonService.modifiedQuote;
				}

				let first = true;
				_.forEach(updateData.ItemComparisonDataToSave || [], function (item) {

					if (!completeDto.PrcItemToSave[0]) {
						let itemComplete = {
							MainItemId: _.isNumber(item.MainItemId) ? item.MainItemId : -1
						};
						itemComplete.PriceConditionToSave = [];
						itemComplete.PriceConditionToDelete = [];
						itemComplete.PrcItemblobToSave = [];
						itemComplete.PrcItemblobToDelete = [];
						completeDto.PrcItemToSave.push(itemComplete);
					}

					mergeUpdateData(item.PrcHeaderBlobToSave, completeDto.PrcHeaderBlobToSave);
					mergeUpdateData(item.PrcHeaderBlobToDelete, completeDto.PrcHeaderBlobToDelete);
					mergeUpdateData(item.PriceConditionToSave, completeDto.PrcItemToSave[0].PriceConditionToSave);
					mergeUpdateData(item.PriceConditionToDelete, completeDto.PrcItemToSave[0].PriceConditionToDelete);
					mergeUpdateData(item.PrcItemblobToSave, completeDto.PrcItemToSave[0].PrcItemblobToSave);
					mergeUpdateData(item.PrcItemblobToDelete, completeDto.PrcItemToSave[0].PrcItemblobToDelete);
					// mergeUpdateData(item.BusinessPartnerEvaluationToDelete, completeDto.BusinessPartnerEvaluationToDelete);
					if (item.BillingSchemaToSave && !_.isEmpty(item.BillingSchemaToSave)) {
						let billingSchemas = _.filter(item.BillingSchemaToSave, function (item) {
							return !(item.__rt$data && item.__rt$data.isBeingDeleted);
						});
						mergeUpdateData(billingSchemas, completeDto.BillingSchemaToSave);
					}
					mergeUpdateData(item.BillingSchemaToDelete, completeDto.BillingSchemaToDelete);

					if (!first) {
						completeDto.PrcItemToSave[0].PriceConditionToSave = _.differenceBy(completeDto.PrcItemToSave[0].PriceConditionToSave, item.PriceConditionToDelete, 'Id');
						completeDto.PrcItemToSave[0].PriceConditionToDelete = _.differenceBy(completeDto.PrcItemToSave[0].PriceConditionToDelete, item.PriceConditionToSave, 'Id');
					} else {
						first = !first;
					}
				});

				_.forEach(updateData['BoqComparisonDataToSave'] || [], function (item) {
					// mergeUpdateData(item.BusinessPartnerEvaluationToDelete, completeDto.BusinessPartnerEvaluationToDelete);
					if (!completeDto.BoqItemToSave[0]) {
						let BoqItemComplete = {
							MainItemId: _.isNumber(updateData.MainItemId) ? updateData.MainItemId : -1
						};
						BoqItemComplete.PriceConditionToSave = [];
						BoqItemComplete.PriceConditionToDelete = [];
						completeDto.BoqItemToSave.push(BoqItemComplete);
					}

					mergeUpdateData(item.BillingSchemaToSave, completeDto.BillingSchemaToSave);
					mergeUpdateData(item.BillingSchemaToDelete, completeDto.BillingSchemaToDelete);
					mergeUpdateData(item.PriceConditionToSave, completeDto.BoqItemToSave[0].PriceConditionToSave);
					mergeUpdateData(item.PriceConditionToDelete, completeDto.BoqItemToSave[0].PriceConditionToDelete);
				});

				if (!_.isEmpty(updateData.BusinessPartnerEvaluationToSave)) {
					mergeUpdateData(updateData.BusinessPartnerEvaluationToSave, completeDto.BusinessPartnerEvaluationToSave, true);
				}

				if (!_.isEmpty(updateData.BusinessPartnerEvaluationToDelete)) {
					mergeUpdateData(updateData.BusinessPartnerEvaluationToDelete, completeDto.BusinessPartnerEvaluationToDelete);
				}

				if (!_.isEmpty(updateData.EvaluationDocumentToSave)) {
					mergeUpdateData(updateData.EvaluationDocumentToSave, completeDto.EvaluationDocumentToSave, true);
				}

				if (!_.isEmpty(updateData.EvaluationDocumentToDelete)) {
					mergeUpdateData(updateData.EvaluationDocumentToDelete, completeDto.EvaluationDocumentToDelete);
				}

				return completeDto;
			};

			service.trySyncQuoteEvaluation = function (quoteId, evaluationSchemaFk, originalEvaluations) {

				let isChanged = false;
				let result = angular.copy(originalEvaluations) || [];
				let removeEntities = service.evaluationModificationKeeper.queryDelete(),
					createEntities = service.evaluationModificationKeeper.queryCreate(),
					updateEntities = service.evaluationModificationKeeper.queryUpdate();

				_.each(createEntities, function (item) {
					let hasCreated = _.find(result, {Id: item.Id});
					if (!hasCreated && item.EvaluationSchemaFk === evaluationSchemaFk && item.QtnHeaderFk === quoteId) {
						result.push(item);
						isChanged = true;
					}
				});
				_.each(updateEntities, function (item) {
					let updateEvaluation = _.find(result, {Id: item.Id});
					if (updateEvaluation) {
						if (updateEvaluation.QtnHeaderFk === item.QtnHeaderFk) {
							Object.assign(updateEvaluation, item);
						} else {
							_.remove(result, function (child) {
								return child === updateEvaluation;
							});
						}
						isChanged = true;
					} else {
						if (item.EvaluationSchemaFk === evaluationSchemaFk && item.QtnHeaderFk === quoteId) {
							result.push(item);
						}
						isChanged = true;
					}
				});
				_.each(removeEntities, function (item) {
					let matchItem = _.find(result, {Id: item.Id});
					if (matchItem) {
						_.remove(result, function (child) {
							return child === matchItem;
						});
						isChanged = true;
					}
				});
				let sumItems = _.filter(result, function (item) {
					return item.Points !== null;
				});
				return {
					isChanged: isChanged,
					summary: {
						Points: result.length > 0 ? _.sumBy(sumItems, 'Points') / result.length : 0
					},
					result: result
				};
			};

			service.getEvaluationSchemaFromSelectedItem = function (rfqHeaderId) {
				let selectedItem = service.getSelected(),
					rfqHeaders = cloudCommonGridService.flatten([selectedItem || {Children: []}], [], 'Children');

				let target = _.find(rfqHeaders, {Id: rfqHeaderId});

				return target ? target.EvaluationSchemaFk : null;
			};

			service.isCurrentSelectedIncludingChangeOrder = function () {
				let hasChangeOrder = false,
					selected = service.getSelected();

				if (selected) {
					hasChangeOrder = (selected.Children && selected.Children.length) || (_.some(service.getList(), function (item) {
						return item.Id === selected.RfqHeaderFk;
					}));
				}

				return hasChangeOrder;
			};

			function mergeUpdateData(updateList, completeList, isMainItem) {
				let findEntity;
				_.forEach(updateList, function (entity) {
					if (isMainItem) {
						findEntity = _.find(completeList, {MainItemId: entity.MainItemId});
					} else {
						findEntity = _.find(completeList, {Id: entity.Id});
					}

					if (!findEntity) {
						completeList.push(entity);
					}
				});
			}

			let filterList = [
				{
					key: 'price-comparison-item-evaluation-filter',
					serverSide: false,
					fn: function (currencyItem, entity) {
						// return currencyItem.Id > 3 && currencyItem.Id < 8;
						let items = [4, 5, 6, 7];
						switch (entity.Field) {
							case commonService.itemCompareFields.percentage:
							case commonService.itemCompareFields.absoluteDifference : {
								items = items.concat([10, 11]);
								break;
							}
							case commonService.itemCompareFields.price:
							case commonService.boqCompareFields.unitRate: {
								items = items.concat(10);
								break;
							}
							case commonService.itemCompareFields.total:
							case commonService.boqCompareFields.finalPrice: {
								items = items.concat(11);
								break;
							}
							case commonService.itemCompareFields.quantity:
							default: {
								break;
							}
						}
						return items.indexOf(currencyItem.Id) > -1;
					}
				},
				{
					key: 'price-comparison-boq-evaluation-filter',
					serverSide: false,
					fn: function (currencyItem) {
						return currencyItem.Id > 2 && currencyItem.Id < 8;
					}
				},
				{
					key: 'price-comparison-wizard-item_evaluation-filter',
					serverSide: false,
					fn: function (currencyItem) {
						let items = [4, 5, 6, 7, 10];
						return items.indexOf(currencyItem.Id) > -1;
					}
				}
			];
			lookupFilterService.registerFilter(filterList);

			function processBscsItemType85(dataList) {

				if (dataList && dataList.length > 0) {
					angular.forEach(dataList, function (item) {
						item.Description = item.DescriptionInfo ? item.DescriptionInfo.Translated : item.Description;
					});
				}
			}

			function showInfoDialog(isNewVersion) {
				var msg = 'procurement.pricecomparison.saveToOriginalDone';
				if (isNewVersion) {
					msg = 'procurement.pricecomparison.saveToNewVersionUnLoad';
				}
				commonService.showInfoDialog(msg);
			}

			function checkBoqNItemModifiedData(compareType) {
				let itemService = $injector.get('procurementPriceComparisonItemService');
				let boqService = $injector.get('procurementPriceComparisonBoqService');
				let modifiedType = 0; // 0:nothing 1:item 2:boq 3:both
				let itemModified = !_.isEmpty(itemService.modifiedData) ? 1 : 0;
				let boqModified = !_.isEmpty(boqService.modifiedData) ? 2 : 0;
				if (compareType === 1) {
					return itemModified;
				}
				if (compareType === 2) {
					return boqModified;
				}
				modifiedType = itemModified + boqModified;
				return modifiedType;
			}
			service.checkBoqNItemModifiedData = checkBoqNItemModifiedData;

			function cleanBoqNItemModifiedData(compareType) {
				let itemService = $injector.get('procurementPriceComparisonItemService');
				let boqService = $injector.get('procurementPriceComparisonBoqService');

				switch (compareType) {
					case 1:
						itemService.modifiedData = {};
						break;
					case 2:
						boqService.modifiedData = {};
						break;
					default:
						itemService.modifiedData = {};
						boqService.modifiedData = {};
						break;
				}

				return compareType;
			}

			let isItemModifiedCheck = {status: 0};

			function getOrSetItemCheck(state) {
				if (state) {
					isItemModifiedCheck.status = state.status;
				} else {
					return isItemModifiedCheck;
				}
			}

			service.getOrSetItemCheck = getOrSetItemCheck;

			let isBoqModifiedCheck = {status: 0};

			function getOrSetBoqCheck(state) {
				if (state) {
					isBoqModifiedCheck.status = state.status;
				} else {
					return isBoqModifiedCheck;
				}
			}

			service.getOrSetBoqCheck = getOrSetBoqCheck;

			function setIsCheck(compareType, state) {
				if (compareType === 1) {
					getOrSetItemCheck(state);
				} else if (compareType === 2) {
					getOrSetBoqCheck(state);
				} else {
					getOrSetItemCheck(state);
					getOrSetBoqCheck(state);
				}
			}

			function checkAndQuerySave(compareType, event, toState) {
				let modifyType = checkBoqNItemModifiedData(compareType);
				if (modifyType) {
					if (event && toState && toState.name === 'app.procurementpricecomparison'){
						event.preventDefault();// interpret navigate
					}
					setIsCheck(compareType, {status: 1});
					return platformModalService.showDialog({
						resolve: {
							controllerOptions: function () {
								return {modifyType: modifyType};
							}
						},
						width: '650px',
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-quit-save-quote-dialog.html',
						controller: 'procurementPriceComparisonItemBoqQuitSaveQuoteController'
					}).then(function (result) {
						setIsCheck(compareType, {status: 0});

						cleanBoqNItemModifiedData(compareType);
						if (result && result.ok && result.isSaved) {
							showInfoDialog(result.isSaved.isNewVersion);
						}
						// go(toState);
						if (toState && toState.name === 'app.procurementpricecomparison'){
							$state.transitionTo(toState.name);
						}
					});
				} else {
					// go(toState);
				}
			}

			service.checkAndQuerySave = checkAndQuerySave;

			service.registerSelectionChanged(()=>{
				procurementCommonOverrideHeaderInfoService.updateModuleHeaderInfo(service,'cloud.desktop.moduleDisplayNamePriceComparison');
			});

			return service;
		}
	]);
})(angular);