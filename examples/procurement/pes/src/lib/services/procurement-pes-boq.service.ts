
import { Injectable } from '@angular/core';
import { BoqCompositeDataService, IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { CompleteIdentification } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPesBoqEntity } from '../model/entities/pes-boq-entity.interface';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { IPesHeaderEntity } from '../model/entities';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

export interface IPesBoqExtendedComplete extends CompleteIdentification<IPesBoqEntity>, IBoqCompositeCompleteEntity {
	MainItemId: number;
	PesBoq: IPesBoqEntity
}

/** Prc Pes boq list data service */
@Injectable({providedIn: 'root'})
export class ProcurementPesBoqDataService extends BoqCompositeDataService<IPesBoqEntity, IPesBoqExtendedComplete, IPesHeaderEntity, PesCompleteNew> {
	public constructor(private parentService: ProcurementPesHeaderDataService) {
		const options: IDataServiceOptions<IPesBoqEntity> = {
			apiUrl: 'procurement/pes/boq',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IPesBoqEntity>>{
				role: ServiceRole.Node,
				itemName: 'PesBoq',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		return { mainItemId: 1009404  /*this.parentService.getSelectedEntity()?.PrcHeaderFk*/ }; // TODO-BOQ: Pes module is currently not working. So not able to test. Remove hardcode id and pass actual parentid.
	}

	public override isParentFn(pesHeader: IPesHeaderEntity, pesBoq: IPesBoqEntity): boolean {
		return true;  // TODO-BOQ: What else to compare?
	}

}

