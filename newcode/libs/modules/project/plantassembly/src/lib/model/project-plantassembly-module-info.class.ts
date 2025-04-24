/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ProjectPlantAssemblyResourceDataService } from '../containers/resources/project-plant-assembly-resource-data.service';
import {IEstResourceEntity} from '@libs/estimate/interfaces';
/**
 * The module info object for the `project.plantassembly` content module.
 */
export class ProjectPlantassemblyModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProjectPlantassemblyModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProjectPlantassemblyModuleInfo {
		if (!this._instance) {
			this._instance = new ProjectPlantassemblyModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'project.plantassembly';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Project.Plantassembly';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			this.PROJECT_PLANT_ASSEMBLY_RESOURCE_CHAR_DATA_ENTITY_INFO,
		];
	}

	private readonly PROJECT_PLANT_ASSEMBLY_RESOURCE_CHAR_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstResourceEntity>({
		permissionUuid: 'bedc9497ca84537ae6c8cabbb0b8faeb',
		sectionId: BasicsCharacteristicSection.AssemblyResources,
		gridTitle: 'project.main.equipassemblyResourceTitle',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ProjectPlantAssemblyResourceDataService);
		},
		pKey1Field: 'EstHeaderFk',
		pKey2Field: 'EstLineItemFk',
	});
}
