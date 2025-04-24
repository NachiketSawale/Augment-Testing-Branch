// remark: current file is copied from basics-material-material-group-data.service in basics.material,
// should be replaced by other way(like LazyInjectionToken from basics.material module) in the future
/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsMaterialRecordDataService } from '../material/material-record-data.service';
import { IMaterialEventTypeEntity } from '../../model/entities/material-event-type-entity.interface';
import { PpsMaterialComplete } from '../../model/entities/pps-material-complete.class';
import { IMaterialNewEntity } from '../../model/entities/material-new-entity.interface';

/**
 * Material group data service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsMaterialEventtypeDataService extends DataServiceFlatLeaf<IMaterialEventTypeEntity, IMaterialNewEntity, PpsMaterialComplete> {
	/**
	 * The constructor
	 */
	public constructor(private readonly _parentService: PpsMaterialRecordDataService) {
		const options: IDataServiceOptions<IMaterialEventTypeEntity> = {
			apiUrl: 'productionplanning/ppsmaterial/materialeventtype',
			roleInfo: <IDataServiceChildRoleOptions<IMaterialEventTypeEntity, IMaterialNewEntity, PpsMaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialEventType',
				parent: _parentService,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (identity) => {
					return {
						Id: _parentService.getSelectedEntity()?.Id || -1,
					};
				},
			},
			readInfo: {
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 || -1 };
				},
			},
		};
		super(options);
	}
}
