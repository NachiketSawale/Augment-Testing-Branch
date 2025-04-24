/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IGenericWizardContainerEntity } from './entities/generic-wizard-container-entity.interface';

/**
 * Basics Config Generic Wizard Container Complete Class 
 */
export class BasicsConfigGenericWizardContainerComplete implements CompleteIdentification<IGenericWizardContainerEntity> {
	public Id: number = 0;

	public Datas: IGenericWizardContainerEntity[] | null = [];
}
