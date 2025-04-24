/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { IGroup } from '../../models/interfaces/group.interface';

@Component({
	selector: 'ui-desktop-tile-group',
	templateUrl: './tile-group.component.html',
	styleUrls: ['./tile-group.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component for groups of tiles
 */
export class UiDesktopTileGroupComponent implements OnInit {
	/**
	 * Variable for groups
	 */
	@Input() groups!: IGroup;
	/**
	 * Variable for name of group
	 */
	/**
	 * Variable for assigning groups data
	 */
	group!: IGroup;

	/**
	 * Variable for group name header
	 */
	groupNameHeader!: string | undefined;

	ngOnInit(): void {
		this.group = this.groups;
		this.groupNameHeader = this.group.groupNameKey;
	}
	/**
	 * Function to set the height
	 * @returns string
	 */
	set_heights(): string {
		const contentHeight_set = document.querySelector('.desktopViewWrapper')?.clientHeight;
		if (contentHeight_set) {
			const contentHeight_new = contentHeight_set - 91;
			return 'height:' + contentHeight_new + 'px;';
		}
		return 'height:' + contentHeight_set + 'px;';
	}
}
