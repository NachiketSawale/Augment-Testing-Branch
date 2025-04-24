/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IGenericWizardStepEntity } from './entities/generic-wizard-step-entity.interface';

/**
 * Basics config generic wizard step complete class.
 */
export class BasicsConfigGenericWizardStepComplete implements CompleteIdentification<IGenericWizardStepEntity> {

	public Id: number = 0;

	public Datas: IGenericWizardStepEntity[] | null = [];

}
