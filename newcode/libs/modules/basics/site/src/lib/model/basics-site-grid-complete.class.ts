/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSiteGridEntity } from './basics-site-grid-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { PpsCommonCalendarSiteEntity } from './pps-common-calendar-site-entity.class';
import { PpsProductionPlaceEntity } from './pps-production-place-entity.class';
import { BasicsSite2ExternalEntity } from './basics-site2-external-entity.class';
import { BasicSite2ClerkEntity } from './basic-site2-clerk-entity.class';
import { BasicsSite2TksShiftEntity } from './basics-site2-tks-shift-entity.class';
import { BasicsSite2StockEntity } from './basics-site2-stock-entity.class';
import { PpsProductionPlaceComplete } from './pps-production-place-complete.class';

export class BasicsSiteGridComplete implements CompleteIdentification<BasicsSiteGridEntity> {
	public mainItemId: number = 0;

	public Site: BasicsSiteGridEntity[] | null = [];

	public CalendarSiteToSave: PpsCommonCalendarSiteEntity[] | null = [];
	public CalendarSiteToDelete: PpsCommonCalendarSiteEntity[] | null =[];

	public ProductionPlaceToSave: PpsProductionPlaceComplete[] | null = [];
	public ProductionPlaceToDelete: PpsProductionPlaceEntity[] | null =[];

	public Site2ExternalsToSave: BasicsSite2ExternalEntity[] | null = [];
	public Site2ExternalsToDelete: BasicsSite2ExternalEntity[] | null = [];
	
	public Site2ClerkToSave: BasicSite2ClerkEntity[] | null = [];
	public Site2ClerkToDelete: BasicSite2ClerkEntity[] | null = [];

	public Site2TksShiftsToSave: BasicsSite2TksShiftEntity[] | null = [];
	public Site2TksShiftsToDelete: BasicsSite2TksShiftEntity[] | null = [];

	public Site2StocksToSave : BasicsSite2StockEntity[] | null = [];
	public Site2StocksToDelete: BasicsSite2StockEntity[] | null =[];
}
