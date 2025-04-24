/*
 * Copyright(c) RIB Software GmbH
 */

import { ContainerBaseComponent } from '@libs/ui/container-system';
import { inject } from '@angular/core';
import { DragDropBase, SimpleIdProperty } from '@libs/platform/common';
import {
	BaseValidationService,
	IEntityCreate,
	IEntityCreateChild,
	IEntityDataCreateConfiguration,
	IEntityDelete,
	IEntityList,
	IEntityModification,
	IEntityNavigation,
	IEntityRuntimeDataRegistry,
	IEntitySchema,
	IEntitySelection,
	IEntityTree
} from '@libs/platform/data-access';
import { EntityContainerInjectionTokens } from '../../model/entity-container-injection-tokens.class';
import { generateDataServiceContainer } from '../../model/data-service-utils.model';

/**
 * The base class for entity-based containers.
 */
export abstract class EntityContainerBaseComponent<T extends object> extends ContainerBaseComponent {

	/**
	 * Initializes a new instance.
	 */
	protected constructor() {
		super();

		const dsCnt = generateDataServiceContainer(inject(this.injectionTokens.dataServiceToken));
		this.entitySelection = dsCnt.entitySelection;
		this.entityModification = dsCnt.entityModification;
		this.entityCreate = dsCnt.entityCreate;
		this.entityCreateChild = dsCnt.entityCreateChild;
		this.entityDelete = dsCnt.entityDelete;
		this.entityList = dsCnt.entityList;
		this.entityTree = dsCnt.entityTree;
		this.entityRuntimeDataRegistry = dsCnt.entityRuntimeDataRegistry;
		this.entityDataConfiguration = dsCnt.entityDataConfiguration;
		this.entityNavigation = dsCnt.entityNavigation;

		this.entityValidationService = inject(this.injectionTokens.validationServiceToken, {
			optional: true
		}) ?? undefined;

		this.entityDragDropService = inject(this.injectionTokens.dragDropServiceToken, {
			optional: true
		}) ?? undefined;

		this.entityIdProperty = inject(this.injectionTokens.idPropertyToken, {
			optional: true
		}) ?? undefined;
	}

	protected readonly injectionTokens = new EntityContainerInjectionTokens<T>();

	/**
	 * The ID property of the entity, unless this it is just named `id`.
	 */
	protected readonly entityIdProperty?: SimpleIdProperty<T>;

	/**
	 * The data service the container is linked to.
	 */
	protected readonly entitySelection: IEntitySelection<T>;

	/**
	 * Provides access to modification capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityModification?: IEntityModification<T>;

	/**
	 * Provides access to creation capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityCreate?: IEntityCreate<T>;

	/**
	 * Provides access to hierarchical creation capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityCreateChild?: IEntityCreateChild<T>;

	/**
	 * Provides access to deletion capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityDelete?: IEntityDelete<T>;

	/**
	 * Provides access to list capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityList?: IEntityList<T>;

	/**
	 * Provides access to tree navigation capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityTree?: IEntityTree<T>;

	/**
	 * Provides access to runtime data management.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	protected readonly entityRuntimeDataRegistry?: IEntityRuntimeDataRegistry<T>;

	/**
	 * Contains the validation service for the entity, if a validation service has been provided.
	 */
	protected readonly entityValidationService?: BaseValidationService<T>;

	/**
	 * Contains the dragdrop service for the entity, if a dragdrop service has been provided.
	 */
	protected readonly entityDragDropService?: DragDropBase<T>;

	/**
	 * Provides access to the configuration for creating entities through a dialog.
	 */
	protected readonly entityDataConfiguration?: IEntityDataCreateConfiguration<T>;

	/**
	 * Provides access to the entity navigation.
	 */
	protected readonly entityNavigation?: IEntityNavigation<T>;

	/**
	 * load the schema for entity <T>
	 */
	protected loadEntitySchema(): IEntitySchema<T> {
		return inject(this.injectionTokens.entitySchemaConfiguration);
	}
}