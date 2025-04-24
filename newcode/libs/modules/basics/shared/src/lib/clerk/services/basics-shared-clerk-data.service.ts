/*
 * Copyright(c) RIB Software GmbH
 */
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { IBasicsClerkEntity } from '../model/basics-clerk-entity.interface';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ILink2ClerkDataServiceInitOptions } from '../model/link2clerk-interface';

/**
 * Basics Clerk Authorization data service
 */
export class BasicsSharedClerkDataService<T extends IBasicsClerkEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> {
	public constructor(
		protected parentService: IEntitySelection<PT>,
		protected config: {
			apiUrl: string;
			itemName?: string;
			Qualifier?: string;
			filter?: string;
		},
	) {
		config.itemName = config.itemName || 'ClerkData';
		const options: IDataServiceOptions<T> = {
			apiUrl: config.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listclerk',
				usePost: true,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1,
						Qualifier: config.Qualifier,
						filter: config.filter,
					};
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createclerk',
				usePost: true,
				prepareParam: (ident) => {
					return {
						mainItemId: ident.pKey1!,
						Qualifier: config.Qualifier,
					};
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<T, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: config.itemName,
				parent: parentService,
			},
		};
		super(options);
	}
}

export type Link2clerkCompleteIdentification = {
	ClerkDataToSave?: IBasicsClerkEntity[];
	ClerkDataToDelete?: IBasicsClerkEntity[];
};

export class BasicsSharedLink2ClerkDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT> & Link2clerkCompleteIdentification> extends BasicsSharedClerkDataService<IBasicsClerkEntity, PT, PU> {
	public constructor(private initOptions: ILink2ClerkDataServiceInitOptions<PT>) {
		const myconfig = {
			apiUrl: 'basics/common/clerk',
			itemName: 'ClerkData',
			Qualifier: initOptions.Qualifier,
			//filter:null
		};

		super(initOptions.parentService, myconfig);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: IBasicsClerkEntity[], deleted: IBasicsClerkEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.ClerkDataToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ClerkDataToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PU): IBasicsClerkEntity[] {
		if (complete && complete.ClerkDataToSave) {
			return complete.ClerkDataToSave;
		}
		return [];
	}

	public handleCreationDone(created: IBasicsClerkEntity[]|IBasicsClerkEntity) {
		if (this.processor !== undefined) {
			this.processor.process(created);
		}
		this.append(created);
		this.select(created);
		this.setModified(created);
	}
	public override isParentFn(parentKey: PT, entity: IBasicsClerkEntity): boolean {
		return entity.MainItemFk === parentKey.Id;
	}

}
