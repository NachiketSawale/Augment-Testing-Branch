/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectableInfo, ILazyInjectionContext, PlatformModuleManagerService } from '@libs/platform/common';
import { BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER, NUMBER_GENERATION_PROVIDER, BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN, BUSINESSPARTNER_DATA_PROVIDER, BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, BUSINESS_PARTNER_HELPER_TOKEN, BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD } from '@libs/businesspartner/interfaces';
import { BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR, CONTACT_LOOKUP_LAYOUT_GENERATOR, GUARANTOR_LOOKUP_LAYOUT_GENERATOR, SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR } from '@libs/basics/interfaces';


export const LAZY_INJECTABLES: LazyInjectableInfo[] =[
LazyInjectableInfo.create('businesspartner.certificate.CreateRequestsService', BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/certificate');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.CreateRequestsService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.common.NumberGenerationProviderService', NUMBER_GENERATION_PROVIDER, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/common');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.NumberGenerationProviderService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.BusinesspartnerLayoutService', BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinesspartnerLayoutService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.BusinesspartnerHeaderDataProviderService', BUSINESSPARTNER_DATA_PROVIDER, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinesspartnerHeaderDataProviderService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.BusinessPartnerLookupColumnGeneratorService', BUSINESSPARTNER_LOOKUP_LAYOUT_GENERATOR, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinessPartnerLookupColumnGeneratorService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.ContactLookupColumnGeneratorService', CONTACT_LOOKUP_LAYOUT_GENERATOR, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ContactLookupColumnGeneratorService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.GuarantorLookupColumnGeneratorService', GUARANTOR_LOOKUP_LAYOUT_GENERATOR, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.GuarantorLookupColumnGeneratorService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.SubsidiaryLookupColumnGeneratorService', SUBSIDIARY_LOOKUP_LAYOUT_GENERATOR, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.SubsidiaryLookupColumnGeneratorService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.shared.BusinesspartnerRelatedLookupProviderService', BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/shared');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinesspartnerRelatedLookupProviderService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.certificate.BusinessPartnerCertificateLayoutService', BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/certificate');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinessPartnerCertificateLayoutService) : null;
		
	}),
LazyInjectableInfo.create('businesspartner.main.BusinessPartnerHelperProviderService', BUSINESS_PARTNER_HELPER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.BusinessPartnerHelperProviderService) : null;
		
	}),

	LazyInjectableInfo.create('businesspartner.certificate.ChangeCertificateStatusWizardService', BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/businesspartner/certificate');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ChangeCertificateStatusWizardService) : null;
		
	}),
];
 