/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { IAccordionItem } from '../../model/interfaces/accordion-item.interface';
import { IAccordionOptions } from '../../model/interfaces/accordion-config.interface';
import { ItemType } from '../../../model/menu-list/enum/menulist-item-type.enum';

@Component({
	selector: 'ui-common-accordion-test',
	templateUrl: './accordion-test.component.html',
	styleUrls: ['./accordion-test.component.scss'],
})
export class UiCommonAccordionTestComponent {

	// generate data on fly
	public get data() {
		return [
			{
				id: 'Workspace',
				imgCss: 'ico-page'
			},
			{
				id: 'Administration',
				imgCss: 'ico-page'
			},
			{
				id: 3,
				title: 'Accounting Journals',
				imgCss: 'ico-accounting-journals',
				children: [
					{
						id: 31,
						title: 'Accounting Journals',
						children: [
							{
								id: 311,
								title: 'Accounting Journals 1',
								actionButtons: [
									{
										id: 'menu',
										type: ItemType.Check,
										caption: 'menu',
										iconClass: 'tlb-icons ico-menu',
										execute: (item: IAccordionItem) => {
											window.alert(item.title);
										}
									}
								]
							},
							{
								id: 312,
								title: 'Accounting Journals 2'
							}
						]
					}
				]
			},
			{
				id: 4,
				title: 'Activity Groups Templates',
				imgCss: 'ico-activity-groups',
				children: [
					{
						id: 41,
						title: 'Templates Master'
					}
				],
				expanded: true
			},
			{
				id: 5,
				title: 'Activity Templates',
				imgCss: 'ico-activity-templates',
				children: [
					{
						id: 51,
						title: 'Activity Templates'
					},
					{
						id: 52,
						title: 'Control Units'
					}
				],
				expanded: true
			},
			{
				id: 6,
				title: 'Lazy Load',
				hasChild: true
			}
		];
	}

	public options: IAccordionOptions = {
		actionButtons: [
			{
				id: 'pin',
				type: ItemType.Check,
				caption: 'pin',
				iconClass: 'control-icons ico-pin',
				execute: (item: IAccordionItem) => {
					window.alert(item.title);
				},
				hideOnHeader: true
			}
		]
	};

	public loadChildren(item: IAccordionItem) {
		if (item.hasChild && !item.children) {
			// loading holder
			item.children = [
				{
					id: 60,
					title: 'loading'
				}
			];

			setTimeout(() => {
				item.children = [
					{
						id: 61,
						title: 'lazy load item 1'
					},
					{
						id: 62,
						title: 'lazy load item 2'
					}
				];
			}, 1000);
		}
	}

	public execute(item: IAccordionItem) {
		console.log(`active: ${item.title}`);
	}
}
