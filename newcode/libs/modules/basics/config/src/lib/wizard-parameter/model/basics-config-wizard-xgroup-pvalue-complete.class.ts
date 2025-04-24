/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IWizard2GroupPValueEntity } from './entities/wizard-2group-pvalue-entity.interface';

/**
 * Basics config wizardx group parameter value complete class.
 */
export class BasicsConfigWizardXGroupPValueComplete implements CompleteIdentification<IWizard2GroupPValueEntity> {

	public MainItemId: number = 0;

	public Datas: IWizard2GroupPValueEntity[] | null = [];


}
