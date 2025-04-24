import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { BoqDummyRootDataService } from '../boq-main-dummy-root-data.service';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IOenLvHeaderEntity } from '../../model/entities/oen-lv-header-entity.interface';

@Injectable({providedIn: 'root'})
export class BoqMainOenLvheaderDataService extends DataServiceFlatNode<IOenLvHeaderEntity, IOenLvHeaderEntity, IBoqItemEntity, IBoqItemEntity> {
	public constructor(parentService: BoqDummyRootDataService) {
		const options: IDataServiceOptions<IOenLvHeaderEntity> = {
			apiUrl: 'boq/main/oen/lvheader',
			roleInfo: <IDataServiceChildRoleOptions<IOenLvHeaderEntity, IOenLvHeaderEntity, IBoqItemEntity>> {
				role: ServiceRole.Node,
				itemName: 'OenLvHeader',
				parent: parentService // TODO-BOQ: First try to use the parent service of 'BoqItemDataService' (to be checked in different modules)
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'lvheader',
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		// TODO-BOQ: Workaround while a project BOQs are not available
		// return { boqHeaderId : boqItemDataService.getSelectedEntity()?.BoqHeaderFk };
		return { boqHeaderId : 1039323 };
	}

	protected override onLoadSucceeded(loadedLvHeader: IOenLvHeaderEntity): IOenLvHeaderEntity[] {
		return loadedLvHeader ? [loadedLvHeader] : [];
	}

	// TODO-BOQ:
	// This overriding prevents that the data dissapear, but the deselection might be the expected behaviour sometimes (to be checked in different modules)
	// A processor could be an alternative.
	public override deselect() {
		if (this.getList().length === 1) {
			this.selectFirst().then(() => {
				// todo
			});
		} else {
			super.deselect();
		}
	}
}