import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEntityProcessor, IEntityRuntimeDataRegistry } from '@libs/platform/data-access';
import { AssemblyType } from '@libs/estimate/interfaces';
import { PropertyPath } from '@libs/platform/common';
import { isNull } from 'lodash';
import { IAssemblyDataService } from '../model/assembly-data-service.interface';
import { IAssemblyStructureDataService } from '../model/assembly-structure-data-service.interface';

/**
 * base class for assembly processor
 */
export class EstimateAssembliesBaseProcessService<T extends IEstLineItemEntity> implements IEntityProcessor<T>{

	/**
	 * constructor
	 * @param assembliesService
	 * @param assemblyStructureService
	 */
	public constructor(protected assembliesService: IEntityRuntimeDataRegistry<T> & IAssemblyDataService, protected assemblyStructureService: IAssemblyStructureDataService) {
	}

	/**
	 * process
	 * @param entity
	 */
	public process(entity: T): void {
		if (entity) {
			let assemblyCategory = this.assembliesService.getAssemblyCategory();
			if(!assemblyCategory || !assemblyCategory.Id){
				const categoriesList = this.assemblyStructureService.getList();
				assemblyCategory = categoriesList.find(e => e.Id === entity.EstAssemblyCatFk) ?? null;
			}
			if((assemblyCategory && (assemblyCategory.EstAssemblyTypeLogicFk === AssemblyType.ProtectedAssembly)) || entity.EstAssemblyTypeLogicFk === AssemblyType.ProtectedAssembly){
				this.setPropertiesReadonly(entity, ['MdcCostCodeFk', 'MdcMaterialFk'], true);
			}else{
				if (entity.MdcMaterialFk === null) {
					this.setPropertiesReadonly(entity, ['MdcCostCodeFk'], false);
					this.setPropertiesReadonly(entity, ['MdcMaterialFk'], !isNull(entity.MdcCostCodeFk));
				} else if (entity.MdcCostCodeFk === null) {
					this.setPropertiesReadonly(entity, ['MdcCostCodeFk'], !isNull(entity.MdcMaterialFk));
					this.setPropertiesReadonly(entity, ['MdcMaterialFk'], false);
				}
			}
		}
	}

	public revertProcess(toProcess: T): void {
	}

	/**
	 * common method, set the properties readonly
	 * @param toProcess
	 * @param propertyNames
	 * @param readonly
	 */
	public setPropertiesReadonly(toProcess: T, propertyNames: PropertyPath<T>[], readonly: boolean){
		this.assembliesService.setEntityReadOnlyFields(toProcess,propertyNames.map(e => {
			return {
				field: e,
				readOnly: readonly
			};
		}));
	}
}