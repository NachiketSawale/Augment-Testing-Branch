/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsMeetingSection, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { ILink2MeetingDataServiceInitOptions } from '../model/link2meeting-options.interface';
import { BasicsSharedMeetingStatusLookupService } from '../../lookup-services/customize';
import { BasicsSharedMeetingDeleteMeetingService } from '../services/delete-meeting/basics-shared-meeting-delete-meeting.service';
import { BasicsSharedMeetingReadonlyProcessorService } from './basics-shared-meeting-readonly-processor.service';

/**
 * Basics meeting data service
 */
export class BasicsSharedMeetingDataService<T extends IMtgHeaderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	private readonly meetingStatusLookupSvc = inject(BasicsSharedMeetingStatusLookupService);
	public readonly deleteMeetingService = inject(BasicsSharedMeetingDeleteMeetingService);
	public readonly readonlyProcessor: BasicsSharedMeetingReadonlyProcessorService<T, PT, PU>;

	/**
	 * constructor
	 * @param svrOptions
	 */
	public constructor(private svrOptions: ILink2MeetingDataServiceInitOptions<PT>) {
		const options: IDataServiceOptions<T> = {
			apiUrl: 'basics/meeting',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbymodule',
				usePost: true,
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1,
						SectionId: svrOptions.sectionId,
					};
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'MtgHeader',
				parent: svrOptions.parentService,
			},
		};

		super(options);
		this.readonlyProcessor = this.createReadonlyProcessor(svrOptions.sectionId);
		this.processor.addProcessor([
			this.readonlyProcessor,
		]);
	}

	protected createReadonlyProcessor(sectionId: BasicsMeetingSection) {
		return new BasicsSharedMeetingReadonlyProcessorService(sectionId, this);
	}

	public override delete(entities: IMtgHeaderEntity[] | IMtgHeaderEntity) {
		const deleteMeetings = this.deleteMeetingService.deleteMeeting(entities);
		if (deleteMeetings) {
			super.delete(deleteMeetings as T[]);
		}
	}

	public override isParentFn(parent: PT, entity: T) {
		return this.svrOptions.isParentFnOverride(parent, entity);
	}

	private isParentReadonly() {
		return !!(this.svrOptions.isParentReadonlyFn && this.svrOptions.isParentReadonlyFn(this.svrOptions.parentService));
	}

	public isParentAndSelectedReadonly() {
		if (this.isParentReadonly()) {
			return true;
		}

		const selectedItem = this.getSelectedEntity();
		if (!selectedItem) {
			return false;
		}

		const statusList = this.meetingStatusLookupSvc.cache.getList();
		if (!statusList?.length) {
			return false;
		}

		const status = statusList.find((s) => s.Id === selectedItem.MtgStatusFk);
		if (!status?.IsReadOnly) {
			return false;
		}

		return true;
	}

	public override canCreate(): boolean {
		return super.canCreate() && !this.isParentReadonly();
	}

	public override canDelete(): boolean {
		return super.canDelete() && !this.isParentAndSelectedReadonly();
	}
}

export type Link2MeetingCompleteIdentification = {
	MtgHeaderToSave?: IMtgHeaderEntity[];
	MtgHeaderToDelete?: IMtgHeaderEntity[];
};

export class BasicsSharedLink2MeetingDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT> & Link2MeetingCompleteIdentification> extends BasicsSharedMeetingDataService<IMtgHeaderEntity, PT, PU> {
	public constructor(private initOptions: ILink2MeetingDataServiceInitOptions<PT>) {
		super(initOptions);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: IMtgHeaderEntity[], deleted: IMtgHeaderEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.MtgHeaderToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.MtgHeaderToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PU): IMtgHeaderEntity[] {
		if (complete && complete.MtgHeaderToSave) {
			return complete.MtgHeaderToSave;
		}
		return [];
	}
}
