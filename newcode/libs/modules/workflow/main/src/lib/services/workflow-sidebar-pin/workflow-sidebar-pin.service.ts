/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IDataEntityFacade, IWorkflowSidebarPin, IWorkflowSidebarPinService, WORKFLOW_SIDEBAR_PIN_SERVICE } from '@libs/workflow/interfaces';
import { isBusinessModuleInfo } from '@libs/ui/business-base';
import { LazyInjectable, PlatformConfigurationService, PlatformModuleManagerService } from '@libs/platform/common';


@LazyInjectable({
	token: WORKFLOW_SIDEBAR_PIN_SERVICE,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class WorkflowSidebarPinService implements IWorkflowSidebarPinService {

	private readonly platformModuleManager = inject(PlatformModuleManagerService);
	private readonly entityPinStorageKey: string = 'entityPin';
	private readonly platformConfigurationService = inject(PlatformConfigurationService);
	private sidebarPins: IWorkflowSidebarPin[] = [];


	public createPin(pin: IWorkflowSidebarPin): void {
		const activeModule = this.platformModuleManager.activeModule;

		if (activeModule && isBusinessModuleInfo(activeModule)) {
			activeModule.entities.forEach((entity) => {
				if (entity.getEntityFacade().entityFacadeId === pin.uuid) {
					const entityId = entity.getEntityFacade().getSelectedId();

					if (entityId) {
						const existingPinIndex = this.sidebarPins.findIndex(i => i.uuid === pin.uuid);

						if (existingPinIndex > -1) {
							if (!this.sidebarPins[existingPinIndex].pinItems.find(pinItem => pinItem.id === entityId.id)) {

								this.sidebarPins[existingPinIndex].pinItems.push({id: entityId.id, description: ''});
							}
						} else {
							pin.pinItems.push({id: entityId.id, description: ''});
							this.sidebarPins.push(pin);
						}
						this.platformConfigurationService.setApplicationValue(this.entityPinStorageKey, JSON.stringify(this.sidebarPins), true);
					} else {
						throw new Error('No item selected');
					}
				}
			});
		}
	}

	public safePinIntoLocalStorage(selectedPin: IWorkflowSidebarPin) {
		const index = this.sidebarPins.findIndex(pin => pin.uuid === selectedPin.uuid);
		if (index >= 0) {
			this.sidebarPins[index] = selectedPin;
		} else {
			this.sidebarPins.push(selectedPin);
		}
		this.platformConfigurationService.setApplicationValue(this.entityPinStorageKey, JSON.stringify(this.sidebarPins), true);
	}

	public getPinnedEntitiesFromStorage(): IWorkflowSidebarPin[] {
		const jsonEntity = this.platformConfigurationService.getApplicationValue(this.entityPinStorageKey);
		if (jsonEntity && typeof jsonEntity === 'string') {

			const storageItems = JSON.parse(jsonEntity) as IWorkflowSidebarPin[];
			if (storageItems.length > this.sidebarPins.length) {
				storageItems.forEach(p => {
					if (!this.sidebarPins.some(i => i.uuid === p.uuid)) {
						this.sidebarPins.push(p);
					}
				});
			}
		}
		return this.sidebarPins;
	}

	public getPinnedEntityById(id: number): IWorkflowSidebarPin | undefined {
		return this.sidebarPins.find(i => i.pinItems.find(e => e.id == id));
	}

	public deletePinById(id: number): void {
		const entity = this.getPinnedEntityById(id);
		if (entity) {
			const storageItem = this.platformConfigurationService.getApplicationValue(this.entityPinStorageKey);
			if (storageItem && typeof storageItem === 'string') {
				const storageEntities = JSON.parse(storageItem) as IWorkflowSidebarPin[];
				storageEntities.forEach(p => {
					if (p.uuid === entity.uuid) {
						const index = p.pinItems.findIndex(pi => pi.id === id);
						if (index >= 0) {
							if (p.pinItems.length > 1) {
								p.pinItems.splice(index, 1);
								this.safePinIntoLocalStorage(p);
							} else {
								this.deletePinFromLocalStorage(p);
							}
						}
					}
				});
			}
		}
	}

	public isCreateDisabled(selectedEntityFacade: IDataEntityFacade): boolean {
		const activeModule = this.platformModuleManager.activeModule;
		const selection = [];
		if (activeModule && isBusinessModuleInfo(activeModule)) {
			activeModule.entities.forEach((entity) => {
				if (entity.getEntityFacade().getSelectedId()) {
					selection.push(entity.getEntityFacade().getSelectedId());
				}
			});
		}
		return !(selectedEntityFacade && selectedEntityFacade.Id.length > 0 && activeModule && isBusinessModuleInfo(activeModule) && selection.length > 0);
	}

	private deletePinFromLocalStorage(selectedPin: IWorkflowSidebarPin) {
		const index = this.sidebarPins.findIndex(pin => pin.uuid === selectedPin.uuid);
		this.sidebarPins.splice(index, 1);
		this.platformConfigurationService.setApplicationValue(this.entityPinStorageKey, JSON.stringify(this.sidebarPins), true);
	}
}