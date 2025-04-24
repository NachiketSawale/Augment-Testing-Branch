(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	let businesspartnerEvaluationschemaModule = angular.module('businesspartner.evaluationschema');
	angular.module('businesspartner.evaluationschema').factory('businessPartnerEvaluationSchemaItemService',
		['globals', 'businessPartnerEvaluationSchemaSubgroupService', 'platformDataServiceFactory', 'businessPartnerEvaluationschemaItemValidationService',
			'platformRuntimeDataService',
			function (globals, businessPartnerEvaluationSchemaSubgroupService, platformDataServiceFactory, businessPartnerEvaluationschemaItemValidationService,
				platformRuntimeDataService) {
				let serviceOption = {
					flatLeafItem: {
						module: businesspartnerEvaluationschemaModule,
						serviceName: 'businessPartnerEvaluationSchemaItemService',
						httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationitem/', endCreate: 'createnew'},
						httpRead: {route: globals.webApiBaseUrl + 'businesspartner/evaluationschema/evaluationitem/'},
						actions: {
							delete: true,
							create: 'flat'
						},
						entityRole: {
							leaf: {
								itemName: 'Item',
								parentService: businessPartnerEvaluationSchemaSubgroupService
							}
						},
						dataProcessor: [{processItem: processItem}],
						translation: {
							uid: '5F7FE377-2294-4517-9F56-BE4E83DFD436',
							title: 'businesspartner.evaluationschema.title.items',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}, {
								header: 'businesspartner.evaluationschema.entityRemark', field: 'RemarkInfo'
							}],
							dtoScheme: {
								typeName: 'EvaluationItemDto',
								moduleSubModule: 'BusinessPartner.EvaluationSchema'
							}
						}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

				angular.extend(serviceContainer.service, {
					multiSelectValueChangeHandler: multiSelectValueChangeHandler,
					markItemAsModified: markItemAsModified,
					mergeUpdatedDataInCache: mergeUpdatedDataInCache
				});

				init();

				function mergeUpdatedDataInCache(updateData, data) {
					let cache = data.provideCacheFor(updateData.MainItemId, data);
					let items;

					if (cache) {
						items = cache.loadedItems;
						cache.modifiedItems.length = 0;
						cache.deletedItems.length = 0;
					} else {
						items = data.itemList;
					}

					if (Array.isArray(items) && items.length === 0 && data.itemList.length > 0) {
						items = data.itemList;
					}

					if (items?.length) {
						let updates = updateData[data.itemName + 'ToSave'];
						_.forEach(updates, function (updated) {
							let oldItem = _.find(items, {Id: updated.Id});
							if (oldItem) {
								data.mergeItemAfterSuccessfullUpdate(oldItem, updated, true, data);
							}
						});
					}
				}

				return serviceContainer.service;

				function init() {
					serviceContainer.data.listLoaded.register(multiSelectValueChangeHandler);
				}

				function markItemAsModified(item) {
					serviceContainer.data.markItemAsModified(item, serviceContainer.data);
				}

				function multiSelectValueChangeHandler() {
					serviceContainer.service.getList().forEach(function (item) {
						let validationResult = businessPartnerEvaluationschemaItemValidationService(serviceContainer.service).validatePoints(item, item.Points, 'Points');
						if (validationResult && validationResult.valid !== null) {
							platformRuntimeDataService.applyValidationResult(validationResult, item, 'Points');
						}

						// serviceContainer.data.markItemAsModified(item, serviceContainer.data);//todo-jes: this will cause unnecessary update action as no field of the item has been modified

						serviceContainer.service.gridRefresh();
					});
				}

				function processItem(item) {
					let validationResult = businessPartnerEvaluationschemaItemValidationService(serviceContainer.service).validatePoints(item, item.Points, 'Points');
					if (validationResult && validationResult.valid !== null) {
						platformRuntimeDataService.applyValidationResult(validationResult, item, 'Points');
					}
				}
			}]);
})(angular);
