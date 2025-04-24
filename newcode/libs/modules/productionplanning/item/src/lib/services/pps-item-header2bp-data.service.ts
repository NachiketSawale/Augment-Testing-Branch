/* it's useless, to be deleted in the future
import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IPpsHeader2BpEntity, PpsHeader2BpComplete} from '@libs/productionplanning/common';
import {IPPSItemEntity} from '../model/entities/pps-item-entity.interface';
import {PPSItemComplete} from '../model/entities/pps-item-complete.class';
import {PpsItemDataService} from './pps-item-data.service';

@Injectable({
	providedIn: 'root'
})
export class PpsItemHeader2bpDataService extends DataServiceFlatNode<IPpsHeader2BpEntity, PpsHeader2BpComplete, IPPSItemEntity, PPSItemComplete> {
	public constructor() {
		const options: IDataServiceOptions<IPpsHeader2BpEntity> = {
			apiUrl: 'productionplanning/header/header2bp',
			roleInfo: <IDataServiceChildRoleOptions<IPpsHeader2BpEntity, IPPSItemEntity, PPSItemComplete>>{
				role: ServiceRole.Node,
				itemName: 'Header2Bp',
				parent: inject(PpsItemDataService)
			},
			readInfo: {
				endPoint: 'listbyheader',
				usePost: true,
				prepareParam: ident => {
					const parent = this.getSelectedParent();
					return {
						Pkey1: parent?.PPSHeaderFk ?? -1,
					};
				},
			},
			createInfo: {
				prepareParam: ident => {
					const parent = this.getSelectedParent();
					return {Id: parent?.PPSHeaderFk ?? -1};
				}
			}
		};
		super(options);
	}
}
*/