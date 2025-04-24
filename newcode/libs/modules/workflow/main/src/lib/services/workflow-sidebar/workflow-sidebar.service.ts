/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IIdentificationData, LazyInjectable, PlatformHttpService, PlatformModuleManagerService } from '@libs/platform/common';
import { isBusinessModuleInfo } from '@libs/ui/business-base';
import { WORKFLOW_SIDEBAR_SERVICE, IWorkflowSidebarService, WorkflowSidebarSwitch } from '@libs/workflow/interfaces';
import { WorkflowTemplate } from '@libs/workflow/interfaces';
import { IAccordionItem } from '@libs/ui/common';
import { WorkflowEntityService } from '../workflow-entity/workflow-entity.service';


@LazyInjectable({
	token: WORKFLOW_SIDEBAR_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class WorkflowSidebarService implements IWorkflowSidebarService {

	private readonly platformHttpService = inject(PlatformHttpService);
	private readonly platformModuleManager = inject(PlatformModuleManagerService);
	private readonly workflowEntityService = inject(WorkflowEntityService);
	private workflowItemList: IAccordionItem[] = [];
	private caseForView: WorkflowSidebarSwitch = WorkflowSidebarSwitch.DefaultView;

	public async getTemplates(): Promise<WorkflowTemplate[]> {
		await this.workflowEntityService.loadAllEntityFacades();
		if (this.platformModuleManager.activeModule && isBusinessModuleInfo(this.platformModuleManager.activeModule)) {
			const entities = this.platformModuleManager.activeModule.entities;
			const entityFacadeIds = ['0'];

			const entityFacadeIdForCurrentModule = entities?.map((entity) => entity.getEntityFacade())?.filter(ef => ef.entityFacadeId)?.map((ef) => ef.entityFacadeId);
			if (entityFacadeIdForCurrentModule) {
				entityFacadeIdForCurrentModule.forEach((entityFacadeId) => {
					if (entityFacadeId) {
						entityFacadeIds.push(entityFacadeId);
					}
				});
			}
			return this.platformHttpService.post('basics/workflow/template/workflows/currentuser', entityFacadeIds);
		}

		return Promise.resolve([]);
	}

	public get getWorkflowItemList(): IAccordionItem[] {
		return this.workflowItemList;
	}

	public setWorkflowItemList(items: IAccordionItem[]): void {
		this.workflowItemList = items;
	}

	public setCaseForView(selectedCase: WorkflowSidebarSwitch) {
		this.caseForView = selectedCase;
	}

	public get getCaseForView(): number {
		return this.caseForView;
	}

	public getSelectedEntityIds(): IIdentificationData[] {
		const activeModule = this.platformModuleManager.activeModule;
		if (activeModule && isBusinessModuleInfo(activeModule)) {
			return activeModule.mainEntity.getEntityFacade().getSelectedIds();
		}
		return [];
	}

	public getAllEntityIds() {
		const activeModule = this.platformModuleManager.activeModule;
		if (activeModule && isBusinessModuleInfo(activeModule)) {
			return activeModule.mainEntity.getEntityFacade().getAllIds();
		}
		return [];
	}

}
