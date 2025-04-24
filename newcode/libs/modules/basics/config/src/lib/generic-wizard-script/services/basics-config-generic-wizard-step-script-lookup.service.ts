/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupSimpleDataService } from '@libs/ui/common';

import { IGenericWizardStepScriptEntity } from '../model/entities/generic-wizard-step-script-entity.interface';

/**
 * The Basics config Generic Wizard Step Script lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsConfigGenericWizardStepScriptLookupService<TEntity extends object = object> extends UiCommonLookupSimpleDataService<IGenericWizardStepScriptEntity, TEntity> {
	public constructor() {
		super('basics.config.scripttype', {
			uuid: '4308700f41179132e9df7650',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}
