import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWotWorkOperationTypeDataService } from './resource-wot-work-operation-type-data.service';
import { Injectable } from '@angular/core';


/**
 * Class implementing the interface with twofunctions doing nothing. Derive from this class, whenever the
 * data processor you are writing only supports one of hte two proecssing methods
 * type param {T} entity type handled by the data service
 */
@Injectable({
	providedIn: 'root'
})
export class ResourceWotWorkOperationTypeReadonlyProcessor<T extends IResourceWorkOperationTypeEntity> implements IEntityProcessor<T> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ResourceWotWorkOperationTypeDataService) {
	}

	/**
	 * Empty implementation of process which may not necessary for a concrete implementation
	 * @param toProcess
	 */
	public process(toProcess: T): void {
		this.setIsHireColumnReadOnly(toProcess, toProcess.IsMinorEquipment);
	}

	public setIsHireColumnReadOnly(item: T, isMinorEquipment: boolean): void{
		const version = item.Version ?? 0;
		const fields: IReadOnlyField<T>[] = [
			{field: 'IsHire', readOnly: isMinorEquipment },
			{field: 'UomFk', readOnly: version >= 1 }
		];

		this.dataService.setEntityReadOnlyFields(item, fields);
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {
	}
}
