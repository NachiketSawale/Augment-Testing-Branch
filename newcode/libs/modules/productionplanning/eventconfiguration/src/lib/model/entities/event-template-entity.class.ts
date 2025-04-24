/* tslint:disable */
import { IEntityIdentification } from '@libs/platform/common';
export class EventTemplateEntity implements IEntityIdentification {
	public Id!: number;
	public EventTemplateFk?: number;
	public EventSeqConfigFk!: number;
	public EventTypeFk!: number;
	public SequenceOrder!: number;
	public Duration!: number;
	public LeadTime!: number;
	public RelationKindFk!: number;
	public MinTime!: number;
	public DateshiftMode?: number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
	/**
	 * addtional property that is as a flag for judging if current event template is the last event template
	 */
	public LastInSequence!: boolean;

}
