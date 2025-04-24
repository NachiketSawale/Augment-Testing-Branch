(function () {
	'use strict';

	var moduleName = 'procurement.rfq';

	/**
	 * @ngdoc service
	 * @name procurementRfqHeaderDetailLayout
	 * @function
	 * @requires []
	 *
	 * @description
	 * # ui layout service for entity RfqHeader.
	 */
	angular.module(moduleName).factory('procurementRfqHeaderDetailLayout', ['$injector', function ($injector) {
		let platformLayoutHelperService = $injector.get('platformLayoutHelperService');
		let baseRfqHeaderLookupDialogOptions = {
			alerts: [{
				theme: 'info',
				message$tr$: 'procurement.rfq.baseRfqHeaderLookupDialogInfo'
			}]
		};
		var config = {
			'fid': 'procurement.rfq.header.detail',
			'version': '1.1.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'baseGroup',
					'attributes': ['id','rfqstatusfk', 'code', 'rfqheaderfk', 'daterequested', 'datecanceled', 'currencyfk', 'exchangerate', 'projectfk', 'projectstatusfk', 'rfqtypefk', 'prccontracttypefk',
						'clerkprcfk', 'clerkreqfk', 'prcawardmethodfk', 'prcconfigurationfk', 'prcstrategyfk', 'paymenttermpafk', 'paymenttermfifk',
						'paymenttermadfk','plannedstart','plannedend','evaluationschemafk','billingschemafk','datedelivery','prcstructurecode','prcstructuredescription', 'datepricefixing']
				},
				{
					'gid': 'supplierGroup',
					'attributes': ['awardreference', 'datequotedeadline', 'timequotedeadline', 'locaquotedeadline', 'dateawarddeadline']
				},
				{
					'gid': 'deliveryRequirementsGroup',
					'attributes': ['remark']
				},
				{
					'gid': 'packageGroup',
					'attributes': ['packagenumber', 'packagedescription', 'assetmastercode', 'assetmasterdescription', 'packagedeliveryaddress', 'packagetextinfo']
				},
				{
					'gid': 'userDefinedGroup',
					'attributes': ['userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'overloads': {
				'id': {
					'readonly': true
				},
				'rfqstatusfk': {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-rfq-header-status-combobox',
						'options': {
							readOnly: true
						}
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'rfqStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						bulkSupport: false
					}
				},
				'code': {
					navigator: {
						moduleName: 'procurement.pricecomparison',
						registerService: 'procurementPriceComparisonMainService'
					},
					detail: {
						'type': 'directive',
						'directive': 'platform-composite-input',
						'label$tr$': 'procurement.rfq.code',
						'model': 'Code',// use for validator
						'options': {
							'rows': [{
								'type': 'code',
								'model': 'Code',
								'cssLayout': 'md-4 lg-4'
							}, {
								'type': 'description',
								'model': 'Description',
								'cssLayout': 'md-8 lg-8',
								'validate': false
							}]
						}
					},
					'grid': {
						editor: 'code',
						name$tr$: 'procurement.rfq.code',
						formatter: 'code',
						bulkSupport: false
					}
				},
				'rfqheaderfk': {
					navigator: {
						moduleName: 'procurement.pricecomparison',
						registerService: 'procurementPriceComparisonMainService'
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-rfq-header-dialog',
							lookupOptions: {
								filterKey: 'prc-rfq-rfqheaderfk-filter',
								showClearButton: false,
								dialogOptions: baseRfqHeaderLookupDialogOptions
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'RfqHeader',
							displayMember: 'Code'
						},
						width: 125
					},
					'detail': {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'procurement-rfq-header-dialog',
							descriptionField: 'Description',
							descriptionMember: 'Description',
							lookupOptions: {
								filterKey: 'prc-rfq-rfqheaderfk-filter',
								initValueField: 'HeaderForeignCode',
								showClearButton: false,
								dialogOptions: baseRfqHeaderLookupDialogOptions
							}
						}
					}
				},
				'currencyfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-currency-combobox'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'currency',
							displayMember: 'Currency'
						}
					},
					readonly: true
				},
				'projectfk': platformLayoutHelperService.provideProjectLookupOverload('procurement-rfq-header-project-filter', 'ProjectFk'),
				'projectstatusfk': {
					'readonly': true,
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							'displayMember': 'Description',
							'imageSelector': 'platformStatusIconService',
							'lookupModuleQualifier': 'project.main.status',
							'lookupSimpleLookup':true,
							'valueMember': 'Id'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': ' basics-lookupdata-simple ',
						'options': {
							'lookupType':'project.main.status',
							'eagerLoad': true,
							'valueMember': 'Id',
							'displayMember': 'Description',
							'filter': {showIcon:true},
							'imageSelector': 'platformStatusIconService',
							'lookupModuleQualifier': 'project.main.status'
						}
					}
				},
				'rfqtypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-rfq-header-type-combobox',
						'options': {
							showClearButton: false
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-rfq-header-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'rfqType',
							displayMember: 'Description'
						}
					}
				},
				'prccontracttypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurement-configuration-contract-type-combobox',
						'options': {
							showClearButton: false
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurement-configuration-contract-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcContractType',
							displayMember: 'Description'
						}
					}
				},
				'prjcontracttypefk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurement-configuration-prj-contract-type-combobox',
						'options': {
							showClearButton: false
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurement-configuration-prj-contract-type-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prjcontracttype',
							displayMember: 'Description'
						}
					}
				},
				'clerkprcfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'cloud-clerk-clerk-dialog',
							lookupField: 'ClerkPrcFk',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Code'
						}
					}
				},
				'clerkreqfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'cloud-clerk-clerk-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Code'
						}
					}
				},
				'prcawardmethodfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-procurement-configuration-award-method-combobox',
						'options': {
							showClearButton: false
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-procurement-configuration-award-method-combobox'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcAwardMethod',
							displayMember: 'Description'
						}
					}
				},
				'prcconfigurationfk': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-configuration-configuration-combobox',
						'options': {
							filterKey: 'prc-rfq-configuration-filter'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-configuration-configuration-combobox',
							lookupOptions: {
								filterKey: 'prc-rfq-configuration-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcConfiguration',
							displayMember: 'DescriptionInfo.Translated'
						},
						bulkSupport: false
					}
				},
				'prcstrategyfk': {
					'detail': {
						'type': 'directive',
						'directive': 'procurement-common-strategy-combobox',
						'options': {
							filterKey: 'procurement-rfq-header-strategy-filter',
							showClearButton: false
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'procurement-common-strategy-combobox',
							lookupOptions: {
								filterKey: 'procurement-rfq-header-strategy-filter'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcConfig2strategy',
							displayMember: 'Description'
						}
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
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-payment-term-lookup',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PaymentTerm',
							displayMember: 'Code'
						}
					}
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
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-payment-term-lookup',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PaymentTerm',
							displayMember: 'Code'
						}
					}
				},
				'paymenttermadfk': {
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
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-lookupdata-payment-term-lookup',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PaymentTerm',
							displayMember: 'Code'
						}
					}
				},
				'evaluationschemafk': {
					'grid': {
						'formatter': 'lookup',
						'formatterOptions': {
							lookupType: 'EvaluationSchema',
							displayMember: 'Description'
						},
						'editor': 'lookup',
						'editorOptions': {
							directive: 'business-partner-evaluation-schema-combobox'
						}
					},
					'detail': {
						'type': 'directive',
						'directive': 'business-partner-evaluation-schema-combobox',
						'model': 'EvaluationSchemaFk',
						'options': {
							displayMember: 'Description'
						}
					}
				},
				'billingschemafk': {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'procurement-configuration-billing-schema-combobox',
							'lookupOptions': {
								'filterKey': 'prc-rfq-billing-schema-filter'
							}
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'PrcConfig2BSchema',
							'displayMember': 'DescriptionInfo.Translated'
						},
						'width': 80
					},
					'detail': {
						'type': 'directive',
						'directive': 'procurement-configuration-billing-schema-Combobox',
						'options': {
							'filterKey': 'prc-rfq-billing-schema-filter'
						}
					}
				},
				'datecanceled': {
					'grid': {
						bulkSupport: false
					}
				},
				'exchangerate': {
					'grid': {
						bulkSupport: false
					}
				},
				'timequotedeadline':{
					'grid': {
						bulkSupport: false
					}
				},
				'packagenumber': {
					'readonly': true
				},
				'packagedescription': {
					'readonly': true
				},
				'assetmastercode': {
					'readonly': true
				},
				'assetmasterdescription': {
					'readonly': true
				},
				'packagedeliveryaddress': {
					'readonly': true
				},
				'packagetextinfo': {
					'readonly': true
				},
				'prcstructurecode': {
					'readonly': true
				},
				'prcstructuredescription': {
					'readonly': true
				},
				'DatePriceFixing': {
					'readonly': true
				}
			},
			'addition': {
				'grid': [
					{
						'afterId': 'code',
						id: 'description',
						field: 'Description',
						name$tr$: 'procurement.rfq.referenceName',
						editor: 'description',
						formatter: 'description',
						grouping: {
							title: 'procurement.rfq.referenceName',
							getter: 'Description',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						'lookupDisplayColumn': true,
						'field': 'ClerkPrcFk',
						'displayMember': 'Description',
						'name$tr$': 'cloud.common.entityResponsibleDescription'
					},
					{
						'lookupDisplayColumn': true,
						'field': 'ClerkReqFk',
						'displayMember': 'Description',
						'name$tr$': 'cloud.common.entityRequisitionOwnerDescription'
					},
					{
						'lookupDisplayColumn': true,
						'field': 'PaymentTermFiFk',
						'displayMember': 'Description',
						'name$tr$': 'cloud.common.entityPaymentTermFiDescription'
					},
					{
						'lookupDisplayColumn': true,
						'field': 'PaymentTermPaFk',
						'displayMember': 'Description',
						'name$tr$': 'cloud.common.entityPaymentTermPaDescription'
					},
					{
						'lookupDisplayColumn': true,
						'field': 'PaymentTermAdFk',
						'displayMember': 'Description',
						'name$tr$': 'cloud.common.entityPaymentTermAdDescription'
					},
					{
						'lookupDisplayColumn': true,
						'field': 'RfqHeaderFk',
						'displayMember': 'Description',
						name$tr$: 'procurement.rfq.headerRfqDescription'
					},
					{
						id: 'NoOfQuotations',
						field: 'Quotation2RfqData.Noofqtn',
						name$tr$: 'procurement.package.entityQuote.number',
						formatter: 'description',
						readonly: true,
						navigator: {
							moduleName: 'procurement.quote',
							targetIdProperty:'NoOfQuoteRfqHeaderFk'
						}
					}
				]
			}
		};

		var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
		config.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
		config.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

		return config;
	}]);

	/**
	 * @ngdoc service
	 * @name procurementRfqHeaderUIStandardService
	 * @function
	 * @requires platformSchemaService
	 *
	 * @description
	 * # ui standard service for entity RfqHeader.
	 */
	angular.module(moduleName).factory('procurementRfqHeaderUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementRfqTranslationService', 'procurementRfqHeaderDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'RfqHeaderDto',
					moduleSubModule: 'Procurement.RfQ'
				});
				domainSchema = domainSchema.properties;

				function RfqUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RfqUIStandardService.prototype = Object.create(BaseService.prototype);
				RfqUIStandardService.prototype.constructor = RfqUIStandardService;
				const entityInformation = { module: angular.module(moduleName), moduleName: 'Procurement.Rfq', entity: 'RfqHeader' };
				const service = new BaseService(layout, domainSchema, translationService, entityInformation);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})();
