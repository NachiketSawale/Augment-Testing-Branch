/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';

	/**
	 * @ngdoc service
	 * @name modulSubModuleMainEntityNameDataService
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * The root data service of the modul.submodule module.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('controllingRevenueRecognitionItemService', ['globals', '_', '$http', '$injector', '$translate', 'PlatformMessenger', 'platformGridAPI', 'platformDataServiceFactory', 'controllingRevenueRecognitionItemReadonlyProcessor', 'ServiceDataProcessDatesExtension', 'controllingRevenueRecognitionHeaderDataService',
		function (globals, _, $http, $injector, $translate, PlatformMessenger, platformGridAPI, platformDataServiceFactory, prrItemReadonlyProcessor, ServiceDataProcessDatesExtension, mainDataService) {

			var serviceOptions = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'controllingRevenueRecognitionItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/item/',
						endRead: 'tree'
					},
					dataProcessor: [prrItemReadonlyProcessor, new ServiceDataProcessDatesExtension(['HeaderDate', 'RelevantDate'])],
					presenter: {
						tree: {
							parentProp: 'PrrItemParentId',
							childProp: 'PrrItems',
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								setIndexForStaticGroupType(readItems);
								return container.data.handleReadSucceeded(readItems, data);
							}
						}
					},
					longText: {
						relatedContainerTitle: 'controlling.revrecognition.progressReportItemListTitle',
						relatedGridId: '0cbab2c461504ccd82a484542f9ea130',
						longTextProperties: [{
							displayProperty: 'Remark',
							propertyTitle: 'controlling.revrecognition.remarkContainerTitle'
						}]
					},
					entitySelection: {},
					entityRole: {
						node: {
							itemName: 'PrrItem',
							parentService: mainDataService,
							addToLastObject: true,
							lastObjectModuleName: moduleName
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			function setIndexForStaticGroupType(items, parent) {
				const hasParentItem = !_.isNil(parent);
				_.forEach(items, function (item) {
					if (item.PrrItemParentId === 0 && hasParentItem) {
						item.PrrItemParentId = parent.Id;
					}
					if (item.StaticItemType > 0 && item.Id === 0) {
						item.Id = item.StaticItemType + '_' + item.PrrAccrualType + '_' + item.PrrItemParentId + '_' + item.Code;
					}
					if (item.PrrItems && item.PrrItems.length > 0) {
						setIndexForStaticGroupType(item.PrrItems, item);
					}
				});
			}

			var container = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = container.service;
			service.prrItemAmountChanged = new PlatformMessenger();

			service.getCellEditable = function getCellEditable(currItem, field) {
				return prrItemReadonlyProcessor.getCellEditable(currItem, field, service);
			};

			function setAccrualWeight(performanceAccrual, accruals) {
				var totalAccrual = performanceAccrual.AmountInc;
				if (totalAccrual > 0) {
					_.forEach(accruals, function (accuralItem) {
						accuralItem.Weight = accuralItem.AmountInc / totalAccrual;
					});
				} else {
					var count = accruals.length;
					_.forEach(accruals, function (accuralItem) {
						accuralItem.Weight = 1 / count;
					});
				}
			}

			function reCalAccrual(accrual, variant) {
				if (accrual && accrual.PrrItems && accrual.PrrItems.length > 0) {
					var list = accrual.PrrItems;
					var findAccruals = _.filter(list, function (item) {
						return item.ItemType === 3;
					});
					if (findAccruals && findAccruals.length > 0) {
						setAccrualWeight(accrual, findAccruals);
						_.forEach(findAccruals, function (accuralItem) {
							accuralItem.AmountInc = variant * accuralItem.Weight;
							accuralItem.AmountTotal = accuralItem.AmountPervious + accuralItem.AmountInc;
							accuralItem.Percentage = (0 !== accuralItem.AmountContractTotal) ? (accuralItem.AmountTotal / accuralItem.AmountContractTotal) * 100 : null;
							service.markItemAsModified(accuralItem);
						});
						accrual.AmountInc = variant;
						$injector.get('controllingRevenueRecognitionItemValidationService').validateAmountInc(accrual, accrual.AmountInc, 'AmountInc', null);
					}
				}
			}

			service.getPrrItemById = function (id) {
				return service.getItemById(id);
			};

			service.getParentPrrItem = function (prrItem) {
				return service.getPrrItemById(prrItem.PrrItemParentId);
			};

			service.calcParentChain = function (item, fromAcrual) {
				var parentItem = service.getParentPrrItem(item);
				if (parentItem) {
					if (parentItem.PrrItems && parentItem.PrrItems.length > 0) {
						parentItem.AmountInc = _.sumBy(parentItem.PrrItems, function (item) {
							return item.AmountInc;
						});
						parentItem.AmountTotal = parentItem.AmountInc + parentItem.AmountPervious;
						parentItem.Percentage = (0 !== parentItem.AmountContractTotal) ? (parentItem.AmountTotal / parentItem.AmountContractTotal) * 100 : null;
						if (parentItem.ItemType === 0 && parentItem.StaticItemType === 0) {
							service.calcParentChain(parentItem);
						}
					}
					// main record
					if ((1 === item.ItemType) && !fromAcrual) {
						var excludeAccrualItem = _.filter(item.PrrItems, function (item) {
							return item.StaticItemType !== 5;
						});
						var subRecordExcludeAccrualTotal = _.sumBy(excludeAccrualItem, function (item) {
							return item.AmountInc;
						});
						var variant = item.AmountInc - subRecordExcludeAccrualTotal;
						var accrual = _.find(item.PrrItems, function (item) {
							return item.StaticItemType === 5;
						});
						reCalAccrual(accrual, variant);
					} else if (3 === item.ItemType || 0 === item.ItemType) {// accruals
						service.calcParentChain(parentItem, true);
					}
				}
			};

			service.refreshItem = function () {
				var headerEntity = mainDataService.getSelected();
				if (headerEntity) {
					var prrHeaderId = headerEntity.Id;
					$http.get(globals.webApiBaseUrl + 'controlling/RevenueRecognition/item/refresh?mainItemId=' + prrHeaderId).then(function (/* response */) {
						service.load();
					});
				}
			};

			return service;
		}]);
})();
