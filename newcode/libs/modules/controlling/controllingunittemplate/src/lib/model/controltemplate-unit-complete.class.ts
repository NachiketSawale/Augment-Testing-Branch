/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControltemplateGroupEntity } from './entities/controltemplate-group-entity.interface';
import { IControltemplateUnitEntity } from './entities/controltemplate-unit-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';
import { IControltemplateEntity } from './models';

export class ControltemplateUnitComplete implements CompleteIdentification<IControltemplateEntity> {

	/*
	 * ControllingUnitTemplateGroupsToDelete
	 */
	public ControllingUnitTemplateGroupsToDelete!: IControltemplateGroupEntity[] | null;

	/*
	 * ControllingUnitTemplateGroupsToSave
	 */
	public ControllingUnitTemplateGroupsToSave!: IControltemplateGroupEntity[] | null;

	/*
	 * ControllingUnitTemplateUnits
	 */
	public ControllingUnitTemplateUnits!: IControltemplateUnitEntity | null;

	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;
}
