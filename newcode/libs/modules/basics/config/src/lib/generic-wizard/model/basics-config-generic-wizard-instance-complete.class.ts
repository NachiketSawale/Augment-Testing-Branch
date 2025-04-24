/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IGenericWizardInstanceEntity } from './entities/generic-wizard-instance-entity.interface';

export class BasicsConfigGenericWizardInstanceComplete implements CompleteIdentification<IGenericWizardInstanceEntity> {
	public Id: number = 0;

	public Datas: IGenericWizardInstanceEntity[] | null = [];
}
