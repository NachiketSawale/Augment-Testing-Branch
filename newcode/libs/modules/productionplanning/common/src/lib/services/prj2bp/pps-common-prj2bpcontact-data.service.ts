import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import { IProjectMainPrj2BPComplete, IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { isNull } from 'lodash';

export class PpsCommonPrj2bpcontactDataService
	extends DataServiceFlatLeaf<IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete> {

	public constructor(private parentService: IEntitySelection<IProjectMainPrj2BusinessPartnerEntity>) {
		const options: IDataServiceOptions<IProjectMainPrj2BPContactEntity> = {
			apiUrl: 'project/main/project2bpcontact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByPartner',
				usePost: false,
			},
			// roleInfo: <IDataServiceChildRoleOptions<IProjectMainPrj2BPContactEntity, PT, PU>>{
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerContacts',
				parent: parentService,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		return {
			parentId: this.getSelectedParent()?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IProjectMainPrj2BPContactEntity[] {
		return loaded as IProjectMainPrj2BPContactEntity[];
	}

	public override isParentFn(parentKey: IProjectMainPrj2BusinessPartnerEntity, entity: IProjectMainPrj2BPContactEntity): boolean {
		return true;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectMainPrj2BPComplete, modified: IProjectMainPrj2BPContactEntity[], deleted: IProjectMainPrj2BPContactEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.BusinessPartnerContactsToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.BusinessPartnerContactsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: IProjectMainPrj2BPComplete): IProjectMainPrj2BPContactEntity[] {
		if (parentUpdate && !isNull(parentUpdate.BusinessPartnerContactsToSave)) {
			return parentUpdate.BusinessPartnerContactsToSave!;
		}
		return [];
	}

}