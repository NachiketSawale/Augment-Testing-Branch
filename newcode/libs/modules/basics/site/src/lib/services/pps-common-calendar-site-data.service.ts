/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';

import { PpsCommonCalendarSiteEntity } from '../model/pps-common-calendar-site-entity.class';
import { PpsCommonCalendarSiteComplete } from '../model/pps-common-calendar-site-complete.class';
import { BasicsSiteGridEntity } from '../model/basics-site-grid-entity.class';
import { BasicsSiteGridDataService } from './basics-site-grid-data.service';
import { BasicsSiteGridComplete } from '../model/basics-site-grid-complete.class';
import { IIdentificationData } from '@libs/platform/common';

export const PPS_COMMON_CALENDAR_SITE_DATA_TOKEN = new InjectionToken<PpsCommonCalendarSiteDataService>('ppsCommonCalendarSiteDataToken');

@Injectable({
	providedIn: 'root',
})
export class PpsCommonCalendarSiteDataService extends DataServiceFlatLeaf<PpsCommonCalendarSiteEntity, PpsCommonCalendarSiteComplete, BasicsSiteGridComplete> {
	public constructor(basicSiteGridService: BasicsSiteGridDataService) {
		const options: IDataServiceOptions<PpsCommonCalendarSiteEntity> = {
			apiUrl: 'productionplanning/common/calendar4site',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},	  
			},		
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				prepareParam: ident => {
					return { Id : ident.pKey1};
				}		
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint:'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<PpsCommonCalendarSiteEntity, BasicsSiteGridEntity, BasicsSiteGridComplete >>{
				role: ServiceRole.Leaf,
				itemName: 'CalendarSite',
				parent: basicSiteGridService
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override isParentFn(parentKey: BasicsSiteGridEntity, entity: PpsCommonCalendarSiteEntity): boolean {
		return true;
	}
	
	public override registerModificationsToParentUpdate(parentUpdate: BasicsSiteGridComplete, modified: PpsCommonCalendarSiteEntity[], deleted: PpsCommonCalendarSiteEntity[]) {
		if (modified && modified.some(() => true)) {
			parentUpdate.CalendarSiteToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.CalendarSiteToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: BasicsSiteGridComplete): PpsCommonCalendarSiteEntity[] {
		if (complete && complete.CalendarSiteToSave) {
			return complete.CalendarSiteToSave;
		}
		return [];
	}

}

