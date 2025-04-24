/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { ControllingSharedGroupSetDataService } from '../controlling-shared-group-set-data.service';
import { ControllingUnitGroupSetCompleteIdentification, IControllingUnitdGroupSetEntity, IControllingUnitGroupSetEntityIdentification } from '@libs/controlling/interfaces';

export class ControllingSharedGroupSetDataProcessor<T extends IControllingUnitdGroupSetEntity,
	PT extends IControllingUnitGroupSetEntityIdentification, PU extends ControllingUnitGroupSetCompleteIdentification<PT>> implements IEntityProcessor<T> {

	public constructor(protected dataService: ControllingSharedGroupSetDataService<T, PT, PU>) {
	}

	public processItems(entityList: T[]) {
		const readOnlyFlag = this.getReadOnlyFlag();
		const readonlyFields: IReadOnlyField<IControllingUnitdGroupSetEntity>[] = [
			{field: 'ControllinggroupFk', readOnly: readOnlyFlag},
			{field: 'ControllinggroupdetailFk', readOnly: readOnlyFlag}
		];
		entityList.map(entity => {
			this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
		});
	}

	public process(toProcess: T): void {
	}

	public revertProcess(toProcess: T): void {
	}

	private getReadOnlyFlag() {
		if (this.dataService.isTextElementType()) {
			return true;
		}
		const parentReadonly = this.dataService.getParentStatusIsReadonly();
		if (parentReadonly !== undefined) {
			return parentReadonly as boolean;
		}
		const parentCanCreate = this.dataService.getParentCanCreate();
		if (parentCanCreate !== undefined) {
			return !parentCanCreate as boolean;
		}
		return false;
	}
}