/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification, IEntityBase } from '@libs/platform/common';

export interface IPlantGroupAccountEntityGenerated extends IEntityIdentification, IEntityBase {
	 PlantGroupFk: number;
	 LedgerContextFk: number;
	 ValidFrom?: Date;
	 ValidTo?: Date;
	 WorkOperationTypeFk: number;
	 AccountTypeFk: number;
	 Account01Fk?: number;
	 Account02Fk?: number;
	 Account03Fk?: number;
	 Account04Fk?: number;
	 Account05Fk?: number;
	 Account06Fk?: number;
	 CommentText?: string;
	 NominalDimension0101?: string;
	 NominalDimension0102?: string;
	 NominalDimension0103?: string;
	 Controllinggrpdetail0101Fk?: number;
	 Controllinggrpdetail0102Fk?: number;
	 Controllinggrpdetail0103Fk?: number;
	 NominalDimension0201?: string;
	 NominalDimension0202?: string;
	 NominalDimension0203?: string;
	 Controllinggrpdetail0201Fk?: number;
	 Controllinggrpdetail0202Fk?: number;
	 Controllinggrpdetail0203Fk?: number;
	 NominalDimension0301?: string;
	 NominalDimension0302?: string;
	 NominalDimension0303?: string;
	 Controllinggrpdetail0301Fk?: number;
	 Controllinggrpdetail0302Fk?: number;
	 Controllinggrpdetail0303Fk?: number;
	 NominalDimension0401?: string;
	 NominalDimension0402?: string;
	 NominalDimension0403?: string;
	 Controllinggrpdetail0401Fk?: number;
	 Controllinggrpdetail0402Fk?: number;
	 Controllinggrpdetail0403Fk?: number;
	 NominalDimension0501?: string;
	 NominalDimension0502?: string;
	 NominalDimension0503?: string;
	 Controllinggrpdetail0501Fk?: number;
	 Controllinggrpdetail0502Fk?: number;
	 Controllinggrpdetail0503Fk?: number;
	 NominalDimension0601?: string;
	 NominalDimension0602?: string;
	 NominalDimension0603?: string;
	 Controllinggrpdetail0601Fk?: number;
	 Controllinggrpdetail0602Fk?: number;
	 Controllinggrpdetail0603Fk?: number;
}