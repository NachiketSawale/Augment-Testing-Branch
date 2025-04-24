/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnInit, inject } from '@angular/core';
import { PlatformLazyInjectorService, PlatformTranslateService } from '@libs/platform/common';
import { IAccordionItem, IMenuItemsList, ItemType } from '@libs/ui/common';
import { IWorkflowSidebarService, WORKFLOW_SIDEBAR_SERVICE, WorkflowSidebarSwitch, WorkflowTemplate } from '@libs/workflow/interfaces';
import { IWorkflowGroupOtions, WorkflowGroupOptionsSettingsService } from '../../services/workflow/workflowSettings/workflow-group-options-settings.service';
import { IWorkflowSortOptions, WorkflowSortOptionsSettingsService } from '../../services/workflow/workflowSettings/workflow-sort-options-settings.service';

@Component({
	selector: 'ui-sidebar-workflow-sidebar-tab',
	templateUrl: './workflow-sidebar-tab.component.html',
	styleUrls: ['./workflow-sidebar-tab.component.scss'],
})
export class UiSidebarWorkflowSidebarTabComponent implements OnInit {

	/**
	 * Enum for the different workflow sidebar views
	 */
	public readonly workflowSidebarSwitchEnum = WorkflowSidebarSwitch;

	/**
	 * Formatted template items displayed in sidebar.
	 */
	public templateAccordionData: IAccordionItem[] = [];

	/**
	 * toggle for setting button
	 */
	public isBtnClicked: boolean = false;

	/**
	 * Service for group setting lookup.
	 */
	public groupSettingService = inject(WorkflowGroupOptionsSettingsService);

	/**
	 * Service for sort setting lookup.
	 */
	public sortSettingService = inject(WorkflowSortOptionsSettingsService);

	/**
	 * Current Group configuration.
	 */
	public groupSetting!: IWorkflowGroupOtions;

	/**
	 * Current sort configuration.
	 */
	public sortSetting!: IWorkflowSortOptions;

	/**
	 * Flag to indicate whether or not workflow templates be grouped.
	 */
	public isGrouped: boolean = false;

	private readonly translate = inject(PlatformTranslateService);


	/**
	 * Toolbar data for the component.
	 */
	public toolbarData: IMenuItemsList<void> = {
		items: [
			//Refresh
			{
				caption: { key: 'cloud.desktop.taskList.refresh' },
				iconClass: 'tlb-icons ico-refresh',
				type: ItemType.Item,
				fn: () => this.refreshTemplates()
			},
			//Search
			{
				caption: { key: 'cloud.desktop.filterdefFooterBtnSearch' },
				iconClass: this.searchIcon,
				type: ItemType.Item,
				fn: () => this.triggerSearch()
			},
			//Grouping
			{
				caption: { key: 'cloud.desktop.taskList.settings' },
				iconClass: 'tlb-icons ico-settings',
				type: ItemType.Item,
				fn: () => {
					this.isBtnClicked = !this.isBtnClicked;
				}
			},
			//Debug
			{
				caption: { key: 'cloud.desktop.taskList.pin' },
				iconClass: 'control-icons ico-pin3',
				type: ItemType.Item,
				fn: () => this.workflowSidebarService.setCaseForView(this.workflowSidebarSwitchEnum.EntityPinView)
			}
		],
		cssClass: 'tools'
	};

	/**
	 * Search string for filtering templates.
	 */
	public searchString: string = '';

	/**
	 * Flag indicating if async operation is in progress.
	 */
	public asyncInProgress: boolean = false;

	/**
	 * Flag indicating if search input is visible.
	 */
	public isSearchVisible: boolean = false;

	/**
	 * workflow sidebar service
	 */
	public workflowSidebarService!: IWorkflowSidebarService;

	/**
	 * Current selected workflow
	 */
	public selectedWorkflow!: IAccordionItem;

	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private loadedWorkflowTemplates: WorkflowTemplate[] = [];
	public filteredWorkflowTemplates: WorkflowTemplate[] = [];
	private reloadToolbar() {
		this.toolbarData = { ...this.toolbarData };
	}

	protected triggerSearch(): void {
		this.isSearchVisible = !this.isSearchVisible;
		this.reloadToolbar();
	}

	protected get searchIcon(): string {
		return this.isSearchVisible ? 'tlb-icons ico-search active' : 'tlb-icons ico-search';
	}

	/**
	 * Initializes the component.
	 */
	public async ngOnInit(): Promise<void> {
		this.workflowSidebarService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_SERVICE);
		// default value for group setting lookup.
		this.groupSetting = this.groupSettingService.getItems()[0];
		// default value for sort setting lookup.
		this.sortSetting = this.sortSettingService.getItems()[0];
		await this.refreshTemplates();
	}

	/**
	 * Loads templates based on the current module.
	 * @param workflowSidebarService
	 */
	public async refreshTemplates() {
		this.asyncInProgress = true;
		this.loadedWorkflowTemplates = await this.workflowSidebarService.getTemplates();
		this.filter();
	}

	/**
	 * Filters workflow templates based on input string.
	 */
	public filter() {
		this.filteredWorkflowTemplates = this.loadedWorkflowTemplates;
		if (this.searchString.trim() !== '') {
			this.filteredWorkflowTemplates = this.loadedWorkflowTemplates.filter(template => template.Description && template.Description.includes(this.searchString));
		}
		this.processData();
		this.asyncInProgress = false;
	}

	/**
	 * Function to prepare workflow template in accordion format.
	 */
	protected processData() {
		this.templateAccordionData = [];
		if (this.filteredWorkflowTemplates) {
			this.filteredWorkflowTemplates = this.sortTemplate();
			if (!this.isGrouped) {
				this.filteredWorkflowTemplates.forEach(workflowTemplate => {
					const mainItemId: IAccordionItem = {
						id: workflowTemplate.Id,
						title: workflowTemplate.Description
					};
					this.templateAccordionData.push(mainItemId);
				});
			} else {
				this.templateAccordionData.push(
					...this.groupTemplates(this.groupSetting)
				);
			}

		}
	}

	public onSelected(item: IAccordionItem) {
		this.selectedWorkflow = item;
		this.workflowSidebarService.setWorkflowItemList(this.templateAccordionData);
		this.workflowSidebarService.setCaseForView(this.workflowSidebarSwitchEnum.WorkflowDetailView);
	}

	public viewState() {
		if (this.workflowSidebarService) {
			return this.workflowSidebarService.getCaseForView;
		}
		return this.workflowSidebarSwitchEnum.DefaultView;
	}

	/**
	 * Grouping of workflow template in an accordion.
	 * @returns
	 */
	public groupSettingChanged(): void {
		if (this.groupSetting) {
			this.isGrouped = this.groupSetting.headerValue != '' ? true : false;
			this.processData();

		} else {
			return;
		}
	}

	/**
	 * prepares the accordion data based on grouping attribute.
	 * @param groupSetting
	 * @returns
	 */
	private groupTemplates(groupSetting: IWorkflowGroupOtions): IAccordionItem[] {
		const groupItems: { [key: string]: IAccordionItem[] } = {};
		const key = groupSetting as unknown as string;
		//here conversion of new value from "group setting lookup" into a "property of workflow template" takes place.
		const _groupKey = key as keyof WorkflowTemplate;
		this.filteredWorkflowTemplates.forEach((template) => {
			let groupBy = template[_groupKey] as string;
			// Below condition occurres for properties "Owner", "Entity" and "KeyUser"
			//when their value is either null or ''.
			if (groupBy === null || groupBy === '') {
				groupBy = this.groupTemplateTitle(_groupKey);

			}
			if (!groupItems[groupBy]) {
				groupItems[groupBy] = [];
			}
			groupItems[groupBy].push({
				id: template.Id,
				title: template.Description
			});
		});

		return Object.keys(groupItems).map(key => ({
			id: `${groupSetting}-${key}`,
			title: `${key} (${groupItems[key].length})`,
			hidden: false,
			expanded: true,
			children: groupItems[key]
		}));
	}

	/**
	 * returns the group title for accordion.
	 * @param _groupKey
	 * @returns
	 */
	private groupTemplateTitle(_groupKey: string): string {
		let groupTitle: string = '';
		switch (_groupKey) {
			case 'Entity':
				groupTitle = 'cloud.desktop.sidebar.workflow.groupDefinition.noEntity';
				break;
			case 'Owner':
				groupTitle = 'cloud.desktop.sidebar.workflow.groupDefinition.noOwner';
				break;
			case 'KeyUser':
				groupTitle = 'cloud.desktop.sidebar.workflow.groupDefinition.noKeyUser';
				break;
			default:
				groupTitle = '';
				break;
		}
		groupTitle = this.translate.instant(groupTitle).text;
		return groupTitle;
	}

	/**
	 * prepares the accordion data based on sorting attribute.
	 * @returns
	 */
	public sortTemplate(): WorkflowTemplate[] {
		if (!this.sortSetting || this.sortSetting.value === 'NoSorting') {
			return this.filteredWorkflowTemplates;
		}
		const sortKey = this.sortSetting.property as unknown as keyof WorkflowTemplate;
		this.filteredWorkflowTemplates.sort((a, b) => {
			const prevTemplate = a[sortKey];
			const nextTemplate = b[sortKey];
			if (prevTemplate && nextTemplate && prevTemplate < nextTemplate) {
				return -1;
			}
			if (prevTemplate && nextTemplate && prevTemplate > nextTemplate) {
				return 1;
			}
			return 0;
		});

		if (this.sortSetting.desc) {
			this.filteredWorkflowTemplates.reverse();
		}

		return this.filteredWorkflowTemplates;
	}

	/**
	 * Sorting of templates in an accordion.
	 * @returns
	 */
	public sortSettingChanged(): void {
		if (this.sortSetting) {
			console.log(this.filteredWorkflowTemplates);
			const sortValue = this.sortSetting as unknown as string;
			this.sortSetting = this.sortSettingService.getItems().find(data => data.value === sortValue)!;
			this.processData();
		}
	}

	//Tool bar functions
	//TODO: Add grouping and sorting function
	//TODO: Another view for pinning
	//TODO: Add another view for detail view

}