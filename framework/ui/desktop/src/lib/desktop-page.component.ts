/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import * as _ from 'lodash';
import { ICurrentSetting } from './models/interfaces/current-settings.interface';
import { IGroup } from './models/interfaces/group.interface';
import { ITilesData } from './models/interfaces/tile.interface';
import { DesktopLayoutSettingsService } from '../../../desktop/src/lib/services/desktop-layout-settings.service';
import { IDefaultPage } from './models/interfaces/default-page.interface';
import { IRouteBase } from './models/interfaces/route.base.interface';
import { ClientAreaBaseComponent } from '@libs/ui/main-frame';

@Component({
	selector: 'desktop-common-desktop-page',
	host: {
		class: 'desktopViewWrapper'
	},
	templateUrl: './desktop-page.component.html',
	styleUrls: ['./desktop-page.component.scss'],
})
export class UiDesktopPageComponent extends ClientAreaBaseComponent implements OnInit {
	browserRefresh: boolean = true;
	tilegroups!: Array<IGroup>;
	contentHeight!: number;
	itemsInColumn!: number;
	itemsCount!: number;
	parentContainerWidth!: number;
	contentHeight_width!: any; // need to check data type
	currentSettings!: { modules?: ITilesData[]; desktopPagesStructure?: IDefaultPage[] | any };
	tilegroupsData!: boolean;

	constructor(public router: Router, private el: ElementRef, public desktopLayoutSettingsService: DesktopLayoutSettingsService) {
		super();
		router.events.subscribe((ev) => {
			if ((ev as IRouteBase).routerEvent instanceof NavigationStart) {
				this.browserRefresh = !router.navigated;
			}
			if ((ev as IRouteBase).routerEvent instanceof NavigationEnd) {
				desktopLayoutSettingsService.getCurrentSettings(true).then((result: ICurrentSetting) => {
					this.currentSettings = {};
					this.currentSettings.modules = result.modules;
					if (result.desktopPages) {
						desktopLayoutSettingsService.getPermittedStructure(result.desktopPages).then((res: IDefaultPage[]) => {
							this.currentSettings.desktopPagesStructure = desktopLayoutSettingsService.removeInvisible(res);
							const expectid = router.url.replace('/app/main/', '').split('/')[2];
							this.tilegroupsData = this.currentSettings.desktopPagesStructure.find((tile: ITilesData) => tile.id === expectid);

							if (this.tilegroupsData) {
								this.tilegroups = this.currentSettings.desktopPagesStructure.find((tile: ITilesData) => tile.id === expectid).groups;
							}
						});
					}
				});
			}
		});
	}

	public override ngOnInit(): void {
		super.ngOnInit();
	}

	/**
	 * to scroll the desktop tiles
	 * @param Event {WheelEvent}
	 */
	onScroll(event: WheelEvent): void {
		this.el.nativeElement.scrollLeft += event.deltaY;
		event.preventDefault();
	}

	/**
	 * To set the width of desktop
	 * @param {IGroup} group to listen event
	 */
	set_width(group: IGroup) {
		this.contentHeight_width = document.querySelector('.desktopViewWrapper')?.clientHeight;
		// h1-tag plus pager
		this.contentHeight = this.contentHeight_width - 91;
		this.itemsInColumn = Math.floor(this.contentHeight / 130);
		// so many tiles fit in
		this.itemsCount = group.tiles.length;
		this.parentContainerWidth = 0;

		group.tiles.map((item) => {
			if (item.btngrp) {
				item.btngrp = '';
			}
			if (item.groupInRow) {
				item.groupInRow = '';
			}
		});

		for (let x = 0; x < this.itemsCount; x++) {
			if (group.tiles[x].btngrp !== 'end') {
				group.tiles[x].groupInRow = true;

				if (group.tiles[x].tileSize === 0 && group.tiles[x].btngrp !== 'end') {
					if (group.tiles[x + 1] && group.tiles[x + 1].tileSize === 0) {
						group.tiles[x].btngrp = 'begin';
						group.tiles[x + 1].btngrp = 'end';
					}
				}
			}
		}

		let groupsInTiles = _.filter(group.tiles, 'groupInRow');
		//calculate and set the width of parent container.
		this.parentContainerWidth = Math.ceil(groupsInTiles.length / this.itemsInColumn) * 260;

		//exist one row in column and exist one small button, then get not 260px rather 130px
		if (groupsInTiles.length % this.itemsInColumn === 1 && _.last<any>(groupsInTiles).tileSize === 0 && !_.last<any>(groupsInTiles).btngrp) {
			this.parentContainerWidth -= 130;
		}
		let plainwidth = this.parentContainerWidth + 20;
		return 'min-width:' + plainwidth + 'px' + ';';
	}

	/**
	 * To resize the window with tiles
	 * @param Event to listen event
	 */
	moveTiles(event: Event, group: IGroup) {
		event.target;
		this.set_width(group);
	}
}
