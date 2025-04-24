(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,jQuery,globals,_ */

	var moduleName = 'procurement.invoice';
	// jshint -W072
	angular.module(moduleName).factory('procurementInvoicePESDataService',
		['platformDataServiceFactory', 'procurementInvoiceHeaderDataService',
			'basicsLookupdataLookupDescriptorService', 'procurementInvoicePESReadOnlyProcessor',
			'procurementContextService', 'invoiceHeaderElementValidationService', '$http', 'procurementInvoicePESDataFillFieldsProcessor',
			'procurementInvoiceCertificateDataService', 'basicsCommonMandatoryProcessor', 'prcCommonCalculationHelper',
			function (dataServiceFactory, parentService, lookupDescriptorService,
				readonlyProcessor, moduleContext, invoiceHeaderValidationService, $http, fillFieldsProcessor,
				procurementInvoiceCertificateDataService, basicsCommonMandatoryProcessor, prcCommonCalculationHelper) {

				var service;
				var self;
				var serviceOptions = {
					flatNodeItem: {
						module: angular.module(moduleName),
						httpCRUD: {
							route: globals.webApiBaseUrl + 'procurement/invoice/pes/'
						},
						serviceName: 'procurementInvoicePESDataService',
						dataProcessor: [readonlyProcessor, fillFieldsProcessor, {processItem: processItem}],
						actions: {
							delete: true, create: 'flat',
							canCreateCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusCreateRightToPes');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToPes');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							},
							canDeleteCallBackFunc: function () {
								var rightByStatus = parentService.haveRightByStatus('InvStatusDeleteRightToPes');
								var editRightByStatus = parentService.haveRightByStatus('InvStatusEditRightToPes');
								if (rightByStatus.hasDescriptor || (editRightByStatus && editRightByStatus.hasDescriptor)) {
									return true;
								}
								return !moduleContext.isReadOnly && rightByStatus.right;
							}
						},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									var parentItem = parentService.getSelected();
									creationData.mainItemId = parentItem.Id;
									creationData.BillschemeFk = parentItem.BillingSchemaFk;
									creationData.BpdVatGroupFk = parentItem.BpdVatGroupFk;
									if (self.isAutoCreate) {
										creationData.PesHeaderFk = parentItem.PesHeaderFk;
										self.isAutoCreate = false;
									}
								},
								incorporateDataRead: function (readData, data) {
									lookupDescriptorService.attachData(readData || {});
									var items = data.usesCache && angular.isArray(readData) ? readData : readData.Main;

									var itemList = data.handleReadSucceeded(items, data, true);
									if (itemList.length > 0) {
										service.setSelected(itemList[0]);
									}
									return itemList;
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'InvPes',
								parentService: parentService,
								doesRequireLoadAlways: true
							}
						},
						filterByViewer: true
					}
				};

				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;
				self = this;

				service.calculateFromPes = function calculateFromPes() {
					self.pesValueOc = 0;
					self.pesVatOc = 0;
					_.forEach(service.getList(), function (item) {
						if (item) {
							self.pesValueOc += item.PesValueOc;
							self.pesVatOc += item.PesVatOc;
						}
					});
					invoiceHeaderValidationService.recalculateFromPes(self.pesValueOc, self.pesVatOc);
				};

				service.getDataByHttp = function (parentId) {
					return $http.get(globals.webApiBaseUrl + 'procurement/invoice/pes/list?mainItemId=' + parentId);
				};

				// (e=>null, deletedItems=>all deleted items)
				// replace the logic of onDeleteDone, done by stone.
				var onEntityDeleted = function onEntityDeleted(/* e, deletedItems */) {
					service.calculateFromPes();
				};
				serviceContainer.service.registerEntityDeleted(onEntityDeleted);

				// value is the pes_header id
				var onAutoCreateItem = function onAutoCreateItem(value) {
					// service.getList() id is  in INV_2PES
					var pesIds = _.map(service.getList(), 'PesHeaderFk');
					var pesItem = _.filter(pesIds, function (item) {
						return item === value;
					});
					if (pesItem.length === 0) {
						self.isAutoCreate = true;
						service.createItem();/* .then(function(response){
                           if(response.InvHeaderFk&&response.PesHeaderFk){
							   var invoicePesValidationService = $injector.get('procurementInvoicePESValidationService');
							   invoicePesValidationService.validatePesHeaderFk(response, response.PesHeaderFk, 'PesHeaderFk', false);
						   }
						}); */
					}
				};

				service.registerEntityCreated(service.calculateFromPes);

				parentService.autoCreateInvoiceToPES.register(onAutoCreateItem);

				function onModuleReadonlyStatusChange(key) {
					if (key !== moduleContext.moduleStatusKey) {
						return;
					}

					angular.forEach(service.getList(), function (item) {
						readonlyProcessor.processItem(item);
					});
				}

				// noinspection JSUnusedLocalSymbols
				function exchangeUpdated(e, args) {
					var exchangeRate = args.ExchangeRate;
					_.forEach(service.getList(), function (item) {
						item.PesValue = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.PesValueOc / exchangeRate);
						item.PesVat = prcCommonCalculationHelper.round(exchangeRate === 0 ? 0 : item.PesVatOc / exchangeRate);
						calculateValueGrossAndOc(item);
					});
					service.gridRefresh();
					service.calculateFromPes();
				}

				function processItem(newItem) {
					addAdditionalProperties(newItem);
				}

				function addAdditionalProperties(item) {
					calculateValueGrossAndOc(item);
					serviceContainer.service.gridRefresh();
				}

				function calculateValueGrossAndOc(pesItem) {
					if (pesItem === null) {
						return;
					}
					pesItem.ValueGross = pesItem.PesValue + pesItem.PesVat;
					pesItem.ValueOcGross = pesItem.PesValueOc + pesItem.PesVatOc;
				}

				parentService.exchangeRateChangedEvent.register(exchangeUpdated);
				moduleContext.moduleValueChanged.register(onModuleReadonlyStatusChange);

				parentService.refreshPes.register(service.gridRefresh);

				function setConHeaderToCertificate() {
					procurementInvoiceCertificateDataService.setConHeaderFromPes(_.map(service.getList(), 'PesHeaderFk'));
				}

				procurementInvoiceCertificateDataService.getConHeaderDataFromPes.register(setConHeaderToCertificate);

				serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'Inv2PESDto',
					moduleSubModule: 'Procurement.Invoice',
					validationService: 'procurementInvoicePESValidationService',
					mustValidateFields: ['PesHeaderFk']
				});

				return service;
			}]);
})(angular, jQuery);