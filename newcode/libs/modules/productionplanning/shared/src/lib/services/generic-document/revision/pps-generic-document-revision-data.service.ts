import { IPpsGenericDocumentRevisionEntity } from '../../../model/generic-document/pps-generic-document-revision-entity.interface';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData,
	PlatformConfigurationService
} from '@libs/platform/common';
import {
	IDataServiceChildRoleOptions,
	IDataServiceOptions, ServiceRole, IDataServiceEndPointOptions
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get, set, maxBy } from 'lodash';
import { IPpsGenericDocumentRevisionDataSrvInitOptions } from '../../../model/generic-document/pps-generic-document-revision-data-srv-init-options.interface';
import { DocumentDataLeafService } from '@libs/documents/shared';

export class ProductionplanningSharedGenericDocumentRevisionDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DocumentDataLeafService<IPpsGenericDocumentRevisionEntity, PT, PU> {

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public constructor(initOptions: IPpsGenericDocumentRevisionDataSrvInitOptions<PT>) {
		const options: IDataServiceOptions<IPpsGenericDocumentRevisionEntity> = {
			apiUrl: initOptions.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const parent = initOptions.parentService.getSelectedEntity()!;
					const maxRevision = maxBy(this.getList(), 'Revision')?.Version ?? 0;
					return {
						Id: parent.Id,
						PKey1: maxRevision
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsGenericDocumentRevisionEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'DocumentRevision',
				parent: initOptions.parentService
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		return {
			From: get(this.getSelectedParent(), 'From'),
			SourceId: get(this.getSelectedParent(), 'SourceId')
		};
	}

	protected override onLoadSucceeded(loaded: IPpsGenericDocumentRevisionEntity[]): IPpsGenericDocumentRevisionEntity[] {
		return loaded;
	}

	public override isParentFn(parentKey: object, entity: IPpsGenericDocumentRevisionEntity): boolean {
		return entity.SourceId === get(parentKey, 'SourceId');
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: IPpsGenericDocumentRevisionEntity[], deleted: IPpsGenericDocumentRevisionEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'RevisionToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'RevisionToDelete', deleted);
		}
	}

	public override IsParentEntityReadonly(): boolean {
		return true; // revision is always readonly
	}

}