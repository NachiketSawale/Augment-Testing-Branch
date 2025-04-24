import { IEntityProcessor } from '@libs/platform/data-access';
import { ResourceMasterPoolDataService } from './data/resource-master-pool-data.service';
import { ResourceMasterContextService } from './resource-master-context.service';
import { IResourceMasterPoolEntity } from '@libs/resource/interfaces';

export class ResourceMasterPoolResourceProcessor<T extends IResourceMasterPoolEntity> implements IEntityProcessor<T> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: ResourceMasterPoolDataService, protected moduleContext: ResourceMasterContextService) {
	}

	/**
	 * Process readonly logic
	 * @param item
	 */
	public process(item: T) {
		const readOnlyStatus = this.moduleContext.isReadOnly;
		if (readOnlyStatus) {
			this.setRowReadonlyFromLayout(item, readOnlyStatus);
		} else {
			const flag = (item?.Version ?? 0) > 0;
			this.setColumnReadOnly(item, 'ResourceSubFk', flag);
		}
	}
	private setRowReadonlyFromLayout(item: T, flag: boolean) {
		const fields = [
			{field: 'ResourceSubFk', readOnly: flag},
			{field: 'Validto', readOnly: flag},
			{field: 'Quantity', readOnly: flag},
			{field: 'Validfrom', readOnly: flag},
			{field: 'CommentText', readOnly: flag}
		];
		this.dataService.setEntityReadOnlyFields(item, fields);
	}

	private setColumnReadOnly(item: T, column: string, flag: boolean) {
		const fields = [
			{field: column, readOnly: flag}
		];
		this.dataService.setEntityReadOnlyFields(item, fields);
	}
	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item:  T) {}

}