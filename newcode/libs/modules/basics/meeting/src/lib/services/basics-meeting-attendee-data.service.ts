/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IMtgAttendeeEntity, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsMeetingDataService } from './basics-meeting-data.service';
import { BasicsMeetingComplete } from '../model/basics-meeting-complete.class';
import { BasicsMeetingAttendeeReadonlyProcessorService } from './processors/basics-meeting-attendee-readonly-processor.service';

export const BASICS_MEETING_ATTENDEE_DATA_TOKEN = new InjectionToken<BasicsMeetingAttendeeDataService>('basicsMeetingAttendeeDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingAttendeeDataService extends DataServiceFlatLeaf<IMtgAttendeeEntity, IMtgHeaderEntity, BasicsMeetingComplete> {
	public readonly readonlyProcessor: BasicsMeetingAttendeeReadonlyProcessorService;

	public constructor(private parentService: BasicsMeetingDataService) {
		const options: IDataServiceOptions<IMtgAttendeeEntity> = {
			apiUrl: 'basics/meeting/attendee',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IMtgAttendeeEntity, IMtgHeaderEntity, BasicsMeetingComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MtgAttendee',
				parent: parentService,
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};

		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readonlyProcessor]);
	}

	private createReadonlyProcessor() {
		return new BasicsMeetingAttendeeReadonlyProcessorService(this);
	}

	protected override provideCreatePayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id,
			};
		}
		throw new Error('please select a meeting first');
	}

	protected override onCreateSucceeded(created: object): IMtgAttendeeEntity {
		return created as unknown as IMtgAttendeeEntity;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: BasicsMeetingComplete, modified: IMtgAttendeeEntity[], deleted: IMtgAttendeeEntity[]) {
		if (modified && modified.length > 0) {
			const parentSelection = this.getSelectedParent();
			if (parentSelection) {
				modified.forEach((value) => (value.MtgHeaderFk = parentSelection.Id));
				parentUpdate.MainItemId = parentSelection.Id;
			}
			parentUpdate.MtgAttendeeToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			parentUpdate.MtgAttendeeToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsMeetingComplete): IMtgAttendeeEntity[] {
		if (complete && complete.MtgAttendeeToSave) {
			return complete.MtgAttendeeToSave;
		}
		return [];
	}

	public override canDelete(): boolean {
		return super.canDelete() && this.getEntityEditable();
	}

	public override canCreate(): boolean {
		return super.canCreate() && this.getEntityEditable();
	}

	public getEntityEditable() {
		return !this.parentService.isItemReadOnly();
	}

	public override isParentFn(parentKey: IMtgHeaderEntity, entity: IMtgAttendeeEntity): boolean {
		return entity.MtgHeaderFk === parentKey.Id;
	}
}
