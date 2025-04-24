/*
 * Copyright(c) RIB Software GmbH
 */


import { Component, inject, OnInit } from '@angular/core';
import { IAccordionItem, IMenuItemsList, ItemType, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule, PlatformLazyInjectorService } from '@libs/platform/common';
import {
	IDataEntityFacade, IPinItem,
	IWorkflowEntityFacadeLookupService, IWorkflowSidebarPinService,
	IWorkflowSidebarService,
	WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE, WORKFLOW_SIDEBAR_PIN_SERVICE,
	WORKFLOW_SIDEBAR_SERVICE, WorkflowSidebarSwitch
} from '@libs/workflow/interfaces';
import { NgIf } from '@angular/common';
import { UiSidebarWorkflowPinningRowComponent } from '../workflow-sidebar-pinning-row/workflow-sidebar-pinning-row.component';

@Component({
	selector: 'ui-sidebar-workflow-tab-pin',
	templateUrl: './workflow-sidebar-tab-pin.component.html',
	standalone: true,
	imports: [
		UiCommonModule,
		PlatformCommonModule,
		NgIf
	],
	styleUrl: './workflow-sidebar-tab-pin.component.css'
})
export class UiSidebarWorkflowTabPinComponent implements OnInit {

	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public entityFacadeService!: IWorkflowEntityFacadeLookupService<IDataEntityFacade>;
	private workflowSidebarSwitchEnum = WorkflowSidebarSwitch;
	public sidebarService!: IWorkflowSidebarService;
	public sidebarPinService!: IWorkflowSidebarPinService;
	private accordionData: IAccordionItem[] = [];
	public selectedItem: string = '';

	public lookupOptions = {
		displayMember: 'EntityName',
		valueMember: 'Id',
		showClearButton: true

	};

	public itemsList: IMenuItemsList = {
		items: [
			//Back to list view
			{
				caption: {key: 'cloud.desktop.taskList.back'},
				iconClass: 'tlb-icons ico-rec-previous',
				type: ItemType.Item,
				fn: () => this.sidebarService.setCaseForView(this.workflowSidebarSwitchEnum.DefaultView)
			},
		]
	};


	public async ngOnInit() {
		this.sidebarService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_SERVICE);
		this.sidebarPinService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_PIN_SERVICE);
		this.entityFacadeService = await this.lazyInjector.inject(WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE);
		this.processData();
	}

	/**
	 * Creates new pin item and refresh the list
	 */
	public createPin() {
		const entity = this.entityFacadeService.getEntityFacadeById(this.selectedItem);
		if (entity) {
			this.sidebarPinService.createPin({uuid: this.selectedItem, text: entity.EntityName, pinItems: []});
			this.processData();
		}
	}

	/**
	 * Build the accordion
	 */
	public processData() {
		this.accordionData = [];
		if (this.sidebarService) {
			this.sidebarPinService.getPinnedEntitiesFromStorage().forEach((group) => {
				const entity = this.entityFacadeService.getEntityFacadeById(this.selectedItem);
				const accordion: IAccordionItem = {
					id: group.uuid,
					title: group.text,
					hidden: entity && entity.Id ? !(group.uuid === entity.Id) : false,
				};
				if (group.pinItems && group.pinItems.length) {
					accordion.hasChild = true;
					accordion.expanded = false;
					accordion.children = this.getChildNode(group.pinItems);
				}
				this.accordionData.push(accordion);
			});
		}
		return this.accordionData;
	}

	private getChildNode(entityIds: IPinItem[]): IAccordionItem[] {
		const childAccordionData: IAccordionItem[] = [];
		entityIds.forEach((pinItem) => {

			const accordion: IAccordionItem = {
				id: pinItem.id,
				title: pinItem.description,
			};
			accordion.component = UiSidebarWorkflowPinningRowComponent;
			childAccordionData.push(accordion);
		});

		return childAccordionData;
	}

	public isDisabled(): boolean {
		const entity = this.entityFacadeService?.getEntityFacadeById(this.selectedItem);
		if (entity) {
			return this.sidebarPinService.isCreateDisabled(entity);
		}
		return true;
	}
}
