/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IWizard2GroupEntity } from './entities/wizard-2group-entity.interface';

/**
 * Basics config wizard to group complete class
 */
export class BasicsConfigWizardXGroupComplete implements CompleteIdentification<IWizard2GroupEntity>{

	public mainItemId: number = 0;

	public Datas: IWizard2GroupEntity[] | null = [];

	
}
