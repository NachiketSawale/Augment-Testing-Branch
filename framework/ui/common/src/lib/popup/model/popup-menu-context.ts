/*
 * Copyright(c) RIB Software GmbH
 */

import {IPopupMenuItem} from './interfaces/popup-menu-item.interface';
import {ActivePopup} from './active-popup';

/**
 * Data context of popup menu
 */
export class PopupMenuContext {
    /**
     * menu level
     */
    public menuLevel: number = 0;
    /**
     * menu items
     */
    public menuItems: IPopupMenuItem[] = [];
    /**
     * Parent menu
     */
    public menuParent?: ActivePopup;
}