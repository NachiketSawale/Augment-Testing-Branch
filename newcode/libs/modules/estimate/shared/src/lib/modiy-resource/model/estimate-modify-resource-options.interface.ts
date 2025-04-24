/*
 * Copyright(c) RIB Software GmbH
 */

import { ModifyResourceModuleEnum } from '../enum/estimate-modify-resource-module.enum';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

export interface IModifyResourceOptions {
	ModuleType: ModifyResourceModuleEnum;

	SelectedResource?: IEstResourceEntity | null;
}