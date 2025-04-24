import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceSkillModuleInfo } from './lib/model/resource-skill-module-info.class';

export * from './lib/resource-skill.module';
export * from './lib/services/index';

export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceSkillModuleInfo.instance;
}
