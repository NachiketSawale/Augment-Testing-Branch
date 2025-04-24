import { IInitializationContext } from '@libs/platform/common';
import { ProjectPlantassemblyUpdateEquimentAssemblyService } from '../../services/wizards/project-plantassembly-update-equiment-assembly.service';


/**
 *
 * This class provides functionality for project plantassembly wizards
 */
export class ProjectPlantassembly {
	/**
	 * This method provides functionality for Updating EquipmentAssembly
	 *
	 */
	public updateEquipmentAssembly(context: IInitializationContext) {
		const service = context.injector.get(ProjectPlantassemblyUpdateEquimentAssemblyService);
		service.updateEquipmentAssembly();
	}
}
