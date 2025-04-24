/**
 * Created by wui on 10/23/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).factory('basicsMaterialScopeServiceFactory', [
		'$q',
		'_',
		'$translate',
		'basicsLookupdataLookupFilterService',
		'businessPartnerLogicalValidator',
		'basicsLookupdataConfigGenerator',
		'basicsCommonComplexFormatter',
		'basicsMaterialCalculationHelper',
		'prcItemScopeDetailTotalProcessor',
		'PlatformMessenger',
		'basicsLookupdataLookupDataService',
		'platformRuntimeDataService',
		'basicsMaterialPriceListLookupDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'platformDataValidationService',
		'basicsCommonRoundingService',
		function ($q,
				_,
				$translate,
				basicsLookupdataLookupFilterService,
				businessPartnerLogicalValidator,
				basicsLookupdataConfigGenerator,
				basicsCommonComplexFormatter,
				basicsMaterialCalculationHelper,
				prcItemScopeDetailTotalProcessor,
				PlatformMessenger,
				basicsLookupdataLookupDataService,
				platformRuntimeDataService,
				basicsMaterialPriceListLookupDataService,
				basicsLookupdataLookupDescriptorService,
				basicsCommonMandatoryProcessor,
				platformDataValidationService,
				basicsCommonRoundingService) {
			var factory = {};
			let roundType=basicsMaterialCalculationHelper.roundingType;
			factory.createScopeLayout = function (options) {
				var filters = [
					{
						key: 'scope-subsidiary-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierFk : null
							};
						}
					},
					{
						key: 'scope-supplier-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerFk : null,
								SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryFk : null
							};
						}
					},
					{
						key: 'scope-subsidiary-prod-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-subsidiary-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerProdFk : null,
								SupplierFk: currentItem !== null ? currentItem.SupplierProdFk : null
							};
						}
					},
					{
						key: 'scope-supplier-prod-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-supplier-common-filter',
						fn: function (currentItem) {
							return {
								BusinessPartnerFk: currentItem !== null ? currentItem.BusinessPartnerProdFk : null,
								SubsidiaryFk: currentItem !== null ? currentItem.SubsidiaryProdFk : null
							};
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				return {
					fid: options.fid,
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'basicData',
							attributes: ['matscope', 'descriptioninfo', 'businesspartnerfk', 'subsidiaryfk', 'supplierfk',
								'businesspartnerprodfk', 'subsidiaryprodfk', 'supplierprodfk', 'commenttext', 'remark',
								'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5','isselected']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						'businesspartnerfk': {
							'navigator': {
								moduleName: 'businesspartner.main'
							},
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-business-partner-dialog',
									'lookupOptions': {
										'showClearButton': true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'BusinessPartner',
									'displayMember': 'BusinessPartnerName1'
								},
								'width': 130
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-business-partner-dialog',
								'options': {
									'showClearButton': true
								}
							}
						},
						'subsidiaryfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-subsidiary-lookup',
									'lookupOptions': {
										'showClearButton': true,
										'filterKey': 'scope-subsidiary-filter',
										'displayMember': 'AddressLine'
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'Subsidiary', 'displayMember': 'AddressLine'},
								'width': 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									'initValueField': 'SubsidiaryAddress',
									'filterKey': 'scope-subsidiary-filter',
									'showClearButton': true,
									'displayMember': 'AddressLine'
								}
							}
						},
						'supplierfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-supplier-lookup',
									'lookupOptions': {
										'filterKey': 'scope-supplier-filter',
										'showClearButton': true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
								'width': 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'business-partner-main-supplier-lookup',
									'descriptionField': 'SupplierDescription',
									'descriptionMember': 'Description',
									'lookupOptions': {
										'filterKey': 'scope-supplier-filter',
										'showClearButton': true
									}
								}
							}
						},

						'businesspartnerprodfk': {
							'navigator': {
								moduleName: 'businesspartner.main'
							},
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-business-partner-dialog',
									'lookupOptions': {
										'showClearButton': true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'BusinessPartner',
									'displayMember': 'BusinessPartnerName1'
								},
								'width': 130
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-business-partner-dialog',
								'options': {
									'showClearButton': true
								}
							}
						},
						'subsidiaryprodfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-subsidiary-lookup',
									'lookupOptions': {
										'showClearButton': true,
										'filterKey': 'scope-subsidiary-prod-filter',
										'displayMember': 'AddressLine'
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'Subsidiary', 'displayMember': 'AddressLine'},
								'width': 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'business-partner-main-subsidiary-lookup',
								'options': {
									'initValueField': 'SubsidiaryAddress',
									'filterKey': 'scope-subsidiary-filter',
									'showClearButton': true
								}
							}
						},
						'supplierprodfk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									'directive': 'business-partner-main-supplier-lookup',
									'lookupOptions': {
										'filterKey': 'scope-supplier-prod-filter',
										'showClearButton': true
									}
								},
								'formatter': 'lookup',
								'formatterOptions': {'lookupType': 'supplier', 'displayMember': 'Code'},
								'width': 125
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'business-partner-main-supplier-lookup',
									'descriptionField': 'SupplierDescription',
									'descriptionMember': 'Description',
									'lookupOptions': {
										'filterKey': 'scope-supplier-prod-filter',
										'showClearButton': true
									}
								}
							}
						}
					}
				};
			};

			factory.createScopeValidationService = function (dataService) {
				var service = {};
				var bpValidator = businessPartnerLogicalValidator.getService({dataService: dataService});
				var bpProdValidator = businessPartnerLogicalValidator.getService({
					dataService: dataService,
					BusinessPartnerFk: 'BusinessPartnerProdFk',
					SubsidiaryFk: 'SubsidiaryProdFk',
					SupplierFk: 'SupplierProdFk'
				});

				service.validateBusinessPartnerFk = function () {
					bpValidator.businessPartnerValidator.apply(null, arguments);
				};

				service.validateSupplierFk = function (entity, value) {
					bpValidator.supplierValidator(entity, value);
				};

				service.validateSubsidiaryFk = function (entity, value) {
					bpValidator.subsidiaryValidator(entity, value);
				};

				service.validateBusinessPartnerProdFk = function () {
					bpProdValidator.businessPartnerValidator.apply(null, arguments);
				};

				service.validateSupplierProdFk = function (entity, value) {
					bpProdValidator.supplierValidator(entity, value);
				};
				service.validateSubsidiaryProdFk = function (entity, value) {
					bpProdValidator.subsidiaryValidator(entity, value);
				};

				service.validateIsSelected=function(entity, value){
					var doGridRefresh = false;
					var list = dataService.getList();
					var parentDataService = dataService.parentService();
					var materialItem = parentDataService.getSelected();
					if (value === true) {
						list.forEach(function (item) {
							if (item !== entity) {
								doGridRefresh = true;
								if(item.IsSelected !== false){
									item.IsSelected = false;
									dataService.markItemAsModified(item);
								}
							}
						});

						if(doGridRefresh){
							dataService.gridRefresh();
						}
					}
					entity.IsSelected = value;
					dataService.isSelectedChanged.fire(dataService.isSelectedChanged, {
						materialItem: materialItem,
						itemScope: entity
					});
					return true;
				};

				return service;
			};

			factory.createScopeDetailLayout = function (priceConditionService) {
				var addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];

				var filters = [
					{
						key: 'basics-material-scope-item-detail-material-filter',
						serverSide: true,
						fn: function (dataItem, searchOptions) {
							var filter = {};

							// set Filter for material-lookup-controller
							searchOptions.DisplayedPriceType = 1; // using cost price
							searchOptions.Filter = filter;

							searchOptions.MaterialTypeFilter = {
								IsForProcurement: true
							};

							if (dataItem && dataItem.PrcStructureFk) {
								filter.PrcStructureId = dataItem.PrcStructureFk;
							}

							return filter;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				let layout= {
					fid: 'basics.material.scope.detail',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							gid: 'basicData',
							attributes: ['scopeofsupplytypefk', 'itemno', 'prcstructurefk', 'description1info', 'description2info',
								'specificationinfo', 'quantity', 'uomfk', 'price',
								'prcpriceconditionfk', 'priceextra', 'priceunit', 'uompriceunitfk', 'factorpriceunit',
								'daterequired', 'paymenttermfifk', 'paymenttermpafk', 'prcincotermfk', 'addressfk',
								'hastext', 'supplierreference', 'trademark', 'commenttext', 'remark',
								'quantityaskedfor', 'quantitydelivered', 'batchno', 'userdefined1', 'userdefined2',
								'userdefined3', 'userdefined4', 'userdefined5', 'total', 'materialfk']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'overloads': {
						'scopeofsupplytypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.material.scopeofsupplytype'),
						'itemno': {
							'mandatory': true,
							'detail': {
								'type': 'directive',
								'model': 'ItemNo',
								'directive': 'basics-common-limit-input',
								'options': {
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							},
							'grid': {
								formatter: 'code',
								editor: 'directive',
								editorOptions: {
									directive: 'basics-common-limit-input',
									validKeys: {
										regular: '^[1-9]{1}[0-9]{0,7}$'
									},
									isCodeProperty: true
								}
							}
						},
						'prcstructurefk': {
							navigator: {
								moduleName: 'basics.procurementstructure'
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-procurementstructure-structure-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcStructure',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									},
									directive: 'basics-procurementstructure-structure-dialog'
								},
								width: 100
							},
							'mandatory': true
						},
						'description1info': {
							'mandatory': true
						},
						'description2info': {
							'mandatory': true
						},
						'specificationinfo': {
							'mandatory': true
						},
						'quantity': {
							'mandatory': true
						},
						'quantityconverted': {
							readonly: true
						},
						'liccostgroup1fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup1'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group1-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group1-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup1',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup1LookupService'
								}
							}
						},
						'liccostgroup2fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup2'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group2-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group2-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup2',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup2LookupService'
								}
							}
						},
						'liccostgroup3fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup3'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group3-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group3-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup3',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup3LookupService'
								}
							}
						},
						'liccostgroup4fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup4'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group4-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group4-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup4',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup4LookupService'
								}
							}
						},
						'liccostgroup5fk': {
							navigator: {
								moduleName: 'basics.costgroups-costgroup5'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-basics-cost-group5-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-basics-cost-group5-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'basicscostgroup5',
									displayMember: 'Code',
									dataServiceName: 'estimateMainBasicsCostGroup5LookupService'
								}
							}
						},
						'prjcostgroup1fk': {
							navigator: {
								moduleName: 'project.main-costgroup1'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group1-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group1-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup1',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup1LookupService'
								}
							}
						},

						'prjcostgroup2fk': {
							navigator: {
								moduleName: 'project.main-costgroup2'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group2-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group2-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup2',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup2LookupService'
								}
							}
						},

						'prjcostgroup3fk': {
							navigator: {
								moduleName: 'project.main-costgroup3'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group3-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group3-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup3',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup3LookupService'
								}
							}
						},

						'prjcostgroup4fk': {
							navigator: {
								moduleName: 'project.main-costgroup4'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group4-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group4-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup4',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup4LookupService'
								}
							}
						},

						'prjcostgroup5fk': {
							navigator: {
								moduleName: 'project.main-costgroup5'
							},
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-project-cost-group5-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-project-cost-group5-dialog',
									lookupOptions: {
										'showClearButton': true,
										'additionalColumns': true,
										'displayMember': 'Code',
										'addGridColumns': addColumns
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProjectCostGroup5',
									displayMember: 'Code',
									dataServiceName: 'estimateMainProjectCostGroup5LookupService'
								}
							}
						},
						'uomfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup'
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-uom-lookup',
									lookupOptions: {
										isFastDataRecording: true
									}
								},
								width: 100
							}
						},
						'price': {
							'mandatory': true
						},
						'priceoc': {
							'mandatory': true
						},
						'prcpriceconditionfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-Material-Price-Condition-Combobox',
								'options': {
									filterKey: 'req-requisition-filter',
									showClearButton: true,
									dataService: priceConditionService
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcPricecondition',
									displayMember: 'DescriptionInfo.Translated'
								},
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-Material-Price-Condition-Combobox',
									lookupOptions: {
										filterKey: 'req-requisition-filter',
										showClearButton: true,
										dataService: priceConditionService
									}
								},
								width: 180
							}
						},
						'priceextra': {
							'readonly': true,
							'mandatory': true
						},
						'priceextraoc': {
							'readonly': true,
							'mandatory': true
						},
						'priceunit': {
							'mandatory': true
						},
						'uompriceunitfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-uom-lookup',
								'options': {
									showClearButton: true
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Uom',
									displayMember: 'Unit'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										isFastDataRecording: true
									},
									directive: 'basics-lookupdata-uom-lookup'
								},
								width: 100
							}
						},
						'factorpriceunit': {
							'mandatory': true
						},
						'daterequired': {
							'mandatory': true
						},
						'paymenttermfifk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 150
							}
						},
						'paymenttermpafk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-payment-term-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PaymentTerm',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-payment-term-lookup'
								},
								width: 170
							}
						},
						// 'prcincotermfk': {
						// 	'detail': {
						// 		'type': 'directive',
						// 		'directive': 'basics-lookupdata-incoterm-combobox',
						// 		'options': {
						// 			showClearButton: true
						// 		}
						// 	},
						// 	'grid': {
						// 		formatter: 'lookup',
						// 		formatterOptions: {
						// 			lookupType: 'PrcIncoterm',
						// 			displayMember: 'Description'
						// 		},
						// 		editor: 'lookup',
						// 		editorOptions: {
						// 			lookupOptions: {showClearButton: true},
						// 			directive: 'basics-lookupdata-incoterm-combobox'
						// 		},
						// 		width: 100
						// 	}
						// },
						'prcincotermfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-incoterm-combobox',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-incoterm-combobox'
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcincoterm',
									displayMember: 'Code'
								}
							}
						},
						'addressfk': {
							detail: {
								type: 'directive',
								directive: 'basics-common-address-dialog',
								model: 'Address',
								options: {
									titleField: 'cloud.common.address',
									foreignKey: 'AddressFk',
									showClearButton: true
								}
							},
							grid: {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-common-address-dialog',
									lookupOptions: {
										foreignKey: 'AddressFk',
										titleField: 'cloud.common.address'
									}
								},
								formatter: 'description',
								field: 'Address',
								formatterOptions: {
									displayMember: 'AddressLine'
								}
							}
						},
						'hastext': {
							'readonly': true,
							'mandatory': true
						},
						'supplierreference': {
							'mandatory': true
						},
						'batchno': {
							'readonly': true,
							'mandatory': true
						},
						'quantityaskedfor': {
							'readonly': true,
							'mandatory': true
						},
						'quantitydelivered': {
							'readonly': true,
							'mandatory': true
						},
						'total': {
							'readonly': true,
							'mandatory': true
						},
						'totalcurrency': {
							'readonly': true,
							'mandatory': true
						},
						'materialfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-material-material-lookup',
								'options': {
									showClearButton: true,
									filterKey: 'basics-material-scope-item-detail-material-filter'
								}
							},
							'grid': {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialCommodity',
									displayMember: 'Code'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										filterKey: 'basics-material-scope-item-detail-material-filter'
									},
									directive: 'basics-material-material-lookup'
								},
								width: 100
							}
						}
					},
					'addition': {
						'grid': [{
							'lookupDisplayColumn': true,
							'field': 'PrcStructureFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'width': 120
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermFiFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermFiDescription',
							'width': 170
						}, {
							'lookupDisplayColumn': true,
							'field': 'PaymentTermPaFk',
							'displayMember': 'Description',
							'name$tr$': 'cloud.common.entityPaymentTermPaDescription',
							'width': 170
						},	{
							'lookupDisplayColumn': true,
							'field': 'PrcIncotermFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityIncotermCodeDescription',
							'width': 120
						}]
					}
				};

				basicsCommonRoundingService.getService('basics.material').uiRoundingConfig(layout);

				return layout;
			};

			factory.createScopeDetailValidationService = function (priceConditionService, options) {
				var service = {
					asyncValidatePrcPriceConditionFk: asyncValidatePrcPriceConditionFk
				};

				function asyncValidatePrcPriceConditionFk(entity, value) {
					var defer = $q.defer();
					entity.PrcPriceConditionFk = value;
					priceConditionService.reload(entity, value).then(function () {
						defer.resolve(true);
					}, function () {
						defer.resolve(true);
					});

					return defer.promise;
				}

				service.validateItemNo = function (entity, value) {
					var itemList = options.dataService.getList();

					if(angular.isString(value)){
						value = !value? 0:  parseInt(value);
					}

					return platformDataValidationService.validateIsUnique(entity, value, 'ItemNo', itemList, service, options.dataService);
				};

				service.validatePrcStructureFk = function (entity, value) {
					if(value === 0){
						value = null;
					}
					return platformDataValidationService.validateMandatory(entity, value, 'PrcStructureFk', service, options.dataService);
				};

				service.validateUomFk = function (entity, value) {
					entity.UomPriceUnitFk = value;
					entity.FactorPriceUnit = 1;
				};

				service.validateUomPriceUnitFk = function (entity, value) {
					entity.FactorPriceUnit = 1;
					var uoms = basicsLookupdataLookupDescriptorService.getData('Uom');
					if (uoms) {
						var uomObj = uoms[entity.UomFk];
						var uomPriceObj = uoms[value];
						if (uomObj && uomPriceObj) {
							if ((uomPriceObj.LengthDimension !== 0 && uomObj.LengthDimension === uomPriceObj.LengthDimension) ||
								(uomPriceObj.MassDimension !== 0 && uomObj.MassDimension === uomPriceObj.MassDimension) ||
								(uomPriceObj.TimeDimension !== 0 && uomObj.TimeDimension === uomPriceObj.TimeDimension)) {
								if (uomPriceObj.Factor !== 0 && uomPriceObj.Factor) {
									entity.FactorPriceUnit = uomObj.Factor / uomPriceObj.Factor;
								}
							}
						}
					}
				};

				service.validatePrice = function (entity, value) {
					if(_.isNumber(value)) {
						entity.Price = value;
						entity.PriceOc = toOc(value);
						processTotal(entity);
					}
				};

				service.validatePriceOc = function (entity, value) {
					entity.PriceOc = value;
					entity.Price = fromOc(value);
					processTotal(entity);
				};

				service.validatePriceExtra = function (entity, value) {
					if(_.isNumber(value)) {
						entity.PriceExtra = value;
						entity.PriceExtraOc = toOc(value);
						processTotal(entity);
					}
				};

				service.validatePriceExtraOc = function (entity, value) {
					entity.PriceExtraOc = value;
					entity.PriceExtra = fromOc(value);
					processTotal(entity);
				};

				service.updatePriceExtraAndOc = function (entity, priceExtra, priceExtraOc) {
					entity.PriceExtra = priceExtra;
					entity.PriceExtraOc = priceExtraOc;
					processTotal(entity);
				};


				service.validatePriceUnit = function (entity, value) {
					entity.PriceUnit = value;
					processTotal(entity);
				};

				service.validateFactorPriceUnit = function (entity, value) {
					entity.FactorPriceUnit = value;
					processTotal(entity);
				};

				service.validateQuantity = function (entity, value) {
					if(_.isNumber(value)) {
						entity.Quantity = value;
						processTotal(entity);
					}
				};

				service.asyncValidateMaterialFk = function (entity, value) {
					//if user click clear button, no need to clear other data
					if (_.isNil(value)) {
						platformRuntimeDataService.readonly(entity, [{field: 'PrcStructureFk', readonly: false}]);
						platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: false}]);
						return $q.when(true);
					}

					var defer = $q.defer();

					platformRuntimeDataService.readonly(entity, [{field: 'UomFk', readonly: true}]);
					platformRuntimeDataService.readonly(entity, [{field: 'PrcStructureFk', readonly: true}]);

					basicsLookupdataLookupDataService.getItemByKey('MaterialCommodity', value).then(function (response) {
						if (!angular.isObject(response)) {
							defer.resolve(true);
							return;
						}

						basicsLookupdataLookupDescriptorService.updateData('MaterialCommodity', [response]);

						var materialItem = response;
						var priceList = basicsMaterialPriceListLookupDataService.getPriceList(materialItem);

						entity.MaterialFk = value;
						entity.PriceUnit = materialItem.PriceUnit;
						entity.UomFk = materialItem.BasUomFk;
						entity.UomPriceUnitFk = materialItem.BasUomPriceUnitFk;
						entity.FactorPriceUnit = materialItem.FactorPriceUnit;
						entity.PrcStructureFk = materialItem.PrcStructureFk;
						service.validatePrcStructureFk(entity, entity.PrcStructureFk);
						platformRuntimeDataService.applyValidationResult(true, entity, 'PrcStructureFk');
						setTranslationInfo(entity.Description1Info, materialItem.DescriptionInfo);
						setTranslationInfo(entity.Description2Info, materialItem.DescriptionInfo2);
						setTranslationInfo(entity.SpecificationInfo, materialItem.SpecificationInfo);

						reloadPriceCondition(entity, priceList.PrcPriceConditionFk, priceList.Id).then(function () {
							entity.PriceOc = round(priceList.Cost - priceList.PriceExtra);
							entity.Price = fromOc(entity.PriceOc,roundType.PriceOc);
							processTotal(entity);
						}).finally(function () {
							defer.resolve();
						});
					}, function () {
						defer.resolve();
					});

					return defer.promise;
				};

				service.onTotalChanged = new PlatformMessenger();
				service.processTotal = processTotal;
				service.toOc = toOc;
				service.fromOc = fromOc;
				service.round = round;
				service.setTranslationInfo = setTranslationInfo;

				function processTotal(entity) {
					prcItemScopeDetailTotalProcessor.processItem(entity);
					service.onTotalChanged.fire();
				}

				function toOc(value) {
					var exchangeRate = options.getExchangeRate();
					return round(value * exchangeRate);
				}

				function fromOc(value,type) {
					var exchangeRate = options.getExchangeRate();

					if (exchangeRate === 0) {
						exchangeRate = 1;
					}
					if(type) {
						return basicsMaterialCalculationHelper.round(type, value / exchangeRate);
					}
					else{
						return value / exchangeRate;
					}
				}

				function round(value) {
					return _.isNaN(value) ? 0 : basicsMaterialCalculationHelper.round(roundType.NoType,value);
				}

				function reloadPriceCondition(entity, value, materialPriceListId) {
					entity.PrcPriceConditionFk = value;
					return priceConditionService.reload(entity, entity.PrcPriceConditionFk, true, false, materialPriceListId);
				}

				function setTranslationInfo(to, from) {
					to.Translated = from.Translated;
					to.Modified = true;
				}

				options.dataService.validationService = function () {
					return service;
				};

				options.dataService.getData().newEntityValidator = basicsCommonMandatoryProcessor.create({
					typeName: 'MaterialScopeDetailDto',
					moduleSubModule: 'Basics.Material',
					validationService: service,
					mustValidateFields: ['PrcStructureFk']
				});

				options.dataService.registerEntityCreated(function () {
					service.onTotalChanged.fire();
				});

				options.dataService.registerEntityDeleted(function () {
					service.onTotalChanged.fire();
				});

				return service;
			};

			factory.createItemTextLayout = function () {
				return {
					'fid': 'basics.material.scope.item.text',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [{
						'gid': 'basicData',
						'attributes': ['prctexttypefk','prcincotermfk']
					}],
					'overloads': {
						'prctexttypefk': {
							'grid': {
								'editor': 'lookup',
								'editorOptions': {
									directive: 'procurement-text-type-combobox',
									lookupOptions: {}
								},
								'formatter': 'lookup',
								'formatterOptions': {
									'lookupType': 'Configuration2TextType',
									'displayMember': 'Description'
								},
								'width': 120
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									'lookupDirective': 'procurement-text-type-combobox',
									'descriptionMember': 'Description',
									lookupOptions: {}
								}
							}
						},'prcincotermfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-lookupdata-incoterm-combobox',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {showClearButton: true},
									directive: 'basics-lookupdata-incoterm-combobox'
								},
								width: 125,
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'prcincoterm',
									displayMember: 'Code'
								}
							}
						}
					},
					'addition':{
						'grid': [{
								'lookupDisplayColumn': true,
								'field': 'PrcIncotermFk',
								'displayMember': 'DescriptionInfo.Translated',
								'name$tr$': 'cloud.common.entityIncotermCodeDescription',
								'width': 120
						}]
					}
				};
			};

			return factory;
		}
	]);

})(angular);