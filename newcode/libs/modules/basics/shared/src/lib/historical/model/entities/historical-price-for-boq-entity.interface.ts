/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IBasicsSharedHistoricalPriceForBoqEntity extends IEntityBase,IEntityIdentification{
	SourceType?: string;
	Status?: number|null;
	Code?: string;
	CorrectedUnitRate: number;
	UnitRate: number|null;
	UomFk: number|null;
	Date?:Date|null;
	BusinessPartnerFk?: number;
	DescriptionInfo?: IDescriptionInfo;
}