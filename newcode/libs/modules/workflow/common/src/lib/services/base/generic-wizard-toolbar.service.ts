/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable, Injector } from '@angular/core';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardConcreteMenuItem } from '../../models/types/generic-wizard-toolbar-item.type';
import { ConcreteMenuItem, IMenuItemEventInfo } from '@libs/ui/common';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { GenericWizardConfigService } from './generic-wizard-config.service';

/**
 * Used to load toolbar items into the generic wizard containers.
 */
@Injectable({
    providedIn: 'root'
})
export class GenericWizardToolbarService {

    private menuItems = <Record<GenericWizardContainers, ConcreteMenuItem[]>>{};
    private readonly injector = inject(Injector);
    private readonly lazyInjector = inject(PlatformLazyInjectorService);
    private readonly wizardConfig = inject(GenericWizardConfigService);

    /**
     * Sets menu items for a container based on the container's uuid.
     * Updates the execute function as required for the toolbar.
     * @param containerUuid Uuid of a generic wizard container.
     * @param menuItems Generic wizard menu items.
     */
    public setMenuItems(containerUuid: GenericWizardContainers, menuItems: GenericWizardConcreteMenuItem[]) {
        const concreteMenuItems: ConcreteMenuItem[] = [];
        const injector = this.injector;
        const lazyInjector = this.lazyInjector;
        const wizardConfig = this.wizardConfig;
        menuItems.forEach(menuItem => {
            const fn: ((info: IMenuItemEventInfo<void>) => void | Promise<void>) | undefined = (info) => {
                const selectedItem = wizardConfig.getService(menuItem.containerUuid).getSelectedEntity();
                return menuItem.fn(info, injector, lazyInjector, selectedItem);
            };
            const disabledFn = () => {
                const selectedItem = wizardConfig.getService(menuItem.containerUuid).getSelectedEntity();
                return menuItem.disabled ? (selectedItem === null && menuItem.disabled) : selectedItem === null;
            };
            concreteMenuItems.push({
                ...menuItem,
                fn: fn,
                disabled: disabledFn
            } as ConcreteMenuItem);
        });
        this.menuItems[containerUuid] = concreteMenuItems;
    }

    /**
     * Gets all loaded menu items for a container.
     * @param containerUuid Uuid of a generic wizard container.
     * @returns Menu items.
     */
    public getMenuItems(containerUuid: GenericWizardContainers): ConcreteMenuItem[] {
        return this.menuItems[containerUuid] || [];
    }
}