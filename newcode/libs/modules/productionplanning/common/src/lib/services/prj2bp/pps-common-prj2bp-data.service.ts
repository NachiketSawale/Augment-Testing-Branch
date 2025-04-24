import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions, IDataServiceOptions,
	IEntitySelection, ServiceRole
} from '@libs/platform/data-access';
import { IProjectMainPrj2BPComplete, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { get, isNull, set } from 'lodash';
import { PpsCommonPrj2bpProcessor } from './pps-common-prj2bp-readonly-processor.serivce';

export class PpsCommonPrj2bpDataService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatNode<IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete, PT, PU> {

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

	public constructor(parentService: IEntitySelection<PT>, private projectFkField: string = 'ProjectFk',
	) {
		const options: IDataServiceOptions<IProjectMainPrj2BusinessPartnerEntity> = {
			apiUrl: 'project/main/project2bp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByProject',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainPrj2BusinessPartnerEntity, PT, PU>>{
				role: ServiceRole.Node,
				itemName: 'BusinessPartners',
				parent: parentService,
			}
		};

		super(options);
		this.processor.addProcessor(new PpsCommonPrj2bpProcessor(this));
	}

	protected override provideCreatePayload(): object {
		return {
			projectId: this.getParentFk(this.projectFkField),
		};
	}

	protected override provideLoadPayload(): object {
		return {
			projectId: this.getParentFk(this.projectFkField),
		};
	}

	protected override onLoadSucceeded(loaded: object): IProjectMainPrj2BusinessPartnerEntity[] {
		return loaded as IProjectMainPrj2BusinessPartnerEntity[];
	}

	protected override checkCreateIsAllowed(entities: IProjectMainPrj2BusinessPartnerEntity | IProjectMainPrj2BusinessPartnerEntity[] | null): boolean {
		return super.checkCreateIsAllowed(entities) && this.getParentFk(this.projectFkField) !== -1;
	}

	public override isParentFn(parentKey: object, entity: IProjectMainPrj2BusinessPartnerEntity): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IProjectMainPrj2BusinessPartnerEntity | null): IProjectMainPrj2BPComplete {
		return {
			MainItemId: modified?.Id ?? 0,
			BusinessPartners: modified
		} as IProjectMainPrj2BPComplete;
	}

	public override getModificationsFromUpdate(complete: IProjectMainPrj2BPComplete): IProjectMainPrj2BusinessPartnerEntity[] {
		if (complete.BusinessPartners) {
			return [complete.BusinessPartners];
		}
		return [];
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: IProjectMainPrj2BPComplete[], deleted: IProjectMainPrj2BusinessPartnerEntity[]): void {
		if (modified && modified.some(() => true)) {
			set(parentUpdate, 'BusinessPartnersToSave', modified);
		}

		if (deleted && deleted.some(() => true)) {
			set(parentUpdate, 'BusinessPartnersToDelete', deleted);
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IProjectMainPrj2BusinessPartnerEntity[] {
		if (parentUpdate && !isNull(get(parentUpdate, 'BusinessPartnersToSave'))) {
			const parnterToSave = get(parentUpdate, 'BusinessPartnersToSave') as IProjectMainPrj2BPComplete[];
			return parnterToSave.map(e => e.BusinessPartners!);
		}
		return [];
	}

}