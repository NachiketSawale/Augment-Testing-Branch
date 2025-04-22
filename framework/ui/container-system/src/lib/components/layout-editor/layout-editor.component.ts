/*
 * Copyright(c) RIB Software GmbH
 */

import {find} from 'lodash';
import {Component, inject, OnInit} from '@angular/core';
import {PlatformTranslateService} from '@libs/platform/common';
import {ILayoutMenuItem} from '../../model/container-pane.model';
import {UiContainerSystemLayoutEditorContext} from '../../model/layout-editor-context';

/**
 * Layout editor, used by editing layout dialog
 */
@Component({
	selector: 'ui-container-system-layout-editor',
	templateUrl: './layout-editor.component.html',
	styleUrls: ['./layout-editor.component.scss'],
})
export class UiContainerSystemLayoutEditorComponent implements OnInit {
	/**
	 * The context object
	 */
	public context = inject(UiContainerSystemLayoutEditorContext);

	private _layoutMenu?: ILayoutMenuItem;
	/**
	 * Get active layout menu.
	 */
	public get layoutMenu(): ILayoutMenuItem | undefined {
		return this._layoutMenu;
	}
	/**
	 * Set active layout menu
	 * @param value
	 */
	public set layoutMenu(value: ILayoutMenuItem | undefined) {
		this._layoutMenu = value;

		if (this._layoutMenu) {
			this.context.updatePaneLayout(this._layoutMenu.id);
		}
	}

	/**
	 * Layout menus
	 */
	public layoutMenus: ILayoutMenuItem[] = this.generateLayoutMenus();

	/**
	 * Translation service
	 */
	public translateService = inject(PlatformTranslateService);

	/**
	 * The constructor
	 */
	public constructor() {
		this.translateService.load(['container-permission', 'cloud.desktop']);
	}

	public ngOnInit() {
		this.layoutMenu = find(this.layoutMenus, e => e.id === this.context.layout.layoutId);
	}

	private generateLayoutMenus() {
		const menus = [];

		for (let i = 0; i < 32; i++) {
			menus.push({
				id: `layout${i}`,
				caption: `Layout ${i}`,
				sort: (i === 24 || i === 25) ? 5 : i
			});
		}

		return menus.sort((a, b) => a.sort - b.sort);
	}

	/**
	 * Get css class for layout menu.
	 * @param item
	 */
	public getLayoutMenuCss(item: ILayoutMenuItem) {
		let css = 'ico-' + item.id;

		if (this.layoutMenu === item) {
			css += ' selected';
		}

		return css;
	}
}
