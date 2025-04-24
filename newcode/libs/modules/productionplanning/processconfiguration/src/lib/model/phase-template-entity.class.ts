/*
 * Copyright(c) RIB Software GmbH
 */

/* tslint:disable */
import { IEntityIdentification } from '@libs/platform/common';
export class PhaseTemplateEntity implements IEntityIdentification {
    public Id!: number;
    public ProcessTemplateFk!: number;
    public PhaseTypeFk!: number;
    public SequenceOrder!: number;
    public Duration!: number;
    public SuccessorLeadTime!: number;
    public PsdRelationkindFk!: number;
    public SuccessorMinSlackTime!: number;
    public DateshiftMode?: number;
    public IsPlaceholder!: boolean;
    public ProcessTemplateDefFk?: number;
    public ExecutionLimit!: number;
    public InsertedAt!: Date;
    public InsertedBy!: number;
    public UpdatedAt?: Date;
    public UpdatedBy?: number;
    public Version!: number;
}
