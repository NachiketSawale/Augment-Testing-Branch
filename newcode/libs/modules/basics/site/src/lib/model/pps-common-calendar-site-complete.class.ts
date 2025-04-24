/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsCommonCalendarSiteEntity } from './pps-common-calendar-site-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class PpsCommonCalendarSiteComplete implements CompleteIdentification<PpsCommonCalendarSiteEntity> {
	public Id: number = 0;

	public Datas: PpsCommonCalendarSiteEntity[] | null = [];
}
