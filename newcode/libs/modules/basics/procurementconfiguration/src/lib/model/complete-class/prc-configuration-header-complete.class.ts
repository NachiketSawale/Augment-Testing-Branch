/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrcConfigHeaderEntity } from '../entities/prc-config-header-entity.interface';
import { IPrcConfiguration2BSchemaEntity } from '../entities/prc-configuration-2-bschema-entity.interface';
import { IPrcConfiguration2StrategyEntity } from '../entities/prc-configuration-2-strategy-entity.interface';
import { IPrcConfiguration2TabEntity } from '../entities/prc-configuration-2-tab-entity.interface';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';
import { PrcConfigurationComplete } from './prc-configuration-complete.class';
import { IPrcTotalTypeEntity } from '../entities/prc-total-type-entity.interface';

export class PrcConfigurationHeaderComplete implements CompleteIdentification<IPrcConfigHeaderEntity> {
	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * PrcConfigHeader
	 */
	public PrcConfigHeader?: IPrcConfigHeaderEntity | null;

	/**
	 * PrcConfiguration2BSchemaToDelete
	 */
	public PrcConfiguration2BSchemaToDelete?: IPrcConfiguration2BSchemaEntity[] | null = [];

	/**
	 * PrcConfiguration2BSchemaToSave
	 */
	public PrcConfiguration2BSchemaToSave?: IPrcConfiguration2BSchemaEntity[] | null = [];

	/**
	 * PrcConfiguration2StrategyToDelete
	 */
	public PrcConfiguration2StrategyToDelete?: IPrcConfiguration2StrategyEntity[] | null = [];

	/**
	 * PrcConfiguration2StrategyToSave
	 */
	public PrcConfiguration2StrategyToSave?: IPrcConfiguration2StrategyEntity[] | null = [];

	/**
	 * PrcConfiguration2TabToDelete
	 */
	public PrcConfiguration2TabToDelete?: IPrcConfiguration2TabEntity[] | null = [];

	/**
	 * PrcConfiguration2TabToSave
	 */
	public PrcConfiguration2TabToSave?: IPrcConfiguration2TabEntity[] | null = [];

	/**
	 * PrcConfigurationToDelete
	 */
	public PrcConfigurationToDelete?: IPrcConfigurationEntity[] | null = [];

	/**
	 * PrcConfigurationToSave
	 */
	public PrcConfigurationToSave?: PrcConfigurationComplete[] | null = [];

	/**
	 * PrcTotalTypeToDelete
	 */
	public PrcTotalTypeToDelete?: IPrcTotalTypeEntity[] | null = [];

	/**
	 * PrcTotalTypeToSave
	 */
	public PrcTotalTypeToSave?: IPrcTotalTypeEntity[] | null = [];

	/**
	 * PreDefaultMainItem
	 */
	public PreDefaultMainItem?: IPrcConfigHeaderEntity | null;

	/**
	 *  EntitiesCount
	 */
	public EntitiesCount?: number;

	public constructor(entity: IPrcConfigHeaderEntity | null) {
		if (entity) {
			this.MainItemId = entity.Id;
			this.PrcConfigHeader = entity;
			this.EntitiesCount = entity ? 1 : 0;
		}
	}
}
