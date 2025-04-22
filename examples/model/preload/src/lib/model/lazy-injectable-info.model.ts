/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectableInfo, ILazyInjectionContext, PlatformModuleManagerService } from '@libs/platform/common';
import { IMPORT_PROFILE_LOOKUP_PROVIDER_TOKEN, PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN, PROPERTY_KEY_TAG_HELPER_TOKEN, ANNOTATION_LOOKUP_PROVIDER_TOKEN, MODEL_PROJECT_MODULE_ADD_ON_TOKEN, MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';


export const LAZY_INJECTABLES: LazyInjectableInfo[] =[
LazyInjectableInfo.create('model.administration.ModelAdministrationModelImportProfileLookupProviderService', IMPORT_PROFILE_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/administration');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ModelAdministrationModelImportProfileLookupProviderService) : null;
		
	}),
LazyInjectableInfo.create('model.administration.ModelAdministrationPropertyKeyLookupProviderService', PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/administration');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ModelAdministrationPropertyKeyLookupProviderService) : null;
		
	}),
LazyInjectableInfo.create('model.administration.ModelAdministrationPropertyKeyTagHelperService', PROPERTY_KEY_TAG_HELPER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/administration');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ModelAdministrationPropertyKeyTagHelperService) : null;
		
	}),
LazyInjectableInfo.create('model.annotation.ModelAnnotationLookupProviderService', ANNOTATION_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/annotation');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ModelAnnotationLookupProviderService) : null;
		
	}),

	LazyInjectableInfo.create('model.project.ModelProjectModuleAddOn', MODEL_PROJECT_MODULE_ADD_ON_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/project');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? new importedModule.ModelProjectModuleAddOn() : null;
		
	}),

	LazyInjectableInfo.create('model.project.ModelProjectModelLookupProviderService', MODEL_LOOKUP_PROVIDER_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/model/project');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.ModelProjectModelLookupProviderService) : null;
		
	}),
];
 