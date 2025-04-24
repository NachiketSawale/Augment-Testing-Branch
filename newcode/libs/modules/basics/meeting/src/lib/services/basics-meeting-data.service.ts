/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IReadOnlyField, ServiceRole } from '@libs/platform/data-access';
import { BasicsMeetingComplete } from '../model/basics-meeting-complete.class';
import { IMtgHeaderEntity } from '@libs/basics/interfaces';
import { BasicsSharedMeetingDeleteMeetingService, BasicsSharedMeetingStatusLookupService, BasicsSharedMeetingTypeLookupService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { BasicsMeetingValidationService } from './validations/basics-meeting-validation.service';
import { ReplaySubject } from 'rxjs';

export const BASICS_MEETING_DATA_TOKEN = new InjectionToken<BasicsMeetingDataService>('basicsMeetingDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingDataService extends DataServiceFlatRoot<IMtgHeaderEntity, BasicsMeetingComplete> {
	private readonly meetingStatusLookupSvc = inject(BasicsSharedMeetingStatusLookupService);
	private readonly meetingTypeLookupSvc = inject(BasicsSharedMeetingTypeLookupService);
	private readonly genNumberSvc = inject(BasicsSharedNumberGenerationService);
	private readonly deleteMeetingService = inject(BasicsSharedMeetingDeleteMeetingService);
	private readonly translateService = inject(PlatformTranslateService);
	public readonly rootDataCreated$ = new ReplaySubject<IMtgHeaderEntity>(1);

	public constructor() {
		const options: IDataServiceOptions<IMtgHeaderEntity> = {
			apiUrl: 'basics/meeting',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletemtgs',
			},
			roleInfo: <IDataServiceRoleOptions<IMtgHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'MtgHeader',
			},
		};

		super(options);
		this.processor.addProcessor([
			{
				process: this.readonlyProcess.bind(this),
				revertProcess() {},
			},
		]);
	}

	public override createUpdateEntity(modified: IMtgHeaderEntity | null): BasicsMeetingComplete {
		const complete = new BasicsMeetingComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.MtgHeaderToSave = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsMeetingComplete) {
		if (complete.MtgHeaderToSave === null) {
			return [];
		}
		return complete.MtgHeaderToSave;
	}

	public override delete(entities: IMtgHeaderEntity[] | IMtgHeaderEntity) {
		const deleteMeetings = this.deleteMeetingService.deleteMeeting(entities);
		if (deleteMeetings) {
			super.delete(deleteMeetings);
		}
	}

	private readonlyProcess(item: IMtgHeaderEntity): void {
		const readonlyFields: IReadOnlyField<IMtgHeaderEntity>[] = [
			{ field: 'Recurrence', readOnly: true },
		];
		this.setEntityReadOnlyFields(item, readonlyFields);
	}

	/**
	 * check item is readOnly or not
	 */
	public isItemReadOnly() {
		const item = this.getSelectedEntity();
		if (item) {
			return this.isStatusReadonly(item);
		}
		return true;
	}

	/**
	 * check item status is readonly or not
	 * @param item
	 */
	public isStatusReadonly(item: IMtgHeaderEntity) {
		const meetingStatus = this.meetingStatusLookupSvc.cache.getItem({ id: item.MtgStatusFk });
		if (meetingStatus) {
			return meetingStatus.IsReadOnly;
		}
		return true;
	}

	/**
	 * get meeting type
	 * @param meetingEntity
	 */
	public getMeetingTypeEntity(meetingEntity: IMtgHeaderEntity) {
		return this.meetingTypeLookupSvc.cache.getItem({ id: meetingEntity.MtgTypeFk });
	}

	private shouldGenerateNumber(meetingEntity: IMtgHeaderEntity): boolean {
		const meetingTypeEntity = this.getMeetingTypeEntity(meetingEntity);
		if (meetingTypeEntity) {
			return this.genNumberSvc.hasNumberGenerateConfig(meetingTypeEntity.RubricCategoryFk);
		}
		return false;
	}

	public override onCreateSucceeded(created: IMtgHeaderEntity) {
		const validationService = ServiceLocator.injector.get(BasicsMeetingValidationService);
		const meetingTypeEntity = this.getMeetingTypeEntity(created);
		const defaultCode = this.translateService.instant('cloud.common.isGenerated').text;
		if (meetingTypeEntity && (created.Code === null || created.Code === defaultCode)) {
			const basRubricCategoryFk = meetingTypeEntity.RubricCategoryFk;
			const readonlyFields: IReadOnlyField<IMtgHeaderEntity>[] = [
				{
					field: 'Code',
					readOnly: this.genNumberSvc.hasNumberGenerateConfig(basRubricCategoryFk),
				},
			];
			this.setEntityReadOnlyFields(created, readonlyFields);
			if (this.shouldGenerateNumber(created)) {
				created.Code = this.genNumberSvc.provideNumberDefaultText(basRubricCategoryFk);
			}
			validationService.validateGeneratedCode(created.Code);
			if (this.genNumberSvc.hasNumberGenerateConfig(basRubricCategoryFk)) {
				// service.gridRefresh(); todo
			}
		}
		this.rootDataCreated$.next(created);
		return created;
	}
}
