/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeChartPrintEntity extends IEntityBase, IEntityIdentification {
	NameInfo?: IDescriptionInfo;
	PapersizeFk: number;
	Height: number;
	Isorientationlandscape: boolean;
	Isheader: boolean;
	ReportFk: number;
}
