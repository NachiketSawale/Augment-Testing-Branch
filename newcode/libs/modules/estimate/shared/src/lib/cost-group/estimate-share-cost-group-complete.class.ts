/*
 * Copyright(c) RIB Software GmbH
 */

import {BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';

export class CostGroupComplete {
    public EntitiesCount: number = 1;
    public MainItemId: number = 0;
    public ProjectId?: number = 0;
    public LicCostGroupCats: BasicsCostGroupCatalogEntity[] = [];
    public PrjCostGroupCats: BasicsCostGroupCatalogEntity[] = [];
}