import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import { get, isNull, set } from 'lodash';
import { IPpsCommonBizPartnerEntity } from '../../model/entities/pps-common-biz-partner-entity.interface';
import { PpsCommonBizPartnerComplete } from '../../model/pps-common-biz-partner-complete.class';
import { IPpsCommonBizPartnerDataSrvInitOptions } from '../../model/pps-common-biz-partner-data-srv-init-options.interface';
import { PpsCommonBizPartnerReadonlyProcessor } from './pps-common-biz-partner-readonly-processor.serivce';

export class PpsCommonBizPartnerDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete, PT, PU> {

	/**
	 * return the value of the field in the parent entity, or -1 if undefined
	 */
	private getParentFk(field: string) {
		if (field.length === 0) {
			return -1;
		}

		const parent = this.getSelectedParent();
		if (!parent) {
			throw new Error('no selected parent for the business partner');
		}

		return get(parent, field) ?? -1;
	}

	public constructor(parentService: IEntitySelection<PT>, initOptions: IPpsCommonBizPartnerDataSrvInitOptions<PT>,
		private projectFkField: string = initOptions.projectFkField ?? 'ProjectFk',
		private ppsHeaderFkField: string = initOptions.ppsHeaderFkField ?? 'PpsHeaderFk',
		private mntReqFkField: string = initOptions.mntReqFkField ?? ''
	) {
		const options: IDataServiceOptions<IPpsCommonBizPartnerEntity> = {
			apiUrl: 'productionplanning/common/bizpartner',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsCommonBizPartnerEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'CommonBizPartner',
				parent: parentService,
			}
		};

		super(options);
		this.processor.addProcessor(new PpsCommonBizPartnerReadonlyProcessor(this));
	}

	protected override provideCreatePayload(): object {
		return {
			Id: this.getParentFk('Id'),
			PKey1: this.getParentFk(this.projectFkField),
			PKey2: this.getParentFk(this.ppsHeaderFkField),
		};
	}

	protected override provideLoadPayload(): object {
		return {
			projectId: this.getParentFk(this.projectFkField),
			ppsHeaderId: this.getParentFk(this.ppsHeaderFkField),
			mntReqId: this.getParentFk(this.mntReqFkField),
		};
	}

	protected override onLoadSucceeded(loaded: object): IPpsCommonBizPartnerEntity[] {
		return loaded as IPpsCommonBizPartnerEntity[];
	}

	protected override checkCreateIsAllowed(entities: IPpsCommonBizPartnerEntity | IPpsCommonBizPartnerEntity[] | null): boolean {
		return super.checkCreateIsAllowed(entities) && this.getParentFk(this.projectFkField) !== -1;
	}

	public override isParentFn(parentKey: object, entity: IPpsCommonBizPartnerEntity): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IPpsCommonBizPartnerEntity | null): PpsCommonBizPartnerComplete {
		const complete = new PpsCommonBizPartnerComplete();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CommonBizPartner = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsCommonBizPartnerComplete): IPpsCommonBizPartnerEntity[] {
		if (complete.CommonBizPartner) {
			return [complete.CommonBizPartner];
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: PpsCommonBizPartnerComplete[], deleted: IPpsCommonBizPartnerEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'CommonBizPartnerToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'CommonBizPartnerToDelete', deleted);
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IPpsCommonBizPartnerEntity[] {
		if (parentUpdate && !isNull(get(parentUpdate, 'CommonBizPartnerToSave'))) {
			const parnterToSave = get(parentUpdate, 'CommonBizPartnerToSave') as PpsCommonBizPartnerComplete[];
			return parnterToSave.map(e => e.CommonBizPartner!);
		}
		return [];
	}

}