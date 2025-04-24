/*
 * Copyright(c) RIB Software GmbH
 */
/* tslint:disable */

import { PhaseTemplateEntity } from './phase-template-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import {PhaseRequirementTemplateEntity} from './phase-requirement-template-entity.class';
export class PhaseTemplateEntityComplete implements CompleteIdentification<PhaseTemplateEntity> {
  public MainItemId: number = 0;
  public PhaseTemplate: PhaseTemplateEntity | null = null;
  public PhaseTemplates: PhaseTemplateEntity[] | null = [];
  public PhaseReqTemplateToDelete?: PhaseRequirementTemplateEntity[] = [];
  public PhaseReqTemplateToSave?: PhaseRequirementTemplateEntity[] = [];

}
