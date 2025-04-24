/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResReservationStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	BackgroundColor: number;
	FontColor: number;
	IsConfirmed: boolean;
	Icon: number;
	Code: string;
	ReservationStatusEndFk: number;
	IsReadOnly: boolean;
}
