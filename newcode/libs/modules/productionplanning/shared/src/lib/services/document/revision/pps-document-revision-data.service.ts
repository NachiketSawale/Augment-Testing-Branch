import { IPpsDocumentRevisionEntity } from '../../../model/document/pps-document-revision-entity.interface';
// import { IPpsDocumentEntity } from '../../../model/document/pps-document-entity.interface';
// import { PpsDocumentComplete } from '../../../model/document/pps-document-complete.class';
// import { IPpsEntityInfoOptionsWithFkProperties } from '../../../model/pps-entity-info-options-with-fk-properties.interface';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData,
	PlatformConfigurationService
} from '@libs/platform/common';
import {
	IEntitySelection,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, ServiceRole, IDataServiceEndPointOptions
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get, set, maxBy } from 'lodash';
import { DocumentDataLeafService } from '@libs/documents/shared';

export class ProductionplanningSharedDocumentRevisionDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DocumentDataLeafService<IPpsDocumentRevisionEntity, PT, PU> {

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public constructor(
		private parentService: IEntitySelection<PT>,
		// private initOptions: IPpsEntityInfoOptionsWithFkProperties<PT>,
	) {
		const options: IDataServiceOptions<IPpsDocumentRevisionEntity> = {
			apiUrl: 'productionplanning/common/document/revision',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { documentId: ident.pKey1 };
				}
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const parent = this.parentService.getSelectedEntity()!;
					const maxRevision = maxBy(this.getList(), 'Revision')?.Version ?? 0;
					return {
						Id: parent.Id,
						PKey1: maxRevision
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsDocumentRevisionEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'Revision',
				parent: parentService
			}
		};

		super(options);
	}

	// protected override provideLoadPayload(): object {
	// 	const mainItemId = get(this.getSelectedParent(), this.Id);
	// 	return { foreignKey: this.initOptions.foreignKey, mainItemId: mainItemId };
	// }

	// protected override onLoadSucceeded(loaded: object): IPpsDocumentRevisionEntity[] {
	// 	if (loaded) {
	// 		return get(loaded, 'Main', []);
	// 	}
	// 	return [];
	// }

	public override isParentFn(parentKey: object, entity: IPpsDocumentRevisionEntity): boolean {
		return entity.PpsDocumentFk === get(parentKey, 'Id');
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: IPpsDocumentRevisionEntity[], deleted: IPpsDocumentRevisionEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'RevisionToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'RevisionToDelete', deleted);
		}
	}

	// public override getModificationsFromUpdate(complete: PpsDocumentRevisionComplete): IPpsDocumentRevisionEntity[] {
	// 	if (complete.PpsDocumentRevision) {
	// 		return [complete.PpsDocumentRevision];
	// 	}
	// 	return [];
	// }

	// public override createUpdateEntity(modified: IPpsDocumentRevisionEntity | null): PpsDocumentRevisionComplete {
	// 	const complete = new PpsDocumentRevisionComplete();
	// 	if (modified !== null) {
	// 		complete.MainItemId = modified.Id;
	// 		complete.PpsDocumentRevision = modified;
	// 	}
	//
	// 	return complete;
	// }

	public override IsParentEntityReadonly(): boolean {
		return true; // revision is always readonly
	}
}