/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsStrandPattern2MaterialEntity } from '../../model/schema/models';

@Injectable({
	providedIn: 'root'
})

export class ProductionplanningPpsmaterialLookupService <TEntity extends object> extends UiCommonLookupEndpointDataService<IPpsStrandPattern2MaterialEntity, TEntity> {

	public constructor() {
		super({httpRead: { route: 'productionplanning/ppsmaterial/', endPointRead: 'lookupAll' }}, {
            idProperty: 'Id',
            valueMember: 'Id',
			displayMember: 'Code',
            showGrid : true,
            gridConfig:{
                columns: [
                    {
                        id: 'Code',
                        type: FieldType.Code,
                        model : 'Code',
                        label: {text: 'Code', key:'cloud.common.entityCode'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width: 100
                    
                    },
                    {
                        id: 'Description',
                        type :FieldType.Description,
                        model: 'Description',
                        label :{text: 'Description', key:'cloud.common.entityDescription'},
                        visible: true,
                        readonly: true,
                        sortable: true,
                        width : 100
                       
                    }
                ]
            },
			uuid: '0512f973b46f476eb6a0b49d92630424'
		});
	}
}