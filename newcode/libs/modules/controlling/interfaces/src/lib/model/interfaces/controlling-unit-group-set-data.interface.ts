/*
 * Copyright(c) RIB Software GmbH
 */

import { IControllingUnitdGroupSetEntity } from '../entities/controlling-unit-group-set-entity.interface';

export interface IControllingUnitGroupSetParent {
	ControllinggrpsetFk?: number | null;
}

export interface IControllingUnitGroupSetComplete {
	MainItemId?: number | null | undefined;
	controllingStructureGrpSetDTLToSave?: IControllingUnitdGroupSetEntity[] | null;
	controllingStructureGrpSetDTLToDelete?: IControllingUnitdGroupSetEntity[] | null;
}
