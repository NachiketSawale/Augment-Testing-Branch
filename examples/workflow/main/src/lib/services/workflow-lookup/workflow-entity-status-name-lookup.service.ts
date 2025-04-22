/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { WorflowEntityStatusService } from '../workflow-data-services/workflow-entity-status-lookup-data.service';
import { IEntityStatusName } from '../../model/interfaces/workflow-entity-status-name.interface';
import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs/internal/Observable';
import { IWorkflowAction } from '@libs/workflow/interfaces';

@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityStatusNameLookup extends UiCommonLookupItemsDataService<IEntityStatusName, IWorkflowAction> {

	public constructor(worflowEntityStatusService: WorflowEntityStatusService) {
		const config: ILookupConfig<IEntityStatusName, object> = {
			uuid: '',
			valueMember: 'Id',
			displayMember: '',
			formatter: {
				format(dataItem, context) {
					return `${dataItem.ObjectTableName} - ${dataItem.StatusName} - ${dataItem.StatusTableName}`;
				}
			}
		};
		super(worflowEntityStatusService.entityStatusNames, config);
	}

	public override getItemByKey(id: IIdentificationData): Observable<IEntityStatusName> {
		return new Observable((observer) => {
			this.items.forEach(item => {
				const i = this.identify(item);
				if (i.id as unknown as string === id as unknown as string) {
					observer.next(item);
				}
			});
			observer.complete();
		});
	}
}