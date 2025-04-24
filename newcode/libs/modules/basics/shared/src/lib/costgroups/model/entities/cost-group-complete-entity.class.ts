/*
 * Copyright(c) RIB Software GmbH
 */

import { ICostGroupCatEntity } from './cost-group-cat-entity.interface';
import { ICostGroupEntity } from './cost-group-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class CostGroupCompleteEntity implements CompleteIdentification<ICostGroupEntity> {
	/**
	 * CostGroupCatToSave
	 */
	public CostGroupCatToSave?: ICostGroupCatEntity | null = null;

	/**
	 * CostGroupsToDelete
	 */
	public CostGroupsToDelete?: ICostGroupEntity[] | null = [];

	/**
	 * CostGroupsToSave
	 */
	public CostGroupsToSave?: ICostGroupEntity[] | null = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount: number = 0;

	/**
	 * LicCostGroupCats
	 */
	public LicCostGroupCats?: ICostGroupCatEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = -1;

	/**
	 * PrjCostGroupCats
	 */
	public PrjCostGroupCats?: ICostGroupCatEntity[] | null = [];

	/**
	 * ProjectId
	 */
	public ProjectId?: number | null;
}
