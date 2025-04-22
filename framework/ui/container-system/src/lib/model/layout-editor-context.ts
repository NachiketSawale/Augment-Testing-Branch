/*
 * Copyright(c) RIB Software GmbH
 */

import {cloneDeep, find, remove} from 'lodash';
import {ContainerDefinition} from './container-definition.class';
import {IContainerLayout} from './layout/container-layout.interface';
import {ILayoutTabContainer, IPaneDefinition, IPaneLayout, paneLayouts} from './container-pane.model';

/**
 * Layout editor context object
 */
export class UiContainerSystemLayoutEditorContext {
    /**
     * Known tab containers.
     */
    public tabContainers: UiContainerSystemLayoutEditorTabContainer[] = [];

    /**
     * Active pane layout
     */
    public paneLayout?: IPaneLayout;

    /**
     * Used containers which can not be selected again
     */
    public get usedContainers(): ILayoutTabContainer[] {
        let tabContainers: ILayoutTabContainer[] = [];

        if (this.paneLayout) {
            this.paneLayout.panes.forEach(p => {
                tabContainers = tabContainers.concat(this.getTabContainersOfPane(p));
            });
        }

        return tabContainers;
    }

    /**
     * Active panes
     */
    public get activePanes() {
        let panes: IPaneDefinition[] = [];

        if (this.paneLayout) {
            this.paneLayout.panes.forEach(p => {
                panes = panes.concat(this.getAllPanes(p));
            });
        }

        return panes;
    }

    /**
     * The constructor
     * @param containers container definitions
     * @param layout current layout
     */
    public constructor(public containers: ContainerDefinition[], public layout: IContainerLayout) {
        this.updatePaneLayout(layout.layoutId);
    }

    private getAllPanes(pane: IPaneDefinition) {
        let panes: IPaneDefinition[] = [];

        if (pane.panes) {
            pane.panes.forEach(p => {
                panes = panes.concat(this.getAllPanes(p));
            });
        } else {
            panes.push(pane);
        }

        return panes;
    }

    /**
     * Update pane layout
     * @param layoutId
     */
    public updatePaneLayout(layoutId: string) {
        const layout = paneLayouts[layoutId];
        this.paneLayout = cloneDeep(layout);

        if (this.layout.layoutId !== layoutId) {
            this.layout = {
                layoutId: layoutId,
                groups: [],
                splitterDef: []
            };
        }
    }

    private getTabContainersOfPane(pane: IPaneDefinition) {
        let tabContainers = pane.tabContainers || [];

        if (pane.panes) {
            pane.panes.forEach(p => {
                tabContainers = tabContainers.concat(this.getTabContainersOfPane(p));
            });
        }

        return tabContainers;
    }

    /**
     * Get a tab container instance, if the container with same uuid is existed then use existed one.
     * @param uuid
     * @param paneNo
     */
    public getTabContainer(uuid: string, paneNo?: number): UiContainerSystemLayoutEditorTabContainer {
        let item = find(this.tabContainers, e => e.uuid === uuid);

        if (!item) {
            item = new UiContainerSystemLayoutEditorTabContainer(uuid);
            this.tabContainers.push(item);
        }

        item.paneNo = paneNo;

        return item;
    }

    /**
     * Get a tab container placeholder, if the placeholder of same pane NO is existed then use existed one.
     * @param paneNo
     */
    public getTabContainerPlaceholder(paneNo?: number): UiContainerSystemLayoutEditorTabContainer {
        let item = find(this.tabContainers, e => e.paneNo === paneNo && e.placeHolder === true);

        if (!item) {
            item = new UiContainerSystemLayoutEditorTabContainer('', paneNo, true);
            this.tabContainers.push(item);
        }

        return item;
    }

    /**
     * Remove a tab container instance by container uuid.
     * @param uuid
     */
    public removeTabContainerByUuid(uuid: string) {
        return remove(this.tabContainers, e => e.uuid === uuid && !e.placeHolder);
    }

    /**
     * Remove tab container by itself
     * @param item
     */
    public removeTabContainer(item: UiContainerSystemLayoutEditorTabContainer) {
        return remove(this.tabContainers, e => e === item);
    }

    private updateLayoutGroup(pane: IPaneDefinition) {
        const group = find(this.layout.groups, e => e.pane === pane.name);

        if (group) {
            const index = this.layout.groups.indexOf(group);
            this.layout.groups.splice(index, 1);
        }

        this.layout.groups.push({
            pane: pane.name,
            content: pane.tabContainers!.filter(e => e.uuid).map(e => e.uuid)
        });
    }

    /**
     * Apply current layout
     */
    public applyLayout() {
        this.activePanes.forEach(p => {
            this.updateLayoutGroup(p);
        });

        return this.layout;
    }
}

/**
 * Tab container data in layout editor
 */
export class UiContainerSystemLayoutEditorTabContainer implements ILayoutTabContainer {
    /**
     * Sort order
     */
    public order: number = 0;

    /**
     * The constructor
     * @param uuid container uuid
     * @param paneNo
     * @param placeHolder
     */
    public constructor(public uuid: string, public paneNo?: number, public placeHolder?: boolean) {

    }
}