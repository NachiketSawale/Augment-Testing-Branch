/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor, IReadOnlyField } from '@libs/platform/data-access';
import { forEach } from 'lodash';
import { IDocumentProjectEntity } from '@libs/documents/shared';
import { DocumentsMainDataService } from '../services/documents-main-data.service';
import { inject } from '@angular/core';

export class DocumentsMainReadonlyProcessor<T extends IDocumentProjectEntity> implements IEntityProcessor<T> {
	private readonly dataService=inject(DocumentsMainDataService);
	public constructor() {}

	public processItems(itemsToProcess: T[], isReadOnly: boolean) {
		const readonlyFields: IReadOnlyField<T>[] = this.dataService.getColumnConfig();
		forEach(itemsToProcess, (item) => {
			this.dataService.setEntityReadOnlyFields(item, readonlyFields);
		});
	}

	public process(toProcess: T): void {

	}

	public revertProcess(toProcess: T): void {}
}
