/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { DragDropBase, SimpleIdProperty } from '@libs/platform/common';
import {
	BaseValidationService,
	IEntitySchema,
	IEntitySelection
} from '@libs/platform/data-access';
import {
	IEntityContainerBehavior,
	IEntityContainerLink
} from './entity-container-link.model';
import {
	ILayoutConfiguration
} from '@libs/ui/common';
import { IEntityTreeConfiguration } from './entity-tree-configuration.interface';

const dataServiceToken = new InjectionToken('data-service');

const validationServiceToken = new InjectionToken('validation-service');

const dragDropServiceToken = new InjectionToken('dragdrop-service');

const entityContainerBehaviorToken = new InjectionToken('entity-container-behavior');

const layoutConfigurationToken = new InjectionToken('layout-configuration');

const entitySchemaConfigurationToken = new InjectionToken('schema-configuration');

const treeConfigurationToken = new InjectionToken('tree-configuration');

const ID_PROPERTY_TOKEN = new InjectionToken('id-property');

/**
 * Provides access to standard injection tokens relevant for an entity container, typed to entity type `T`.
 */
export class EntityContainerInjectionTokens<T extends object> {

	/**
	 * The injection token for a data service.
	 */
	public get dataServiceToken(): InjectionToken<IEntitySelection<T>> {
		return <InjectionToken<IEntitySelection<T>>>dataServiceToken;
	}

	/**
	 * The injection token for a data service.
	 */
	public get validationServiceToken(): InjectionToken<BaseValidationService<T>> {
		return <InjectionToken<BaseValidationService<T>>>validationServiceToken;
	}

	/**
	 * The injection token for a data service.
	 */
	public get dragDropServiceToken(): InjectionToken<DragDropBase<T>> {
		return <InjectionToken<DragDropBase<T>>>dragDropServiceToken;
	}

	/**
	 * Returns the token for an entity container behavior object typed to a given container type.
	 */
	public getEntityContainerBehaviorToken<TContainer extends IEntityContainerLink<T>>(): InjectionToken<IEntityContainerBehavior<TContainer, T>> {
		return <InjectionToken<IEntityContainerBehavior<TContainer, T>>>entityContainerBehaviorToken;
	}

	/**
	 * The injection token for a layout configuration.
	 */
	public get layoutConfigurationToken(): InjectionToken<ILayoutConfiguration<T>> {
		return <InjectionToken<ILayoutConfiguration<T>>>layoutConfigurationToken;
	}

	/**
	 * The injection token for entity schema configuration.
	 */
	public get entitySchemaConfiguration(): InjectionToken<IEntitySchema<T>> {
		return <InjectionToken<IEntitySchema<T>>>entitySchemaConfigurationToken;
	}

	/**
	 * The injection token for tree configuration options.
	 */
	public get treeConfigurationToken(): InjectionToken<IEntityTreeConfiguration<T>> {
		return <InjectionToken<IEntityTreeConfiguration<T>>>treeConfigurationToken;
	}

	/**
	 * The injection token for a custom ID property.
	 */
	public get idPropertyToken(): InjectionToken<SimpleIdProperty<T>> {
		return <InjectionToken<SimpleIdProperty<T>>>ID_PROPERTY_TOKEN;
	}
}