/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';

import { IWizardGroupEntity } from './entities/wizard-group-entity.interface';

/**
 * basics config wizard group complete class.
 */
export class BasicsConfigWizardGroupComplete implements CompleteIdentification<IWizardGroupEntity>{

	public MainItemId: number = 0;

	public Datas: IWizardGroupEntity[] | null = [];


}
