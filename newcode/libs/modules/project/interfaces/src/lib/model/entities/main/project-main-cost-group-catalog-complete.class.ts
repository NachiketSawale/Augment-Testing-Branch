import { CompleteIdentification } from '@libs/platform/common';
import { ProjectMainCostGroupCatalogEntity } from './project-main-cost-group-catlog-entity.interface';
import { ProjectMainCostGroupEntityGenerated } from './project-main-cost-group-entity-generated.interface';

export interface IProjectMainCostGroupCatalogComplete extends CompleteIdentification<ProjectMainCostGroupCatalogEntity>{

	 CostGroupCatalogId: number;

	 CostGroupCatalogs: ProjectMainCostGroupCatalogEntity | null;

	 CostGroupsToSave: ProjectMainCostGroupEntityGenerated[] | null;

	 CostGroupsToDelete: ProjectMainCostGroupEntityGenerated[] | null;


}
