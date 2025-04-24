/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IPesHeaderEntity} from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { IPesShipmentinfoEntity } from '../model/entities/pes-shipmentinfo-entity.interface';
import { get } from 'lodash';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';


@Injectable({
	providedIn: 'root'
})
/**
 * Procurement Pes shipmentinfo data service
 */
export class ProcurementPesShipmentInfoDataService extends DataServiceFlatLeaf<IPesShipmentinfoEntity,IPesHeaderEntity, PesCompleteNew >{

	public constructor(parentDataService :ProcurementPesHeaderDataService) {
		const options: IDataServiceOptions<IPesShipmentinfoEntity>  = {
			apiUrl: 'procurement/pes/shipmentInfo',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',				
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew'
			},			
			roleInfo: <IDataServiceChildRoleOptions<IPesShipmentinfoEntity,IPesHeaderEntity, PesCompleteNew>>{
				role: ServiceRole.Leaf,
				itemName: 'ShipmentInfo',
				parent: parentDataService,
			},	
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		if (parent) {
			return {
				mainItemId: parent.Id
			};
		} else {
			throw new Error('There should be a selected parent record to load the data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPesShipmentinfoEntity[] {
		if (loaded) {
			return get(loaded, 'dtos', []);
		}
		return [];
	}	
}

		
			





