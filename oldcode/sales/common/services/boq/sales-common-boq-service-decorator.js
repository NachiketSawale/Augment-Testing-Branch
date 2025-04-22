/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonBoqCreationDecorator
	 * @description decorator to enhance sales boq services by overwriting given functions and enhance them
	 */
	angular.module(salesCommonModule).service('salesCommonBoqServiceDecorator', ['_', '$injector', '$q', '$http', 'globals', 'platformDataServiceInitOptionExtension',
		function (_, $injector, $q, $http, globals, platformDataServiceInitOptionExtension) {

			return {
				completeServiceOptions: function completeServiceOptions(options) {
					platformDataServiceInitOptionExtension.completeOptions(options); // Make sure to have the standard options completed
					if (options && options.flatLeafItem && options.flatLeafItem.actions) {

						options.flatLeafItem.actions.canCreateCallBackFunc = function (selectedItem, data) {
							return data && data.getCanCreate();
						};
						options.flatLeafItem.actions.canDeleteCallBackFunc = function (selectedItem, data) {
							return data && !data.readOnly;
						};
					}
				},
				decorate: function decorate(serviceContainer) {

					var service = serviceContainer.service;
					var data = serviceContainer.data;
					data.readOnly = false;
					data.canCreate = true;
					var parentService = service.parentService();

					service.createItem = function createItemWithDialog(opt) {
						var defer = $q.defer();

						var dialogService = $injector.get('salesCommonBoqCreationDialogService');
						dialogService.resetToDefault();
						var mainItemId = null;
						if (service.parentService() !== null) {
							service.parentService().updateAndExecute(function () {
								var selectedMainItem = service.parentService().getSelected();
								mainItemId = (angular.isDefined(selectedMainItem) && (selectedMainItem !== null)) ? selectedMainItem.Id : null;

								if (_.isObject(opt) && opt.runQuiet) {
									// case 2: quiet execution
									var creationParam = {
										MainItemId: opt.mainItemId,
										Reference: opt.reference,
										BriefInfo: {
											Description: '',
											Translated: opt.outlineSpec,
											Modified: true
										}
									};
									data.doCallHTTPCreate(creationParam, data, data.onCreateSucceeded).then(function (compositeBoq) {
										defer.resolve(compositeBoq);
									});
								} else {
									// case 1: dialog
									dialogService.showDialog(function (creationData) {
										creationData.MainItemId = mainItemId;
										// WIC BoQ?
										if (_.isFunction(creationData.getCreationType) && creationData.getCreationType() === 'wicboq') {
											$http.get(globals.webApiBaseUrl + 'boq/wic/boq/list?wicGroupId=' + creationData.WicGroupId).then(function (resultData) {
												creationData.BoqHeaderId = resultData.data.filter(res => res.Id === creationData.WicBoqId)[0].BoqHeader.Id;
												$http.post(globals.webApiBaseUrl + 'sales/contract/boq/createbywic', creationData).then(function (compositeBoq) {
													data.handleOnCreateSucceeded(compositeBoq.data, data);
													defer.resolve(compositeBoq.data);
												});
											});
										} else { // other cases (new boq / base boq)
											data.doCallHTTPCreate(creationData, data, data.onCreateSucceeded).then(function (compositeBoq) {
												defer.resolve(compositeBoq);
											});
										}
									}, service).then(function (result) {
										if (result === false) {
											defer.reject('cancelled');
										}
									});
								}
							});
						}
						return defer.promise;
					};

					// Overwrite the setSelected function to be able to trigger an update to avoid loosing modified data of child items, i.e. boqItems.
					// Todo: This is just a workaround to avoid loosing changed data, until the correct parent-child aggregation of services is done.
					var originalSetSelected = service.setSelected;
					service.setSelected = function setSelectedBidBoq(item, entities) {
						if (service.getSelected() && item && item.Id === service.getSelected().Id && _.isEqual(service.getSelectedEntities(), entities)) {
							return $q.when(item);
						}

						// Get parent data service and trigger an update....
						var parentService = data.parentService;
						if (parentService.getSelected() && parentService.update) {
							return parentService.update().then(function () {
								// ...and after the successful update trigger the selection
								return originalSetSelected(item, entities);
							},
							function () {
								return service.getSelected();
							});
						} else {
							return originalSetSelected(item, entities);
						}
					};

					service.incorporateDataRead = function incorporateDataRead(result, data) {
						var response = data.handleReadSucceeded(result, data);
						service.goToFirst();
						return response;
					};

					// TODO: search for #83004
					service.reload = function reload() {
						if (!_.isEmpty(serviceContainer.data.filter)) {
							service.load();
						}
					};

					service.loadSubItemsList = function () {
						data.doesRequireLoadAlways = true;// Baf. Otherwise the service.loadSubItemList will not work correctly.
						data.loadSubItemList.apply(this, arguments);
						data.doesRequireLoadAlways = false;
					};

					service.setReadOnly = function setReadOnly(flag) {
						data.readOnly = flag;
					};

					service.getReadOnly = function getReadOnly() {
						return data.readOnly;
					};

					service.setCanCreate = function setCanCreate(flag) {
						data.canCreate = flag;
					};

					data.getCanCreate = function getCanCreate() {
						if ((service.parentService() !== null) && _.isObject(service.parentService().getSelected())) {
							return data.canCreate;
						}

						return false;
					};

					service.canCreate = function canCreate() {
						return data.getCanCreate();
					};

					service.doProcessItem = function doProcessItem(salesBoqCompositeItem) {
						var platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');
						if (salesBoqCompositeItem) {
							platformDataServiceDataProcessorExtension.doProcessItem(salesBoqCompositeItem, data);
						}
					};

					function loadList() {
						var list = service.getList();
						if (list && list.length) {
							service.load();
						}
					}

					if (parentService && parentService.onRecalculationItemsAndBoQ) {
						parentService.onRecalculationItemsAndBoQ.register(loadList);
					}
				}
			};
		}

	]);

})();
