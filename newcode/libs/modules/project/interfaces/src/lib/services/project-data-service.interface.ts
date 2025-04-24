/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatRoot, IDataServiceOptions} from '@libs/platform/data-access';
import { LazyInjectionToken } from '@libs/platform/common';
import { IProjectEntity } from '../model/entities/main/project-main-entity.interface';
import { IProjectComplete } from '../model/entities/main/project-main-complete.interface';

/**
 * Material group attribute data service
 */
export class IProjectDataService<T extends IProjectEntity, C extends  IProjectComplete> extends DataServiceFlatRoot<T, C> {
	public constructor(dataServiceOptions:IDataServiceOptions<T>) {
		super(dataServiceOptions);
	}

}
export const PROJECT_SERVICE_TOKEN = new LazyInjectionToken<IProjectDataService<IProjectEntity, IProjectComplete>>('project.data-service');
