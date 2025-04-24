(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,moment,_ */

	var moduleName = 'procurement.invoice';

	// jshint -W072
	angular.module(moduleName).factory('procurementInvoiceHeader2HeaderDataService',
		['$q', 'platformDataServiceFactory', 'procurementInvoiceHeaderDataService', 'procurementInvoiceHeader2HeaderReadOnlyProcessor',
			'procurementContextService', '$http', 'basicsLookupdataLookupDescriptorService','basicsCommonReadDataInterceptor', 'basicsCommonMandatoryProcessor',
			function ($q, dataServiceFactory, headerDataService, readonlyProcessor,
				moduleContext, $http, lookupDescriptorService,readDataInterceptor, basicsCommonMandatoryProcessor) {
				var self = this;
				var laterImplementParentChange = false;
				var creatingItems = false;
				var serviceOptions = {
					flatNodeItem: {
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/invoice/invheader2invheader/'
						},
						serviceName: 'procurementInvoiceHeader2HeaderDataService',
						dataProcessor: [readonlyProcessor],
						actions: {
							delete: true,
							create: 'flat',
							canCreateCallBackFunc: function () {
								var rightByStatus = headerDataService.haveRightByStatus('InvStatusCreateRightToChain');
								var editRightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToChain');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								if (rightByStatus.hasDescriptor) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							},
							canDeleteCallBackFunc: function () {
								var rightByStatus = headerDataService.haveRightByStatus('InvStatusDeleteRightToChain');
								var editRightByStatus = headerDataService.haveRightByStatus('InvStatusEditRightToChain');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							}
						},
						presenter: {
							list: {
								incorporateDataRead: function (readData, data) {
									var invHeaderChaineds=readData.InvHeaderChained;
									_.forEach(invHeaderChaineds,function(item){
										item.DateInvoiced=moment.utc(item.DateInvoiced);
										item.DateReceived=moment.utc(item.DateReceived);
									});
									lookupDescriptorService.attachData(readData || {});
									var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;
									return data.handleReadSucceeded(items, data, true);
								},
								handleCreateSucceeded:function(/* creationData */){
									var headerData=headerDataService.getSelected();
									// headerData.ProgressId=service.getList().length+2;
									// headerData.Description=headerDataService.getDescription(headerData);
									headerDataService.fireItemModified(headerData);
									headerDataService.markCurrentItemAsModified();
								}

							}
						},
						entityRole: {leaf: {itemName: 'InvHeader2InvHeader', parentService: headerDataService,doesRequireLoadAlways: true}}
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);

				var service = serviceContainer.service;
				readDataInterceptor.init(service, serviceContainer.data);

				service.sumChainInvoice=function(model,chainInvoiceIds){ // jshint ignore : line
					var chainInvoices=lookupDescriptorService.getData('InvHeaderChained');
					if(null === chainInvoices){return 0;}
					return _.sumBy(chainInvoiceIds, function (item) {
						var oneChain=chainInvoices[item];
						return oneChain?oneChain[model]:0;
					});
				};

				service.parentChange=function(){ // jshint ignore : line
					if (laterImplementParentChange) {
						return;
					}
					var invoiceIds = [];
					var parentSelected = headerDataService.getSelected();
					var invTypes = lookupDescriptorService.getData('invtype');
					var invType = (parentSelected && invTypes) ? _.find(invTypes, {Id: parentSelected.InvTypeFk}) : null;
					var list = service.getList();
					var isFicorrection = false;
					if (invType && invType.IsFicorrection) {
						var maxProgressId = _.maxBy(list, 'InvHeaderChainedProgressId');
						if (maxProgressId) {
							list = [maxProgressId];
							isFicorrection = true;
						}
					}
					_.forEach(list, function (item) {
						invoiceIds.push(item.InvHeaderChainedFk);
					});

					var sumGrossChainInvoices = 0;
					var sumNetChainInvoices = 0;
					if (isFicorrection) {
						sumGrossChainInvoices = service.sumChainInvoice('TotalPerformedGross',invoiceIds);
						sumNetChainInvoices = service.sumChainInvoice('TotalPerformedNet',invoiceIds);
					}
					else {
						sumGrossChainInvoices = service.sumChainInvoice('AmountGross',invoiceIds);
						sumNetChainInvoices = service.sumChainInvoice('AmountNet',invoiceIds);
					}
					headerDataService.onChainInvoiceChange.fire(sumGrossChainInvoices,sumNetChainInvoices);
				};

				var onDeleteDoneBase = serviceContainer.data.onDeleteDone;
				serviceContainer.data.onDeleteDone = function onDeleteDone(/* deleteParams */) {
					var headerData=headerDataService.getSelected();
					// headerData.ProgressId=service.getList().length;
					// headerData.Description=headerDataService.getDescription(headerData);
					headerDataService.fireItemModified(headerData);
					headerDataService.markCurrentItemAsModified();
					onDeleteDoneBase.apply(this, arguments);
					service.parentChange();
				};


				self.getChainedInvoicesCheckBSIsChainedNType = function getChainedInvoicesCheckBSIsChainedNType(invoiceId, invTypeFk, conHeaderFk, billingSchemaFk) {
					conHeaderFk = conHeaderFk || 0;
					var uri = globals.webApiBaseUrl + 'procurement/invoice/invheader2invheader/getChainedInvoicesCheckBSIsChainedNType?invoiceId=' + invoiceId + '&invTypeFk=' + invTypeFk + '&conHeaderFk=' + conHeaderFk + '&billingSchemaFk=' + billingSchemaFk;
					return $http({
						method: 'GET',
						url: uri
					});
				};


				var createItems = function createItems(itemList) {
					var parentItem = headerDataService.getSelected();
					var creationDatas = itemList.map(item => {
						return {
							MainItemId: parentItem.Id,
							InvHeaderChainedFk: item.Id
						};
					});

					if (creationDatas.length > 0) {
						var deleteAllPromise = service.deleteAll();
						var succeedPromises = [deleteAllPromise];
						if (!creatingItems) {
							creatingItems = true;
						}
						else {
							return;
						}
						$http.post(serviceContainer.data.httpCreateRoute + 'createitems', creationDatas).then(function (response) {
							if (serviceContainer.data.onCreateSucceeded && response.data) {
								/* var lastItem;
								 angular.forEach(response.data, function (newItem) {
								 serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
								 lastItem = newItem;
								 });

								 serviceContainer.data.listLoaded.fire();
								 if (lastItem) {
								 platformDataServiceSelectionExtension.doSelect(lastItem, serviceContainer.data);
								 } */

								if (response.data && response.data.length) {
									angular.forEach(response.data, function (newItem) {
										succeedPromises.push(serviceContainer.data.handleCreateSucceededWithoutSelect(newItem, serviceContainer.data, service));
									});
								}
							}
							$q.all(succeedPromises).then(function () {
								service.parentChange();
							});
						}).finally(function () {
							creatingItems = false;
						});
					}
					else {
						service.deleteAll().then(function () {
							service.parentChange();
						});
					}
				};

				/* serviceContainer.data.handleOnCreateSucceeded = function handleOnCreateSucceeded(newItem, data) {
				 data.itemList.push(newItem);
				 platformDataServiceDataProcessorExtension.doProcessItem(newItem, data);
				 data.markItemAsModified(newItem, data);
				 }; */

				service.deleteAll = function deleteAll() {
					var defer = $q.defer();
					var list = service.getList();
					if (list && list.length) {
						laterImplementParentChange = true;
						serviceContainer.data.supportUpdateOnSelectionChanging = false;
						return service.deleteEntities(list).then(function () {
							serviceContainer.data.supportUpdateOnSelectionChanging = true;
							laterImplementParentChange = false;
						});
					}
					defer.resolve();
					return defer.promise;
				};

				var onAutoCreateItem = function onAutoCreateItem(conHeaderId, businessPartnerFk) {
					var parentItem = headerDataService.getSelected();
					if (!parentItem || !parentItem.BillingSchemaFk) {
						return;
					}
					conHeaderId = conHeaderId || parentItem.ConHeaderFk;
					businessPartnerFk = businessPartnerFk || parentItem.BusinessPartnerFk;
					self.getChainedInvoicesCheckBSIsChainedNType(parentItem.Id, parentItem.InvTypeFk, conHeaderId, parentItem.BillingSchemaFk, businessPartnerFk).then(function (response) {
						if (!response || !response.data) {
							return;
						}
						lookupDescriptorService.updateData('InvoicePes', response.data);
						lookupDescriptorService.updateData('InvHeaderChained', response.data);
						createItems(response.data);
					});
				};

				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);

				headerDataService.autoCreateChainedInvoice.register(onAutoCreateItem);
				headerDataService.autoDeleteChainedInvoice.register(service.deleteAll);
				headerDataService.refreshChainedInvoice.register(service.gridRefresh);

				var onCompleteEntityCreated = function onCompleteEntityCreated(e, completeData) {
					/** @namespace completeData.InvHeader2InvHeaders */
					service.setCreatedItems(completeData.InvHeader2InvHeaders);
				};

				headerDataService.completeEntityCreateed.register(onCompleteEntityCreated);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'InvHeader2InvHeaderDto',
					moduleSubModule: 'Procurement.Invoice',
					validationService: 'procurementInvoiceHeader2HeaderValidationService',
					mustValidateFields: ['InvHeaderChainedFk']
				});

				return service;
			}]);
})(angular);