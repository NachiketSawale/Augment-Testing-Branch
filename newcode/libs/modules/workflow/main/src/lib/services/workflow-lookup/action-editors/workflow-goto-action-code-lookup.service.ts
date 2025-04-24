/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IWorkflowTemplateVersion, IWorkflowAction } from '@libs/workflow/interfaces';
import { IGoToActionCodeDisplayType } from '../../../model/types/workflow-goto-action-editor-param.type';
import { IIdentificationData } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { WorkflowTemplateVersionDataService } from '../../workflow-template-version-data/workflow-template-version-data.service';

/**
 * Configuration class for goTo action editor.
 */
@Injectable({
	providedIn: 'root'
})
export class GoToActionCodeLookupService<T extends object = IGoToActionCodeDisplayType> extends UiCommonLookupItemsDataService<T> {

	private readonly templateVersionService = inject(WorkflowTemplateVersionDataService);

	public constructor() {
		const items: IGoToActionCodeDisplayType[] = [];
		super(items as T[], {uuid: 'ee9f50d284b64120b367df5d094d0eb9', displayMember: 'description', valueMember: 'id'});
		this.setItems(this.getAllCodes(this.getRootAction()) as T[]);
	}

	public override getItemByKey(id: IIdentificationData): Observable<T> {
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

	private getRootAction(): IWorkflowAction{
		let rootAction: IWorkflowAction = {} as IWorkflowAction;
		this.templateVersionService.selectionChanged$.subscribe(async (workflowTemplateVersions: IWorkflowTemplateVersion[]) => {
			const tmp: string | IWorkflowAction = workflowTemplateVersions[0].WorkflowAction;
			if(typeof tmp != 'string') {
				rootAction = workflowTemplateVersions[0].WorkflowAction as IWorkflowAction;
			}
		});
		return rootAction;
	}

	private getAllCodes(rootItem: IWorkflowAction): IGoToActionCodeDisplayType[] {
		const result: IGoToActionCodeDisplayType[] = [];
		this.forEachAction(rootItem, function (item) {
			if (item.code != null && item.code !== '') {
				result.push({
					id: item.code,
					value: item.code,
					description: item.code
				});
			}
		});
		return result;
	}

	private forEachAction(rootAction: IWorkflowAction, fn: (a:IWorkflowAction) => void) : void {
		fn(rootAction);
		if (!Array.isArray(rootAction.transitions)) {
			return;
		}
		for (let i = 0; i < rootAction.transitions.length; i++) {
			this.forEachAction(rootAction.transitions[i].workflowAction, fn);
		}
	}
}