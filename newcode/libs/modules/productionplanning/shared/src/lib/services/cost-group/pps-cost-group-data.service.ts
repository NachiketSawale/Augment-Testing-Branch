import { CostGroupCompleteEntity, IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { concat, get, isNil, set, sortBy } from 'lodash';
import { IPpsCostGroupEntityInfoOptions } from '../../model/cost-group/pps-cost-group-entity-info-options.interface';
import { IPpsCostGroupEntity } from '../../model/cost-group/pps-cost-group.interface';

export class PpsCostGroupDataService<PT extends object, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<IPpsCostGroupEntity, PT, PU> {

	public constructor(private parentService: IEntitySelection<PT>, private initOptions: IPpsCostGroupEntityInfoOptions<PT>) {
		const options: IDataServiceOptions<IPpsCostGroupEntity> = {

			apiUrl: initOptions.apiUrl,
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listcostgroup',
				usePost: true,
				// prepareParam: (ident) => {
				// 	const parent = this.getSelectedParent() as PT;
				// 	return this.initOptions.provideReadDataFn(parent);
				// },
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsCostGroupEntity, PT, PU>>{
				role: ServiceRole.Leaf,
				itemName: 'CostGroup',
				parent: parentService,
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent() as PT;
		return this.initOptions.provideReadDataFn(parent);
	}

	protected override onLoadSucceeded(loaded: object): IPpsCostGroupEntity[] {
		const mainItemId = get(loaded, 'MainItemId') as unknown as number;
		const costGroupCats = get(loaded, 'CostGroupCats') as unknown as CostGroupCompleteEntity;
		const object2CostGroups = get(loaded, this.initOptions.dataLookupType) as IBasicMainItem2CostGroup[];
		const dtos: IPpsCostGroupEntity[] = [];
		if (costGroupCats) {
			const both = sortBy(concat(costGroupCats.LicCostGroupCats!, costGroupCats.PrjCostGroupCats!), ['Sorting']);
			let generatedId = -1;
			both.forEach(costGroupCat => {
				const obj2CostGroup = object2CostGroups.find(e => !isNil(e.CostGroupCatFk) && e.CostGroupCatFk === costGroupCat.Id);
				generatedId = isNil(obj2CostGroup) ? generatedId - 1 : generatedId;
				dtos.push({
					Code: costGroupCat.Code,
					DescriptionInfo: costGroupCat.DescriptionInfo,
					CostGroupCatFk: costGroupCat.Id,
					CostGroupFk: obj2CostGroup?.CostGroupFk,
					Id: obj2CostGroup?.Id ?? generatedId,
					MainItemId: obj2CostGroup?.MainItemId ?? mainItemId,
				});
			});
		}

		return dtos;
	}

	public override isParentFn(parentKey: PT, entity: IPpsCostGroupEntity): boolean {
		const actualParent = this.getSelectedParent() as PT;
		return entity.MainItemId === this.initOptions.getMainItemIdFn(parentKey)
			|| actualParent === parentKey
			|| this.initOptions.getMainItemIdFn(actualParent) === this.initOptions.getMainItemIdFn(parentKey);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IPpsCostGroupEntity[] {
		return [];
	}

	public override registerModificationsToParentUpdate(parentUpdate: PU, modified: IPpsCostGroupEntity[], deleted: IPpsCostGroupEntity[]): void {
		if (modified && modified.length > 0) {
			const mainItemId = this.initOptions.getMainItemIdFn(this.getSelectedParent() as PT);
			const costGroupToSave = convertToBasicMainItem2CostGroups(modified.filter(e => e.CostGroupFk!), mainItemId);
			set(parentUpdate, 'CostGroupToSave', costGroupToSave);

			const costGroupToDelete = convertToBasicMainItem2CostGroups(modified.filter(e => isNil(e.CostGroupFk)), mainItemId);
			set(parentUpdate, 'CostGroupToDelete', costGroupToDelete);
		}

		function convertToBasicMainItem2CostGroups(ppsCostGroups: IPpsCostGroupEntity[], mainItemId: number): IBasicMainItem2CostGroup[] {
			return ppsCostGroups.map(e => ({
				Id: e.Id,
				MainItemId: e.MainItemId ?? mainItemId,
				CostGroupCatFk: e.CostGroupCatFk,
				CostGroupFk: e.CostGroupFk,
				Code: e.Code,
			}));
		}
	}

}