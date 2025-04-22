/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IInfoBarHeader, IInfoBarOutput, IInfoBarSub } from '../model/interfaces/info-bar.interfaces';
import { InfoBarLevel } from '../model/enum/info-bar-levels.enum';

@Component({
	selector: 'ui-common-info-bar',
	templateUrl: './info-bar.component.html',
	styleUrl: './info-bar.component.scss',
})
export class UiCommonInfoBarComponent {

	/**
	 * List of entity infos for the info bar.
	 */
	@Input()
	public entityInfos!: IInfoBarHeader[];

	/**
	 * Returns the index number of the selected item.
	 */
	@Output()
	public clickedItem = new EventEmitter<IInfoBarOutput>();

	/**
	 * Enum for the info bar levels.
	 */
	public readonly InfoBarLevel = InfoBarLevel;

	/**
	 * Set the output value for header entity click.
	 * @param headerItem
	 * @param level
	 */
	public headerClick(headerItem: IInfoBarHeader, level: number): void {
		this.clickedItem.emit( {id: headerItem.id, description: headerItem.description, level: level});
	}

	/**
	 * Set the output value for sub entity click.
	 * @param subItem
	 * @param level
	 */
	public subClick(subItem: IInfoBarSub, level: number): void{
		this.clickedItem.emit( {id: subItem.id, description: subItem.description, level: level});
	}

	/**
	 * Gets the total number of items under the header.
	 * @param headerItem The header item to get the count for.
	 * @returns number
	 */
	public getItemCount(headerItem:IInfoBarHeader): number {
		if(headerItem.subEntity) {
			return headerItem.subEntity.map((subItem)=>{
				if(subItem.subEntity) {
					return subItem.subEntity.length;
				}
				return 0;
			}).reduce((acc, curr)=> acc= acc+curr, 0);
		}
		return 0;
	}
}