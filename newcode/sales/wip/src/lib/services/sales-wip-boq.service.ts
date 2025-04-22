import { Injectable } from '@angular/core';
import { BoqCompositeConfigService, BoqCompositeDataService } from '@libs/boq/main';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IWipBoqCompositeEntity } from '../model/entities/wip-boq-composite-entity.interface';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { WipHeaderComplete } from '../model/wip-header-complete.class';
import { SalesWipWipsDataService } from './sales-wip-wips-data.service';

//TODO-BOQ-Incomplete
@Injectable({providedIn: 'root'})
export class SalesWipBoqDataService extends BoqCompositeDataService<IWipBoqCompositeEntity, IWipBoqCompositeEntity, IWipHeaderEntity, WipHeaderComplete> {
	public constructor(private parentService: SalesWipWipsDataService) {
		const options: IDataServiceOptions<IWipBoqCompositeEntity> = {
			apiUrl: 'sales/wip/boq',
			roleInfo: <IDataServiceRoleOptions<IWipBoqCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'WipBoqComposite',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
		};
		super(options);
	}

	//  region CRUD operations
	// #region

	protected override provideLoadPayload(): object {
		return { wipId:this.parentService.getSelectedEntity()?.Id };
	}

	public override isParentFn(wipHeader: IWipHeaderEntity, wipBoqComposite: IWipBoqCompositeEntity): boolean {
		return wipHeader.Id == wipBoqComposite.WipBoq?.WipHeaderFk;
	}

	// #endregion
	//  endregion
}

@Injectable({providedIn: 'root'})
export class SalesWipBoqConfigService extends BoqCompositeConfigService<IWipBoqCompositeEntity> {
	protected properties = {
		...this.getBoqItemProperties(),
		...this.getBoqHeaderProperties(),
	};
}
