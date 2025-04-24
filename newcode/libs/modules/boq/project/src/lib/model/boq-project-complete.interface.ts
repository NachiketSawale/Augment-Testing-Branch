/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { IProjectBoqCompositeEntity } from './entities/project-boq-composite-entity.interface';

// TODO-BOQ: Can that be generated?
export interface IProjectBoqComplete extends CompleteIdentification<IProjectBoqCompositeEntity>, IBoqCompositeCompleteEntity {
	BoqComposite: IProjectBoqCompositeEntity | null

	//TODO-BOQ-Need another complete class for below
	//public BoqHeader2ClerksToSave: IBoqHeader2ClerkEntity[] | null = [];
	//public BoqHeader2ClerksToDelete: IBoqHeader2ClerkEntity[] | null = [];

}
