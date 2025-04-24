/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IEntityRuntimeDataRegistry, IReadOnlyField } from '@libs/platform/data-access';
import { ResourceTypeDataService } from './resource-type-data.service';
import { IResourceTypeEntity } from '@libs/resource/interfaces';

export class ResourceTypeReadonlyProcessorService<T extends IResourceTypeEntity> implements IEntityProcessor<T> {

	/*
 * The Constructor
 */
	public constructor(protected dataService: ResourceTypeDataService) {
	}
	public process(item: T) {
		this.validateCreateTemporaryResource(item);
	}

	protected validateCreateTemporaryResource(info: T) {
		const readOnlyStatus = false;
		if (!readOnlyStatus) {
			const readOnlyFields: IReadOnlyField<IResourceTypeEntity>[] = [
				{ field: 'GroupFk', readOnly: true }
			];
			this.dataService.setEntityReadOnlyFields(info, readOnlyFields);
		}
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceTypeEntity> {
		return this.dataService;
	}
	public revertProcess(toProcess: T): void {
	}
}