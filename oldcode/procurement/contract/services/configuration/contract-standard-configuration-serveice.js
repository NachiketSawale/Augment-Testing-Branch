(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('contractMainStandardConfigurationService', ['platformUIStandardConfigService', 'procurementContractTranslationService', 'platformSchemaService', 'procurementContractHeaderLayout',

		function (platformUIStandardConfigService, procurementContractTranslationService, platformSchemaService, procurementContractHeaderLayout) {

		const mappedColumns = ['ConStatusFk','CompanyFk','ProjectFk','PackageFk','TaxCodeFk','ClerkPrcFk','ClerkReqFk','BasCurrencyFk','ExchangeRate',
				'ProjectChangeFk','ConHeaderFk','HasChanges','MaterialCatalogFk','PrcHeaderFk','PaymentTermFiFk','PaymentTermPaFk','Code','Description','DateOrdered',
				'DateReported','DateCanceled','DateDelivery','DateCallofffrom','DateCalloffto','ConTypeFk','AwardmethodFk','ContracttypeFk','ControllingUnitFk',
				'BusinessPartnerFk','SubsidiaryFk','SupplierFk','ContactFk','BusinessPartner2Fk','Subsidiary2Fk','Supplier2Fk','Contact2Fk','IncotermFk',
				'CompanyInvoiceFk','AddressFk','CodeQuotation','BusinessPartnerAgentFk','Package2HeaderFk','DateQuotation','Remark','Userdefined1','Userdefined2',
				'Userdefined3','Userdefined4','Userdefined5','BillingSchemaFk','ConfirmationCode','ConfirmationDate','ExternalCode','PaymentTermAdFk','PrcCopyModeFk',
				'DatePenalty','PenaltyPercentPerDay','PenaltyPercentMax','PenaltyComment','DateEffective','BpdVatGroupFk','ProvingPeriod','ProvingDealdline','ApprovalPeriod',
				'ApprovalDealdline','IsFreeItemsAllowed','MdcPriceListFk','BankFk','QtnHeaderFk','ReqHeaderFk','ExecutionStart','ExecutionEnd','BasAccassignBusinessFk',
				'BasAccassignControlFk','BasAccassignAccountFk','BasAccassignConTypeFk','OrdHeaderFk','OverallDiscount','OverallDiscountOc','OverallDiscountPercent',
				'SalesTaxMethodFk','ValidFrom','ValidTo','BoqWicCatFk','BoqWicCatBoqFk','BaselineUpdate','IsFramework','IsNotAccrualPrr'];

			function getLayout() {
				procurementContractHeaderLayout.overloads.quantitytotal = {};
				let layouts = angular.copy(procurementContractHeaderLayout);
				let mappedColumnArray = mappedColumns.toLocaleString().toLowerCase().split(',');
				_.forEach(layouts.groups, function(groupItem) {
					groupItem.attributes = _.filter(groupItem.attributes, function(item) {
						if (mappedColumnArray.indexOf(item) > -1) {
							return item;
						}
					});
				});
				return layouts;
			}

			var BaseService = platformUIStandardConfigService;
			var contractDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'ConHeaderDto', moduleSubModule: 'Procurement.Contract'} );
			if (contractDomainSchema) {
				contractDomainSchema = contractDomainSchema.properties;
				contractDomainSchema.Info ={ domain : 'image'};
				contractDomainSchema.Rule ={ domain : 'imageselect'};
				contractDomainSchema.Param ={ domain : 'imageselect'};
			}

			function ContractUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ContractUIStandardService.prototype = Object.create(BaseService.prototype);
			ContractUIStandardService.prototype.constructor = ContractUIStandardService;
			const entityInformation = { module: angular.module(moduleName), moduleName: 'Procurement.Contract', entity: 'ConHeader' };
			return new BaseService(getLayout(), contractDomainSchema, procurementContractTranslationService,entityInformation);
		}
	]);
})();