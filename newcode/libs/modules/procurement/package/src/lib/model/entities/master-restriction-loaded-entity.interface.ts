/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IProcurementPackageLookupEntity} from '@libs/basics/interfaces';
import {IProjectBoqEntity} from '@libs/boq/project';
import {IBoqHeaderLookupEntity} from '@libs/boq/main';
import {IBoqItemEntity} from '@libs/boq/interfaces';
import {IContractLookupEntity} from '@libs/procurement/shared';
import {IPrcPacMasterRestrictionEntity} from './prc-pac-master-restriction-entity.interface';

export interface IMasterRestrictionLoadedEntity {
	Main: IPrcPacMasterRestrictionEntity[];
	PrcPackage: IProcurementPackageLookupEntity[];
	PrjBoq: IProjectBoqEntity[];
	boqHeadsBasePackage: IBoqHeaderLookupEntity[];
	conheaderview: IContractLookupEntity[];
	conBoqHeaders: IBoqHeaderLookupEntity[];
	wicBoqHeaders: IBoqItemEntity[];
}