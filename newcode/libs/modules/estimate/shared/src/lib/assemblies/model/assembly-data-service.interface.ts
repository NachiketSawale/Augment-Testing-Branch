import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import {
	IEntityCreate,
	IEntityCreateChild,
	IEntityDelete,
	IEntityModification, IEntityRuntimeDataRegistry,
	IEntityTree
} from '@libs/platform/data-access';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEditableDataService } from '@libs/procurement/shared';

export interface IAssemblyResourceDataService extends IEntityRuntimeDataRegistry<IEstResourceEntity>,
	IEntityTree<IEstResourceEntity>,
	IEntityDelete<IEstResourceEntity>,
	IEntityCreate<IEstResourceEntity>,
	IEntityCreateChild<IEstResourceEntity>,
	IEntityModification<IEstResourceEntity>{
	calculateAssemblyResource(assemblyItem: IEstLineItemEntity | null, assemblyResources: IEstResourceEntity[] | null): void;
	setIndirectCost(resources: IEstResourceEntity[], isIndirectCost: boolean):void;
	resolveResourcesAndAssign(assemblyItem: IEstLineItemEntity, assemblyIds: number[], resourceType: number, prjCostCodeIds?: number[]|null):Promise<boolean>;
}

export interface IAssemblyDataService extends IEditableDataService<IEstLineItemEntity>{
	getAssemblyCategory(): IEstAssemblyCatEntity | null;
	getConsiderDisabledDirect(): boolean;
	getAssemblyResourceDataService(): IAssemblyResourceDataService | null;
	setAssemblyResourceDataService(value: IAssemblyResourceDataService):void;
}