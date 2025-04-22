/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchema, IEntitySchemaId } from '@libs/platform/data-access';
import { ContainerLayoutConfiguration, IFormContainerSettings, IGridContainerSettings } from '@libs/ui/business-base';
import { GenericWizardRootDataServiceConfig } from './generic-wizard-leaf-data-service-config.type';
import { ContainerTypeRef } from '@libs/ui/container-system';
import { GenericWizardContainerType } from '../enum/generic-wizard-container-type.enum';
import { PlatformLazyInjectorService, ValueOrType } from '@libs/platform/common';
import { Injector } from '@angular/core';

/**
 * Custom configuration used to load containers.
 */
export type CustomContainerConfigBase<T extends object> = {
	/**
	 * Dto schema id used to load the schema for the container.
	 */
	dtoSchemeId?: IEntitySchemaId;

	/**
	 * Optionally, if the dto is not available on the server, this property is used to set the entity schema.
	 * The schema can be a function that returns a promise of the schema or a value.
	 */
	entitySchema?: ((injector: Injector, lazyInjector: PlatformLazyInjectorService) => Promise<IEntitySchema<T>>) | ValueOrType<IEntitySchema<T>>;

	/**
	 * Describes the layout configuration for the container.
	 */
	containerLayoutConfiguration?: ContainerLayoutConfiguration<T>;

	/**
	 * Describes the type of the container.
	 * The container can be a grid/form and can be supplied with a grid/form configuration.
	 * Or the container can be a custom component.
	 */
	containerType: GenericWizardContainerType;

	/**
	 * Describes the type of data service created for the container.
	 * If the container doesn't require the root data service from the base configuration, this property should be set to false.
	 * @Default the value defaults to false.
	 */
	isLeafContainer?: boolean;

	/**
	 * Describes the configuration used to build the dataservice for the container.
	 */
	dataServiceConfig?: GenericWizardRootDataServiceConfig<T>;

	/**
	 * Describes the default values set for the data service.
	 */
	defaultDataServiceValue?: T[];

	/**
	 * Selects all the items in this container.
	 * @Default is false by default.
	 */
	includeAll?: boolean;
};

/**
 * Custom configuration for grid container.
 */
export type GridConfig<T extends object> = CustomContainerConfigBase<T> & {
	containerType: GenericWizardContainerType.Grid,
	gridConfig: Omit<IGridContainerSettings<T>, 'containerUuid'>
}

/**
 * Custom configuration for form container.
 */
export type FormConfig<T extends object> = CustomContainerConfigBase<T> & {
	containerType: GenericWizardContainerType.Form,
	formConfig: Omit<IFormContainerSettings<T>, 'containerUuid'>
}

/**
 * Custom configuration for custom container.
 */
export type CustomConfiguration<T extends object> = CustomContainerConfigBase<T> & {
	containerType: GenericWizardContainerType.Custom,
	containerComponentRef: ContainerTypeRef
}

/**
 * Union of all custom container configurations.
 */
export type CustomContainerConfiguration<T extends object> = GridConfig<T> | FormConfig<T> | CustomConfiguration<T>;

/**
 * Helper function to type grid container configuration.
 * @param config
 * @returns
 */
export function isGridContainerConfig<T extends object>(config: CustomContainerConfiguration<T>): config is GridConfig<T> {
	return config.containerType === GenericWizardContainerType.Grid;
}

/**
 * Helper function to type form container configuration.
 * @param config
 * @returns
 */
export function isFormContainerConfig<T extends object>(config: CustomContainerConfiguration<T>): config is FormConfig<T> {
	return config.containerType === GenericWizardContainerType.Form;
}

/**
 * Helper function to type custom container configuration.
 * @param config
 * @returns
 */
export function isCustomContainerConfig<T extends object>(config: CustomContainerConfiguration<T>): config is CustomConfiguration<T> {
	return config.containerType === GenericWizardContainerType.Custom;
}