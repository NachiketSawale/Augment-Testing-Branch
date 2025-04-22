/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectableInfo, ILazyInjectionContext, PlatformModuleManagerService } from '@libs/platform/common';
import { SALES_SHARED_LOOKUP_PROVIDER_TOKEN } from '@libs/sales/interfaces';


export const LAZY_INJECTABLES: LazyInjectableInfo[] =[
	LazyInjectableInfo.create('sales.shared.SalesSharedCustomizeLookupOverloadProvider', SALES_SHARED_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/sales/shared');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.SalesSharedCustomizeLookupOverloadProvider) : null;
		
	}),
];
 