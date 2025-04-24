/*
 * Copyright(c) RIB Software GmbH
 */

/* tslint:disable */
import { CompleteIdentification } from '@libs/platform/common';
import { ProcessTemplateEntity } from './process-template-entity.class';
import { PhaseTemplateEntity } from './phase-template-entity.class';
import { PhaseTemplateEntityComplete } from './phase-template-entity-complete.class';

export class ProcessTemplateEntityComplete implements CompleteIdentification<ProcessTemplateEntity> {
	public MainItemId: number = 0;
	public ProcessTemplate: ProcessTemplateEntity[] | null = []; // the same as name of property ProcessTemplate of RIB.Visual.Productionplanning.ProcessConfiguration.ServiceFacade.WebApi.ProcessTemplateCompleteDto
	public PhaseTemplateToSave: PhaseTemplateEntityComplete[] = [];
	public PhaseTemplateToDelete: PhaseTemplateEntity[] = [];
}
