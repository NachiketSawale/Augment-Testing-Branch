/*
 * Copyright(c) RIB Software GmbH
 */


import { IControllingUnitEntity } from '@libs/basics/shared';
import { CompleteIdentification } from '@libs/platform/common';



/**
 * @class EstimateMainControllingContainerComplete
 */
export class EstimateMainControllingContainerComplete implements CompleteIdentification<IControllingUnitEntity>{

	public Id: number = 0;

	public EstCtu: IControllingUnitEntity [] | null = [];

	
}
