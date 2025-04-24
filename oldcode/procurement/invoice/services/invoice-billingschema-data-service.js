/**
 * invoice billing schema data service
 * create by lnb 2015-06-24
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('invoiceBillingSchemaDataService',
		['$http', 'commonBillingSchemaDataService', '$q', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'procurementInvoiceHeaderDataService', 'procurementContextService',
			'procurementInvoiceGeneralDataService',
			function ($http, commonBillingSchemaDataService, $q, lookupDataService, basicsLookupdataLookupDescriptorService, procurementInvoiceHeaderDataService, moduleContext,
				procurementInvoiceGeneralDataService) {
				var service = commonBillingSchemaDataService.getService(procurementInvoiceHeaderDataService, 'procurement/invoice/billingschema/', {
					onUpdateSuccessNotify: procurementInvoiceHeaderDataService.onUpdateSucceeded
				});

				var initConfigurations = function initConfigurations() {
					lookupDataService.getSearchList('prcconfiguration', 'RubricFk=28').then(function (data) {
						basicsLookupdataLookupDescriptorService.attachData({prcconfiguration: data});
					});
				};

				// use to copy general's value to billingSchema's value
				service.registerEntityCreated(onEntityCreated);

				// noinspection JSUnusedLocalSymbols
				function onEntityCreated(e, item) {
					angular.forEach(procurementInvoiceGeneralDataService.getList(), function (general) {
						switch (item.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (item.GeneralsTypeFk === general.PrcGeneralstypeFk) {
									item.Value = general.Value;
									if (general.ControllingUnitFk) {
										item.ControllingUnitFk = general.ControllingUnitFk;
									}
									if (general.TaxCodeFk) {
										item.TaxCodeFk = general.TaxCodeFk;
									}
									service.markItemAsModified(item);
								}
								break;
						}
					});
				}

				procurementInvoiceGeneralDataService.registerGeneralCreated(onGeneralsCreated);
				procurementInvoiceGeneralDataService.registerGeneralDeleted(onGeneralsDelete);
				procurementInvoiceGeneralDataService.registerControllingUnitOrTaxCodeChange(onGeneralsCuOrTcChange);

				// noinspection JSUnusedLocalSymbols
				function onGeneralsCreated(e, general) {
					angular.forEach(service.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
							case 13:
							case 14:
								if (general.PrcGeneralstypeFk && billingSchema.GeneralsTypeFk === general.PrcGeneralstypeFk) {
									billingSchema.Value = general.Value;
									service.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					service.setPostHiddenStatus(true);
				}

				function onGeneralsCuOrTcChange(e, result) {
					angular.forEach(service.getMergeItems(), function (billingSchema) {
						switch (billingSchema.BillingLineTypeFk) {
							case 8:
							case 10:
								if (billingSchema.GeneralsTypeFk === result.entity.PrcGeneralstypeFk) {
									if (result.model === 'ControllingUnitFk') {
										billingSchema.ControllingUnitFk = result.value;
									} else if (result.model === 'TaxCodeFk') {
										billingSchema.TaxCodeFk = result.value;
									}
									service.markItemAsModified(billingSchema);
								}
								break;
						}
					});
					service.setPostHiddenStatus(true);
				}

				var array = [];

				function onGeneralsDelete(e, general) {
					if (general) {
						array = array.concat(general);

						var parentItem = procurementInvoiceHeaderDataService.getSelected();
						var creationData = {
							HeaderFK: parentItem.Id,
							billingSchemaFk: parentItem.BillingSchemaFk,
							rubricCategoryFk: service.getRubricCategory(parentItem)
						};
						$http({
							method: 'get',
							url: globals.webApiBaseUrl + 'procurement/invoice/billingschema/reloaditems',
							params: creationData
						}).then(function (res) {
							angular.forEach(array, function (gen) {
								angular.forEach(service.getMergeItems(), function (billingSchema) {
									switch (billingSchema.BillingLineTypeFk) {
										case 8:
										case 10:
										case 13:
										case 14:
											if (billingSchema.GeneralsTypeFk === gen.PrcGeneralstypeFk) {
												angular.forEach(res.data.InvBillingSchemas, function (item) {
													if (item.BillingLineTypeFk === billingSchema.BillingLineTypeFk) {
														billingSchema.Value = item.Value;
														service.markItemAsModified(billingSchema);
													}
												});
											}
											break;
									}
								});
								service.setPostHiddenStatus(true);
							});
							array.length = 0;
						});
					}
				}

				service.getRubricCategory = function getRubricCategory(selectedInvoice) {
					selectedInvoice = selectedInvoice || procurementInvoiceHeaderDataService.getSelected();
					var config = _.find(basicsLookupdataLookupDescriptorService.getData('prcconfiguration'), {Id: selectedInvoice.PrcConfigurationFk});
					return config.RubricCategoryFk;
				};

				var moduleContextChanged = function moduleContextChanged(key) {
					if (key === moduleContext.moduleReadOnlyKey || key === moduleContext.moduleStatusKey) {
						angular.forEach(service.getList(), function (item) {
							service.updateRowReadonly(item);
						});
					}
				};

				service.getModuleReadonly = function getModuleReadonly() {
					return moduleContext.isReadOnly;
				};

				var getCellEditableBase = service.getCellEditable;

				service.getCellEditable = function getCellEditable(item, model) {
					var billingLineTypeFk = [8, 10, 13, 14];
					var editableResult = getCellEditableBase(item, model);
					if (!item || !item.Id) {
						return editableResult;
					}
					if (model === 'Value') {
						var isInLineType = _.indexOf(billingLineTypeFk, item.BillingLineTypeFk) !== -1;
						if (isInLineType && item.GeneralsTypeFk) {
							editableResult = false;
						}
					}
					if (model === 'Result' || model === 'ResultOc') {
						editableResult = item.BillingLineTypeFk === 19;// Dif. Discount Basis
					}
					return editableResult;
				};

				const onBillingSchemaChanged = service.reloadBillingSchemas = async function onBillingSchemaChanged(e, invHeader,isCalculating) {
					service.setPostHiddenStatus(true);
					service.autoReloadBilling = false;

					let parentItem = invHeader || procurementInvoiceHeaderDataService.getSelected();
					if (parentItem !== null) {
						try {
							await service.onBillingSchemaChanged(parentItem);
							if(!isCalculating){
								procurementInvoiceGeneralDataService.autoReloadGeneralsByBusinessPartnerFk(isCalculating);
							}
							service.autoReloadBilling = true;
						} catch (error) {
							console.error('Error occurred while reloading billing schemas:', error);
						}
					}
					return true;
				};

				service.getReloadBillingStatus = function () {
					return service.autoReloadBilling;
				};
				moduleContext.moduleValueChanged.register(moduleContextChanged);
				procurementInvoiceHeaderDataService.BillingSchemaChanged.register(onBillingSchemaChanged);

				initConfigurations();
				return service;
			}]);
})(angular);