(function () {
	/* global Slick */
	'use strict';
	let modName = 'qto.main',
		mod = angular.module(modName);

	mod.factory('qtoMainBillToLocationLayout',
		[function () {
			return {
				'fid': 'qto.main.location',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'description', 'comment', 'remark', 'businesspartnerfk', 'customerfk', 'quantityportion', 'totalquantity', 'subsidiaryfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'code': {
						readonly:true,
						width: 100
					},
					'description': {
						readonly:true,
						width: 100,
						grid: {
							displayName:'Description',
							displayName$tr$: 'cloud.common.entityDescription'
						},
					},
					'comment':{
						readonly:true,
						width: 100
					},
					'remark': {
						readonly:true,
						width: 100
					},
					'businesspartnerfk':{
						readonly:true,
						editor: 'lookup',
						editorOptions: {
							directive: 'business-partner-main-business-partner-dialog',
							lookupOptions: {
								showClearButton: true,
								'IsShowBranch': true,
								'mainService':'qtoMainBillToDataService',
								'BusinessPartnerField':'BusinessPartnerFk',
								'SubsidiaryField':'SubsidiaryFk',
								'SupplierField':'SupplierFk'
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						width: 130
					},
					'customerfk':{
						readonly:true,
						grid: {
							editor: 'lookup',
							directive: 'basics-lookupdata-lookup-composite',
							editorOptions: {
								'directive': 'business-partner-main-customer-lookup',
								'lookupOptions': {
									'filterKey': 'qto-main-bill-to-customer-filter'
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								'lookupType': 'customer',
								'displayMember': 'Code'
							},
							width: 125
						}
					},
					'quantityportion':{
						readonly:true,
						width: 100
					},
					'totalquantity': {
						readonly:true,
						width: 100
					},
					'subsidiaryfk': {
						readonly:true,
						grid: {
							editor: null,
							editorOptions: {
								'directive': 'business-partner-main-subsidiary-lookup',
								'lookupOptions': {
									'showClearButton': true,
									'filterKey': 'qto-main-bill-subsidiary-filter',
									'displayMember': 'AddressLine'
								}
							},
							formatter: 'lookup',
							formatterOptions: {'lookupType': 'subsidiary', 'displayMember': 'AddressLine'},
							width: 180
						},
					}
				}
			};
		}]);


	mod.factory('qtoMainBillToUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService','qtoMainBillToLocationLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ProjectBillToDto',
					moduleSubModule: 'Project.Main'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
