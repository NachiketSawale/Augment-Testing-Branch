/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IPesSelfBillingEntity } from '../model/entities/pes-self-billing-entity.interface';
import { IPesHeaderEntity} from '../model/entities';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { MainDataDto } from '@libs/basics/shared';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';


@Injectable({
	providedIn: 'root'
})

/**
 * The Procurement Pes Selfbilling Detail Data Service
 */
export class ProcurementPesSelfbillingDetailDataService extends DataServiceFlatLeaf<IPesSelfBillingEntity,IPesHeaderEntity, PesCompleteNew>{
	
	public constructor(protected parentDataService :ProcurementPesHeaderDataService) {
		const options: IDataServiceOptions<IPesSelfBillingEntity>  = {
			apiUrl: 'procurement/pes/selfbilling',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				prepareParam: () => {
					const selection = parentDataService.getSelectedEntity();
					return { 
						MainItemId: selection?.Id ?? -1 ,
						BusinessPartnerId: selection?.BusinessPartnerFk ?? -1
					};
				},
			},
			
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPesSelfBillingEntity,IPesHeaderEntity, PesCompleteNew>>{
				role: ServiceRole.Leaf,
				itemName: 'PesSelfBilling',
				parent: parentDataService,
			},
			
		};
		super(options);
	}
	
	protected override provideLoadPayload(): object {
		const parent = this.parentDataService.getSelectedEntity()!;
		return {
			mainItemId:parent.Id
		};
	}
	
	protected override onLoadSucceeded(loaded: object): IPesSelfBillingEntity[] {
		const dto = new MainDataDto<IPesSelfBillingEntity>(loaded);
		return dto.Main;
	}	
}

		
		





