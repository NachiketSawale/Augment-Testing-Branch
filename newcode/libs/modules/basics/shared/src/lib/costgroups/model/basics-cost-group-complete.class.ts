import { CompleteIdentification } from '@libs/platform/common';
import { ICostGroupEntity } from './entities/cost-group-entity.interface';
import { ICostGroupCatEntity } from './entities/cost-group-cat-entity.interface';

export class BasicsCostGroupComplete implements CompleteIdentification<ICostGroupEntity> {
	public MainItemId: number = 0;

	public CostGroupCatToSave: ICostGroupCatEntity | null = null;

	public LicCostGroupCats: ICostGroupCatEntity[] | null = null;

	public PrjCostGroupCats: ICostGroupCatEntity[] | null = null;

	public CostGroupsToSave: ICostGroupEntity | null = null;

	public CostGroupsToDelete: ICostGroupEntity | null = null;

	public ProjectId: number | null = null;

	public EntitiesCount: number = 0;
}
