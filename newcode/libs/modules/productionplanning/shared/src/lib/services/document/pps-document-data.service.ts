import { IPpsDocumentEntity } from '../../model/document/pps-document-entity.interface';
import { PpsDocumentComplete } from '../../model/document/pps-document-complete.class';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData,
	PlatformConfigurationService
} from '@libs/platform/common';
import {
	IEntitySelection,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, ServiceRole
} from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { get, isFunction, set } from 'lodash';
import { DocumentDataNodeService } from '@libs/documents/shared';


export class ProductionplanningSharedDocumentDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DocumentDataNodeService<IPpsDocumentEntity, PpsDocumentComplete, PT, PU> {

	protected readonly http = inject(HttpClient);
	protected readonly configService = inject(PlatformConfigurationService);

	public constructor(
		private parentService: IEntitySelection<PT>,
		private initOptions: {
			endPoint?: string,
			foreignKey: string,
			idProperty?: string,
			selectedItemIdProperty?: string,
			provideLoadPayloadFn?: () => object,
			IsParentEntityReadonlyFn?: () => boolean,
		},
		private readonly idProperty = initOptions.idProperty ?? 'Id'
	) {

		const options: IDataServiceOptions<IPpsDocumentEntity> = {
			apiUrl: 'productionplanning/common/ppsdocument',
			readInfo: {
				endPoint: initOptions.endPoint ?? 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					const parent = this.parentService.getSelectedEntity()!;
					return {
						mainItemId: get(parent, this.idProperty),
						foreignKey: this.initOptions.foreignKey
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsDocumentEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'PpsDocument',
				parent: parentService
			}
		};

		super(options);

		//this.createBtVisible = false;
	}

	protected override provideLoadPayload(): object {
		if (isFunction(this.initOptions.provideLoadPayloadFn)) {
			return this.initOptions.provideLoadPayloadFn();
		}
		const mainItemId = get(this.getSelectedParent(), this.idProperty);
		return { foreignKey: this.initOptions.foreignKey, mainItemId: mainItemId };
	}

	protected override onLoadSucceeded(loaded: object): IPpsDocumentEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	public override isParentFn(parentKey: object, entity: IPpsDocumentEntity): boolean {
		return get(entity, this.initOptions.foreignKey) === get(parentKey, this.idProperty);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PpsDocumentComplete[], deleted: IPpsDocumentEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'PpsDocumentToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'PpsDocumentToDelete', deleted);
		}
	}

	public override getModificationsFromUpdate(complete: PpsDocumentComplete): IPpsDocumentEntity[] {
		if (complete.PpsDocument) {
			return [complete.PpsDocument];
		}
		return [];
	}

	public override createUpdateEntity(modified: IPpsDocumentEntity | null): PpsDocumentComplete {
		const complete = new PpsDocumentComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsDocument = modified;
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