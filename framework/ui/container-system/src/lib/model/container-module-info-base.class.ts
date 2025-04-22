/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { ModuleInfoBase } from '@libs/platform/common';
import { ContainerDefinition } from './container-definition.class';
import { IContainerDefinition } from './container-definition.interface';
import { Subscription } from 'rxjs';

/**
 * The base clas for module info objects of modules that are displayed with a container layout.
 *
 * @group Module Management
 */
export abstract class ContainerModuleInfoBase extends ModuleInfoBase {

	/**
	 * This method is invoked when a user enters the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);

		const mainEntityAccess = this.getMainEntityAccess(injector);
		if (mainEntityAccess) {
			this.mainEntitySelectionSubscription = mainEntityAccess.selectionInfo$.subscribe(selInfo => this.updateSelectionInfo(selInfo));
		}
	}

	/**
	 * This method is invoked when a user leaves the module.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	public override finalizeModule(injector: Injector) {
		if (this.mainEntitySelectionSubscription) {
			this.mainEntitySelectionSubscription.unsubscribe();
			this.mainEntitySelectionSubscription = undefined;
		}

		super.finalizeModule(injector);
	}

	private mainEntitySelectionSubscription?: Subscription;

	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	protected abstract get containers(): (ContainerDefinition | IContainerDefinition)[];

	/**
	 * Returns all containers available in the module as {@link ContainerDefinition} objects.
	 */
	public get effectiveContainers(): ContainerDefinition[] {
		return this.normalizeContainerDefs(this.containers);
	}

	/**
	 * Converts a list of container definitions to a uniform form.
	 * @param containerDefs The container definitions.
	 * @returns The normalized container definitions.
	 */
	protected normalizeContainerDefs(containerDefs: (ContainerDefinition | IContainerDefinition)[]): ContainerDefinition[] {
		return containerDefs.map(cnt => cnt instanceof ContainerDefinition ? cnt : new ContainerDefinition(cnt));
	}

	/**
	 * returns container permission uuids that should be loaded during module navigation.
	 */
	public override get preloadedPermissions(): string[] {
		return this.extractContainerPermissions(this.effectiveContainers);
	}

	/**
	 * Extracts permission UUIDs from a set of container definitions.
	 * @param containerDefs The container definitions.
	 * @returns The permission UUIDs.
	 */
	protected extractContainerPermissions(containerDefs: ContainerDefinition[]): string[] {
		return containerDefs.map(containerDef => containerDef.permission);
	}

	/**
	 * Returns translations ids (normally module.submodule like example.topic-one) that should be loaded during module navigation.
	 * Translations for a couple of default modules and for the current module (based on
	 * {@link internalModuleName}) are requested by the default implementation.
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'ui.container-system'
		];
	}
}
