
import { Injectable } from '@angular/core';
import { BoqCompositeDataService, IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { CompleteIdentification } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

// Todo-BOQ: Create separate file for this complete entity probably in the procurement common module. Has to be discussed first. Same interface is also created in other prc modules like contract. Can be replaced with common one.
export interface IPrcBoqExtendedComplete extends CompleteIdentification<IPrcBoqExtendedEntity>, IBoqCompositeCompleteEntity {
	MainItemId: number;
	PrcBoqExtended: IPrcBoqExtendedEntity
}

/** Prc Package boq list data service */
@Injectable({providedIn: 'root'})
export class ProcurementPackageBoqDataService extends BoqCompositeDataService<IPrcBoqExtendedEntity, IPrcBoqExtendedComplete, IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor(private parentService: ProcurementPackageHeaderDataService) {
		const options: IDataServiceOptions<IPrcBoqExtendedEntity> = {
			apiUrl: 'procurement/common/boq',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IPrcBoqExtendedEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrcBoqExtended',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		return { prcHeaderFk:1062934 /* this.parentService.getSelectedEntity()?.PrcHeaderFk */, exchangeRate:1, filterBackups: false }; // TODO-BOQ: exchangeRate? TODO-PRC- How to get PrcHeaderFk from ProcurementPackageHeaderDataService. Currently pending from Prc team.
	}

	public override isParentFn(pkgHeader: IPrcPackageEntity, prcBoqExtended: IPrcBoqExtendedEntity): boolean {
		return true;  //pkgHeader.Id === prcBoqExtended.PrcBoq?.PrcHeaderFk; // TODO-BOQ: What else to compare?
	}

}

