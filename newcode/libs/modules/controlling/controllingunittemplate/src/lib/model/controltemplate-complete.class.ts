/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControltemplateUnitEntity } from './entities/controltemplate-unit-entity.interface';
import { ControltemplateUnitComplete } from './controltemplate-unit-complete.class';
import { IControltemplateEntity } from './entities/controltemplate-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class ControltemplateComplete implements CompleteIdentification<IControltemplateEntity> {

	/*
	 * ControllingUnitTemplateUnitsToDelete
	 */
	public ControllingUnitTemplateUnitsToDelete!: IControltemplateUnitEntity[] | null;

	/*
	 * ControllingUnitTemplateUnitsToSave
	 */
	public ControllingUnitTemplateUnitsToSave!: ControltemplateUnitComplete[] | null;

	/*
	 * ControllingUnitTemplates
	 */
	public ControllingUnitTemplates!: IControltemplateEntity[] | null;

	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;
}
