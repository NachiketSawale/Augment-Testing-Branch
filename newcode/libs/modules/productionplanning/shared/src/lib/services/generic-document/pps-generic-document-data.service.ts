import { IPpsGenericDocumentEntity } from '../../model/generic-document/pps-generic-document-entity.interface';
import { PpsGenericDocumentComplete } from '../../model/generic-document/pps-generic-document-complete.class';
import {
	CompleteIdentification,
	IEntityIdentification,
	PlatformConfigurationService
} from '@libs/platform/common';

import {
	IDataServiceEndPointOptions,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get, set } from 'lodash';
import { IPpsGenericDocumentDataSrvInitOptions } from '../../model/generic-document/pps-generic-document-data-srv-init-options.interface';
import { DocumentDataNodeService } from '@libs/documents/shared';

export class ProductionplanningSharedGenericDocumentDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DocumentDataNodeService<IPpsGenericDocumentEntity, PpsGenericDocumentComplete, PT, PU> {

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public constructor(
		private initOptions: IPpsGenericDocumentDataSrvInitOptions<PT>
	) {

		const options: IDataServiceOptions<IPpsGenericDocumentEntity> = {
			apiUrl: initOptions.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: initOptions.endPoint ?? 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsGenericDocumentEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'GenericDocument',
				parent: initOptions.parentService
			}
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: IPpsGenericDocumentEntity[]): IPpsGenericDocumentEntity[] {
		return loaded;
	}

	protected override provideLoadPayload(): object {
		const mainItemId = get(this.getSelectedParent(), 'Id');
		const obj = {};
		set(obj, this.initOptions.parentFilter, mainItemId);
		return obj;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PpsGenericDocumentComplete[], deleted: IPpsGenericDocumentEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'PpsGenericDocumentToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'PpsGenericDocumentToDelete', deleted);
		}
	}

	public override getModificationsFromUpdate(complete: PpsGenericDocumentComplete): IPpsGenericDocumentEntity[] {
		if (complete.GenericDocument) {
			return [complete.GenericDocument];
		}
		return [];
	}

	public override createUpdateEntity(modified: IPpsGenericDocumentEntity | null): PpsGenericDocumentComplete {
		const complete = new PpsGenericDocumentComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.GenericDocument = modified;
		}

		return complete;
	}

	public override IsParentEntityReadonly(): boolean {
		if(this.initOptions.IsParentEntityReadonlyFn){
			return this.initOptions.IsParentEntityReadonlyFn();
		}
		return super.IsParentEntityReadonly();
	}
}