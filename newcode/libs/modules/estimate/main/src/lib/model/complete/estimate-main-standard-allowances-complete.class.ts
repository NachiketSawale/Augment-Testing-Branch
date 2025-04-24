/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IEstAllMarkup2costcodeEntity, IEstAllowanceEntity } from '@libs/estimate/interfaces';

export class EstimateMainStandardAllowancesComplete implements CompleteIdentification<IEstAllowanceEntity>{

	public Id: number = 0;

	public EstHeaderId: number | null = null;
	public ProjectId: number | undefined = undefined;
	public IsActiveChange: boolean = false;

	public EstimateAllowanceToSave: IEstAllowanceEntity[] | null = null;

	public AllowanceMarkUp2CostCodeToSave: IEstAllMarkup2costcodeEntity[] | null = null;

	public AllowanceMarkUp2CostCodeToDelete: IEstAllMarkup2costcodeEntity[] | null = null;

	public Areas: IEstAllowanceEntity[] = [];
}
