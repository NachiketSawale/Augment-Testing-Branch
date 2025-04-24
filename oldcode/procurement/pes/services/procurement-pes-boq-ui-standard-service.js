(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var cloudCommonModule = 'cloud.common';
	var procurementPesModuleName = 'procurement.pes';
	var boqMainModuleName = 'boq.main';

	angular.module(procurementPesModuleName).factory('procurementPesBoqDetailLayout', ['procurementCommonPrcItemFormatter', 'procurementPesBoqService', 'basicsLookupdataConfigGenerator', '$injector',
		function (procurementCommonPrcItemFormatter, procurementPesBoqService, basicsLookupdataConfigGenerator, $injector) {
			return {
				'fid': 'procurement.pes.boq.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'baseGroup',// 'boqheaderfk','prcitemstatusfk'
						'attributes': ['boqheader.boqstatusfk', 'conheaderfk', 'packagefk', 'prcboqfk', 'controllingunitfk', 'performedfrom', 'performedto', 'currencyfk', 'prcstructurefk', 'mdctaxcodefk','boqrootitem.briefinfo']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [procurementPesModuleName, cloudCommonModule, boqMainModuleName, 'basics.procurementstructure'],
					'extraWords': {
						MdcTaxCodeFk: {location: cloudCommonModule, identifier: 'entityTaxCode', initial: 'entityTaxCode'},
						PrcStructureFk: {location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'entityStructureCode'},
						baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
						BoqStatusFk: {location: boqMainModuleName, identifier: 'BoqStatusFk', initial: 'BoQ Status'},
						ConHeaderFk: {location: procurementPesModuleName, identifier: 'entityContractCode', initial: 'Contract Code'},
						PrcBoqFk: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						BoqHeaderFk: {location: procurementPesModuleName, identifier: 'entityBoqHeader', initial: 'Boq Header'},
						PackageFk: {location: cloudCommonModule, identifier: 'entityPackage', initial: 'Package'},
						ControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'Controlling Unit Code'},
						PerformedFrom: {location: procurementPesModuleName, identifier: 'entityPerformedFrom', initial: 'Performed From'},
						PerformedTo: {location: procurementPesModuleName, identifier: 'entityPerformedTo', initial: 'Performed To'},
						PrcItemStatusFk: {location: procurementPesModuleName, identifier: 'entityPcItemStatus', initial: 'Status'},
						CurrencyFk: {location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency'},
						entityHistory: {location: cloudCommonModule, identifier: 'entityHistory', initial: 'History'},
						InsertedAt: {location: cloudCommonModule, identifier: 'entityInsertedAt', initial: 'Inserted At'},
						InsertedBy: {location: cloudCommonModule, identifier: 'entityInsertedBy', initial: 'Inserted By'},
						UpdatedAt: {location: cloudCommonModule, identifier: 'entityUpdatedAt', initial: 'Updated At'},
						UpdatedBy: {location: cloudCommonModule, identifier: 'entityUpdatedBy', initial: 'Updated By'},
						Version: {location: cloudCommonModule, identifier: 'entityVersion', initial: 'Version'},
						BriefInfo: {
							location: cloudCommonModule,
							identifier: 'entityBriefInfo',
							initial: 'Outline Specification'
						},
					}
				},
				'overloads': {
					'conheaderfk': {
						'navigator': {
							moduleName: 'procurement.contract',
							registerService: 'procurementContractHeaderDataService'
						},
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'prc-con-header-dialog',
								lookupOptions: {
									filterKey: 'prc-con-header-for-pes-filter',
									showClearButton: true
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeaderView',
								displayMember: 'Code'
							}
						},
						'detail': {
							'model': 'ConHeaderFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'prc-con-header-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'prc-con-header-for-pes-filter'
								}
							}
						}
					},
					'prcboqfk': {
						'detail': {
							'type': 'directive',
							'directive': 'procurement-common-merged-boq-lookup',
							'options': {
								filterKey: 'pes-boq-con-merge-boq-filter'
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									filterKey: 'pes-boq-con-merge-boq-filter'
								},
								directive: 'procurement-common-merged-boq-lookup'
							},
							formatter: procurementCommonPrcItemFormatter,
							formatterOptions: {
								create: {
									action: procurementPesBoqService.createOtherItems
								},
								lookupType: 'PrcMergeBoqView',
								displayMember: 'Reference',
								version: 3
							},
							width: 100
						}
					},
					'packagefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcPackage',
								displayMember: 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								directive: 'procurement-common-package-lookup',
								lookupOptions: {
									filterKey: 'pes-boq-package-for-pes-filter',
									showClearButton: true
								}
							}
						},
						'detail': {
							'model': 'PackageFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'procurement-common-package-lookup',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'pes-boq-package-for-pes-filter'
								}
							}
						}
					},
					'controllingunitfk': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								directive: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'pes-boq-controlling-unit-filter',
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesBoqService);
									}
								}
							},
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'Controllingunit',
								displayMember: 'Code'
							}
						},
						'detail': {
							'model': 'ControllingUnitFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'pes-boq-controlling-unit-filter',
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, procurementPesBoqService);
									}
								}
							}
						}
					},
					'currencyfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'currency',
								displayMember: 'Currency'
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'CurrencyFk',
							'directive': 'basics-lookupdata-currency-combobox'
						},
						readonly: true
					},
					'prcstructurefk': {
						'detail': {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									// showClearButton: true,
									filterKey: 'basics-materialcatalog-procurement-structure-filter'
								}
							}
						},
						'grid': {
							required: true,
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									// showClearButton: true,
									filterKey: 'basics-materialcatalog-procurement-structure-filter'
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						}
					},
					'mdctaxcodefk': {
						'detail': {
							required: true,
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-master-data-context-tax-code-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									// showClearButton: true
								}
							}
						},
						'grid': {
							required: true,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'TaxCode',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								lookupField: 'MdcTaxCodeFk',
								lookupOptions: {
									// showClearButton: true
								},
								directive: 'basics-master-data-context-tax-code-lookup'
							},
							width: 100
						}
					},
					'boqheader.boqstatusfk': basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.boqstatus', null, {
						showIcon: true
					}),
					'boqrootitem.briefinfo':{
						readonly:true
					}
				},
				addition: {
					grid: [
						{
							'field': 'ConHeaderFk',
							'name$tr$': 'procurement.pes.entityConHeaderDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'ConHeader',
								displayMember: 'Description'
							}
						},
						{
							'field': 'PackageFk',
							'name$tr$': 'cloud.common.entityPackageDescription',
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'PrcPackage',
								displayMember: 'Description'
							}
						},
						{
							'field': 'ControllingUnitFk',
							'name$tr$': 'cloud.common.entityControllingUnitDesc',
							'formatter': 'lookup',
							'formatterOptions': {
								lookupType: 'controllingunit',
								displayMember: 'DescriptionInfo.Translated'
							}
						},
						{
							'afterId': 'prcstructurefk',
							'lookupDisplayColumn': true,
							'field': 'PrcStructureFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityStructureDescription',
							'width': 150
						},
						{
							'afterId': 'mdctaxcodefk',
							'lookupDisplayColumn': true,
							'field': 'MdcTaxCodeFk',
							'displayMember': 'DescriptionInfo.Translated',
							'name$tr$': 'cloud.common.entityTaxCodeDescription',
							'width': 150
						},
						{
							field: 'Vat',
							formatter: 'money',
							editor: 'money',
							id: 'vat',
							name: 'Vat',
							name$tr$: 'procurement.common.entityVat',
							readonly: true,
							width: 100
						},
						{
							field: 'VatOc',
							formatter: 'money',
							editor: 'money',
							id: 'vatoc',
							name: 'Vat Oc',
							name$tr$: 'procurement.common.entityVatOc',
							readonly: true,
							width: 100
						},
						{
							field: 'Finalgross',
							formatter: 'money',
							editor: 'money',
							id: 'finalpricegross',
							name: 'Final Price (Gross)',
							name$tr$: 'boq.main.Finalgross',
							readonly: true,
							width: 100
						},
						{
							field: 'FinalgrossOc',
							formatter: 'money',
							editor: 'money',
							id: 'finalpricegrossoc',
							name: 'Final Price (Gross OC)',
							name$tr$: 'boq.main.FinalgrossOc',
							readonly: true,
							width: 100
						},
						{
							field: 'Finalprice',
							formatter: 'money',
							editor: 'money',
							id: 'finalprice',
							name: 'Final Price',
							name$tr$: 'boq.main.Finalprice',
							readonly: true,
							width: 100
						},
						{
							field: 'FinalpriceOc',
							formatter: 'money',
							editor: 'money',
							id: 'finalpriceoc',
							name: 'Final Price (OC)',
							name$tr$: 'boq.main.FinalpriceOc',
							readonly: true,
							width: 100
						}
					]
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name procurementPesBoqUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(procurementPesModuleName).factory('procurementPesBoqUIStandardService',
		['platformUIStandardConfigService', 'procurementPesBoqDetailLayout', 'procurementPesTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',
			function (BaseService, procurementPesBoqDetailLayout, procurementPesTranslationService, platformSchemaService, extentService) {

				/**
				 * @ngdoc function
				 * @name addPrefixToProperties
				 * @function
				 * @description Adds the given prefix to all keys of the given original object and returns a copy of this object with the prefixed keys
				 * @param {Object} original object whose keys are to be prefixed
				 * @param {String} prefix that's to be added to the keys of the copied renamed object
				 * @returns {Object} copy of the original whose keys are prefixed
				 */
				var addPrefixToKeys = function addPrefixToKeys(original, prefix) {

					if (angular.isUndefined(original) || original === null || !angular.isString(prefix)) {
						return original;
					}

					var renamed = {};
					var renamedKey;
					var historyKeys = ['Inserted', 'InsertedAt', 'InsertedBy', 'Updated', 'UpdatedAt', 'UpdatedBy'];

					_.each(original, function (value, key) {
						// Leave the history properties unchanged. To the rest add the prefix.
						renamedKey = (historyKeys.indexOf(key) !== -1) ? key : prefix + '.' + key;
						renamed[renamedKey] = value;
					});

					return renamed;
				};

				var boqHeaderAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqHeaderDto',
					moduleSubModule: 'Boq.Main'
				});

				var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});

				boqItemAttributeDomains = addPrefixToKeys(boqItemAttributeDomains.properties, 'BoqRootItem');

				// Add the prefix 'BoqHeader' to the keys of the properties information because we use them in the context of the BoqCompositeDto
				boqHeaderAttributeDomains = addPrefixToKeys(boqHeaderAttributeDomains.properties, 'BoqHeader');

				var pesBoqAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PesBoqDto',
					moduleSubModule: 'Procurement.Pes'
				}).properties;

				// Merge those two ojects that make up the domain of the pesBoq
				var pesBoqMergedAttributeDomains = {};
				pesBoqMergedAttributeDomains = _.merge(pesBoqMergedAttributeDomains, pesBoqAttributeDomains, boqHeaderAttributeDomains,boqItemAttributeDomains);

				var uiService = new BaseService(procurementPesBoqDetailLayout, pesBoqMergedAttributeDomains, procurementPesTranslationService);
				extentService.extend(uiService, procurementPesBoqDetailLayout.addition);
				return uiService;

			}
		]);

})(angular);
