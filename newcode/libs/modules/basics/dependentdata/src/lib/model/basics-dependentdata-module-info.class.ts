/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BASICS_DEPENDENT_DATA_ENTITY_INFO } from '../dependent-data/basics-dependent-data-entity-info.model';
import { BASICS_DEPENDENT_DATA_COLUMN_ENTITY_INFO } from '../columns/basics-dependent-data-column-entity-info.model';
import { BASICS_DEPENDENT_DATA_CHART_ENTITY_INFO } from '../chart/basics-dependent-data-chart-entity-info.module';
import { BASICS_DEPENDENT_DATA_CHART_SERIES_ENTITY_INFO } from '../chart-series/basics-dependent-data-chart-series-entity-info.service';

/**
 * The module info object for the `basics.dependentdata` content module.
 */
export class BasicsDependentdataModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsDependentdataModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'basics.dependentdata';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.Dependentdata';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [BASICS_DEPENDENT_DATA_ENTITY_INFO, BASICS_DEPENDENT_DATA_COLUMN_ENTITY_INFO, BASICS_DEPENDENT_DATA_CHART_ENTITY_INFO, BASICS_DEPENDENT_DATA_CHART_SERIES_ENTITY_INFO];
	}

	/**
	 * Returns the translation container.
	 */
	protected override get translationContainer(): string | undefined {
		return '7fb114adecdf41d999ab7e3a1359e463';
	}
}
