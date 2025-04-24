/*
 * Copyright(c) RIB Software GmbH
 */

import { AsyncCtxFactoryEnabled } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';

/**
 * Stores settings for lookup fields related to a given entity type.
 *
 * @typeParam T The entity type.
 */
export interface IEntityLookupSettings<T extends object> {

	/**
	 * If the lookup displays a grid whose columns should differ from the overall fields
	 * available for the entity, a lookup-specific layout can be defined here.
	 * If none is given, the layout configuration of the entity will be used for lookups.
	 *
	 * If a configuration is provided in this property, {@link ILayoutConfiguration<T>.overloads}
	 * and {@link ILayoutConfiguration<T>.labels} will be merged with the respective objects
	 * of the entity layout.
	 * Other properties will be overwritten.
	 *
	 * Note that, unless you explicitly set {@link ILayoutConfiguration.suppressHistoryGroup}
	 * to `false`, history fields will not be included in the lookup grid layout. In other words,
	 * the default value for `suppressHistoryGroup` is assumed as `true` for this object.
	 */
	readonly gridLayout?: AsyncCtxFactoryEnabled<ILayoutConfiguration<T>>;
}