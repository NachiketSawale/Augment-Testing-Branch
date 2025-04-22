/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridTreeConfiguration } from '@libs/ui/common';

/**
 * A tree configuration for a grid based on an entity.
 *
 * @typeParam T The entity type.
 */
export interface IEntityTreeConfiguration<T extends object> extends Partial<IGridTreeConfiguration<T>> {

}
