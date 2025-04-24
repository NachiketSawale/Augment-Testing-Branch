import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CheckListComplete, IHsqCheckList2ActivityEntity, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistDataService } from './hsqe-checklist-data.service';
import { HsqeChecklistActivityDataReadonlyProcessor } from '../model/processor/hsqe-checklist-activity-data-readonly-processor.service';
import { Injectable, InjectionToken } from '@angular/core';
import { MainDataDto } from '@libs/basics/shared';

export const HSQE_CHECKLIST_ACTIVITY_DATA_TOKEN = new InjectionToken<HsqeChecklistDataService>('hsqeChecklistActivityDataToken');

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistActivityDataService extends DataServiceFlatLeaf<IHsqCheckList2ActivityEntity, IHsqCheckListEntity, CheckListComplete> {
	public constructor(private hsqeChecklistDataService: HsqeChecklistDataService) {
		const options: IDataServiceOptions<IHsqCheckList2ActivityEntity> = {
			apiUrl: 'hsqe/checklist/activity',
			roleInfo: <IDataServiceChildRoleOptions<IHsqCheckList2ActivityEntity, IHsqCheckListEntity, CheckListComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Activity',
				parent: hsqeChecklistDataService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfilter',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident) => {
					return {
						Id: ident.pKey1,
					};
				},
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};
		super(options);
		this.processor.addProcessor(new HsqeChecklistActivityDataReadonlyProcessor(this));
	}

	protected override provideLoadPayload() {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		} else {
			throw new Error('There should be a selected checklist to load the corresponding activity');
		}
	}

	protected override onLoadSucceeded(loaded: object): IHsqCheckList2ActivityEntity[] {
		const dto = new MainDataDto<IHsqCheckList2ActivityEntity>(loaded);
		return dto.Main;
	}

	public override canDelete(): boolean {
		return super.canDelete() && this.getEntityEditable();
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.getEntityEditable();
	}

	private getEntityEditable() {
		return !this.hsqeChecklistDataService.isItemReadOnly();
	}

	public override getSavedEntitiesFromUpdate(complete: CheckListComplete): IHsqCheckList2ActivityEntity[] {
		if (complete && complete.ActivityToSave) {
			return complete.ActivityToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IHsqCheckListEntity, entity: IHsqCheckList2ActivityEntity): boolean {
		return entity.HsqCheckListFk === parentKey.Id;
	}
}
