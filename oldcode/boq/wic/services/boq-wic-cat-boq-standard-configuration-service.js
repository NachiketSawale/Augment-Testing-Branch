/**
 * Created by bh on 07.05.2015.
 */

(function () {
	/* global _ */
	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicCatBoqStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for wic cat boq entities
	 */
	angular.module(moduleName).factory('boqWicCatBoqStandardConfigurationService',
		['platformUIStandardConfigService', 'boqWicTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
			'$injector', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, boqWicTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, $injector, platformUIStandardExtentService) {

				var allFields =
					['BoqRootItem.Reference', 'BoqRootItem.ExternalCode', 'BoqRootItem.BriefInfo', 'WicBoq.MdcMaterialCatalogFk', 'BoqHeader.BasCurrencyFk', 'BoqHeader.IsGCBoq', 'WicBoq.CopyTemplateOnly'
						, 'WicBoq.BpdBusinessPartnerFk', 'WicBoq.BpdSubsidiaryFk', 'WicBoq.BpdSupplierFk', 'WicBoq.BasPaymentTermFk', 'WicBoq.BasClerkFk', 'WicBoq.MdcWicTypeFk', 'WicBoq.ValidFrom', 'WicBoq.ValidTo', 'WicBoq.BasPaymentTermFiFk', 'WicBoq.BasPaymentTermAdFk', 'WicBoq.ConHeaderFk', 'WicBoq.OrdHeaderFk','WicBoq.BpdCustomerFk'];


				function createWicCatBoqDetailLayout() {
					return {
						fid: 'boq.wic.boqdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'basicData',
								attributes: _.map(allFields, function(field) {
									return field.toLowerCase();
								})
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							'boqrootitem.reference': {
								navigator: {
									moduleName: 'boq.main',
									'navFunc': function (triggerFieldOption, item) {
										var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
										if (boqRuleComplexLookupService) {
											boqRuleComplexLookupService.setNavFromBoqWic();

											var boqWicGroupService = $injector.get('boqWicGroupService');
											if (boqWicGroupService) {
												boqWicGroupService.updateAndExecute(function () {

													boqRuleComplexLookupService.loadLookupData().then(function () {
														boqRuleComplexLookupService.setBoqHeaderId(item.BoqHeader.Id);
														$injector.get('platformModuleNavigationService').navigate({moduleName: 'boq.main'}, item, triggerFieldOption);
													});
												});
											}
										}
									}
								},
								grid:{
									sortOptions: {
										numeric: true
									}
								},
							},
							'wicboq.mdcmaterialcatalogfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsLookupMaterialCatalogDataService',
								filter: function (item) {
									var type;
									if (item) {
										type = 3; // corresponds to MaterialCatalogTypeFk; 3 currently stands for Framework Agreement; id has changed 2 times within half a year, without any notice to me !!!
									}

									return type;
								},
								enableCache: true,
								navigator: {
									moduleName: 'basics.materialcatalog',
									registerService: 'basicsMaterialCatalogService'
								}
							}),
							'boqheader.bascurrencyfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCurrencyLookupDataService',
								enableCache: true
							}),
							'wicboq.bpdbusinesspartnerfk': {
								navigator: {
									moduleName: 'businesspartner.main'
								},
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										// 'directive': 'business-partner-main-business-partner-dialog'
										'directive': 'filter-business-partner-dialog-lookup',
										'lookupOptions': {
											'showClearButton': true
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'BusinessPartner',
										'displayMember': 'BusinessPartnerName1'
									},
									'width': 150
								},
								'detail': {
									'type': 'directive',
									// 'directive': 'business-partner-main-business-partner-dialog'
									'directive': 'filter-business-partner-dialog-lookup',
									'options': {
										'showClearButton': true
									}
								}
							},
							'wicboq.bpdsubsidiaryfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-subsidiary-lookup',
										'lookupOptions': {'showClearButton': true, 'filterKey': 'wic-boq-subsidiary-filter', 'displayMember': 'AddressLine'}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
									'width': 180
								},
								'detail': {
									'type': 'directive',
									'directive': 'business-partner-main-subsidiary-lookup',
									'options': {
										'filterKey': 'wic-boq-subsidiary-filter', 'showClearButton': true,
										'displayMember': 'AddressLine'
									}
								}
							},
							'wicboq.bpdsupplierfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-supplier-lookup',
										'lookupOptions': {'filterKey': 'wic-boq-supplier-filter', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'Supplier', 'displayMember': 'Code'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'business-partner-main-supplier-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {'filterKey': 'wic-boq-supplier-filter', 'showClearButton': true}
									}
								}
							},
							'wicboq.bpdcustomerfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'business-partner-main-customer-lookup',
										'lookupOptions': {'filterKey': 'basics-company-customerledger-group', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'customer', 'displayMember': 'Code'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'business-partner-main-customer-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {'filterKey': 'basics-company-customerledger-group', 'showClearButton': true}
									}
								}
							},
							'wicboq.baspaymenttermfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-lookupdata-payment-term-lookup',
										'lookupOptions': {'displayMember': 'Code', 'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
									'width': 80
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-lookupdata-payment-term-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {'showClearButton': true}
									}
								}
							},
							'wicboq.baspaymenttermfifk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'lookupOptions': {'showClearButton': true},
										'directive': 'basics-lookupdata-payment-term-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
									'width': 140
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-lookupdata-payment-term-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {'initValueField': 'PaymentTermFiCode', 'showClearButton': true}
									}
								}
							},
							'wicboq.baspaymenttermadfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'lookupOptions': {'showClearButton': true},
										'directive': 'basics-lookupdata-payment-term-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'PaymentTerm', 'displayMember': 'Code'},
									'width': 140
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-lookupdata-payment-term-lookup',
										'descriptionMember': 'Description',
										'lookupOptions': {'initValueField': 'PaymentTermAdCode', 'showClearButton': true}
									}
								}
							},
							'wicboq.basclerkfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'cloud-clerk-clerk-dialog',
										'lookupOptions': {'showClearButton': true}
									},
									'formatter': 'lookup',
									'formatterOptions': {'lookupType': 'clerk', 'displayMember': 'Code'},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'cloud-clerk-clerk-dialog',
										'descriptionMember': 'Description',
										'lookupOptions': {'showClearButton': true}
									}
								}
							},
							'wicboq.mdcwictypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomWicTypeLookupDataService',
								enableCache: true
							}),
							'wicboq.conheaderfk': {
								editor: 'lookup',
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'ConHeaderView',
										displayMember: 'Code'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'prc-con-header-dialog',
										lookupOptions: {
											displayMember: 'Code'
										}
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'prc-con-header-dialog',
										descriptionMember: 'Description'
									}
								},
								readonly: true
							},
							'wicboq.ordheaderfk': {
								editor: 'lookup',
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'SalesContract',
										displayMember: 'Code'
									},
									editor: 'lookup',
									editorOptions: {
										directive: 'sales-common-contract-dialog',
										lookupOptions: {
											displayMember: 'Code'
										}
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'sales-common-contract-dialog',
										descriptionMember: 'DescriptionInfo.Translated'
									}
								},
								readonly: true
							}
						},
						addition: {
							grid: [
								{
									lookupDisplayColumn: true,
									displayMember: 'Description',
									field: 'WicBoq.ConHeaderFk',
									name: 'Contract Description',
									name$tr$: 'cloud.common.entityContractDescription',
									width: 150
								},
								{
									lookupDisplayColumn: true,
									displayMember: 'DescriptionInfo.Translated',
									field: 'WicBoq.OrdHeaderFk',
									name: 'Sales Contract Description',
									name$tr$: 'OrdHeaderDescription',
									width: 150
								}
							]
						}
					};
				}

				var wicCatBoqDetailLayout = createWicCatBoqDetailLayout();

				var BaseService = platformUIStandardConfigService;

				/**
				 * @ngdoc function
				 * @name addPrefixToProperties
				 * @function
				 * @description Adds the given prefix to all keys of the given original object and returns a copy of this object with the prefixed keys
				 * @param {Object} original object whose keys are to be prefixed
				 * @param {String} prefix that's to be added to the keys of the copied renamed object
				 * @returns {Object} copy of the original whose keys are prefixed
				 */
				var addPrefixToKeys = function addPrefixToKeys(original, prefix, useHistory) {
					if (angular.isUndefined(original) || original === null || !angular.isString(prefix)) {
						return original;
					}

					var renamed = {};
					var renamedKey;
					var historyKeys = ['Inserted', 'InsertedAt', 'InsertedBy', 'Updated', 'UpdatedAt', 'UpdatedBy'];

					_.each(original, function (value, key) {
						// Leave the history properties unchanged. To the rest add the prefix.
						renamedKey = (useHistory && historyKeys.indexOf(key) !== -1) ? key : prefix + '.' + key;
						renamed[renamedKey] = value;
					});

					return renamed;
				};

				var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});

				// Add the prefix 'BoqRootItem' to the keys of the properties information because we use them in the context of the WicBoqCompositeDto
				boqItemAttributeDomains = addPrefixToKeys(boqItemAttributeDomains.properties, 'BoqRootItem', true);

				var boqHeaderAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqHeaderDto',
					moduleSubModule: 'Boq.Main'
				});

				// Add the prefix 'BoqHeader' to the keys of the properties information because we use them in the context of the WicBoqCompositeDto
				boqHeaderAttributeDomains = addPrefixToKeys(boqHeaderAttributeDomains.properties, 'BoqHeader', false);

				var wicCatBoqAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'WicBoqDto',
					moduleSubModule: 'Boq.Wic'
				});

				// Add the prefix 'WicBoq' to the keys of the properties information because we use them in the context of the WicBoqCompositeDto
				wicCatBoqAttributeDomains = addPrefixToKeys(wicCatBoqAttributeDomains.properties, 'WicBoq', false);

				// Merge those three ojects that make up the domain of the wicBoqComposite
				var wicBoqCompositeAttributeDomains = {};
				wicBoqCompositeAttributeDomains = _.merge(wicBoqCompositeAttributeDomains, boqItemAttributeDomains, boqHeaderAttributeDomains, wicCatBoqAttributeDomains);

				function BoqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqUIStandardService.prototype.constructor = BoqUIStandardService;

				var service = new BoqUIStandardService(wicCatBoqDetailLayout, wicBoqCompositeAttributeDomains, boqWicTranslationService);

				platformUIStandardExtentService.extend(service, wicCatBoqDetailLayout.addition, wicBoqCompositeAttributeDomains);

				/**
				 * @ngdoc function
				 * @name getAllFields
				 * @function
				 * @description Return all currently displayed fields
				 * @returns {Array} copy of the array of all currently displayed fields
				 */
				service.getAllFields = function getAllFields() {
					return angular.copy(allFields);
				};

				return service;
			}
		]);
})();