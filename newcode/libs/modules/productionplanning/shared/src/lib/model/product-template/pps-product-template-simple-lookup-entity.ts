import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IPpsProductTemplateSimpleLookupEntity extends IEntityBase {
	Id?: number,
	Code?: string,
	DescriptionInfo?: IDescriptionInfo | null;
	ProjectFk?: number | null;
	EngDrawingFk?: number | null;
	MdcMaterialFk?: number | null;
	PpsFormulaVersionFk?: number | null;
	InsertedAt?: Date,
	InsertedBy?: number,
	UpdatedAt?: Date | undefined,
	UpdatedBy?: number | undefined,
	Version?: number,
}