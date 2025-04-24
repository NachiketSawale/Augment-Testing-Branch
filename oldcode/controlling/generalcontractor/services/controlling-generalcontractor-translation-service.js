(function (angular) {
	'use strict';

	let controllingGeneralContractorModule = 'controlling.generalcontractor';
	let basicsCommonModule = 'basics.common';
	let cloudCommonModule = 'cloud.common';
	let estimateMainModule = 'estimate.main';

	angular.module(controllingGeneralContractorModule).service('controllingGeneralContractorTranslationService', ControllingGeneralContractorTranslationService);

	ControllingGeneralContractorTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ControllingGeneralContractorTranslationService(platformTranslationUtilitiesService) {
		let service = this;
		let data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [controllingGeneralContractorModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			Code: {location: controllingGeneralContractorModule, identifier: 'Code', initial: 'Code'},
			Revenue: {location: controllingGeneralContractorModule, identifier: 'Revenue', initial: 'Revenue'},
			CostTotal: {location: controllingGeneralContractorModule, identifier: 'CostTotal', initial: 'Cost Total'},
			BasicCost: {location: controllingGeneralContractorModule, identifier: 'BasicCost', initial: 'Basic Cost'},
			BasicCostCO: {location: controllingGeneralContractorModule, identifier: 'BasicCostCO', initial: 'BasicCost CO'},
			Mutation: {location: controllingGeneralContractorModule, identifier: 'Mutation', initial: 'Mutation'},
			Budget: {location: controllingGeneralContractorModule, identifier: 'Budget', initial: 'Budget'},
			Additional: {location: controllingGeneralContractorModule, identifier: 'Additional', initial: 'Additional Expenses'},
			Contract: {location: controllingGeneralContractorModule, identifier: 'Contract', initial: 'Contract'},
			Performance: {location: controllingGeneralContractorModule, identifier: 'Performance', initial: 'Performance'},
			Invoice: {location: controllingGeneralContractorModule, identifier: 'Invoice', initial: 'Invoice'},
			InvoiceStatus: {location: controllingGeneralContractorModule, identifier: 'InvoiceStatus', initial: 'Invoice Status'},
			ActualsWithoutContract: {location: controllingGeneralContractorModule, identifier: 'ActualsWithoutContract', initial: 'Actuals Without Contract'},
			ActualCosts: {location: controllingGeneralContractorModule, identifier: 'ActualCosts', initial: 'Actual Costs'},
			Forecast: {location: controllingGeneralContractorModule, identifier: 'Forecast', initial: 'Forecast'},
			Result: {location: controllingGeneralContractorModule, identifier: 'Result', initial: 'Result'},
			Cost: {location: controllingGeneralContractorModule, identifier: 'Cost', initial: 'Cost'},
			OrdStatusFk: {location: controllingGeneralContractorModule, identifier: 'OrdStatusFk', initial: 'Contract Status'},
			PrjChangeFk: {location: controllingGeneralContractorModule, identifier: 'PrjChangeFk', initial: 'Change'},
			CommentText: {location: controllingGeneralContractorModule, identifier: 'Comment', initial: 'Comment'},
			Total: {location: controllingGeneralContractorModule, identifier: 'Total', initial: 'Net Amount'},
			ControllingUnitFk: {location: controllingGeneralContractorModule, identifier: 'ControllingUnitFk', initial: 'Controlling Unit'},
			MdcControllingUnitFk: {location: controllingGeneralContractorModule, identifier: 'ControllingUnitFk', initial: 'Controlling Unit'},
			OrdHeaderFk: {location: controllingGeneralContractorModule, identifier: 'OrdHeaderFk', initial: 'Order Header'},
			Flag: {location: controllingGeneralContractorModule, identifier: 'Flag', initial: 'Info'},
			BudgetShift: {location: controllingGeneralContractorModule, identifier: 'BudgetShift', initial: 'Budget Shift'},
			AdditionalExpenses: {location: controllingGeneralContractorModule, identifier: 'AdditionalExpenses', initial: 'Additional Expenses'},
			Value: {location: controllingGeneralContractorModule, identifier: 'Value', initial: 'Value'},
			Description: {location: controllingGeneralContractorModule, identifier: 'Description', initial: 'Description'},
			MdcCounitSourceFk: {location: controllingGeneralContractorModule, identifier: 'SourceCounit', initial: 'Source Controlling Unit'},
			MdcCounitTargetFk: {location: controllingGeneralContractorModule, identifier: 'TargetCounit', initial: 'Target Controlling Unit'},
			Comment: {location: controllingGeneralContractorModule, identifier: 'Comment', initial: 'Comment'},
			Amount: {location: controllingGeneralContractorModule, identifier: 'Amount', initial: 'Amount'},
			PrcPackageFk: {location: controllingGeneralContractorModule, identifier: 'prcPackageFk', initial: 'Package'},
			ConHeaderFk: {location: controllingGeneralContractorModule, identifier: 'ConHeaderFk', initial: 'Contract'},
			DirectCosts: {location: controllingGeneralContractorModule, identifier: 'DirectCosts', initial: 'Dir. Costs'},
			Remark: {location: controllingGeneralContractorModule, identifier: 'Remark', initial: 'Remarks'},
			PackageStatusFk: {location: controllingGeneralContractorModule, identifier: 'PackageStatusFk', initial: 'Status'},
			InvoiceStatusFk: {location: controllingGeneralContractorModule, identifier: 'InvoiceStatusFk ', initial: 'Invoice Status'},
			AmountNet: {location: controllingGeneralContractorModule, identifier: 'AmountNet', initial: 'Amount(Net)'},
			ContractChangeOrder: {location: controllingGeneralContractorModule, identifier: 'ContractChangeOrder', initial: 'Change Order'},
			ConStatusFk: {location: controllingGeneralContractorModule, identifier: 'ConStatusFk', initial: 'Contract Status'},
			PesValue: {location: cloudCommonModule, identifier: 'entityTotal', initial: 'Total'},
			PesStatusFk: {location: controllingGeneralContractorModule, identifier: 'PesStatusFk ', initial: 'Pes Status'},
			MdcControllingunitFk: {location: cloudCommonModule, identifier: 'entityControllingUnit', initial: 'Controlling Unit'},
			MdcControllingUnit: {location: cloudCommonModule, identifier: 'entityControllingUnit', initial: 'Controlling Unit'},
			MdcControllingUnitDescription: {location: cloudCommonModule, identifier: 'entityControllingUnitDesc', initial: 'Controlling Unit Description'},
			entityControllingUnitDesc: {location: cloudCommonModule, identifier: 'entityControllingUnitDesc', initial: 'Controlling Unit Description'},
			BusinesspartnerFk: {'location': cloudCommonModule,'identifier': 'entityBusinessPartner','initial': 'entityBusinessPartner'},
			SupplierFk: {'location': cloudCommonModule,'identifier': 'entitySupplierCode','initial': 'entitySupplierCode'},
			BpdBusinesspartnerFk: {location: cloudCommonModule,identifier: 'entityBusinessPartner',initial: 'Business Partner'},
			BpdSupplierFk: {location: cloudCommonModule, identifier: 'entitySupplierCode', initial: 'Supplier'},
			PaymentDate: { location: controllingGeneralContractorModule, identifier: 'PaymentDate', initial: 'PaymentDate' },
			UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
			UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
			UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
			CompanyYearFk: {location: controllingGeneralContractorModule, identifier: 'entityCompanyYearServiceFk', initial: 'Company Year Service'},
			CompanyYear: {location: controllingGeneralContractorModule, identifier: 'entityCompanyYearServiceFk', initial: 'Company Year Service'},
			CompanyPeriodFk: {location: controllingGeneralContractorModule, identifier: 'entityCompanyTradingPeriodFk', initial: 'Trading Period'},
			CompanyPeriod: {location: controllingGeneralContractorModule, identifier: 'entityCompanyTradingPeriodFk', initial: 'Trading Period'},
			ValueTypeFk: {location: controllingGeneralContractorModule, identifier: 'entityValueTypeFk', initial: 'Value Type'},
			ValueTypeDescription: {location: controllingGeneralContractorModule, identifier: 'entityValueTypeFk', initial: 'Value Type'},
			AccountFk: {location: controllingGeneralContractorModule, identifier: 'entityAccountFk', initial: 'Account'},
			Account: {location: controllingGeneralContractorModule, identifier: 'entityAccountFk', initial: 'Account'},
			AccountDescription: {location: controllingGeneralContractorModule, identifier: 'AccountDescription', initial: 'Account-Description'},
			Quantity: {location: controllingGeneralContractorModule, identifier: 'entityQuantity', initial: 'Quantity'},
			UomFk: {location: controllingGeneralContractorModule, identifier: 'entityUomFk', initial: 'UOM'},
			Uom: {location: controllingGeneralContractorModule, identifier: 'entityUomFk', initial: 'UOM'},
			UomDescription: {location: controllingGeneralContractorModule, identifier: 'UomDescription', initial: 'Uom-Description'},
			NominalDimension1: {location: controllingGeneralContractorModule, identifier: 'nominalDimension1', initial: 'Nominal Dimension 1'},
			NominalDimension2: {location: controllingGeneralContractorModule, identifier: 'nominalDimension2', initial: 'Nominal Dimension 2'},
			CustomerFk:  { location: controllingGeneralContractorModule, identifier: 'entityCustomerFk', initial: 'Customer' },
			InvTypeFk: {location: controllingGeneralContractorModule, identifier: 'entityType', initial: 'Type'},
			BudgetPackage: {location: controllingGeneralContractorModule, identifier: 'BudgetPackage', initial: 'Budget Package'},
			GccCostControlComment: {location: controllingGeneralContractorModule, identifier: 'Comment', initial: 'Comment'},
			InvoiceStatusPercent: {location: controllingGeneralContractorModule, identifier: 'InvoiceStatusPercent', initial: 'InvoiceStatusPercent'},
			EstTypeFk :{location: estimateMainModule, identifier: 'estType', initial: 'Estimate Type'},
			EstStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'DescriptionInfo'},
			BudgetTotal:{location: estimateMainModule, identifier: 'budget', initial: 'Budget Total'},
			DirCostTotal:{location: estimateMainModule, identifier: 'grandTotal', initial: 'Grand Total'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
