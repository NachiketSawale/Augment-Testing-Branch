/*
 * Copyright(c) RIB Software GmbH
 */

import { AsyncCtxFactoryEnabled } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';

/**
 * Describes a source for a layout configuration object.
 */
export type ContainerLayoutConfiguration<T extends object> = AsyncCtxFactoryEnabled<ILayoutConfiguration<T>>;