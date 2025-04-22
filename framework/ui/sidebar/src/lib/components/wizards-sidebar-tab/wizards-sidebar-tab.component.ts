/**
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, OnInit, inject, DestroyRef, ViewChild } from '@angular/core';

import { UiSidebarWizardsService } from '../../services/wizard-sidebar.service';

import { Dictionary, InitializationContext, PlatformModuleManagerService } from '@libs/platform/common';

import { IWizard } from '@libs/platform/common';
import { ISidebarWizard } from '../../model/interfaces/wizard/sidebar-wizard.interface';
import { ISidebarWizardItem } from '../../model/interfaces/wizard/sidebar-wizard-item.interface';
import { AccordionItemAction, IAccordionItem, IMenuItemsList, ItemType, UiCommonAccordionComponent } from '@libs/ui/common';
import { ISidebarWizardAccordionItem } from '../../model/interfaces/wizard/sidebar-wizard-accordion-data.interface';
import {
	ISidebarWizardComplete
} from '../../model/interfaces/wizard/sidebar-wizard-complete.interface';

/**
 * Implements the basic functionality for wizards sidebar.
 */
@Component({
	selector: 'ui-sidebar-wizards-sidebar-tab',
	templateUrl: './wizards-sidebar-tab.component.html',
	styleUrls: ['./wizards-sidebar-tab.component.scss'],
})
export class UiSidebarWizardsSidebarTabComponent implements OnInit {

	/**
	 * Accordion wizard data.
	 */
	public accordionData: ISidebarWizardAccordionItem[] = [];

	/**
	 * Property to display overlay.
	 */
	public asyncInProgress: boolean = false;

	/**
	 * Search string from search input field.
	 */
	public searchString: string = '';

	/**
	 * Toolbar data for header
	 */
	public readonly toolbarData: IMenuItemsList = {
		cssClass: 'tools',
		items: [
			{
				hideItem: false,
				list: {
					items: [
						{
							caption: { key: 'cloud.common.toolbarCollapseAll' },
							iconClass: 'tlb-icons ico-tree-collapse-all ',
							type: ItemType.Item,
							fn: () => {
								this.accordionElement.closeAll();
							},
						},
						{
							caption: { key: 'cloud.common.toolbarExpandAll' },
							iconClass: 'tlb-icons ico-tree-expand-all ',
							type: ItemType.Item,
							fn: () => {
								this.accordionElement.openAll();
							},
						},
					],
					showTitles: false,
				},
				type: ItemType.Sublist,
			},
		],
	};

	/**
	 * Reference to accordion component.
	*/
	@ViewChild('accordion') private readonly accordionElement!: UiCommonAccordionComponent;

	/**
	 * Action button for Pin.
	 */
	private actionButtonForPin: AccordionItemAction[] = [
		{
			id: 'pin',
			type: ItemType.Check,
			caption: 'pin',
			iconClass: 'control-icons ico-pin',
			execute: this.onActionButtonClick.bind(this),
		},
	];

	/**
	 * Action button for unpin.
	 */
	private actionButtonForUnPin: AccordionItemAction[] = [
		{
			id: 'unpin',
			type: ItemType.Check,
			caption: 'unpin',
			iconClass: 'control-icons ico-close',
			execute: this.onActionButtonClick.bind(this),
		},
	];

	/**
	 * For pinned data
	 */
	private pinnedGroup: ISidebarWizardAccordionItem = {
		id: 10000, //TODO:Dummy ID given for pinned accordion item temporarily.
		title: 'Pinned',
		imgCss: 'btn control-icons ico-pin',
		children: [],
		expanded: true,
	};

	/**
	 * Filtered Wizard Data from APi.
	 */
	private wizardsData: ISidebarWizard[] = [];

	/**
	 * Wizard sidebar service instance.
	 */
	private readonly wizardSidebarService = inject(UiSidebarWizardsService);

	/**
	 * An Angular injector that allows for loading Angular injectables in a wizard.
	 */
	private readonly injector = inject(Injector);
	private readonly platformModuleManagerService = inject(PlatformModuleManagerService);
	private readonly destroyRef = inject(DestroyRef);

	/**
	 * Initializes sidebar.
	 */
	public ngOnInit() {
		const subscription = this.platformModuleManagerService.activeModule$.subscribe(() => {
			this.loadWizards();
		});

		this.destroyRef.onDestroy(() => {
			subscription.unsubscribe();
		});

		this.loadWizards();
	}

	/**
	 * This function initializes wizard sidebar.
	 */
	private loadWizards() {
		this.asyncInProgress = true;
		this.updateWizards();
	}

	/**
	 * This Function fetches the data from APi, processes it and prepares the data
	 * according to accordion item interface.
	 */
	private updateWizards() {
		this.wizardSidebarService.loadWizards$().subscribe((response: ISidebarWizard[]) => {
			response.forEach((wizardGroup: ISidebarWizard) => {
				if (wizardGroup.wizards.length) {
					this.wizardsData.push(wizardGroup);
				} else {
					this.wizardsData = [];
				}
			});
			this.processData();
		});
	}

	/**
	 * This Function process the data fetched from API according to data format required
	 * by the accordion.
	 */
	private processData() {
		this.accordionData = [];
		this.wizardsData.forEach((group: ISidebarWizard) => {
			const accordion: ISidebarWizardAccordionItem = {
				id: group.id,
				title: group.name,
				imgCss: group.icon,
				hidden: false,
			};
			if (group.wizards && group.wizards.length) {
				accordion.hasChild = true;
				accordion.expanded = true;
				accordion.children = this.getChildNode(group.wizards, group.id);
			}
			this.accordionData.push(accordion);
		});
		this.asyncInProgress = false;
	}

	/**
	 * This Function process the data fetched from API according to data format required
	 * by the accordion.
	 *
	 * @param {ISidebarWizardItem[]} wizards Wizard item list.
	 * @param {number} groupId Unique Wizard group id.
	 * @returns {ISidebarWizardAccordionItem[]} Accordion data.
	 */
	private getChildNode(wizards: ISidebarWizardItem[], groupId: number): ISidebarWizardAccordionItem[] {
		const childAccordionData: ISidebarWizardAccordionItem[] = [];
		wizards.forEach((wizard) => {
			const wizardData = this.wizardSidebarService.wizardList.find((item: IWizard) => {
				return item.uuid === wizard.wizardGuid;
			});

			const clonedActionButtonsforPin = this.actionButtonForPin.map((a) => {
				return { ...a };
			});

			const accordion = {
				id: wizard.id,
				groupId: groupId,
				w2GId: wizard.w2GId,
				title: wizard.name ? wizard.name : wizardData?.name,
				actionButtons: clonedActionButtonsforPin,
				hidden: false,
				comment: wizard.description ? wizard.description : wizardData && wizardData.description ? wizardData.description : '',
				executeWizard: wizardData?.execute,
			};

			childAccordionData.push(accordion);
		});

		return childAccordionData;
	}

	/**
	 * This function gets executed when accordion item is clicked and executes the function
	 * assigned to the item.
	 *
	 * @param {ISidebarWizardAccordionItem} item Accordion item clicked.
	 */
	public async onSelected(item: ISidebarWizardAccordionItem) {
		if (!item.children && item.executeWizard) {
			const ctx = new InitializationContext(this.injector);
			const wizardParameters: Dictionary<string, unknown> = new Dictionary<string, unknown>();
			if (item.w2GId) {
				const completeItems: ISidebarWizardComplete[] = await this.wizardSidebarService.loadWizardComplete(item.w2GId);

				completeItems.forEach((item) => {
					wizardParameters.add(item.Name, item.Value);
				});
			}

			item.executeWizard(ctx, wizardParameters);
		}
	}

	/**
	 * This Function gets executed when action button(pin/unpin) is clicked and
	 * executes the pin/unpin functionality based on the item state.
	 *
	 * @param {ISidebarWizardAccordionItem} item Accordion item clicked.
	 */
	private onActionButtonClick(item: ISidebarWizardAccordionItem) {
		let isPinned = false;
		//TODO: Condition checked with static Id temporarily. will be removed in future.
		if (this.accordionData[0].id === 10000 && this.accordionData[0].children) {
			const data = this.accordionData[0].children.find((data: ISidebarWizardAccordionItem) => {
				return data.w2GId === item.w2GId;
			});
			isPinned = data ? true : false;
		}

		isPinned ? this.unPin(item) : this.pin(item);

		if (this.searchString) {
			this.search(this.searchString);
		}
	}

	/**
	 * This Function implements the pin operation when the item action button is clicked.
	 *
	 * @param {ISidebarWizardAccordionItem} item Accordion item clicked.
	 */
	private pin(item: ISidebarWizardAccordionItem) {
		const clonedActionButtonsforUnPin = this.actionButtonForUnPin.map((a) => {
			return { ...a };
		});
		this.pinnedGroup.children?.push({ ...item, actionButtons: clonedActionButtonsforUnPin });

		if (this.pinnedGroup.children?.length === 1) {
			this.accordionData.unshift(this.pinnedGroup);
		}

		item.isPinned = true;
		item.hidden = true;
		const group = this.getWizardGroup(item);

		if (group && group.children && this.isAllItemsHidden(group.children)) {
			group.hidden = true;
		}
	}

	/**
	 * This function returns true when all wizard items in wizard group are hidden
	 * else returns false.
	 *
	 * @param {IAccordionItem[]} child
	 * @returns {boolean}
	 */
	private isAllItemsHidden(child: IAccordionItem[]): boolean {
		let hiddenCount = 0;
		child.forEach((data) => {
			if (data.hidden === true) {
				hiddenCount = hiddenCount + 1;
			}
		});
		return hiddenCount === child.length ? true : false;
	}

	/**
	 * This Function implements the unpin operation when the item action button is clicked.
	 *
	 * @param {ISidebarWizardAccordionItem} item Accordion item clicked.
	 */
	private unPin(item: ISidebarWizardAccordionItem) {
		this.accordionData[0].children?.forEach((dataItem: ISidebarWizardAccordionItem, i: number) => {
			if (dataItem.w2GId && dataItem.w2GId === item.w2GId) {
				this.accordionData[0].children?.splice(i, 1);
			}
		});

		if (!this.accordionData[0].children?.length) {
			this.accordionData.shift();
		}

		const accordionGroup = this.getWizardGroup(item);
		accordionGroup.hidden = false;
		accordionGroup.children?.forEach((wizardItem: ISidebarWizardAccordionItem) => {
			if (item.w2GId === wizardItem.w2GId) {
				wizardItem.isPinned = false;
				wizardItem.hidden = false;
			}
		});
	}

	/**
	 * This Function returns the wizard group containing the wizard item.
	 *
	 * @param {ISidebarWizardAccordionItem} item wizard item
	 * @returns {ISidebarWizardAccordionItem} wizard group
	 */
	private getWizardGroup(item: ISidebarWizardAccordionItem): ISidebarWizardAccordionItem {
		const group = this.accordionData.find((data) => {
			return data.id === item.groupId;
		});
		if (group) {
			return group;
		}
		throw new Error('Item Group not found');
	}

	/**
	 * This function performs the search operation on the accordion list displayed.
	 *
	 * @param {string} data Search string.
	 */
	public search(data: string) {
		const searchString = data.toLowerCase();
		this.accordionData.forEach((data) => {
			let count = 0;
			data.children?.forEach((wizard: ISidebarWizardAccordionItem) => {
				const itemName = (wizard.title as string).toLowerCase();
				if (itemName.includes(searchString) && !wizard.isPinned) {
					wizard.hidden = false;
				} else {
					wizard.hidden = true;
					count = count + 1;
				}
			});
			data.hidden = count === data.children?.length ? true : false;
		});
	}
}
