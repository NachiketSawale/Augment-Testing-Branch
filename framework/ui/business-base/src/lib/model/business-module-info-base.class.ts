/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { uniq } from 'lodash';
import {
	IApplicationModuleInfo,
	IInitializationContext,
	IMainEntityAccess,
	OptionallyAsyncResource,
	PlatformPermissionService,
	ResourceProvider,
	ResourceProvidersList,
	isModuleInfo
} from '@libs/platform/common';
import {
	ContainerDefinition,
	ContainerModuleInfoBase,
	IContainerDefinition
} from '@libs/ui/container-system';
import {
	SidebarTab,
	UiSidebarService,
	UiSidebarWizardsSidebarTabComponent,
	UiSidebarSearchSidebarTabComponent
} from '@libs/ui/sidebar';
import { EntityInfo } from '../entities/model/entity-info.class';
import { COMMON_ENTITY_LABELS } from '../entities/model/common-entity-labels.model';
import { DataTranslationGridComponent } from '../entities';
import { IBusinessModuleAddOn } from './business-module-add-on.interface';
import { ITranslationContainerInfo } from './translation-container-info.interface';
import { PlatformModuleEntityCreationConfigService } from '@libs/platform/data-access';

class BusinessModuleAddOnWrapper {
	public constructor(private readonly addOn: IBusinessModuleAddOn) {
	}

	public get isEmpty(): boolean {
		return ((this.addOn.containers?.length ?? 0) <= 0) && ((this.addOn.entities?.length ?? 0) <= 0);
	}

	public get containers(): ContainerDefinition[] {
		const result: ContainerDefinition[] = [];
		if (this.addOn.entities) {
			for (const ei of this.addOn.entities) {
				result.push(...ei.containers);
			}
		}
		if (this.addOn.containers) {
			result.push(...<ContainerDefinition[]>(this.addOn.containers));
		}
		return result;
	}

	public get entities(): EntityInfo[] {
		return this.addOn.entities ?? [];
	}
}

/**
 * The base class for module info objects for standard business modules.
 *
 * @group Module Management
 */
export abstract class BusinessModuleInfoBase extends ContainerModuleInfoBase {

	/**
	 * Returns sidebar tabs available while the module is active.
	 * When overriding this method in a subclass, do not forget to concatenate your
	 * custom sidebars with the inherited result.
	 *
	 * @return The list of sidebar tabs available in the module.
	 */
	protected get sidebarTabs(): SidebarTab[] {
		return [
			new SidebarTab('sidebar-newWizard', {key: 'cloud.desktop.sdCmdBarWizard'}, 'sidebar-icons', 'ico-wiz', 9, async () => {
				return Promise.resolve(UiSidebarWizardsSidebarTabComponent);
			})
		];
	}

	private sidebarSvc?: UiSidebarService;

	/**
	 * This method is invoked when a user enters the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);

		const moduleSidebarTabs = this.sidebarTabs;

		const mainEntityAccess = this.getMainEntityAccess(injector);
		const sidebarSupport  = mainEntityAccess.sidebarSearchSupport?.supportsSidebarSearch;

		if (sidebarSupport && typeof sidebarSupport === 'function' && sidebarSupport()) {
			moduleSidebarTabs.push(
				new SidebarTab('sidebar-search', { key: 'cloud.desktop.sdCmdBarSearch' }, 'sidebar-icons', 'ico-search', 3, async () => {
					return Promise.resolve(UiSidebarSearchSidebarTabComponent);
				})
			);
		}
		if (moduleSidebarTabs.length > 0) {
			this.sidebarSvc ??= injector.get(UiSidebarService);
			this.sidebarSvc.addSidebarTabs(moduleSidebarTabs);
		}

		// loading initial configuration of a module for a dynamic create dialog.
		if(this.shouldLoadModuleEntityConfig()){
			const moduleEntityCreateService = injector.get(PlatformModuleEntityCreationConfigService);
			moduleEntityCreateService.load(this.internalModuleName);
		}
	}

	/**
	 * This method is invoked when a user leaves the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override finalizeModule(injector: Injector) {
		const moduleSidebarTabIds = this.sidebarTabs.map(st => st.id);
		if (moduleSidebarTabIds.length > 0) {
			this.sidebarSvc ??= injector.get(UiSidebarService);
			this.sidebarSvc.removeSidebarTabs(moduleSidebarTabIds);
		}

		super.finalizeModule(injector);
	}

	/**
	 * Determines whether the entity configuration settings required for the dynamic create dialog should be loaded.
	 * Module developers should override this method to specify if the configuration settings are needed. By default,
	 * it returns true
	 * @protected
	 * @returns 'true' if the configuration settings should be loaded; otherwise, 'false'
	 */
	protected shouldLoadModuleEntityConfig(): boolean {
		return true;
	}

	/**
	 * Returns the entities used by the module.
	 * Override this to return entities.
	 * Container definition objects will be automatically generated based on these entity info objects.
	 *
	 * @returns The list of entities.
	 */
	public get entities(): EntityInfo[] {
		return [];
	}

	/**
	 * Returns a full list of all entities in the module, including those from module add-ons.
	 *
	 * Do not override this member.
	 * In order to declare your own entities, override the {@link entities} getter.
	 *
	 * @returns The full list of entity info objects.
	 */
	public listAllEntities(): EntityInfo[] {
		const result: EntityInfo[] = [];

		result.push(...this.entities);

		for (const addOn of this.loadedIncludedAddOns) {
			result.push(...addOn.entities);
		}

		return result;
	}

	/**
	 * Lists business module add-ons to be included in the module.
	 * Typically, these are resources from other modules.
	 * Override this member to return the add-ons required for the current module.
	 */
	protected get includedAddOns(): OptionallyAsyncResource<IBusinessModuleAddOn>[] {
		return [];
	}

	/**
	 * Executes preparatory steps for the module.
	 *
	 * This method can perform any synchronous or asynchronous activities that need to
	 * be executed once before the module is loaded.
	 * Override it in derived classes to specify the actions to run.
	 *
	 * @param context An object that provides some context information for the module preparation.
	 *
	 * @returns A promise that is resolved when the preparation is done.
	 */
	protected override async doPrepareModule(context: IInitializationContext): Promise<void> {
		const mainEntityInfo = this.mainEntity;
		await mainEntityInfo.prepareMainEntityAccess(context.injector);

		// load add-ons supplied by other modules
		const addOns = this.includedAddOns.map(addOn => ResourceProvider.create(addOn));
		if (addOns.length > 0) {
			const addOnsList = new ResourceProvidersList();
			for (const addOn of addOns) {
				addOnsList.add(addOn);
			}

			addOnsList.finalizeList();

			await addOnsList.prepareAll(context);

			const newPermissionUuids: string[] = [];
			for (const addOn of addOns) {
				const wrapper = new BusinessModuleAddOnWrapper({
					entities: addOn.value.entities,
					containers: addOn.value.containers ? this.normalizeContainerDefs(addOn.value.containers) : undefined
				});
				if (!wrapper.isEmpty) {
					this.loadedIncludedAddOns.push(wrapper);
					newPermissionUuids.push(...this.extractContainerPermissions(wrapper.containers));
				}
			}

			if (newPermissionUuids.length > 0) {
				const permissionSvc = context.injector.get(PlatformPermissionService);
				await permissionSvc.loadPermissions(uniq(newPermissionUuids));
			}
		}
	}

	private readonly loadedIncludedAddOns: BusinessModuleAddOnWrapper[] = [];

	/**
	 * Returns the reference to the main entity.
	 * By default, the first item of {@link entities} will be returned.
	 */
	public get mainEntity(): EntityInfo {
		if (this.entities.length <= 0) {
			throw new Error('Cannot determine main entity in a module without any declared entities.');
		}

		return this.entities[0];
	}

	/**
	 * Retrieves an object that allows to access the main entity of the module, if any.
	 * In modules that are not based on entities, an entity-like construct might still
	 * serve as the main entity.
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns An object that provides access to main entity information.
	 */
	public override getMainEntityAccess(injector: Injector): IMainEntityAccess {
		return this.mainEntity.getMainEntityAccess(injector);
	}

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const result: ContainerDefinition[] = [];

		for (const ei of this.entities) {
			result.push(...ei.containers);
		}

		for (const extraWrapper of this.loadedIncludedAddOns) {
			result.push(...extraWrapper.containers);
		}

		let tlsCntInfo: string | ITranslationContainerInfo | undefined = this.translationContainer;
		if (typeof tlsCntInfo === 'string') {
			tlsCntInfo = {
				uuid: tlsCntInfo
			};
		}

		if (!tlsCntInfo) {
			const tlsCntUuid = this.translationContainerUuid;
			if (tlsCntUuid) {
				tlsCntInfo = {
					uuid: tlsCntUuid
				};
			}
		}

		if (tlsCntInfo) {
			result.push(new ContainerDefinition({
				uuid: tlsCntInfo.uuid,
				permission: tlsCntInfo.permissionUuid,
				title: {key: 'cloud.common.entityTranslation'},
				containerType: DataTranslationGridComponent
			}));
		}

		return result;
	}

	/**
	 * Override this to auto-generate a translation container with the specified UUID.
	 * The default implementation returns `undefined`, in which case no translation container
	 * will be automatically added to the module.
	 *
	 * @deprecated Please use the {@link translationContainer} property instead.
	 */
	protected get translationContainerUuid(): string | undefined {
		return undefined;
	}

	/**
	 * Override this to auto-generate a translation container.
	 * If specified as a string, this string will be assumed to be the container UUID.
	 * The default implementation returns `undefined`, in which case no translation container
	 * will be automatically added to the module.
	 */
	protected get translationContainer(): string | ITranslationContainerInfo | undefined {
		return undefined;
	}

	/**
	 * Returns translations ids (normally module.submodule like example.topic-one) that should be loaded during module navigation.
	 * Translations for a couple of default modules and for the current module (based on
	 * {@link internalModuleName}) are requested by the default implementation.
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			...COMMON_ENTITY_LABELS.translationModules,
			'ui.business-base',
			'platform.data-access'
		];
	}
}

/**
 * Checks whether a given module info object is a business module info.
 *
 * @param moduleInfo The object to check.
 *
 * @returns A value that indicates whether the type matches.
 *
 * @group Module Management
 */
export function isBusinessModuleInfo(moduleInfo: IApplicationModuleInfo): moduleInfo is BusinessModuleInfoBase {
	return isModuleInfo(moduleInfo) && ('entities' in moduleInfo);
}