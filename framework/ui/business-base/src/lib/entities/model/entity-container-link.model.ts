/*
 * Copyright(c) RIB Software GmbH
 */

import { Subscription } from 'rxjs';
import {
	IEntityModification,
	IEntitySelection,
	IEntityCreate,
	IEntityDelete, IEntityList, IEntityRuntimeDataRegistry, BaseValidationService, IEntityDataCreateConfiguration
} from '@libs/platform/data-access';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { DragDropBase } from '@libs/platform/common';

/**
 * Provides access to resources of an entity container.
 */
export interface IEntityContainerLink<T extends object> {

	/**
	 * The UUID of the container.
	 */
	readonly uuid: string;

	/**
	 * Provides access to the container's standard UI add-ons.
	 */
	readonly uiAddOns: IContainerUiAddOns;

	/**
	 * The data service the container is linked to.
	 */
	readonly entitySelection: IEntitySelection<T>;

	/**
	 * Provides access to modification capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	readonly entityModification?: IEntityModification<T>;

	/**
	 * Provides access to create capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	readonly entityCreate?: IEntityCreate<T>;

	/**
	 * Provides access to delete capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	readonly entityDelete?: IEntityDelete<T>;

	/**
	 * Provides access to list capabilities.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	readonly entityList?: IEntityList<T>;

	/**
	 * Provides access to runtime data management.
	 * Note that this may be `undefined` if the data service does not implement this interface.
	 */
	readonly entityRuntimeDataRegistry?: IEntityRuntimeDataRegistry<T>;

	/**
	 * Provides access to a validation service.
	 * Note that this may be `undefined` if there is no validation service for the entity.
	 */
	readonly entityValidationService?: BaseValidationService<T>;

	/**
	 * Provides access to a drag drop service.
	 * Note that this may be `undefined` if there is no drag drop service for the entity.
	 */
	readonly entityDragDropService?: DragDropBase<T>;

	/**
	 * Provides access to the configuration for creating entities through a dialog.
	 */
	readonly entityDataConfiguration?: IEntityDataCreateConfiguration<T>;

	/**
	 * Registers a finalizer function that is run automatically when the container gets destroyed.
	 * @param finalizer The finalizer function.
	 */
	registerFinalizer(finalizer: () => void): void;

	/**
	 * Registers a subscription that is unsubscribed automatically when the container gets destroyed.
	 *
	 * @param subscription The subscription.
	 */
	registerSubscription(subscription: Subscription): void;

	/**
	 * provides printing functionality for grid, form, tree containers
	 */
	print(): void;
}

/**
 * Provides custom behavior for an entity container.
 */
export interface IEntityContainerBehavior<TContainerLink extends IEntityContainerLink<T>, T extends object> {

	/**
	 * This method is invoked right when the container component is being created.
	 * @param containerLink A reference to the facilities of the container.
	 */
	onCreate?(containerLink: TContainerLink): void;

	/**
	 * This method is invoked in the init phase.
	 * @param containerLink A reference to the facilities of the container.
	 */
	onInit?(containerLink: TContainerLink): void;

	/**
	 * This method is invoked when the container component gets destroyed.
	 * @param containerLink A reference to the facilities of the container.
	 */
	onDestroy?(containerLink: TContainerLink): void;
}