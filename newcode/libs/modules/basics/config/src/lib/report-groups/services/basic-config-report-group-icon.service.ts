/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

/**
 * image select domain item source entity.
 */
interface ISelectreportGroupIcon {
	id: number;
	displayName: string;
	iconCSS: string;
}

@Injectable({
	providedIn: 'root',
})

//TODO : Functions implementation will be modify once icon-basis service
// (platformIconBasisService) implementation is done.

/**
 * Used to create array of report css icon data for icon
 * image select dropdown from report group entity
 */
export class BasicsConfigReportGroupIconService {
	/**
	 * total icon count
	 */
	public totalIcon = 20;

	/**
	 * Used to create report css icon objects.
	 * @returns {IImageSelectItemSource} item source for imageselet
	 * dropdown
	 */
	public createReportGroupCssIconObjects(): ISelectreportGroupIcon[] {
		const icons: ISelectreportGroupIcon[] = [];

		for (let i = 1; i <= this.totalIcon; i++) {
			const itemSource = {
				id: i,
				displayName: `Report${i.toString()}`,
				iconCSS: `report-icons ico-report${i.toString().padStart(2, '0')}`,
			};
			icons.push(itemSource);
		}
		return icons;
	}
}
