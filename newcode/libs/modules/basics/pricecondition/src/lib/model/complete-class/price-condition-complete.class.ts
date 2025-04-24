/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPriceConditionEntity } from '../entities/price-condition-entity.interface';
import { IPriceConditionDetailEntity } from '../entities/price-condition-detail-entity.interface';

export class PriceConditionComplete implements CompleteIdentification<IPriceConditionEntity> {
	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	/**
	 * PriceCondition
	 */
	public PriceCondition?: IPriceConditionEntity | null;

	/**
	 * PriceConditionDetailToDelete
	 */
	public PriceConditionDetailToDelete?: IPriceConditionDetailEntity[] | null = [];

	/**
	 * PriceConditionDetailToSave
	 */
	public PriceConditionDetailToSave?: IPriceConditionDetailEntity[] | null = [];

	/**
	 * ReplacedDefault
	 */
	public ReplacedDefault?: IPriceConditionEntity | null;

	public constructor(e: IPriceConditionEntity | null) {
		if (e) {
			this.MainItemId = e.Id;
			this.PriceCondition = e;
			this.EntitiesCount = e ? 1 : 0;
		}
	}
}
