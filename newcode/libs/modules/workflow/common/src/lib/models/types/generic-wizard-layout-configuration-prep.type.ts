/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { TransientFieldSpec } from '@libs/ui/common';

/**
 * Settings type used to prepare layout configuration for generic wizard containers.
 */
export type GenericWizardLayoutConfigPrepSettings<T extends object> = {
    /**
     * Source for layout configuration for current container.
     */
    layoutConfig: ContainerLayoutConfiguration<T>;

    /**
     * Initialization context used when creating layout configuration asynchronously.
     */
    ctx: IInitializationContext;

    /**
     * Layout attributes to be included from modules module.
     */
    layoutAttributes: LayoutAttributes[];

    /**
     * TransientFields to be added from generic wizard configuration, only mandatory for entity type configurations.
     * @Optional
     */
    transientFields?: TransientFieldSpec<T>[];

    /**
     * Checks if the current container is a grid to add isIncluded field by default.
     * @Optional
     */
    isGridContainer?: boolean;
}

/**
 * Attributes to be included in the layout configuration for generic wizard containers.
 */
export type LayoutAttributes = {
    id: string;
    isReadonly: boolean;
    sorting: number;
    isPinned: boolean;
}