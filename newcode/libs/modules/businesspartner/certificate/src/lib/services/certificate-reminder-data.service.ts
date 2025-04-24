
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, EntityDateProcessorFactory, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntityProcessor, IEntitySchemaId, ServiceRole } from '@libs/platform/data-access';
import { BusinesspartnerCertificateCertificateDataService } from './certificate-data.service';
import { Observable, ReplaySubject } from 'rxjs';
import { MainDataDto } from '@libs/basics/shared';
import { ICertificateEntity, ICertificateReminderCreateParameter, ICertificateReminderEntity } from '@libs/businesspartner/interfaces';
import { CertificateEntityComplete } from '@libs/businesspartner/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';


@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerCertificateReminderDataService extends DataServiceFlatLeaf<ICertificateReminderEntity,
	ICertificateEntity, CertificateEntityComplete> {
	private readonly subjectRequiredChanged$ = new ReplaySubject<ICertificateReminderEntity>(1);
	public constructor(businesspartnerCertificateCertificateDataService: BusinesspartnerCertificateCertificateDataService ) {
		const options: IDataServiceOptions<ICertificateReminderEntity> = {
			apiUrl: 'businesspartner/certificate/certificatereminder',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getlist',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ICertificateReminderEntity, ICertificateEntity, CertificateEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CertificateReminder',
				parent: businesspartnerCertificateCertificateDataService
			}
		};
		super(options);
		this.processor.addProcessor({
			process: (item) => this.processItem(item),
			revertProcess() {
			}
		});
		this.processor.addProcessor(this.provideDateProcessor());
	}

	protected get entitySchemaId(): IEntitySchemaId {
		return {moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificatePascalCasedModuleName, typeName: 'CertificateReminderDto'};
	}

	protected provideDateProcessor(): IEntityProcessor<ICertificateReminderEntity> {
		return this.createDateProcessor(this.entitySchemaId);
	}

	private createDateProcessor(entitySchemaId: IEntitySchemaId): IEntityProcessor<ICertificateReminderEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<ICertificateReminderEntity>(entitySchemaId);
	}

	private processItem(item: ICertificateReminderEntity) {
		this.subjectRequiredChanged$.next(item);
	}

	public get requiredChanged$(): Observable<ICertificateReminderEntity> {
		return this.subjectRequiredChanged$;
	}

	public reload() {
		const dummyId = {id: -1};
		return this.load(dummyId); // reload reminders.
	}

	// region basic override

	protected override onLoadSucceeded(loaded: ICertificateReminderEntity[]): ICertificateReminderEntity[] {
		// todo call selectFirst() after load. There is no proper place to call it currently.
		// var dataRead = data.handleReadSucceeded(responseData.Main, data);
		// container.service.goToFirst();
		if (loaded) {
			return new MainDataDto<ICertificateReminderEntity>(loaded).Main;
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				CertificateFk: parentSelection.Id
			};
		}
		return {
			CertificateFk: -1
		};
	}

	protected override provideCreatePayload(): ICertificateReminderCreateParameter {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			return {
				CertificateFk: parentSelected.Id,
				CertificateStatusFk: parentSelected.CertificateStatusFk,
				BusinesspartnerFk: parentSelected.BusinessPartnerFk,
			};
		}
		throw new Error('Please select a certificate first');
	}

	protected override onCreateSucceeded(created: ICertificateReminderEntity): ICertificateReminderEntity {
		return created;
	}

	public override isParentFn(parentKey: ICertificateEntity, entity: ICertificateReminderEntity): boolean {
		return entity.CertificateFk === parentKey.Id;
	}
	// endregion
}