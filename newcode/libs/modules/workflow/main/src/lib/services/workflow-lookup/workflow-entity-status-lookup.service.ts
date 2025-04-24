/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IEntityStatus } from '../../model/interfaces/workflow-entity-status.interface';
import { ActionEditorHelper } from '../../model/classes/common-action-editors/action-editor-helper.class';
import { ParameterType } from '../../model/enum/action-editors/parameter-type.enum';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { IEntityContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityStatusLookup extends UiCommonLookupEndpointDataService<IEntityStatus, IWorkflowAction> {

	public constructor() {
		const endpoint: ILookupEndpointConfig<IEntityStatus, IWorkflowAction> = {
			httpRead: { route: 'basics/common/status/', endPointRead: 'list' },
			filterParam: true,
			prepareSearchFilter(request, context) {
				let keyValue = '';
				if(context && context.entity) {
					keyValue = ActionEditorHelper.getFilterKeyValue(context.entity);
					return `statusName=${keyValue}`;
				}
				return keyValue;
			},
			prepareListFilter(context) {
				let keyValue = '';
				if(context && context.entity) {
					keyValue = ActionEditorHelper.getFilterKeyValue(context.entity);
					return `statusName=${keyValue}`;
				}
				return keyValue;
			},
		};
		const config: ILookupConfig<IEntityStatus, object> = {
			uuid: '',
			valueMember: 'Id',
			displayMember: '',
			formatter: {
				format(dataItem, context) {
					 return dataItem.DescriptionInfo.Translated;
				},
			}
		};
		super(endpoint, config);
	}

	/**
	 * Resets the cache in the lookup and selects the default item.
	 * @param context
	 */
	public resetLookup(context?: IEntityContext<IWorkflowAction> | undefined): void {
		this.cache.clear();
		const list$ = super.getList(context).subscribe((items)=>{

			const defaultId = items.filter(item=>item.IsDefault)[0].Id ?? 1;
			if(context && context.entity) {
				const keyValue = ActionEditorHelper.getFilterKeyValue(context.entity);
				//Reset to first value
				(ActionEditorHelper.findOrAddProperty(context.entity, keyValue, ParameterType.Input).value as unknown as number) = defaultId;
			}
			list$.unsubscribe();
		 });
	}
}