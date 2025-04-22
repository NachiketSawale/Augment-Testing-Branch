/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo, IEntityContext, IIdentificationData, ServiceLocator } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { ActionEditorHelper } from '../../../model/classes/common-action-editors/action-editor-helper.class';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { ParameterType } from '../../../model/enum/action-editors/parameter-type.enum';
import { GetCharacteristicActionParams } from '../../../model/enum/actions/get-charactaristic-action-editor-params.enum';
import { BasicsCharacteristicSearchService } from '@libs/basics/shared';

export class CharacteristicHeader {
	public SectionId?: number;
	public DescriptionInfo?: IDescriptionInfo;
	public Code?: string;
	public CharacteristicTypeFk?: number;
	public action?: string;
	public actionType?: string;
	public priorityId?: number;
}

@Injectable({
	providedIn: 'root'
})
export class WorkflowCharacteristicCodeLookupService
	extends UiCommonLookupEndpointDataService<CharacteristicHeader, IWorkflowAction> {
	protected basicsCharacteristicSearchService = ServiceLocator.injector.get(BasicsCharacteristicSearchService);
	private list: CharacteristicHeader[] = [];

	public constructor() {
		super({
			httpRead: {route: 'basics/characteristic/characteristic', endPointRead: 'lookup'},
			filterParam: true,
			prepareSearchFilter(request, context) {
				if (context && context.entity) {
					const id: string = ActionEditorHelper.findOrAddProperty(context.entity, GetCharacteristicActionParams.SectionId, ParameterType.Input).value;
					return `sectionId=${id}`;
				}
				return '';
			},
			prepareListFilter(context) {
				if (context && context.entity) {
					const id: string = ActionEditorHelper.findOrAddProperty(context.entity, GetCharacteristicActionParams.SectionId, ParameterType.Input).value;
					return `sectionId=${id}`;
				}
				return '';
			},
		}, {
			uuid: '',
			valueMember: 'Id',
			displayMember: 'Code',
		});
	}

	/**
	 * Resets the cache in the lookup and the value.
	 * @param context
	 */
	public resetLookup(context?: IEntityContext<IWorkflowAction> | undefined): void {
		this.cache.clear();
		const list$ = super.getList(context).subscribe((items) => {
			const defaultValue = '';
			if (context && context.entity) {
				//Reset to empty value
				(ActionEditorHelper.findOrAddProperty(context.entity, GetCharacteristicActionParams.Code, ParameterType.Input).value) = defaultValue;
			}
			list$.unsubscribe();
		});
	}

	/**
	 * Get data item by identification data
	 * @param key
	 * @param context
	 */
	//the override is necessary because in this case the "key" parameter is a String and not a number
	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<IWorkflowAction>): Observable<CharacteristicHeader> {
		return new Observable((observer) => {

			if (this.list.length > 0) {
				observer.next(this.getItem(key));
				observer.complete();
			} else {
				this.getList(context).subscribe((itemList) => {
					if (this.list.length <= 0) {
						this.list = itemList;
					}
					observer.next(this.getItem(key));
					observer.complete();
				});
			}
		});

	}

	private getItem(key: IIdentificationData): CharacteristicHeader {
		let value = {};
		if (this.list.length > 0) {
			this.list.forEach(item => {
				const i = this.identify(item);
				const keyItem = key.id ? key.id.toString() : key.toString();
				if (i.id.toString() == keyItem) {
					value = item;
				}
			});
		}
		return value;
	}
}