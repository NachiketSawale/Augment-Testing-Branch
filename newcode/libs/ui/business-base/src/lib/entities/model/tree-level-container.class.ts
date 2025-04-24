/*
 * Copyright(c) RIB Software GmbH
 */


import { ConcreteMenuItem, IDropdownBtnMenuItem, ItemType } from '@libs/ui/common';
import { ITreeContainerLink } from './tree-container-link.interface';

/**
 * class to store and generate tree-level dropdown data.
 */
export class TreeLevelContainer {

    /**
     * To stored valid levels,
     */
    private validLevels: string[] = ['expand', 'collapse'];


    /**
     * Function generates tree-level dropdown data based on
     * tree-grid level.
     * 
     * @param {number} maxLevel max tree grid level
     * @param containerLink container Link
     * @param toolbar tree-level dropdown data
     */
    public generateTreeLevelToolbaritems<T extends object>(maxLevel: number, containerLink: ITreeContainerLink<T>, toolbar: IDropdownBtnMenuItem) {

        const treeTypes: string[] = ['undefined', 'collapse', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'expand'];

        const toolbarList: ConcreteMenuItem<void>[] = treeTypes
            .filter(level => this.validLevels.includes(level) ||
                (maxLevel != null ? (parseInt(level) >= 1 && parseInt(level) <= maxLevel) : !isNaN(parseInt(level))))
            .map(level => ({
                id: level,
                caption: this.generateCaption(level, this.validLevels),
                type: ItemType.Item,
                iconClass: this.generateIconClass(level, this.validLevels),
                hideItem: false,
                fn: () => {
                    this.setSelectedTreeLevel(level, containerLink, toolbar);
                },
            }));

        toolbar.list.items = toolbarList;
        return toolbar;
    }


    /**
     * Used to generate caption based on level
     * 
     * @param {string} level tree grid level 
     * @param {string[]} validLevels  valid levels
     * @returns returns caption for provided level.
     */

    public generateCaption(level: string, validLevels: string[]) {
        if (validLevels.includes(level) || level === 'undefined') {
            return { key: `cloud.common.toolbar${this.capitalizedLevel(level)}` };
        }
        return { key: `cloud.common.toolbarLevel ${level}` };
    }


    /**
     * Used to format level 
     * 
     * @param {string} level provided level
     * @returns returns formatted level
     */
    public capitalizedLevel(level: string) {
        return level.charAt(0).toUpperCase() + level.slice(1);
    }


    /**
     * Used to generate icon class based on level.
     * 
     * @param {string} level tree grid level 
     * @param {string[]} validLevels valid levels 
     * @returns returns generated icon class for provided level.
     */
    public generateIconClass(level: string, validLevels: string[]) {
        const baseClass = 'tlb-icons ico-tree-level';
        return validLevels.includes(level) || level === 'undefined' ? `${baseClass}-${level}` : `${baseClass}${level}`;
    }

    /**
    * Used to stored selected level for respective container dropdown
    * to remove selected level from drodown menu item and 
    * display as active level in dropdown menu item.
    * 
    * @param {string} level selected level 
    * @param {ITreeContainerLink<T>} containerLink 
    */
    public setSelectedTreeLevel<T extends object>(level: string, containerLink: ITreeContainerLink<T>, toolbar: IDropdownBtnMenuItem) {

        toolbar.list.activeValue = level;
        setTimeout(() => {
            this.setTreeGridLevel(level, containerLink, toolbar);
        });

    }


    /**
     * Used to perform expand/collapse for selected level in tree grid.
     * 
     * @param {string} level selected tree grid level
     * @param {ITreeContainerLink<T>} containerLink 
     */
    public setTreeGridLevel<T extends object>(level: string, containerLink: ITreeContainerLink<T>, toolbar: IDropdownBtnMenuItem) {

        switch (level) {
            case 'collapse':
                containerLink.collapseAll();
                break;
            case 'expand':
                containerLink.expandAll();
                break;
            default:
                if (!isNaN(parseInt(level))) {
                    containerLink.collapseAll();
                    containerLink.expandAll(parseInt(level));
                }
        }
        this.setTreeLevel(level, toolbar);
    }


    /**
    * Used to show/hide selected level from tree-level dropdown and 
    * set as active level.
    * 
    * @param {string} level selected tree-grid level
    * @param {IDropdownBtnMenuItem} toolbar tree-level dropdown data
    */
    public setTreeLevel(level: string, toolbar: IDropdownBtnMenuItem) {
        toolbar.list.items?.forEach((menu) => {
            if (menu.hideItem) {
                menu.hideItem = false;
            }
            if (menu.id === level) {
                menu.hideItem = true;
                toolbar.caption = menu.caption;
                toolbar.iconClass = menu.iconClass;
            }
        });
    }

}