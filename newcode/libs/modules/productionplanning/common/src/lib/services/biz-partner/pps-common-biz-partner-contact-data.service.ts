import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { isNull } from 'lodash';
import { IPpsCommonBizPartnerContactEntity } from '../../model/entities/pps-common-biz-partner-contact-entity.interface';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerComplete } from '../../model/pps-common-biz-partner-complete.class';

// export class PpsCommonBizPartnerContactDataService<PT extends IPpsCommonBizPartnerEntity, PU extends PpsCommonBizPartnerComplete>
export class PpsCommonBizPartnerContactDataService
	extends DataServiceFlatLeaf<IPpsCommonBizPartnerContactEntity, IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete> {

	public constructor(private parentService: IEntitySelection<IPpsCommonBizPartnerEntity>) {
		const options: IDataServiceOptions<IPpsCommonBizPartnerContactEntity> = {
			apiUrl: 'productionplanning/common/contact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			// roleInfo: <IDataServiceChildRoleOptions<IPpsCommonBizPartnerContactEntity, PT, PU>>{
			roleInfo: <IDataServiceChildRoleOptions<IPpsCommonBizPartnerContactEntity, IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CommonBizPartnerContact',
				parent: parentService,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		return {	
			mainItemId: this.getSelectedParent()?.Id
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsCommonBizPartnerContactEntity[] {
		return loaded as IPpsCommonBizPartnerContactEntity[];
	}

	public override isParentFn(parentKey: IPpsCommonBizPartnerEntity, entity: IPpsCommonBizPartnerContactEntity): boolean {
		// return entity.BusinessPartnerFk === parentKey.BusinessPartnerFk;
		return true;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: PpsCommonBizPartnerComplete, modified: IPpsCommonBizPartnerContactEntity[], deleted: IPpsCommonBizPartnerContactEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.CommonBizPartnerContactToSave = modified;
		}

		if (deleted && deleted.length > 0) {
			parentUpdate.CommonBizPartnerContactToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PpsCommonBizPartnerComplete): IPpsCommonBizPartnerContactEntity[] {
		if (parentUpdate && !isNull(parentUpdate.CommonBizPartnerContactToSave)) {
			return parentUpdate.CommonBizPartnerContactToSave!;
		}
		return [];
	}

}