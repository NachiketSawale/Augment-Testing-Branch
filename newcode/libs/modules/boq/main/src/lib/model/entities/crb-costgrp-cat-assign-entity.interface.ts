/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { ICrbCostgrpCatAssignEntityGenerated } from './crb-costgrp-cat-assign-entity-generated.interface';

export interface ICrbCostgrpCatAssignEntity extends ICrbCostgrpCatAssignEntityGenerated {
    /*
 * NewPrjCostgrpCatAssign
 */
	NewPrjCostgrpCatAssign?: IPrjCostgrpCatAssignUnmappedEntity | null;
	/*
* PrjCostgrpcatAssignDescription
*/
	PrjCostgrpcatAssignDescription?: string | null;
}


export interface IPrjCostgrpCatAssignUnmappedEntity {

    Id?: number | null;

    Code?: string | null;

    Description?: string | null;

    IsBoq?: boolean | null;

    IsEstimate?: boolean | null;

    IsConstructionSystem?: boolean | null;

    IsProcurement?: boolean | null;

    IsEngineering?: boolean | null;

    IsProductionSystem?: boolean | null;

    IsModel?: boolean | null;

    IsQto?: boolean | null;

    IsControlling?: boolean | null;

    IsDefect?: boolean | null;

    ContextCostGroupCatalogFk?: number | null;

    ProjectCostGroupCatalogFk?: number | null;
}

