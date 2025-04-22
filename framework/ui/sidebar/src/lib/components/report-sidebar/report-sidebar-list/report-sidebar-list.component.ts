/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import cloneDeep from 'lodash/cloneDeep';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';

import { UiSidebarReportSettingsService } from '../../../services/report/report-sidebar-settings.service';

import { AccordionItemAction, ConcreteMenuItem, IMenuItemsList, ItemType, UiCommonAccordionComponent } from '@libs/ui/common';

import { IReportLanguageData, IReportLanguageItems, PlatformReportLanguageItemService } from '@libs/platform/common';
import { ISidebarReportAccordionData } from '../../../model/interfaces/report/sidebar-report-accordion-data.interface';
import { DispatchId } from '../../../model/enums/dispatch-id.enum';
import { map, Observable } from 'rxjs';

/**
 * Class renders the report accordion list and handles the basic operations
 * like pin/unpin, search, expand/collapse etc.
 */
@Component({
	selector: 'ui-sidebar-report-list',
	templateUrl: './report-sidebar-list.component.html',
	styleUrls: ['./report-sidebar-list.component.scss'],
})
export class UiSidebarReportListComponent implements OnChanges, OnInit {

	/**
	 * Language service.
	 */
	public languageService = inject(PlatformReportLanguageItemService); 
	
	/**
	 * Report language toolbar data.
	 */
	@Input() public reportLanguageToolbar!: IReportLanguageData;

	/**
	 * Report accordion data.
	 */
	@Input() public reportAccordionData!: ISidebarReportAccordionData[];

	/**
	 * Search string data.
	 */
	public searchString!: string;

	/**
	 * Property to display overlay.
	 */
	public asyncInProgress: boolean = true;
	
	/**
	 * Property to display the toolbar.
	 */
	public toolbarData:IMenuItemsList ={};
	
	/**
	 * Initializes the menuList.
	 */
	public ngOnInit(): void {
		this.getConcreteMenuItems().subscribe((menuItems) => {
			this.toolbarData = {
				cssClass: 'tools',
				items: [
					{
						hideItem: false,
						list: {
							items: [
								{
									caption: {
										key: 'cloud.common.toolbarCollapseAll',
									},
									iconClass: 'tlb-icons ico-tree-collapse-all ',
									isDisplayed: true,
									type: ItemType.Item,
									fn: () => {
										this.accordionElement.closeAll();
									},
								},
								{
									caption: {
										key: 'cloud.common.toolbarExpandAll',
									},
									iconClass: 'tlb-icons ico-tree-expand-all ',
									isDisplayed: true,
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
					{
						hideItem: false,
						list: {
							showImages: false,
							showTitles: true,
							cssClass: 'dropdown-menu-right',
							items: menuItems
						},
						type: ItemType.ActionSelectBtn,
					}
				],
				showImages: true,
				showTitles: false,
				isVisible: true,
				activeValue: '',
				overflow: false,
				iconClass: '',
				layoutChangeable: false,
			};
		  });
	  }

	/**
	* To fetch languages
	*/
	private getConcreteMenuItems(): Observable<ConcreteMenuItem[]> {
		return this.languageService.getLanguageItems().pipe(
		  map((languageItems) =>
			languageItems.map((item) => this.mapToConcreteMenuItem(item))
		  )
		);
	  }
	
	  private mapToConcreteMenuItem(item: IReportLanguageItems): ConcreteMenuItem {
		return {
		  id: item.id.toString() ,
		  cssClass:item.cssClass,
		  iconClass:item.iconClass ,
		  caption:item.caption,
		  type:ItemType.Item,
		};
	}

	/**
	 * Action button for Pin.
	 */
	private readonly actionButtonForPin: AccordionItemAction = {
		id: 'pin',
		type: ItemType.Check,
		caption: 'pin',
		iconClass: 'control-icons ico-pin',
		execute: this.pin.bind(this),
	};

	/**
	 * Action button for unpin.
	 */
	private readonly actionButtonForUnPin: AccordionItemAction = {
		id: 'unpin',
		type: ItemType.Check,
		caption: 'unpin',
		iconClass: 'control-icons ico-close',
		execute: this.unPin.bind(this),
	};

	/**
	 * Pinned data schema
	 */
	private readonly pinnedGroup: ISidebarReportAccordionData = {
		id: 10000,
		title: 'Pinned',
		imgCss: 'btn control-icons ico-pin',
		children: [],
		expanded: true,
	};

	/**
	 * Overflow button.
	 */
	private readonly actionButtonforOverflow: AccordionItemAction = {
		caption: {
			key: 'cloud.common.viewerConfiguration',
			text: 'Viewer Configuration',
		},
		iconClass: 'tlb-icons ico-menu',
		id: 'overflowButton',
		isDisplayed: true,
		type: ItemType.OverflowBtn,
		hideItem: false,
		execute: this.onOverflowButtonClick.bind(this),
		list: {
			cssClass: ' dropdown-menu-right ',
			showImages: true,
			showTitles: true,
			items: [
				{
					caption: {
						text: 'PDF Print',
					},
					iconClass: 'block-image control-icons ico-print-pdf',
					hideItem: false,
					id: 't200',
					sort: 300,
					type: ItemType.Check,
					execute: (data: ISidebarReportAccordionData) => {
						this.selected.emit({
							dispatcherId: DispatchId.PdfPrint,
							report: data,
						});
					},
				},
				{
					caption: {
						text: 'Preview',
					},
					iconClass: 'block-image control-icons ico-print-preview',
					hideItem: false,
					id: 't200',
					sort: 300,
					type: ItemType.Check,
					execute: (data: ISidebarReportAccordionData) => {
						this.selected.emit({
							dispatcherId: DispatchId.Preview,
							report: data,
						});
					},
				},
			] as AccordionItemAction[],
		},
		groupId: 'overflow-btn-fixbutton',
	};

	/**
	 * Service manages the state for report sidebar.
	 */
	private readonly reportSidebarSettingsService = inject(UiSidebarReportSettingsService);

	/**
	 * Reference to accordion component.
	 */
	@ViewChild('accordion') private readonly accordionElement!: UiCommonAccordionComponent;

	/**
	 * Event emiiter to emit selected report.
	 */
	@Output() public selected = new EventEmitter();

	/**
	 * A callback method that is invoked immediately after the default change detector
	 * has checked data-bound properties if at least one has changed,
	 * and before the view and content children are checked.
	 *
	 * @param {SimpleChanges} change Input bound data.
	 */
	public ngOnChanges(change: SimpleChanges): void {
		if (change['reportAccordionData'].currentValue) {
			this.addActionButtonsToChildData();
			this.setExpandValues();
			this.asyncInProgress = false;
		}
	}

	/**
	 * Function sets the 'expanded' property value(true/false) for report groups.
	 */
	private setExpandValues(): void {
		const expandValues = this.reportSidebarSettingsService.getExpandState();

		this.reportAccordionData.forEach((data) => {
			data.disabled = false;

			if (expandValues.includes(+data.id)) {
				data.expanded = true;
			} else {
				data.expanded = false;
			}
		});
	}

	/**
	 * Method adds the action buttons(overflow,pin/unpin) to the accordion group items.
	 */
	private addActionButtonsToChildData(): void {
		const pinState = this.reportSidebarSettingsService.getPinState();
		const pinnedItems: ISidebarReportAccordionData[] = [];

		this.reportAccordionData.forEach((data) => {
			data.isSearch = false;
			data.hidden = false;

			data.children?.forEach((reportData) => {
				reportData.hidden = false;

				const pinItem = pinState?.find((item) => {
					return item.id === reportData.id && item.groupId === reportData.groupId;
				});

				if (pinItem) {
					pinnedItems.push(reportData);
				} else {
					reportData.actionButtons = [cloneDeep(this.actionButtonforOverflow), { ...this.actionButtonForPin }];
				}
			});
		});

		if (this.reportAccordionData[0].id !== 10000) {
			pinnedItems.forEach((item) => {
				this.pin(item);
			});
		} else {
			this.reportAccordionData.shift();

			pinnedItems.forEach((item) => {
				this.pin(item);
			});
		}
	}

	/**
	 * This Function implements the pin operation when the item action button is clicked.
	 *
	 * @param {ISidebarReportAccordionData} item Accordion item.
	 */
	private pin(item: ISidebarReportAccordionData): void {
		const group = this.getGroup(item);

		const index = group.children?.findIndex((report) => report.id === item.id);

		group.children?.splice(<number>index, 1);
		this.pinnedGroup.children?.push({ ...item, actionButtons: [cloneDeep(this.actionButtonforOverflow), { ...this.actionButtonForUnPin }] });

		if (this.pinnedGroup.children?.length === 1) {
			this.reportAccordionData.unshift(this.pinnedGroup);
		}

		if (!group.children?.length) {
			group.hidden = true;
		}

		if (this.searchString) {
			this.search(this.searchString);
		}

		const pinState = {
			id: item.id,
			groupId: item.groupId,
		};

		this.reportSidebarSettingsService.setPinState(pinState);
	}

	/**
	 * This Function implements the unpin operation when the item action button is clicked.
	 *
	 * @param {ISidebarReportAccordionData} item Accordion item.
	 */
	private unPin(item: ISidebarReportAccordionData): void {
		const index = this.reportAccordionData[0].children?.findIndex((report) => {
			return report.groupId === item.groupId && report.id === item.id;
		});

		this.reportAccordionData[0].children?.splice(<number>index, 1);

		const group = this.getGroup(item);

		group.children?.push({ ...item, actionButtons: [cloneDeep(this.actionButtonforOverflow), { ...this.actionButtonForPin }] });
		group.hidden = false;

		group.children?.sort((child1, child2) => <number>child1.sort - <number>child2.sort);

		if (!this.reportAccordionData[0].children?.length) {
			this.reportAccordionData.shift();
		}

		if (this.searchString) {
			this.search(this.searchString);
		}

		this.reportSidebarSettingsService.deletePinState(item.id, item.groupId);
	}

	/**
	 * Function returns the group of the item.
	 *
	 * @param {ISidebarReportAccordionData} item Accordion item.
	 * @returns {ISidebarReportAccordionData} Item group
	 */
	private getGroup(item: ISidebarReportAccordionData): ISidebarReportAccordionData {
		const group = this.reportAccordionData.find((data) => {
			return data.id === item.groupId;
		});

		return <ISidebarReportAccordionData>group;
	}

	/**
	 * Method gets called on overflow button click.
	 *
	 * @param {ISidebarReportAccordionData} item Accordion item.
	 */
	private onOverflowButtonClick(item: ISidebarReportAccordionData): void {
		console.log(item);
	}

	/**
	 * This function performs the search operation on the accordion list displayed.
	 *
	 * @param {string} data Search string.
	 */
	public search(data: string): void {
		const searchString = data.toLowerCase();

		this.reportAccordionData.forEach((data) => {
			data.isSearch = searchString.length ? true : false;
			let count = 0;

			data.children?.forEach((report: ISidebarReportAccordionData) => {
				const itemName = (report.title as string).toLowerCase();

				if (itemName.includes(searchString)) {
					report.hidden = false;
				} else {
					report.hidden = true;
					count = count + 1;
				}
			});

			data.hidden = count === data.children?.length ? true : false;

			if (!data.hidden && searchString.length) {
				data.expanded = true;
				data.disabled = true;
			}
		});

		if (!searchString.length) {
			this.setExpandValues();
		}
	}

	/**
	 * Method emits the selected item.
	 *
	 * @param {ISidebarReportAccordionData} data  Selected item.
	 */
	public onSelected(data: ISidebarReportAccordionData): void {
		if (!data.hasChild) {
			this.selected.emit({ dispatcherId: 'preview', report: data });
		}
	}

	/**
	 * Method gets called when panel is opened.
	 *
	 * @param {ISidebarReportAccordionData} item  Selected item.
	 */
	public onPanelOpened(item: ISidebarReportAccordionData): void {
		if (!item.isSearch) {
			item.expanded = true;
			this.reportSidebarSettingsService.setExpandState(+item.id);
		}
	}

	/**
	 * Method gets called when panel is closed.
	 *
	 * @param {ISidebarReportAccordionData} item  Selected item.
	 */
	public onPanelClosed(item: ISidebarReportAccordionData): void {
		if (!item.isSearch) {
			item.expanded = false;
			this.reportSidebarSettingsService.deleteExpandState(+item.id);
		}
	}
}
