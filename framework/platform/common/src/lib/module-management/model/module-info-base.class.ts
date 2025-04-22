/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { kebabCaseModuleNameToPascalCase } from '../../utils/model/string-utils.model';
import { Observable, Subject } from 'rxjs';
import { Translatable } from '../../model/translation/translatable.interface';
import { IMainEntityAccess } from '../../model/main-entity-support/index';
import { IApplicationModuleInfo } from './application-module-info.interface';
import { FeatureRegistry, IReadOnlyFeatureSource } from '../../feature-registry/index';
import { IInitializationContext } from '../../model';

/**
 * This class is the base class for module information objects.
 *
 * Each module provides a module info object.
 * This info object is the central source of information about the module.
 *
 * The current module info object should be made available in the `moduleInfo` field of the activated route's `data` object.
 * This way, components can subscribe to the `data` property to access the current module info.
 *
 * ## Subclassing
 *
 * Specialized module types may derive their own specialized base classes for module info types.
 * For instance, container-based modules should have a module info object that is inherited from `ContainerModuleInfoBase`, rather than from the general `ModuleInfoBase` type.
 *
 * @group Module Management
 */
export abstract class ModuleInfoBase implements IApplicationModuleInfo {

	/**
	 * Returns the unique internal module name.
	 */
	public abstract get internalModuleName(): string;

	/**
	 * Returns the unique internal module name in PascalCase.
	 * For most modules, the default implementation will be sufficient. Merely modules that
	 * spell their internal name as a fully lower-case word, while it should be broken up
	 * into multiple words in PascalCase, will need to override this member.
	 */
	public get internalPascalCasedModuleName(): string {
		return kebabCaseModuleNameToPascalCase(this.internalModuleName);
	}

	/**
	 * Returns a human-readable name of the module.
	 * Override this to supply an actual human-readable text rather than the value of the
	 * {@link internalModuleName} property.
	 */
	public get moduleName(): Translatable {
		return {
			text: this.internalModuleName
		};
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
	protected async doPrepareModule(context: IInitializationContext): Promise<void> {
	}

	/**
	 * Executes preparatory steps for the module.
	 *
	 * This method can perform any synchronous or asynchronous activities that need to
	 * be executed once before the module is loaded.
	 *
	 * @param context An object that provides some context information for the module preparation.
	 *
	 * @returns A promise that is resolved when the preparation is done.
	 */
	public async prepareModule(context: IInitializationContext): Promise<void> {
		if (!this.isPrepared) {
			await this.doPrepareModule(context);
			this.isPrepared = true;
		}
	}

	private isPrepared = false;

	/**
	 * Returns permission UUIDs that should be loaded during module navigation.
	 */
	public get preloadedPermissions(): string[] {
		return [];
	}

	/**
	 * Returns translations ids (normally module.submodule like example.topic-one) that should be loaded during module navigation.
	 * Translations for a couple of default modules and for the current module (based on
	 * {@link internalModuleName}) are requested by the default implementation.
	 */
	public get preloadedTranslations(): string[] {
		return [
			'platform.common',
			'ui.common',
			this.internalModuleName
		];
	}

	/**
	 * This method is invoked when a user enters the module.
	 * This method is intentionally empty and serves as an overrideable extension point.
	 *
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public initializeModule(injector: Injector) {
		this.updateSelectionInfo(this.moduleName);
	}

	/**
	 * This method is invoked when a user leaves the module.
	 * This method is intentionally empty and serves as an overrideable extension point.
	 * @param injector An Angular injector that allows for retrieving Angular injectables.
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public finalizeModule(injector: Injector) {

	}

	/**
	 * Updates the selection info message displayed for the module.
	 *
	 * @param selInfo The new message.
	 */
	protected updateSelectionInfo(selInfo: Translatable) {
		this.currentSelectionInfo$.next(selInfo);
	}

	private readonly currentSelectionInfo$ = new Subject<Translatable>();

	/**
	 * Returns an observable that provides the current selection info.
	 */
	public get selectionInfo$(): Observable<Translatable> {
		return this.currentSelectionInfo$;
	}

	/**
	 * Retrieves an object that allows to access the main entity of the module, if any.
	 * In modules that are not based on entities, an entity-like construct might still
	 * serve as the main entity.
	 * If the module has nothing like a main entity, the function will return `null`
	 * (as does the default implementation).
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns An object that provides access to main entity information, or `null` if
	 *   no main entity-like concept exists in the module.
	 */
	public getMainEntityAccess(injector: Injector): IMainEntityAccess | null {
		return null;
	}

	/**
	 * The feature registry of the module.
	 *
	 * Use this object to store key-identified features that need to be accessible across the module.
	 */
	protected readonly featureRegistry = new FeatureRegistry();

	/**
	 * Provides access to the module's feature source.
	 */
	public get featureSource(): IReadOnlyFeatureSource {
		return this.featureRegistry;
	}
}

/**
 * Checks whether a given module info object is of type {@link ModuleInfoBase}.
 *
 * @param moduleInfo The object to check.
 *
 * @returns A value that indicates whether the type matches.
 *
 * @group Module Management
 */
export function isModuleInfo(moduleInfo: IApplicationModuleInfo): moduleInfo is ModuleInfoBase {
	return 'doPrepareModule' in moduleInfo;
}