import { IApplicationModuleInfo } from '@libs/platform/common';
import { moduleInfo } from './lib/project-shared.module';

export * from './lib/project-shared.module';

// Project Entity Types & Service
export * from './lib/model/project-entity.class';
export * from './lib/model/project-update.class';
export * from './lib/services/project-main-data.service';
export * from './lib/model/project-2d-viewer-entity.info';

// Project Location Service & Behavior
export * from './lib/services/project-location-data.service';
export * from './lib/behaviors/project-location-behavior.service';

export * from './lib/lookup-services/index';

export function getModuleInfo(): IApplicationModuleInfo {
	return moduleInfo;
}


/*export for lookup service inforequest */
//export  * from './lib/lookup-services/inforequest/index';
