/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';

import {IEntityContainerBehavior, IEntityContainerLink} from '@libs/ui/business-base';

import {PhaseRequirementTemplateEntity} from '../model/phase-requirement-template-entity.class';
import {PpsPhaseRequirementTemplateDateService} from '../services/phase-requirement-template-data.service';

@Injectable({
	providedIn: 'root'
})
export class PhaseRequirementTemplateFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<PhaseRequirementTemplateEntity>, PhaseRequirementTemplateEntity>{
		private dataService: PpsPhaseRequirementTemplateDateService;

		public constructor() {
				this.dataService = inject(PpsPhaseRequirementTemplateDateService);
		}

		public onCreate(containerLink: IEntityContainerLink<PhaseRequirementTemplateEntity>) {
		}
}