/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IGenericWizardStepScriptEntity } from './entities/generic-wizard-step-script-entity.interface';


/**
 * Basics config Generic Wizard Step Script complete class
 */
export class BasicsConfigGenericWizardStepScriptComplete implements CompleteIdentification<IGenericWizardStepScriptEntity>{

	public Id: number = 0;

	public Datas: IGenericWizardStepScriptEntity[] | null = [];

	
}
