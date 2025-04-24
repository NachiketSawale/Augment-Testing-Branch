import { BasicsCostGroupCatalogEntity } from './entities/basics-cost-group-catalog-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsCostGroupCatalogComplete implements CompleteIdentification<BasicsCostGroupCatalogEntity> {
	public MainItemId: number = 0;

	public CostGroupCatToSave: BasicsCostGroupCatalogEntity | null = null;

	public EntitiesCount: number = 0;
}
