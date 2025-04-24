/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Inject, OnInit } from '@angular/core';
import { AccordionContext, IMenuItemsList, ItemType, UiCommonModule } from '@libs/ui/common';
import { IWorkflowSidebarPinService, WORKFLOW_SIDEBAR_PIN_SERVICE } from '@libs/workflow/interfaces';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { isEmpty } from 'lodash';

@Component({
	selector: 'ui-sidebar-workflow-pinning-row',
	standalone: true,
	imports: [
		FormsModule,
		UiCommonModule
	],
	templateUrl: './workflow-sidebar-pinning-row.component.html',
	styleUrl: './workflow-sidebar-pinning-row.component.scss'
})
export class UiSidebarWorkflowPinningRowComponent implements OnInit {

	public sidebarPinService!: IWorkflowSidebarPinService;

	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public itemsList: IMenuItemsList ={
		items: [
			//Delete pin item
			{
				caption: {key: 'cloud.desktop.taskList.delete'},
				iconClass: 'tlb-icons ico-rec-delete',
				type: ItemType.Item,
				fn: () => this.onBlur()
			},
		],
		cssClass: 'tools'
	};

	public constructor(@Inject(AccordionContext) public injectedData: AccordionContext) {
	}

	public async ngOnInit() {
		this.sidebarPinService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_PIN_SERVICE);
	}

	/**
	 * Update the entity on blur event
	 */
	public onBlur(): void{
		if(!isEmpty(this.injectedData.data.title?.toString().trim())){
			const sidebarPin = this.sidebarPinService.getPinnedEntityById(this.injectedData.data.id as number);
			if (sidebarPin) {
				sidebarPin.pinItems.forEach((item) => {
					if (item.id === this.injectedData.data.id){
						item.description = this.injectedData.data.title!;
					}
				});
				this.sidebarPinService.safePinIntoLocalStorage(sidebarPin);
			}
		}
	}

	public deleteItem(){
		this.sidebarPinService.deletePinById(this.injectedData.data.id as number);
	}
}
