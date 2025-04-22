/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectableInfo, ILazyInjectionContext, PlatformModuleManagerService } from '@libs/platform/common';
import { PRC_CON_ENTITY_CONFIG, PRC_CONTRACT_BOQ_ENTITY_CONFIG, CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE, CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE, PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN, PACKAGE_HEADER_DATA_PROVIDER, QUOTE_BY_REQUEST_LAYOUT_TOKEN, PRC_RFQ_BIDDER_ENTITY_CONFIG, PRC_RFQ_ENTITY_CONFIG, RFQ_HEADER_LAYOUT_SERVICE, PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE, PROCUREMENT_SHARED_EXCHANGE_RATE_INPUT_LOOKUP_PROVIDER_TOKEN, PROCUREMENT_ITEM_LOOKUP_PROVIDER_TOKEN, PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN, PACKAGE_2HEADER_DATA_PROVIDER, PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN, CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG } from '@libs/procurement/interfaces';
import { RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE } from '@libs/businesspartner/interfaces';


export const LAZY_INJECTABLES: LazyInjectableInfo[] =[
LazyInjectableInfo.create('procurement.contract.ConHeaderEntityConfig', PRC_CON_ENTITY_CONFIG, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ConHeaderEntityConfig) : null;
		
	}),
LazyInjectableInfo.create('procurement.contract.PrcContractBoqEntityConfig', PRC_CONTRACT_BOQ_ENTITY_CONFIG, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.PrcContractBoqEntityConfig) : null;
		
	}),
LazyInjectableInfo.create('procurement.contract.ContractConfirmDetailLayoutService', CONTRACT_CONFIRM_HEADER_LAYOUT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ContractConfirmDetailLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.contract.ProcurementContractBusinesspartnerLayoutService', CONTRACT_CONFIRM_BUSINESS_PARTNER_LAYOUT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementContractBusinesspartnerLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.contract.ProcurementContractCertificateLayoutService', PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementContractCertificateLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.package.PackageDataProviderService', PACKAGE_HEADER_DATA_PROVIDER, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/package');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.PackageDataProviderService) : null;
		
	}),
LazyInjectableInfo.create('procurement.pricecomparison.QuoteByRequestLayoutService', QUOTE_BY_REQUEST_LAYOUT_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/pricecomparison');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.QuoteByRequestLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.rfq.RfqBusinessPartnerMainPortalUserManagementService', RFQ_BPM_PORTAL_USER_MANAGEMENT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/rfq');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.RfqBusinessPartnerMainPortalUserManagementService) : null;
		
	}),
LazyInjectableInfo.create('procurement.rfq.RfqBidderEntityConfig', PRC_RFQ_BIDDER_ENTITY_CONFIG, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/rfq');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.RfqBidderEntityConfig) : null;
		
	}),
LazyInjectableInfo.create('procurement.rfq.RfqHeaderEntityConfig', PRC_RFQ_ENTITY_CONFIG, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/rfq');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.RfqHeaderEntityConfig) : null;
		
	}),
LazyInjectableInfo.create('procurement.rfq.ProcurementRfqLayoutService', RFQ_HEADER_LAYOUT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/rfq');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementRfqLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.rfq.ProcurementRfqBusinessPartnerLayoutService', PRC_RFQ_BUSINESS_PARTNER_LAYOUT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/rfq');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementRfqBusinessPartnerLayoutService) : null;
		
	}),
LazyInjectableInfo.create('procurement.shared.ProcurementSharedExchangeRateInputLookupProviderService', PROCUREMENT_SHARED_EXCHANGE_RATE_INPUT_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/shared');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementSharedExchangeRateInputLookupProviderService) : null;
		
	}),
LazyInjectableInfo.create('procurement.shared.ProcurementSharedPrcItemLookupProviderService', PROCUREMENT_ITEM_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/shared');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementSharedPrcItemLookupProviderService) : null;
		
	}),
LazyInjectableInfo.create('procurement.stock.ProcurementStockAlternativeDialogService', PROCUREMENT_STOCK_ALTERNATIVE_DIALOG_SERVICE_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/stock');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementStockAlternativeDialogService) : null;
		
	}),
LazyInjectableInfo.create('procurement.package.Package2headerDataProviderService', PACKAGE_2HEADER_DATA_PROVIDER, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/package');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.Package2headerDataProviderService) : null;
		
	}),
LazyInjectableInfo.create('procurement.contract.ProcurementContractTotalsLayoutService', PRC_CONTRACT_TOTAL_LAYOUT_SERVICE_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ProcurementContractTotalsLayoutService) : null;
		
	}),

	LazyInjectableInfo.create('procurement.contract.ContractApprovalGeneralEntityConfig', CONTARCT_APPROVAL_GENERALS_ENTITY_CONFIG, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/procurement/contract');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ContractApprovalGeneralEntityConfig) : null;
		
	}),
];
 