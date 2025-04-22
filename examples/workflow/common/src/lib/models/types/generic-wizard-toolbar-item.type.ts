/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { ConcreteMenuItem, IMenuItemEventInfo } from '@libs/ui/common';
import { GenericWizardContainers, GenericWizardContainerTypeUnion } from '../../configuration/base/enum/rfq-bidder-container-id.enum';

/**
 * Toolbar items to be added to containers in generic wizard.
 * Has a different execute function, where in addition to the menu context, the angular injector is provided.
 */
export type GenericWizardConcreteMenuItem = Omit<ConcreteMenuItem,'fn'> & {
    /**
     * Function to be executed when the menu item is clicked.
     */
    fn: (info: IMenuItemEventInfo<void>, injector: Injector, lazyInjector: PlatformLazyInjectorService, selectedItem: GenericWizardContainerTypeUnion | null) => void | Promise<void>;

    /**
     * Uuid of the container the menu item is added to.
     */
    containerUuid: GenericWizardContainers;
};