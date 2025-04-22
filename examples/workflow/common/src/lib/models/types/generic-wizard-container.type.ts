/*
 * Copyright(c) RIB Software GmbH
 */

import { AllKeys, ITranslatable, LazyInjectionToken } from '@libs/platform/common';
import { GenericWizardContainers, GenericWizardUuidTypeMap } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardContainerConfigType } from '../enum/generic-wizard-container-config-type.enum';
import { GenericWizardEntityConfig } from '@libs/ui/business-base';
import { CustomContainerConfiguration } from './generic-wizard-container-config.type';
import { Injector, Type } from '@angular/core';
import { GenericWizardBaseConfig } from './generic-wizard-base-config.type';
import { GenericWizardEntityContainerConfiguration } from './generic-wizard-entity-container-config.type';
import { BaseValidationService, IEntityProcessor } from '@libs/platform/data-access';
import { GenericWizardConcreteMenuItem } from './generic-wizard-toolbar-item.type';
import { ContainerDefinition } from '@libs/ui/container-system';

export type Containers = Partial<{
	[key in GenericWizardContainers]: Container<key>
}>;

type ContainerBase<Key extends GenericWizardContainers> = {
	/**
	 * Name of the container
	 */
	name: ITranslatable;

	/**
	 * Uuid used to load permissions for the container.
	 */
	permissionUuid: string;

	/**
	 * Property signifies type of configuration loaded
	 */
	containerConfigType: GenericWizardContainerConfigType;

	/**
	 * Filters the loaded entities.
	 * @param injector angular injector
	 * @param entities entities related to this container
	 * @param wizardConfig configuration items from the wizard context
	 * @returns Filtered entity list.
	 */
	filterFn?: (injector: Injector, entities: GenericWizardUuidTypeMap[Key][], wizardConfig: GenericWizardBaseConfig) => GenericWizardUuidTypeMap[Key][];

	/**
	 * Validation service to be used for the container.
	 */
	validationService?: Type<BaseValidationService<GenericWizardUuidTypeMap[Key]>>

	/**
	 * The key that will be used to select display value for the info bar.
	 * The keys are loaded in order, the last valid display value is shown in the info bar.
	 */
	orderedInfoBarDisplayMembers?: AllKeys<GenericWizardUuidTypeMap[Key]>[];

	/**
	 * entity processors to be used for this container.
	 */
	entityProcessors?: IEntityProcessor<GenericWizardUuidTypeMap[Key]>[];

	/**
	 * items to be loaded in the toolbar of the container.
	 */
	toolbarItems?: GenericWizardConcreteMenuItem[];

	
	/**
	 *  flag that indicates whether or not , current container should have a preview button or not.
	 */
	enableDocumentPreview?: boolean;

	/**
	 * Flag that indicates if the container should be shown in the UI or not.
	 * @param injector the angular injector.
	 * @param wizardConfig the runtime configuration of the current wizard.
	 * @returns boolean
	 */
	isVisible?: (injector: Injector, wizardConfig: GenericWizardBaseConfig) => boolean | Promise<boolean>;

	/**
	 * A list of containers that are dependent on the current container.
	 */
	providerContainer?: GenericWizardContainers
};

export type EntityContainer<Key extends GenericWizardContainers> = ContainerBase<Key> & {
	/**
	 * Property signifies type of configuration loaded
	 */
	containerConfigType: GenericWizardContainerConfigType.Entity;

	/**
	 * Configuration used to load entities from the container.
	 */
	configuration: GenericWizardEntityContainerConfiguration<Key>
}

export type CustomContainer<Key extends GenericWizardContainers> = ContainerBase<Key> & {
	/**
	 * Property signifies type of configuration loaded
	 */
	containerConfigType: GenericWizardContainerConfigType.Custom;

	/**
	 * Configuration used to create a custom container.
	 */
	configuration: CustomContainerConfiguration<GenericWizardUuidTypeMap[Key]>;
}

export type ContainerDef<Key extends GenericWizardContainers> = ContainerBase<Key> & {
	/**
	 * Property signifies that this container should be built using a container definition.
	 */
	containerConfigType: GenericWizardContainerConfigType.ContainerDefinition;

	/**
	 * The container definition used to build the container.
	 */
	configuration: ContainerDefinition;
}

export type Container<Key extends GenericWizardContainers> = EntityContainer<Key> | CustomContainer<Key> | ContainerDef<Key>;


/**
 * Helper function to get entityinfo container configuration.
 * @param config - Generic container configuration.
 * @returns the input as an entityInfoContainer.
 */
export function isEntityInfoContainer(config: ContainerUnion): config is EntityContainerUnion {
	return config.containerConfigType === GenericWizardContainerConfigType.Entity;
}

/**
 * Helper function to get custom container configuration
 * @param config - Generic container configuration.
 * @returns the input as an customContainer.
 */
export function isCustomContainer(config: ContainerUnion): config is CustomContainerUnion {
	return config.containerConfigType === GenericWizardContainerConfigType.Custom;
}

/**
 * Helper function to determine if the given configuration is a container definition.
 * 
 * This function checks if the `containerConfigType` property of the provided configuration
 * matches `GenericWizardContainerConfigType.ContainerDefinition`.
 * 
 * @param config - The generic container configuration to check.
 * @returns `true` if the configuration is a container definition, otherwise `false`.
 */
export function isContainerDef(config: ContainerUnion): config is ContainerDefUnion{
	return config.containerConfigType === GenericWizardContainerConfigType.ContainerDefinition;
}

export type ContainerUnion = {
	[K in keyof GenericWizardUuidTypeMap]: Container<K>;
}[keyof GenericWizardUuidTypeMap];

export type EntityContainerUnion = {
	[K in keyof GenericWizardUuidTypeMap]: EntityContainer<K>;
}[keyof GenericWizardUuidTypeMap];

export type CustomContainerUnion = {
	[K in keyof GenericWizardUuidTypeMap]: CustomContainer<K>;
}[keyof GenericWizardUuidTypeMap];

export type ContainerDefUnion = {
	[K in keyof GenericWizardUuidTypeMap]: ContainerDef<K>
}[keyof GenericWizardUuidTypeMap];

export type InjectionTokenUnion = {
	[K in keyof GenericWizardUuidTypeMap]: LazyInjectionToken<GenericWizardEntityConfig<GenericWizardUuidTypeMap[K]>>;
}[keyof GenericWizardUuidTypeMap];

export type GenericWizardEntityConfigUnion = {
	[K in keyof GenericWizardUuidTypeMap]: GenericWizardEntityConfig<GenericWizardUuidTypeMap[K]>;
}[keyof GenericWizardUuidTypeMap];