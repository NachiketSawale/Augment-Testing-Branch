/*
 * Copyright(c) RIB Software GmbH
 */

import { clone, isUndefined } from 'lodash';
import {
	Injector,
	ProviderToken,
	StaticProvider
} from '@angular/core';
import {
	Translatable,
	IMainEntityAccess,
	InitializationContext,
	IResourceProvider,
	ResourceProvider,
	ResourceProvidersList,
	SimpleIdProperty, DragDropBase
} from '@libs/platform/common';
import {
	BaseValidationService,
	IEntitySchema,
	IEntitySelection,
	IRootRoleBase,
	isEntitySchemaType,
	PlatformSchemaService,
} from '@libs/platform/data-access';
import {
	ColumnDef,
	ILayoutConfiguration, ILayoutGroup
} from '@libs/ui/common';
import {
	combineContainerInjectionProviders,
	ContainerDefinition, ContainerInitializationContext,
	IContainerDefinition,
	IContainerInitializationContext
} from '@libs/ui/container-system';
import {
	IEntityInfo,
	isFormSettingsObject,
	isGridSettingsObject,
	isTreeSettingsObject
} from './entity-info.interface';
import { FormContainerComponent } from '../components/form-container/form-container.component';
import { EntityContainerInjectionTokens } from './entity-container-injection-tokens.class';
import { IFormContainerLink } from './form-container-link.interface';
import { IGridContainerSettings } from './grid-container-settings.interface';
import { IGridContainerLink } from './grid-container-link.interface';
import { ITreeContainerLink } from './tree-container-link.interface';
import { GridContainerComponent } from '../components/grid-container/grid-container.component';
import { TreeContainerComponent } from '../components/tree-container/tree-container.component';
import { IFormContainerSettings } from './form-container-settings.interface';
import { IEntityContainerBehavior } from './entity-container-link.model';
import { IEntityContainerSettingsBase } from './entity-container-settings-base.interface';
import { UiBusinessBaseEntityGridService } from '../services/ui-business-base-entity-grid.service';
import { IEntityTreeConfiguration } from './entity-tree-configuration.interface';
import { generateDataServiceContainer } from './data-service-utils.model';
import { IEntityFacade } from './entity-facade.interface';
import { ENTITY_DEFAULT_GROUP_ID, ENTITY_HISTORY_GROUP_ID } from './default-entity-ids.model';
import { ContainerLayoutConfiguration } from './container-layout-configuration.type';

function isRootRole(ds: unknown): ds is IRootRoleBase {
	return typeof ds === 'object' && ds !== null && 'mainEntityAccess' in ds;
}

/**
 * Provides some information and utility functions about an entity.
 */
export abstract class EntityInfo {

	/**
	 * Initializes a new instance.
	 */
	// This empty ctor declaration serves to set the visibility to protected.
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	protected constructor() {
	}

	/**
	 * Creates a new instance of type {@link EntityInfo} based on a typed configuration object.
	 * @param config The configuration object.
	 */
	public static create<T extends object>(config: IEntityInfo<T>): TypedEntityInfo<T> {
		return new InternalTypedEntityInfo<T>(config);
	}
	private static MergeTitle(generated: Translatable | undefined, manual: Translatable | undefined): Translatable | undefined{
		if(typeof generated == 'object' && typeof manual == 'object'){
			return {
				...generated,
				...manual
			};
		} else if (typeof manual == 'object' || typeof manual == 'string') {
			return manual;
		} else {
			return generated;
		}
	}
	private static MergeEntityContainerSettingsBase(generated: IEntityContainerSettingsBase,manual: IEntityContainerSettingsBase):IEntityContainerSettingsBase {
		return {
			...generated,
			...manual,
			title: this.MergeTitle(generated.title,manual.title),
		};
	}
	private static MergeEntityGrid<T extends object>(generated: boolean | [string] | IGridContainerSettings<T> | undefined, manual: boolean | [string] | IGridContainerSettings<T> | undefined): boolean | [string] | IGridContainerSettings<T> | undefined{
		if (typeof manual == 'boolean' || manual instanceof Array) {
			return manual;
		} else if (typeof manual == 'object') {
			if (typeof generated == 'object') {
				return {
					...generated as IGridContainerSettings<T>,
					...manual  as IGridContainerSettings<T>,
					...this.MergeEntityContainerSettingsBase(generated as IGridContainerSettings<T>, manual as IGridContainerSettings<T>)
				};
			} else {
				return manual;
			}
		} else {
			return generated;
		}
	}
	private static MergeEntityForm<T extends object>(generated: false | string | [string, string] | IFormContainerSettings<T> | undefined, manual: false | string | [string, string] | IFormContainerSettings<T>  | undefined): false | string | [string, string] | IFormContainerSettings<T>  | undefined{
		if(typeof manual == 'string' || typeof manual == 'boolean' || manual instanceof Array){
			return manual;
		}else if(typeof manual == 'object'){
			if(typeof generated == 'object'){
				return {
					...generated as IFormContainerSettings<T>,
					...manual as IFormContainerSettings<T>,
					...this.MergeEntityContainerSettingsBase(generated as IGridContainerSettings<T>, manual as IGridContainerSettings<T>)
				};
			} else {
				return manual;
			}
		} else {
			return generated;
		}
	}
	private static MergeLayoutConfiguration<T extends object>(generated: ContainerLayoutConfiguration<T> | undefined, manual: ContainerLayoutConfiguration<T> | undefined): ContainerLayoutConfiguration<T>  | undefined{
		if(typeof manual === 'function' && typeof generated === 'function'){
			return (ctx) => Promise.
				all([generated(ctx), manual(ctx)]).
				then(res => this.MergeLayoutConfiguration2(res[0], res[1]));
		} else if(typeof manual === 'function' && !isUndefined(generated)){
			return (ctx) => Promise.
				resolve(manual(ctx)).
				then((manualILC) => this.MergeLayoutConfiguration2(generated as ILayoutConfiguration<T>, manualILC));
		} else if(typeof generated === 'function' && !isUndefined(manual)){
			return (ctx) => Promise.
				resolve(generated(ctx)).
				then((generatedILC) => this.MergeLayoutConfiguration2(generatedILC, manual as ILayoutConfiguration<T>));
		} else if(typeof manual !== 'function' && !isUndefined(manual) && typeof generated !== 'function'&& !isUndefined(generated)){
			return {...generated,...manual};
		} else if(!isUndefined(manual)) {
			return manual;
		} else {
			return generated;
		}
	}
	private static MergeObjects<T extends object>(generated: T | undefined, manual: T | undefined): T | undefined  {
		if(typeof manual == 'object' && typeof generated == 'object'){
			return {
				...generated,
				...manual
			};
		} else if(typeof manual == 'object'){
			return manual;
		} else if(typeof generated == 'object'){
			return generated;
		} else {
			return undefined;
		}
	}
	private static filterForUnique<T>(v: T,i: number, a: T[]){
		return  a.indexOf(v) === i;
	}
	private static MergeGroup<T extends object>(generated: ILayoutGroup<T> , manual: ILayoutGroup<T>): ILayoutGroup<T>  {
		return {
			...generated,
			...manual,
			title: this.MergeTitle(generated.title,manual.title),
			attributes: [...generated.attributes,...manual.attributes].filter(this.filterForUnique),
		};
	}
	private static MergeGroups<T extends object>(generated: ILayoutGroup<T>[] | undefined, manual: ILayoutGroup<T>[] | undefined): ILayoutGroup<T>[] | undefined  {
		if(manual instanceof Array && generated instanceof Array){
			const allManualAttributes = manual.flatMap(g => g.attributes );
			const removeManualAttributesFromGenerated = generated.map(g => <ILayoutGroup<T>>{
				gid : g.gid,
				title: g.title,
				attributes : g.attributes.filter(a => !allManualAttributes.includes(a)),
				additionalAttributes : g.additionalAttributes
			});
			const intersectedGroups = manual.
				filter(m => removeManualAttributesFromGenerated.some(g => g.gid === m.gid)).
				map(m => [removeManualAttributesFromGenerated.find(g => m.gid === g.gid), m] as [generated: ILayoutGroup<T>, manual:ILayoutGroup<T>]);
			const nonIntersectedGenerativGroups = removeManualAttributesFromGenerated.filter(m => !manual.some(g => g.gid === m.gid));
			const nonIntersectedManualGroups = manual.filter(m => !removeManualAttributesFromGenerated.some(g => g.gid === m.gid));
			const res: ILayoutGroup<T>[] = [];
			res.push(...nonIntersectedGenerativGroups);
			res.push(...nonIntersectedManualGroups);
			for(const intersectedGroup of intersectedGroups){
				res.push(this.MergeGroup(intersectedGroup[0] ,intersectedGroup[1]));
			}
			return res;
		} else if(manual instanceof Array){
			return manual;
		} else if(generated instanceof Array){
			return generated;
		} else {
			return undefined;
		}
	}
	private static MergeLayoutConfiguration2<T extends object>(generated: ILayoutConfiguration<T>, manual: ILayoutConfiguration<T>): ILayoutConfiguration<T>  {
		return {
			...generated,
			...manual,
			overloads: this.MergeObjects(generated.overloads, manual.overloads),
			additionalOverloads: this.MergeObjects(generated.additionalOverloads, manual.additionalOverloads),
			labels: this.MergeObjects(generated.labels, manual.labels),
			groups: this.MergeGroups(generated.groups, manual.groups),
		};
	}
	/**
	 * This Methode should only be used by the model generator!
	 * Merges a typed configuration object from the model generator with a typed configuration object from a handwritten file.
	 * Same properties on the configuration objects are overwritten by the handwritten one. This also applies to nested objects.
	 * @param generated The configuration object.
	 * @param manual The configuration object.
	 */
	public static MergeEntityInfo<T extends object>(generated: IEntityInfo<T>,manual: Partial<IEntityInfo<T>>): IEntityInfo<T> {
		return {
			...generated,
			...manual,
			grid: this.MergeEntityGrid(generated.grid,manual.grid),
			form: this.MergeEntityForm(generated.form,manual.form),
			layoutConfiguration: this.MergeLayoutConfiguration(generated.layoutConfiguration,manual.layoutConfiguration),
		};
	}

	protected abstract generateContainerDefinitions(): ContainerDefinition[];

	private cachedContainerDefs?: ContainerDefinition[];

	/**
	 * Returns all containers for the entity.
	 */
	public get containers(): ContainerDefinition[] {
		this.cachedContainerDefs ??= this.generateContainerDefinitions();
		return this.cachedContainerDefs;
	}

	/**
	 * Prepares the relevant parts of the entity required for main entity access.
	 * This must only be called if the entity info is actually the root entity
	 * of the sub-module.
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns A promise that is resolved when the preparation is done.
	 */
	public abstract prepareMainEntityAccess(injector: Injector): Promise<void>;


	/**
	 * Provides an object that offers access to main entity-based functionality.
	 * This must only be called if the entity info is actually the root entity
	 * of the sub-module.
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns The main entity access object.
	 */
	public abstract getMainEntityAccess(injector: Injector): IMainEntityAccess;

	/**
	 * Get entity facade details.
	 */
	public abstract getEntityFacade(): IEntityFacade;

	/**
	 * Returns the default field IDs defined for the entity.
	 *
	 * @param injector The injector instance to use for loading any Angular-injected resources.
	 *
	 * @returns A promise that is resolved to an array of groups, each with the contained field IDs.
	 */
	public abstract getDefaultFieldIds(injector: Injector): Promise<{ groupId: string, fieldIds: string[] }[]>;
}

/**
 * A subclass of {@link EntityInfo} that is type-restricted to the entity type.
 */
export abstract class TypedEntityInfo<T extends object> extends EntityInfo {

	/**
	 * Initializes a new instance.
	 */
	protected constructor() {
		super();
	}

	/**
	 * Generates columns for a typical lookup that references the entity.
	 *
	 * @param injector The Angular injector to use.
	 *
	 * @returns The list of columns.
	 */
	public abstract generateLookupColumns(injector: Injector): Promise<ColumnDef<T>[]>;
}

enum ProvidersMode {
	Custom,
	Form,
	Grid,
	Tree
}

class InternalTypedEntityInfo<T extends object> extends TypedEntityInfo<T> {

	/**
	 * Initializes a new instance.
	 * @param config An object that supplies data about the entity.
	 */
	public constructor(config: IEntityInfo<T>) {
		super();

		this.config = {
			grid: true,
			...config
		};

		this.cachedResources = {
			layoutConfigProvider: ResourceProvider.createOptional(this.config.layoutConfiguration),
			dataServiceProvider: ResourceProvider.create(this.config.dataService),
			dragDropServiceProvider: ResourceProvider.createOptional(this.config.dragDropService),
			idPropertyProvider: ResourceProvider.createOptional(this.config.idProperty),
			validationServiceProvider: ResourceProvider.createOptional(this.config.validationService),
			schemaProvider: this.loadSchema(),
			prepareContainerProvider: ResourceProvider.createOptional(this.config.prepareEntityContainer, 100),
			form: {},
			grid: {},
			tree: {},
			lookup: {}
		};

		if (isFormSettingsObject(this.config.form)) {
			this.cachedResources.form.behaviorProvider = ResourceProvider.createOptional(this.config.form.behavior, 500);
			InternalTypedEntityInfo.prepareProviders(this.config.form, this.cachedResources.form);
		}
		if (isGridSettingsObject(this.config.grid)) {
			this.cachedResources.grid.behaviorProvider = ResourceProvider.createOptional(this.config.grid.behavior, 500);
			if (typeof (this.config.grid.treeConfiguration) === 'boolean') {
				if (this.config.grid.treeConfiguration) {
					this.cachedResources.grid.treeConfigProvider = ResourceProvider.create<IEntityTreeConfiguration<T>>({}, 500);
				}
			} else {
				this.cachedResources.grid.treeConfigProvider = ResourceProvider.createOptional(this.config.grid.treeConfiguration, 500);
			}
			InternalTypedEntityInfo.prepareProviders(this.config.grid, this.cachedResources.grid);
		}
		if (isTreeSettingsObject(this.config.tree)) {
			this.cachedResources.tree.behaviorProvider = ResourceProvider.createOptional(this.config.tree.behavior, 500);
			this.cachedResources.tree.treeConfigProvider = ResourceProvider.create(this.config.tree.treeConfiguration ?? {}, 500);
			InternalTypedEntityInfo.prepareProviders(this.config.tree, this.cachedResources.tree);
		}

		if (this.config.containerBehavior) {
			const cntBehaviorProvider = ResourceProvider.create(this.config.containerBehavior, 500);
			this.cachedResources.form.behaviorProvider ??= cntBehaviorProvider;
			this.cachedResources.grid.behaviorProvider ??= cntBehaviorProvider;
			this.cachedResources.tree.behaviorProvider ??= cntBehaviorProvider;
		}

		if (this.config.lookup) {
			this.cachedResources.lookup.layoutConfigProvider = ResourceProvider.createOptional(this.config.lookup.gridLayout);
		}
	}

	private static prepareProviders(src: IEntityContainerSettingsBase, dest: {
		staticProvidersProvider?: IResourceProvider<StaticProvider[]>,
		loadPermissionsProvider?: IResourceProvider<string | string[]>
	}) {
		dest.staticProvidersProvider = ResourceProvider.createOptional(src.providers, 500);
		dest.loadPermissionsProvider = ResourceProvider.createOptional(src.loadPermissions, 500);
	}

	protected readonly config: IEntityInfo<T>;

	private readonly cachedResources: {
		layoutConfigProvider?: IResourceProvider<ILayoutConfiguration<T>>,
		dataServiceProvider: IResourceProvider<IEntitySelection<T>>,
		dragDropServiceProvider?: IResourceProvider<DragDropBase<T>>
		idPropertyProvider?: IResourceProvider<SimpleIdProperty<T>>,
		validationServiceProvider?: IResourceProvider<BaseValidationService<T>>,
		schemaProvider: IResourceProvider<IEntitySchema<T>>,
		prepareContainerProvider?: IResourceProvider<void>,
		form: {
			behaviorProvider?: IResourceProvider<IEntityContainerBehavior<IFormContainerLink<T>, T>>,
			staticProvidersProvider?: IResourceProvider<StaticProvider[]>,
			loadPermissionsProvider?: IResourceProvider<string[]>
		},
		grid: {
			behaviorProvider?: IResourceProvider<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
			treeConfigProvider?: IResourceProvider<IEntityTreeConfiguration<T>>,
			staticProvidersProvider?: IResourceProvider<StaticProvider[]>,
			loadPermissionsProvider?: IResourceProvider<string[]>
		},
		tree: {
			behaviorProvider?: IResourceProvider<IEntityContainerBehavior<ITreeContainerLink<T>, T>>,
			treeConfigProvider?: IResourceProvider<IEntityTreeConfiguration<T>>,
			staticProvidersProvider?: IResourceProvider<StaticProvider[]>,
			loadPermissionsProvider?: IResourceProvider<string[]>
		},
		lookup: {
			layoutConfigProvider?: IResourceProvider<ILayoutConfiguration<T>>
		}
	};

	private generateProviders(
		normalizedInjectionTokens: EntityContainerInjectionTokens<T>,
		mode: ProvidersMode
	): StaticProvider[] | ((context: IContainerInitializationContext) => StaticProvider[] | Promise<StaticProvider[]>) {
		// create provider for schema first as it is used by other providers
		const firstResourceProviders = new ResourceProvidersList();
		firstResourceProviders.add(this.cachedResources.schemaProvider, normalizedInjectionTokens.entitySchemaConfiguration);
		firstResourceProviders.finalizeList();

		// collect resource providers required for the requested container type
		const resourceProviders = new ResourceProvidersList();
		resourceProviders.add(this.cachedResources.schemaProvider, normalizedInjectionTokens.entitySchemaConfiguration);
		resourceProviders.add(this.cachedResources.prepareContainerProvider);
		resourceProviders.add(this.cachedResources.dataServiceProvider, normalizedInjectionTokens.dataServiceToken);
		resourceProviders.add(this.cachedResources.validationServiceProvider, normalizedInjectionTokens.validationServiceToken);
		resourceProviders.add(this.cachedResources.dragDropServiceProvider, normalizedInjectionTokens.dragDropServiceToken);
		resourceProviders.add(this.cachedResources.layoutConfigProvider, normalizedInjectionTokens.layoutConfigurationToken, {});
		resourceProviders.add(this.cachedResources.idPropertyProvider, normalizedInjectionTokens.idPropertyToken);

		switch (mode) {
			case ProvidersMode.Form:
				resourceProviders.add(this.cachedResources.form.behaviorProvider, normalizedInjectionTokens.getEntityContainerBehaviorToken(), {});
				resourceProviders.addStaticProviders(this.cachedResources.form.staticProvidersProvider);
				resourceProviders.add(this.cachedResources.form.loadPermissionsProvider);
				break;
			case ProvidersMode.Grid:
				resourceProviders.add(this.cachedResources.grid.behaviorProvider, normalizedInjectionTokens.getEntityContainerBehaviorToken(), {});
				resourceProviders.add(this.cachedResources.grid.treeConfigProvider, normalizedInjectionTokens.treeConfigurationToken);
				resourceProviders.addStaticProviders(this.cachedResources.grid.staticProvidersProvider);
				resourceProviders.add(this.cachedResources.grid.loadPermissionsProvider);
				break;
			case ProvidersMode.Tree:
				resourceProviders.add(this.cachedResources.tree.behaviorProvider, normalizedInjectionTokens.getEntityContainerBehaviorToken(), {});
				resourceProviders.add(this.cachedResources.tree.treeConfigProvider, normalizedInjectionTokens.treeConfigurationToken);
				resourceProviders.addStaticProviders(this.cachedResources.tree.staticProvidersProvider);
				resourceProviders.add(this.cachedResources.tree.loadPermissionsProvider);
				break;
		}

		resourceProviders.finalizeList();

		// generate actual static provider factory functions

		if (resourceProviders.containsAsyncProviders || firstResourceProviders.containsAsyncProviders) {
			const result: (context: IContainerInitializationContext) => Promise<StaticProvider[]> = async ctx => {

				let firstProvider : StaticProvider[] | null = null;

				if(firstResourceProviders.containsAsyncProviders){
					await firstResourceProviders.prepareAll(ctx);
					firstProvider = firstResourceProviders.getStaticProviders();
				}else{
					// TODO: async await should handle both cases, need to be rechecked if else block necessary
					firstResourceProviders.prepareAll(ctx);
					firstProvider = firstResourceProviders.getStaticProviders();
				}

				const enhancedInjector = Injector.create({providers: firstProvider, parent: ctx.injector});
				ctx = new ContainerInitializationContext(enhancedInjector, ctx.containerUuid);
				//const secondCtx = new InitializationContext(enhancedInjector);

				if(resourceProviders.containsAsyncProviders){
					await resourceProviders.prepareAll(ctx);
					return resourceProviders.getStaticProviders();
				}else{
					resourceProviders.prepareAll(ctx);
					return resourceProviders.getStaticProviders();
				}
			};

			return result;
		} else {
			const result: (context: IContainerInitializationContext) => StaticProvider[] = ctx => {
				firstResourceProviders.prepareAll(ctx);
				const firstProvider = firstResourceProviders.getStaticProviders();

				const enhancedInjector = Injector.create({providers: firstProvider, parent: ctx.injector});
				const secondCtx = new InitializationContext(enhancedInjector);

				resourceProviders.prepareAll(secondCtx);
				return resourceProviders.getStaticProviders();
			};

			return result;
		}
	}

	/**
	 * Use the schema provided by module info by default, if it's unavailable get the required schema from the server.
	 */
	private loadSchema(): IResourceProvider<IEntitySchema<T>> {
		if (this.config.entitySchema) {
			if (isEntitySchemaType(this.config.entitySchema)) {
				const schemaType = this.config.entitySchema;
				return ResourceProvider.create(ctx => new schemaType());
			}

			return ResourceProvider.create(this.config.entitySchema);
		}

		if (!this.config.dtoSchemeId) {
			throw new Error('The entity info must either supply a schema object or identify a schema that can be retrieved from the back-end.');
		}

		const schemeId = this.config.dtoSchemeId;

		return ResourceProvider.create(ctx => {
			const schemaSvcToken: ProviderToken<PlatformSchemaService<T>> = PlatformSchemaService<T>;
			const platformSchemaService = ctx.injector.get(schemaSvcToken);
			return platformSchemaService.getSchema(schemeId);
		});
	}

	protected override generateContainerDefinitions(): ContainerDefinition[] {
		const result: ContainerDefinition[] = [];

		const normalizedInjectionTokens = new EntityContainerInjectionTokens<T>();

		if (this.config.form) {
			let effectiveFormConfig: IFormContainerSettings<T>;

			if (typeof this.config.form === 'object') {
				const formCfg = this.config.form;
				if (isFormSettingsObject(formCfg)) {
					effectiveFormConfig = formCfg;
				} else {
					effectiveFormConfig = {
						containerUuid: formCfg[0],
						legacyId: formCfg[1]
					};
				}
			} else {
				effectiveFormConfig = {
					containerUuid: this.config.form
				};
			}

			const formInjectionProviders = this.generateProviders(normalizedInjectionTokens, ProvidersMode.Form);

			result.push(new ContainerDefinition({
				uuid: effectiveFormConfig.containerUuid,
				id: effectiveFormConfig.legacyId,
				title: effectiveFormConfig.title ?? this.getDefaultContainerTitle('ui.business-base.defaultDetailsContainerTitle'),
				containerType: effectiveFormConfig.containerType ?? FormContainerComponent,
				permission: (effectiveFormConfig.permission ?? this.config.permissionUuid).toLowerCase(),
				providers: formInjectionProviders,
				loadPermissions: effectiveFormConfig.loadPermissions
			}));
		}

		if (this.config.tree) {
			const effectiveTreeConfig = this.config.tree;

			const treeInjectionProviders = this.generateProviders(normalizedInjectionTokens, ProvidersMode.Tree);

			result.push(new ContainerDefinition({
				uuid: effectiveTreeConfig.containerUuid,
				id: effectiveTreeConfig.legacyId,
				title: effectiveTreeConfig.title ?? this.getDefaultContainerTitle('ui.business-base.defaultTreeContainerTitle'),
				containerType: effectiveTreeConfig.containerType ?? TreeContainerComponent,
				permission: (effectiveTreeConfig.permission ?? this.config.permissionUuid).toLowerCase(),
				providers: treeInjectionProviders,
				loadPermissions: effectiveTreeConfig.loadPermissions
			}));
		}

		if (this.config.grid === undefined || this.config.grid) {
			let effectiveGridConfig: IGridContainerSettings<T>;

			if (typeof this.config.grid === 'object') {
				const gridCfg = this.config.grid;
				if (isGridSettingsObject(gridCfg)) {
					effectiveGridConfig = gridCfg;
				} else {
					effectiveGridConfig = {
						legacyId: gridCfg[0]
					};
				}
			} else {
				effectiveGridConfig = {};
			}

			const gridInjectionProviders = this.generateProviders(normalizedInjectionTokens, ProvidersMode.Grid);

			result.push(new ContainerDefinition({
				uuid: effectiveGridConfig.containerUuid ?? this.config.permissionUuid,
				id: effectiveGridConfig.legacyId,
				title: effectiveGridConfig.title ?? this.getDefaultContainerTitle('ui.business-base.defaultListContainerTitle'),
				containerType: effectiveGridConfig.containerType ?? (effectiveGridConfig.treeConfiguration ? TreeContainerComponent : GridContainerComponent),
				permission: (effectiveGridConfig.permission ?? this.config.permissionUuid).toLowerCase(),
				providers: gridInjectionProviders,
				loadPermissions: effectiveGridConfig.loadPermissions
			}));
		}

		if (this.config.additionalEntityContainers) {
			const additionalContainerInjectionProviders = this.generateProviders(normalizedInjectionTokens, ProvidersMode.Custom);

			for (const origCntDef of this.config.additionalEntityContainers) {
				const newCntDef: IContainerDefinition = (() => {
					if (origCntDef instanceof ContainerDefinition) {
						return {
							uuid: origCntDef.uuid,
							id: origCntDef.id,
							permission: (origCntDef.permission ?? this.config.permissionUuid).toLowerCase(),
							loadPermissions: origCntDef.loadPermissions,
							containerType: origCntDef.containerType,
							title: origCntDef.title,
							providers: combineContainerInjectionProviders(origCntDef.providers, additionalContainerInjectionProviders)
						};
					} else {
						return {
							permission: this.config.permissionUuid.toLowerCase(),
							...origCntDef,
							providers: combineContainerInjectionProviders(origCntDef.providers, additionalContainerInjectionProviders)
						};
					}
				})();

				result.push(new ContainerDefinition(newCntDef));
			}
		}

		return result;
	}

	private getDefaultContainerTitle(defaultTitleKey: string): Translatable {
		return {
			key: defaultTitleKey,
			params: ctx => {
				return {
					entity: this.config.description ? ctx.translator.instant(this.config.description).text : '(unnamed entity)'
				};
			}
		};
	}

	/**
	 * Prepares the relevant parts of the entity required for main entity access.
	 * This must only be called if the entity info is actually the root entity
	 * of the sub-module.
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns A promise that is resolved when the preparation is done.
	 */
	public override async prepareMainEntityAccess(injector: Injector) {
		// create and finalize the firstResourceProviders list
		const firstResourceProviders = new ResourceProvidersList();
		const normalizedInjectionTokens = new EntityContainerInjectionTokens<T>();
		firstResourceProviders.add(this.cachedResources.schemaProvider, normalizedInjectionTokens.entitySchemaConfiguration);
		firstResourceProviders.finalizeList();

		// create context and prepare firstResourceProviders
		const ctx: IContainerInitializationContext = new InitializationContext(injector) as IContainerInitializationContext;
		await firstResourceProviders.prepareAll(ctx);
		const firstProvider = firstResourceProviders.getStaticProviders();

		// create an enhanced injector and generate a new context
		const enhancedInjector = Injector.create({providers: firstProvider, parent: ctx.injector});

		// create and finalize the providers for main entity access (old logic part with new context)
		const providers = new ResourceProvidersList();
		const newCtx = new InitializationContext(enhancedInjector);
		providers.add(this.cachedResources.dataServiceProvider);
		providers.finalizeList();

		await providers.prepareAll(newCtx);
	}



	/**
	 * Provides an object that offers access to main entity-based functionality.
	 * This must only be called if the entity info is actually the root entity
	 * of the sub-module.
	 *
	 * @param injector An Angular injector instance.
	 *
	 * @returns The main entity access object.
	 */
	public override getMainEntityAccess(injector: Injector): IMainEntityAccess {
		const dsp = this.cachedResources.dataServiceProvider;

		if (dsp.requiresAsyncLoading && !dsp.isLoaded) {
			throw new Error('The root data service must be asynchronously loaded before main entity access is required. ' +
				'Please double-check whether your EntityInfo instance is correctly cached, so already loaded reosurces are retained.');
		}

		if (!dsp.isLoaded) {
			const initCtx = new InitializationContext(injector);
			dsp.prepareValue(initCtx); // definitely synchronous (see above), so promise can be ignored
		}

		const ds = dsp.value;
		if (isRootRole(ds)) {
			return ds.mainEntityAccess;
		}

		throw new Error('The specified data service is not a root data service.');
	}

	/**
	 * Generates columns for a typical lookup that references the entity.
	 *
	 * @param injector The Angular injector to use.
	 *
	 * @returns The list of columns.
	 */
	public override async generateLookupColumns(injector: Injector): Promise<ColumnDef<T>[]> {
		const resources = new ResourceProvidersList();

		resources.add(this.cachedResources.schemaProvider);
		const layoutConfigProvider = this.cachedResources.lookup.layoutConfigProvider ?? this.cachedResources.layoutConfigProvider;
		resources.add(layoutConfigProvider);

		resources.finalizeList();

		await resources.prepareAll(() => new InitializationContext(injector));

		const gridSvc = injector.get(UiBusinessBaseEntityGridService);

		const layoutConfig = clone(layoutConfigProvider?.value) ?? {};
		if (layoutConfig.suppressHistoryGroup !== false) {
			layoutConfig.suppressHistoryGroup = true;
		}

		return gridSvc.generateGridConfig<T>(this.cachedResources.schemaProvider.value, layoutConfig);
	}

	/**
	 * Prepares a function to return the details of this entity.
	 * @returns An object with the details of this entity
	 */
	public override getEntityFacade(): IEntityFacade {
		return {
			entityFacadeId: this.config.entityFacadeId,
			getSelectedId: () => {
				if (!this.cachedResources.dataServiceProvider.isLoaded) {
					return null;
				}

				const selectedItem = this.cachedResources.dataServiceProvider.value.getSelectedIds()[0];
				if (!selectedItem) {
					return null;
				}

				return selectedItem;
			},
			getSelectedIds: () => {
				if (!this.cachedResources.dataServiceProvider.isLoaded) {
					return [];
				}

				return this.cachedResources.dataServiceProvider.value.getSelectedIds();
			},
			getAllIds: () => {
				if (!this.cachedResources.dataServiceProvider.isLoaded) {
					return [];
				}
				const entityDataService = generateDataServiceContainer(this.cachedResources.dataServiceProvider.value);
				if (!entityDataService.entityList) {
					return [];
				}
				return entityDataService.entityList.getAllIds();
			}
		};
	}

	/**
	 * Returns the default field IDs defined for the entity.
	 *
	 * @param injector The injector instance to use for loading any Angular-injected resources.
	 *
	 * @returns A promise that is resolved to an array of groups, each with the contained field IDs.
	 */
	public override async getDefaultFieldIds(injector: Injector): Promise<{ groupId: string, fieldIds: string[] }[]> {
		const lcp = this.cachedResources.layoutConfigProvider;
		const sp = this.cachedResources.schemaProvider;

		const resources = new ResourceProvidersList();

		resources.add(sp);
		resources.add(lcp);

		resources.finalizeList();

		await resources.prepareAll(() => new InitializationContext(injector));

		const s = sp.value;
		const lc = lcp?.value;

		const result: { groupId: string, fieldIds: string[] }[] = [];

		if (lc && lc.groups) {
			for (const g of lc.groups) {
				result.push({
					groupId: g.gid,
					fieldIds: [
						...(g.attributes ?? []).map(k => String(k)),
						...(g.additionalAttributes ?? []).map(p => String(p))
					]
				});
			}
		} else {
			const gInfo = {
				groupId: ENTITY_DEFAULT_GROUP_ID,
				fieldIds: Object.keys(s.properties).concat(Object.keys(s.additionalProperties ?? {}))
			};
			if (lc?.excludedAttributes) {
				const excl = new Set<string>();
				for (const attrName of lc.excludedAttributes) {
					excl.add(String(attrName));
				}
				if (lc?.suppressHistoryGroup !== true) {
					excl.add('InsertedAt');
					excl.add('InsertedBy');
					excl.add('UpdatedAt');
					excl.add('UpdatedBy');
					excl.add('Version');
				}

				gInfo.fieldIds = gInfo.fieldIds.filter(fi => !excl.has(fi));
			}
			result.push(gInfo);
		}
		if (lc?.suppressHistoryGroup !== true) {
			if ('InsertedAt' in s.properties) {
				result.push({
					groupId: ENTITY_HISTORY_GROUP_ID,
					fieldIds: ['InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version']
				});
			}
		}

		return result;
	}
}
