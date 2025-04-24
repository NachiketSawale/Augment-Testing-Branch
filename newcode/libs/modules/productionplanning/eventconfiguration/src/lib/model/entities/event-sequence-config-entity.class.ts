/* tslint:disable */
import { IEntityIdentification } from '@libs/platform/common';

export class EventSequenceConfigEntity implements IEntityIdentification {
	public Id!: number;
	public EventSeqConfigFk?: number;
	public SiteFk?: number;
	public SeqEventSplitFromFk?: number;
	public SeqEventSplitToFk?: number;
	public Description?: string;
	public IsTemplate!: boolean;
	public QuantityFrom?: number;
	public QuantityTo?: number;
	public SplitAfterQuantity?: number;
	public SplitDayOffset?: number;
	public MaterialGroupFk!: number;
	public IsDefault!: boolean;
	public Mounting!: boolean;
	public ReproductionEng!: boolean;
	public Reproduction!: boolean;
	public CeActive!: boolean;
	public CeField1?: string;
	public CeField2?: string;
	public CeField3?: string;
	public Userdefined1?: string;
	public Userdefined2?: string;
	public Userdefined3?: string;
	public Userdefined4?: string;
	public ItemTypeFk!: number;
	public Userdefined5?: string;
	public MaterialFk?: number;
	public IsLive!: boolean;
	public MatSiteGrpFk?: number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
