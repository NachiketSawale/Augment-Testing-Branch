/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { AccordionItemAction, IAccordionItem, IMenuItemsList, IMenuTabParam, ItemType } from '@libs/ui/common';
import { SidebarNotificationService } from '../../services/notification/sidebar-notification.service';
import { INotificationGroupSetting, NotificationGroupSettingService } from '../../services/notification/notification-setting/notification-group-setting.service';
import { INotificationSortSetting, NotificationSortSettingService } from '../../services/notification/notification-setting/notification-sort-setting.service';
import { ISidebarNotificationEntity } from '../../model/interfaces/notifications/sidebar-notification-entity.interface';
import { NotificationItemsComponent } from './notification-items/notification-items/notification-items.component';
import { PlatformTranslateService } from '@libs/platform/common';
@Component({
	selector: 'ui-sidebar-notification',
	templateUrl: './sidebar-notification.component.html',
	styleUrls: ['./sidebar-notification.component.scss'],
})

/**
 * Notification Panel.
 */
export class UiSidebarNotificationComponent {

	/**
	 * Notification group setting lookup service.
	 */
	public groupSettingService = inject(NotificationGroupSettingService);

	/**
	 * Notification sort setting lookup service.
	 */
	public sortSettingService = inject(NotificationSortSettingService);

	/**
	 * Stores the current group setting details.
	 */
	public groupSetting!: INotificationGroupSetting;

	/**
	 * Stores the current sort setting details.
	 */
	public sortSetting!: INotificationSortSetting;

	/**
	 * Flag indicating whether or not notifications shall be grouped.
	 */
	private isGrouped!: boolean;

	/**
	 * Stores the current tab details.
	 */
	private currentTab!: IMenuTabParam;

	/**
	 * Stores accordion notification list.
	 */
	public notificationList: IAccordionItem[] = [];

	/**
	 * Toggles the setting button in toolbar.
	 */
	public isSettingBtnClicked: boolean = false;

	/**
	 * Flag indicating if unseen notifications are available or not.
	 */
	public isUnseenNotificationAvailable: boolean = false;

	private readonly currentTabKey = 'currentNotificationTab';

	private readonly currentNtfGroupKey = 'currentNotificationGroup';

	private readonly currentNtfSortKey = 'currentNotificationSort';
	/**
	 * Translation for notification tab titles.
	 */
	private translate = inject(PlatformTranslateService);

	private actionButtonForPin: AccordionItemAction[] = [
		{
			id: 'remove',
			type: ItemType.Check,
			caption: 'Remove',
			iconClass: 'control-icons ico-close',
			execute: this.removeNotification.bind(this, false)
		},
	];

	/**
	 * Contains the menu tab items for notification panel.
	 */
	public notificationTabs: IMenuTabParam[] = [
		{
			id: 1,
			title: 'cloud.desktop.notification.menuTabs.all',
			isActive: false
		},
		{
			id: 2,
			title: 'cloud.desktop.notification.menuTabs.report',
			isActive: false
		},
		{
			id: 3,
			title: 'cloud.desktop.notification.menuTabs.workflow',
			isActive: false
		},
		{
			id: 4,
			title: 'cloud.desktop.notification.menuTabs.import',
			isActive: false
		},
		{
			id: 5,
			title: 'cloud.desktop.notification.menuTabs.schedular',
			isActive: false
		}
	];

	/**
	 * Contains the toolbar buttons information.
	 */
	public readonly toolbarItems: IMenuItemsList<void> = {
		items: [
			{
				caption: { key: 'cloud.desktop.taskList.refresh' },
				iconClass: 'tlb-icons ico-delete2',
				type: ItemType.Item,
				fn: () => {
					this.removeNotification(true);
				}
			},
			{
				caption: { key: 'cloud.common.gridlayout' },
				iconClass: 'tlb-icons ico-settings',
				type: ItemType.Item,
				fn: () => {
					this.isSettingBtnClicked = !this.isSettingBtnClicked;
				}
			},
			{
				caption: { key: 'cloud.desktop.taskList.refresh' },
				iconClass: 'tlb-icons ico-refresh',
				type: ItemType.Item,
				fn: () => { }
			},
		],
		cssClass: 'tools'
	};

	private allNotifications: ISidebarNotificationEntity[] = [];

	public constructor(private notificationService: SidebarNotificationService) {
		this.initialize();
	}

	private async initialize(): Promise<void> {
		await Promise.all([
			this.getAllNotifications(),
			this.RetrieveUnseenNotifications()
		]);
		this.prepareDefaultConfig();
	}

	/**
	 * prepare the default configuration needed for notification panel.
	 */
	private prepareDefaultConfig(): void {
		const storedGroupSetting = localStorage.getItem(this.currentNtfGroupKey);
		const storedSortSetting = localStorage.getItem(this.currentNtfSortKey);
		this.groupSetting = storedGroupSetting ? JSON.parse(storedGroupSetting) as INotificationGroupSetting : this.groupSettingService.getItems()[0];
		this.sortSetting = storedSortSetting ? JSON.parse(storedSortSetting) as INotificationSortSetting : this.sortSettingService.getItems()[0];
		this.isGrouped = false;
		this.currentTab = this.getCurrentTabDetails();
		this.currentTab.isActive = true;
		//Load Accordion Data based on Default settings.
		const filterNotifications = this.filterNotifications();
		if (filterNotifications && filterNotifications.length > 0) {
			this.processAccordionData();
		}
	}

	private async getAllNotifications(): Promise<void> {
		this.allNotifications = await this.notificationService.getNotificationsList();
	}

	/**
	 * Filters notification list based on currently selected tab.
	 * If the current tab is "workflow", then only the notifications belonging to this tab
	 * shall be loaded.
	 * @returns
	 */
	private filterNotifications(): ISidebarNotificationEntity[] | undefined {
		let filteredNotifications: ISidebarNotificationEntity[] = [];
		if (this.currentTab && this.allNotifications.length > 0) {
			const translatedNotificationType = this.translate.instant(this.currentTab.title).text;
			filteredNotifications = this.allNotifications.filter(notification => notification.NotificationType === translatedNotificationType || translatedNotificationType === 'All');
		}
		return filteredNotifications;
	}

	/**
	 * Get unseen notifications.
	 */
	private async RetrieveUnseenNotifications(): Promise<void> {
		const unseenNotifications = await this.notificationService.getUnseenNotifications();

		if (unseenNotifications.length > 0) {
			//when isUnseenNotificationAvailable is true, "New" keyword will be added next to notification name.
			this.isUnseenNotificationAvailable = true;
			await this.updateNotificationViewCount(unseenNotifications.map(n => n.Id));
		} else {
			this.isUnseenNotificationAvailable = false;
		}
	}

	/**
	 * Function to make notifications as seen.
	 * @param notificationIds : Ids of unseen notifications.
	 */
	private async updateNotificationViewCount(notificationIds: number[]): Promise<void> {
		const result = await this.notificationService.updateNotificationViewState(notificationIds);
		if (result) {
			await this.getAllNotifications();
		}
	}

	/**
	 * Provides current tab details.
	 * @returns
	 */
	private getCurrentTabDetails(): IMenuTabParam {
		const savedTab = localStorage.getItem(this.currentTabKey);
		if (savedTab) {
			this.currentTab = JSON.parse(savedTab);
			this.notificationTabs.forEach(tab => tab.isActive = tab.id === this.currentTab.id);
			return this.currentTab;
		} else {
			return this.notificationTabs[0];
		}
	}

	/**
	 * Provides the notifications upon change in active notification tab.
	 * @param newTabDetail
	 */
	public async getActiveTab(newTabDetail: IMenuTabParam) {
		localStorage.setItem(this.currentTabKey, JSON.stringify(newTabDetail));
		//update currentTab and change "isActive" status.
		this.currentTab = newTabDetail;
		const filteredNotifications = this.filterNotifications();
		this.notificationList = [];
		if (filteredNotifications && filteredNotifications.length > 0) {
			this.processAccordionData();
		}
	}

	/**
	 * Processess notification list into an accordion.
	 * @returns
	 */
	private processAccordionData(): void {
		const filteredNotifications = this.filterNotifications();
		if (filteredNotifications && filteredNotifications.length > 0) {
			const sortedNotifications = this.sortNotificationsByProperty(filteredNotifications);
			if (!this.isGrouped) {
				sortedNotifications.forEach(item => {
					const mainItemData: IAccordionItem = {
						id: item.Id,
						actionButtons: this.actionButtonForPin,
						component: NotificationItemsComponent,
						providers: [{ provide: 'currentNotification', useValue: item },
						{ provide: 'unseenNotification', useValue: this.isUnseenNotificationAvailable }
						]
					};
					this.notificationList.push(mainItemData);
				});
			} else {
				this.notificationList.push(
					...this.groupNotificationsByProperty(sortedNotifications, this.groupSetting)
				);
			}
		} else {
			return;
		}

	}

	/**
	 * Grouping of notification list based on group value from group setting lookup.
	 * @param allNotifications :all filtered notifications based on current menu tab.
	 * @param groupKey : currently stored group setting value.
	 * @returns
	 */
	private groupNotificationsByProperty(allNotifications: ISidebarNotificationEntity[], groupKey: INotificationGroupSetting): IAccordionItem[] {
		const groupItems: { [key: string]: IAccordionItem[] } = {};
		const _groupKey = groupKey.value as keyof ISidebarNotificationEntity;
		allNotifications.forEach((notification) => {
			let groupBy = notification[_groupKey] as string;
			if (_groupKey === 'Started') {
				groupBy = groupBy.split('T')[0];
			}
			if (!groupItems[groupBy]) {
				groupItems[groupBy] = [];
			}
			groupItems[groupBy].push({
				id: notification.Id,
				actionButtons: this.actionButtonForPin,
				component: NotificationItemsComponent,
				providers: [{ provide: 'currentNotification', useValue: notification },
				{ provide: 'unseenNotification', useValue: this.isUnseenNotificationAvailable }
				]
			});
		});

		return Object.keys(groupItems).map(key => ({
			id: `${groupKey}-${key}`,
			title: `${key} (${groupItems[key].length})`,
			hidden: false,
			expanded: true,
			children: groupItems[key]
		}));
	}
	/**
	 * Sorting of notification list based on sort setting value from sort setting lookup.
	 * @param notifications : all filtered notifications based on current menu tab.
	 * @returns
	 */
	private sortNotificationsByProperty(notifications: ISidebarNotificationEntity[]): ISidebarNotificationEntity[] {
		if (this.sortSetting.property === '') {

			return notifications;
		}
		const sortKey = this.sortSetting.property as keyof ISidebarNotificationEntity;
		notifications.sort((a, b) => {
			const aValue = a[sortKey];
			const bValue = b[sortKey];
			if (aValue && bValue && aValue < bValue) {
				return -1;
			}
			if (aValue && bValue && aValue > bValue) {
				return 1;
			}
			return 0;
		});

		if (this.sortSetting.desc) {
			notifications.reverse();
		}

		return notifications;
	}

	/**
	 * Change in any value of group setting lookup triggers this function.
	 * @returns
	 */
	public groupSettingChanged(): void {
		if (this.groupSetting) {
			this.groupSetting = this.groupSettingService.getItems().find(group => group.value === this.groupSetting as unknown as string)!;
			localStorage.setItem(this.currentNtfGroupKey, JSON.stringify(this.groupSetting));
			this.isGrouped = this.groupSetting.value != 'noGrouping' ? true : false;
			this.notificationList = [];
			this.processAccordionData();

		} else {
			return;
		}
	}

	/**
	 * Change in any value of sort setting lookup triggers this function.
	 * @returns
	 */
	public sortSettingChanged(): void {
		if (this.sortSetting) {
			//Note :-selected sort object is retrieved from getItems() again because "ui-common-lookup-input"
			// provides only the "value" property on change event of any sort setting.
			this.sortSetting = this.sortSettingService.getItems().find(sort => sort.value === this.sortSetting as unknown as string)!;
			localStorage.setItem(this.currentNtfSortKey, JSON.stringify(this.sortSetting));
			this.notificationList = [];
			this.processAccordionData();
		} else {
			return;
		}

	}

	/**
	 * Removes a  single or multiple notifications.
	 * @param isDeleteAll : When true, the function call is made from toolbar delete button,
	 * else, the function call is made from cancel button in accordion.
	 * @param item : current notification item in an accordion.
	 */
	private removeNotification(isDeleteAll: boolean, item?: IAccordionItem): void {
		const idsToDelete: number[] = [];
		if (isDeleteAll) {
			this.allNotifications.forEach((notification) => {
				idsToDelete.push(notification.Id);
			});
		} else {
			idsToDelete.push(item?.id as number);
		}
		this.notificationService.removeNotifications(idsToDelete).then(async result => {
			if (result) {
				await this.getAllNotifications();
				this.notificationList = [];
				this.processAccordionData();

			}
		});
	}
}
