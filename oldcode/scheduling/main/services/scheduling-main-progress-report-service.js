/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityRelationshipService
	 * @function
	 *
	 * @description
	 * schedulingMainActivityRelationshipService is the data service for all activityRelationship related functionality.
	 */
	schedulingMainModule.factory('schedulingMainProgressReportService', ['_', 'schedulingMainService', 'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension', 'schedulingProgressReportLineItemLookupService', 'schedulingProgressReportLineHeaderItemLookupService',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService', 'schedulingMainDueDateService',
		'schedulingMainProgressReportTempService', 'schedulingMainConstantValues',

		/* jshint -W072 */ // many parameters because of dependency injection
		function (_, schedulingMainService, platformDataServiceFactory,
			platformDataServiceDataProcessorExtension, lineItemLookupService, lineItemHeaderLookupService,
			platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService, schedulingMainDueDateService,
			schedulingMainProgressReportTempService, constantValues) {
			let actTypeIdHammock = 5;
			let actTypeIdSummary = 2;

			let schedulingMainProgressReportServiceOption = {
				flatLeafItem: {
					module: schedulingMainModule,
					serviceName: 'schedulingMainProgressReportService',
					entityNameTranslationID: 'scheduling.main.progress',
					httpCreate: {route: globals.webApiBaseUrl + 'scheduling/main/progressreport/'},
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/progressreport/', endRead: 'list'},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ActivityProgressReportDto',
						moduleSubModule: 'Scheduling.Main'
					}),
					{
						processItem: function (item) {
							let progressReportId = schedulingMainService.getSelected().ProgressReportMethodFk;
							if (item.EstimateHeaderIsActive === false || item.Version >= 1 || progressReportId === constantValues.progressReportMethod.ByModelObjects) {
								platformRuntimeDataService.readonly(item, true);
							}
							if (_.gt(item.Quantity, 0)) {
								platformRuntimeDataService.readonly(schedulingMainService.getSelected(), [{
									field: 'ProgressReportMethodFk',
									readonly: true
								}]);
							}
						}
					}],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.mainItemId = schedulingMainService.getSelected().Id;
								creationData.Activity = schedulingMainService.getSelected();
								if (schedulingMainDueDateService.hasDueDate()) {
									creationData.PerformanceDueDate = schedulingMainDueDateService.getPerformanceDueDateAsString();
									creationData.PerformanceDescription = schedulingMainDueDateService.getPerformanceDescription();
								}
							},
							/* Add handleCreateSucceeded function to manage due date for each record */
							handleCreateSucceeded: function handleCreateSucceeded(newData,data) {
							/*  Add one day to  PerformanceDate and set it to default */
								if(newData.PerformanceDate){
									if(data.itemList.length>0){
										let checkDueDate = data.itemList.find(x => x.PerformanceDate.format('YYYY[-]MM[-]DD[T00:00:00Z]') === schedulingMainDueDateService.getPerformanceDueDate().format('YYYY[-]MM[-]DD[T00:00:00Z]'));
										if(checkDueDate){
											newData.PerformanceDate = schedulingMainDueDateService.getPerformanceDueDate().add(1, 'days');
											schedulingMainDueDateService.setDueDate(newData.PerformanceDate);
										}else{
											newData.PerformanceDate = schedulingMainDueDateService.getPerformanceDueDate();
										}
									}
								}
								/*
								setTimeout(() => {
								 $('.e2e-navbar-btn-save').click();
								}, 1000);
*/
								return newData;
							}
						}
					},
					entityRole: {leaf: {itemName: 'ProgressReports', parentService: schedulingMainService}},
					filterByViewer: true
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainProgressReportServiceOption);

			serviceContainer.service.takeOverNewReports = function takeOverNewReports(newItems) {
				let data = serviceContainer.data;
				let fireListLoaded = false;
				/* Handel the PerformanceDate conflict */
				if (newItems && newItems.length > 0) {
					let tmpArray = [];
					for (let i = 0; i < newItems.length - 1; i++) {
						let exists = false;
						_.forEach(tmpArray, function (val2) {
							if (angular.equals(newItems[i].PerformanceDate, val2.PerformanceDate) && angular.equals(newItems[i].EstLineItemFk, val2.EstLineItemFk)
								&& angular.equals(newItems[i].EstHeaderFk, val2.EstHeaderFk)
								&& angular.equals(newItems[i].Activity2ModelObjectFk, val2.Activity2ModelObjectFk)) {
								exists = true;
							}
						});
						if (exists === false && newItems[i] !== '') {
							tmpArray.push(newItems[i]);
						}
					}
					if (tmpArray.length > 0) {
						newItems = tmpArray;
					}
					_.forEach(newItems, function (newItem) {
						platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
						let tmpItem = _.find(data.itemList, {Id: newItem.Id});
						if (!tmpItem) {
							if (schedulingMainService.getSelected().Id === newItem.ActivityFk) {
								if (data.itemList.length > 0) {
									let filterDueDate = data.itemList.find(x => x.PerformanceDate.format('YYYY[-]MM[-]DD[T00:00:00Z]') === newItem.PerformanceDate.format('YYYY[-]MM[-]DD[T00:00:00Z]') && x.EstLineItemFk === newItem.EstLineItemFk
										&& x.EstHeaderFk === newItem.EstHeaderFk && x.Activity2ModelObjectFk === newItem.Activity2ModelObjectFk);
									if (!filterDueDate) {
										data.itemList.push(newItem);
									} else {
										let index = data.itemList.indexOf(filterDueDate);
										if (newItem.Quantity > 0) {
											data.itemList[index] = newItem;
										}
									}
								} else {
									data.itemList.push(newItem);
								}

								fireListLoaded = true;
								data.markItemAsModified(newItem, data);
							} else {
								schedulingMainProgressReportTempService.takeCareOfNewReport(newItem);
							}
						} else {
							angular.extend(tmpItem, newItem);
							data.markItemAsModified(newItem, data);
						}
					});
					if (fireListLoaded) {
						data.listLoaded.fire(data.itemList);
					}
				}
			};

			serviceContainer.service.canCreate = function canCreate() {
				let sel = schedulingMainService.getSelected();
				return (sel && !(sel.ProgressReportMethodFk === constantValues.progressReportMethod.ByModelObjects ||	sel.ActivityTypeFk === actTypeIdHammock
					|| sel.ActivityTypeFk === actTypeIdSummary || sel.RemainingActivityQuantity === 0 || sel.RemainingActivityWork === 0
					|| schedulingMainService.getDueDate() === sel.LastProgressDate) && !schedulingMainService.isCurrentTransientRoot());
			};

			serviceContainer.service.canDelete = function canDelete() {
				let sel = schedulingMainService.getSelected();
				return (sel && sel.ProgressReportMethodFk !== constantValues.progressReportMethod.ByModelObjects );
			};

			function putLineItemsInLookupCache(items, item) {
				if (!items && item) {
					items = [item];
				}
				let lineItems = [];
				let lineItemHeaders = [];
				if (!_.isEmpty(items)) {
					_.each(items, function (item) {
						if (!_.isEmpty(item.LineItems)) {
							_.each(item.LineItems, function (li) {
								lineItems.push(li);
							});
						}
						if (!_.isEmpty(item.LineItemHeaders)) {
							_.each(item.LineItemHeaders, function (lih) {
								lineItemHeaders.push(lih);
							});
						}
					});
					lineItems = _.uniqBy(lineItems, 'Id');
					lineItemHeaders = _.uniqBy(lineItemHeaders, 'Id');
				}
				if (!_.isEmpty(lineItems)) {
					lineItemLookupService.setCache({lookupType: 'schedulingProgressReportLineItemLookupService'}, lineItems);
				} else {
					lineItemLookupService.resetCache({lookupType: 'schedulingProgressReportLineItemLookupService'});
				}
				if (!_.isEmpty(lineItemHeaders)) {
					lineItemHeaderLookupService.setCache({lookupType: 'schedulingProgressReportLineHeaderItemLookupService'}, lineItemHeaders);
				} else {
					lineItemHeaderLookupService.resetCache({lookupType: 'schedulingProgressReportLineHeaderItemLookupService'});
				}
			}

			schedulingMainService.registerSelectionChanged(function () {
				putLineItemsInLookupCache(null, null);
			});

			serviceContainer.service.registerListLoaded(putLineItemsInLookupCache);

			serviceContainer.service.registerEntityCreated(putLineItemsInLookupCache);

			serviceContainer.service.registerEntityDeleted(makeActivityReportTypeReadable);

			function makeActivityReportTypeReadable() {
				let amountOfReportHistoryRemaining = serviceContainer.service.getList().length;

				if (_.eq(amountOfReportHistoryRemaining, 0)) {
					platformRuntimeDataService.readonly(schedulingMainService.getSelected(), [{
						field: 'ProgressReportMethodFk',
						readonly: false
					}]);
				}
			}

			return serviceContainer.service;
		}
	]);
})(angular);
