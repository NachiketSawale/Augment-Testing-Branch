/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlatformConfigurationService, PlatformPermissionService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, FieldType, IGridConfiguration, IYesNoDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonInputDialogService, UiCommonMessageBoxService } from '@libs/ui/common';

import { IModuleTabView } from '../../model/tab/module-tab-view.interface';
import { IModuleTab } from '../../model/tab/module-tab.interface';
import { UiContainerSystemLayoutEditorComponent } from '../layout-editor/layout-editor.component';
import { ContainerDefinition } from '../../model/container-definition.class';
import { IContainerLayout } from '../../model/layout/container-layout.interface';
import { UiContainerSystemLayoutEditorContext } from '../../model/layout-editor-context';
import * as _ from 'lodash';
import { ILayoutExportItem } from '../../model/layout-export-item.interface';
import { getLayoutExporterDialogDataToken, UiContainerSystemLayoutExporterComponent } from '../layout-exporter/layout-exporter.component';
import { IContainerLayoutUpdater } from '../../model/layout/layout-manager.interface';
import { getLayoutSaverDialogDataToken, getLayoutSaverDialogHelperToken, ISelections, UiContainerSystemLayoutSaverComponent } from '../layout-saver/layout-saver.component';

/**
 * To render module tabs.
 */

@Component({
	selector: 'ui-container-system-module-tab-bar',
	templateUrl: './module-tab-bar.component.html',
	styleUrls: ['./module-tab-bar.component.scss'],
})
export class UiContainerSystemModuleTabBarComponent implements OnInit, AfterViewInit, OnDestroy {

	private configService = inject(PlatformConfigurationService);
	private readonly permissionService = inject(PlatformPermissionService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
	private readonly zone: NgZone = inject(NgZone);
	private resizeObserver!: ResizeObserver;
	private tabReverse!: IModuleTab[];
	private routeDataSubscription: Subscription;
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private activeTab: IModuleTab|undefined;

	@Input()
	public tabs!: IModuleTab[];
	@Input()
	public activeTabId!: number;

	public overflowAnchorHidden = true;

	public get hiddenTab(): IModuleTab[] {
		return this.tabs.filter(x => x.hidden === true);
	}

	@Output()
	public tabChanged = new EventEmitter<number>();

	@Output()
	public viewChange = new EventEmitter<number>();

	@Input()
	public containers: ContainerDefinition[] = [];

	@Input()
	public layout!: IContainerLayout;

	@Output()
	public layoutChange = new EventEmitter<IContainerLayout>();

	private dialogService = inject(UiCommonDialogService);
	private inputDialogService = inject(UiCommonInputDialogService);

	@Output()
	public tabClosed = new EventEmitter();

	@ViewChild('tabsUI')
	private tabsElement!: ElementRef<HTMLElement>;
	@ViewChildren('tabUI')
	private tabElements!: QueryList<ElementRef<HTMLElement>>;

	@ViewChild('fileUpload')
	private uploadElement!: ElementRef<HTMLElement>;

	/**
	 * Represents an updater of the layout.
	 */
	public layoutHelper!: IContainerLayoutUpdater;

	public constructor(public http: HttpClient, activatedRoute: ActivatedRoute) {
		this.routeDataSubscription = activatedRoute.data.subscribe((data) => {
			this.activeTabId = parseInt(data['activeTabId']);
			this.activeTab = this.getTab(this.activeTabId);
		});
		this.translate.load(['platform.common', 'cloud.common', 'cloud.desktop', 'login', 'basics.common']).then();
	}

	private sortComparer(a: IModuleTabView, b: IModuleTabView) {
		let result: number;
		const x = a.Description ? a.Description.toLowerCase() : '';
		const y = b.Description ? b.Description.toLowerCase() : '';
		if (!x || x === '') {
			result = 1;
		} else if (!y || y === '') {
			result = -1;
		} else {
			if (_.isString(x) && _.isString(y)) {
				result = x.localeCompare(y);
			} else {
				result = (x === y ? 0 : (x > y ? 1 : -1));
			}
		}
		return result;
	}

	private groupViews(tab: IModuleTab) {
		const views = _.sortBy(tab.Views, 'Issystem');
		const latest = views.find((v) => {
			return v.Description === null;
		});

		if (latest) {
			latest.hidden = true;
		}

		if (latest && latest.ModuleTabViewOriginFk) {

			views.forEach(
				view => {
					if (view.Id === latest.ModuleTabViewOriginFk) {
						view.css = 'selected';
					} else {
						view.css = undefined;
					}
				}
			);
		}

		const groups = _.groupBy(views, (view) => {
			return view.Issystem ? 'System' : view.IsPortal ? 'Portal' : view.FrmAccessroleFk !== null ? 'Role' : 'User';
		});
		tab.grouped = [];
		_.mapValues(groups, (val, key) => {
			switch (key) {
				case 'System':
					tab.grouped[0] = val;
					break;
				case 'Role':
					tab.grouped[1] = val;
					break;
				case 'User':
					tab.grouped[2] = val;
					break;
				case 'Portal':
					tab.grouped[3] = val;
					break;
			}
		});
		if (tab.grouped[0]) {
			tab.grouped[0] = tab.grouped[0].sort(this.sortComparer);
		}
		if (tab.grouped[1]) {
			tab.grouped[1] = tab.grouped[1].sort(this.sortComparer);
		}
		if (tab.grouped[2]) {
			tab.grouped[2] = tab.grouped[2].sort(this.sortComparer);
		}
		if (tab.grouped[3]) {
			tab.grouped[3] = tab.grouped[3].sort(this.sortComparer);
		}
	}

	private getChildrenWidth() {
		let childrenWidth = 0;

		this.tabs.forEach(x => {
			if (!x.hidden) {
				childrenWidth += x.width ?? 0;
			}
		});
		return childrenWidth + 28 /* anchor width */;
	}

	private setTabsWidth() {
		this.getChildren(this.tabElements, false).forEach((x) => {
			const tab = this.tabs.find((y) => {
				return y.Id.toString() === x.nativeElement.id.replace('tab_', '');
			});
			if (tab) {
				const tabWidth = x.nativeElement.getBoundingClientRect().width;
				if (tabWidth) {
					tab.width = tabWidth;
				}
			}
		});
	}

	private getChildren(parent: QueryList<ElementRef<HTMLElement>>, isHidden: boolean) {
		return parent.filter((x) => {
			return x.nativeElement.hidden === isHidden;
		});
	}

	private getTab(tabId: number){
		if(!this.tabs){
			return undefined;
		}
		return this.tabs.find(x=> {
			return x.Id === tabId;
		});
	}

	private getParentWidth() {
		return this.tabsElement.nativeElement.getBoundingClientRect().width - 66;
	}

	private toggleAnchor() {
		const hiddenTab = this.tabReverse.find((tab) => {
			return tab.hidden === true;
		});
		this.overflowAnchorHidden = !hiddenTab;
	}

	private beSmaller() {
		this.tabReverse.forEach((tab) => {
			if (this.getParentWidth() > this.getChildrenWidth()) {
				return;
			}
			if (tab.Id !== this.activeTabId) {
				tab.hidden = true;
			}
		});
	}

	private beGreater() {
		this.tabs.forEach((tab) => {
			if (this.getParentWidth() > (this.getChildrenWidth() + this.getFirstHiddenTabWidth())) {
				if (this.getParentWidth() > this.getChildrenWidth()) {
					tab.hidden = false;
				}
			}
		});
	}

	private getFirstHiddenTabWidth() {
		const firstHiddenTab = this.tabs.find((x) => {
			return x.hidden === true;
		});
		if (firstHiddenTab) {
			return firstHiddenTab.width ?? 0;
		}
		return 0;
	}

	/**
	 * change the tabs layout when UI resize
	 * @private
	 */
	private resize() {
		if (this.getParentWidth() < this.getChildrenWidth()) {
			this.beSmaller();
		} else {
			this.beGreater();
		}
		this.toggleAnchor();
	}

	/**
	 * return the default functions.
	 */
	public defaultFunctions = [
		{
			css: 'layout-dropdown-save',
			description: 'platform.layoutsystem.save',
			enabled: () => {
				return !this.configService.isPortal;
			},
			execute: () => {
				this.goToSaveView();
			}
		},
		{
			css: 'layout-dropdown-edit',
			description: 'platform.layoutsystem.edit',
			enabled: () => {
				return !this.configService.isPortal && this.permissionService.hasExecute('a1013e0c2c12480c9292deaed7cb11dd');
			},
			execute: () => {
				this.goToEditView();
			}
		},
		{
			css: 'layout-dropdown-export',
			description: 'platform.layoutsystem.export',
			enabled: () => {
				!this.configService.isPortal && this.permissionService.hasExecute('b92e1f10594d4e7daa2cba19be14d5aa');
			},
			execute: () => {
				this.goToExportView();
			}
		},
		{
			css: 'layout-dropdown-import',
			description: 'platform.layoutsystem.import',
			enabled: () => {
				return !this.configService.isPortal && this.permissionService.hasExecute('b92e1f10594d4e7daa2cba19be14d5aa');
			},
			execute: () => {
				this.uploadElement.nativeElement.click();
			}
		}];

	private goToSaveView() {
		const tab = this.getTab(this.activeTabId);
		this.dialogService.show({
			width: '800px',
			headerText: 'platform.layoutsystem.save',
			buttons: [
				{
					id: 'ok',
					autoClose: true,
					isDisabled: (info) => {
						return info.dialog.body.disableOkay();
					},
					fn: (event, info) => {
						const [view, scope] = info.dialog.body.getView();
						if (view) {
							this.layoutHelper.saveView(view, scope).then((result)=>{
								if (this.activeTab){
									this.groupViews(this.activeTab);
								}
							});
						}
					}
				},
				{id: 'cancel', caption: {key: 'ui.common.dialog.cancelBtn'}},
			],
			customButtons: [
				{
					id: 'delete', autoClose: false, caption: {key: 'ui.common.dialog.deleteBtn'},
					isDisabled: (info) => {
						return info.dialog.body.disableDelete();
					},
					fn: (event, info) => {
						info.dialog.body.delete();
						if(this.activeTab){
							this.groupViews(this.activeTab);
						}
					}
				},
				{
					id: 'default',
					caption: {key: 'ui.common.dialog.defaultButton'},
					isDisabled: (info) => {
						return info.dialog.body.disableDefault();
					},
					autoClose: false,
					fn: (event, info) => {
						info.dialog.body.default();
					}
				},
				{
					id: 'rename', autoClose: false, caption: {key: 'basics.common.button.rename'},
					isDisabled: (info) => {
						return info.dialog.body.disableRename();
					},
					fn: (event, info) => {
						const body = info.dialog.body;
						// TODO: missing label and validation.
						this.inputDialogService.showInputDialog({
							headerText: 'basics.common.button.rename',
							topDescription: 'cloud.common.layout.renameDescription',
							//labelText: 'cloud.common.layout.savename',
							pattern: '^[0-9a-zA-Z \\-_]*$',
							value: body.selections?.inputView?.Description ?? ''
						})?.then((result) => {

							if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
								const newName = result.value;

								if (newName === body.selections?.inputView?.Description) {
									// No changes in view name
									return;
								}
								body.renameView(newName);
							}
						});
					}
				},
			],
			bodyComponent: UiContainerSystemLayoutSaverComponent,
			bodyProviders: [{
				provide: getLayoutSaverDialogDataToken(),
				useValue: tab
			}, {provide: getLayoutSaverDialogHelperToken(), useValue: this.layoutHelper}],
			value: {} as ISelections
		});
	}

	/**
	 * Used to open the edit view popup.
	 */
	private goToEditView() {
		const layout = _.cloneDeep(this.layout);
		const context = new UiContainerSystemLayoutEditorContext(this.containers, layout);

		this.dialogService.show({
			width: 'max',
			height: 'max',
			headerText: 'cloud.desktop.layoutDialogHeader',
			bodyComponent: UiContainerSystemLayoutEditorComponent,
			bodyProviders: [
				{
					provide: UiContainerSystemLayoutEditorContext,
					useValue: context
				}
			],
			buttons: [
				{
					id: 'ok',
					caption: {
						text: 'OK',
						key: 'cloud.common.ok'
					}
				},
				{
					id: 'cancel',
					caption: {
						text: 'Cancel',
						key: 'cloud.common.cancel'
					}
				}
			],
			defaultButtonId: 'cancel'
		})?.then(e => {
			if (e.closingButtonId === 'ok') {
				this.layoutChange.emit(context.applyLayout());
			}
		});
	}

	/**
	 * Used to open the export view popup.
	 * @private
	 */
	private goToExportView() {

		// TODO: grouping and editor config
		const columns: ColumnDef<ILayoutExportItem>[] = [{
			id: 'export',
			model: 'export',
			type: FieldType.Boolean,
			sortable: false,
			label: {
				text: 'Selected',
				key: 'cloud.desktop.layoutExport.selected'
			},
			width: 70,
			visible: true,
		},
			{
				id: 'layoutType',
				model: 'type',
				type: FieldType.Description,
				sortable: false,
				label: {
					text: 'type',
					key: 'cloud.desktop.layoutExport.type'
				},
				width: 100,
				visible: true,
			},
			{
				id: 'layoutName',
				model: 'description',
				type: FieldType.Description,
				sortable: true,
				label: {
					text: 'Name',
					key: 'cloud.desktop.layoutExport.name'
				},
				width: 270,
				visible: true,
			}
		];
		const views: ILayoutExportItem[] = [];
		const tab = this.getTab(this.activeTabId);
		if (tab) {
			tab.grouped.forEach((x, index) => {
				x.forEach(y => {
					views.push({
						Id: y.Id,
						export: false,
						type: this.translate.instant(this.getHeader(index)).text,
						description: y.Description ?? '',
					});
				});
			});
		}
		const gridConfig: IGridConfiguration<ILayoutExportItem> = {
			uuid: '7e8ad1eaa60a445fbee56db30f2fc66d',
			columns: columns,
			items: views
		};

		// TODO: replace with gird-dialogService if possible
		this.dialogService.show({
			width: '635px',
			height: '600px',
			resizeable: true,
			headerText: 'platform.layoutsystem.exportDialogHeader',
			bodyComponent: UiContainerSystemLayoutExporterComponent,
			bodyProviders: [
				{
					provide: getLayoutExporterDialogDataToken(),
					useValue: gridConfig
				}
			],
			value: gridConfig.items,
			buttons: [
				{
					id: 'ok',
					caption: {
						text: 'Export',
						key: 'cloud.desktop.navBarExportDesc'
					}
				},
				{
					id: 'cancel',
					caption: {
						text: 'Cancel',
						key: 'cloud.common.cancel'
					}
				}
			],
			defaultButtonId: 'cancel'
		})?.then(e => {
			if (e.closingButtonId === 'ok') {
				this.layoutHelper.exportLayouts(e.value ?? [], this.activeTabId);
			}
		});
	}

	public importFile(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files as FileList;

		if (files[0].name.indexOf('.lsv') === -1) {
			throw new Error('Wrong file type.');
		}
		const reader: FileReader = new FileReader();
		reader.readAsText(files[0]);
		reader.onloadend = (evt: ProgressEvent<FileReader>) => {
			const resultData = evt.target?.result;
			this.openImportViewModalDialog(resultData as string | ArrayBuffer).then();
		};
	}

	public async openImportViewModalDialog(fileReaderData: string | ArrayBuffer) {

		const options: IYesNoDialogOptions = {
			defaultButtonId: 'no',
			id: 'YesNoModal',
			dontShowAgain: false,
			showCancelButton: false,
			headerText: 'platform.importLayoutHeader',
			bodyText: 'platform.overwriteExisting'

		};
		const result = await this.messageBoxService.showYesNoDialog(options);

		if (result?.closingButtonId === 'yes') {
			this.layoutHelper.importLayouts(this.activeTabId, fileReaderData).then(() => {
				document.location.reload();
			});
		}

	}


	public ngOnInit(): void {
		this.activeTab = this.getTab(this.activeTabId);
		this.tabs.forEach(x => this.groupViews(x));
		this.tabReverse = [...this.tabs].reverse();
		// observe the component resize event.
		this.resizeObserver = new ResizeObserver(() => {
			this.zone.run(() => {
				this.resize();
			});
		});
		this.resizeObserver.observe(this.element);
	}

	public ngAfterViewInit() {
		// set the tabs width after view init.
		this.setTabsWidth();
		// resize manually after view init.
		setTimeout(() => this.resize());
	}

	public ngOnDestroy(): void {
		this.routeDataSubscription.unsubscribe();
		this.resizeObserver.unobserve(this.element);
	}

	public changeTab(id: number) {
		if (this.activeTabId === id) {
			return;
		}
		this.tabs.forEach(x => {
			x.hidden = false;
		});
		this.activeTabId = id;
		this.tabChanged.emit(id);
		// resize manually after change tab, because active tab should show on tabbar.
		this.resize();
	}

	public changeView(id: number) {
		this.viewChange.emit(id);
	}

	public closeTab() {
		this.tabClosed.emit();
	}

	public userViewsVisible(views: IModuleTabView[]) {
		if (!views) {
			return false;
		}
		const res = (views.length === 1 && views[views.length - 1].hidden);

		return !res;
	}

	public getHeader(type: number) {
		let result = '!Header Not Defined';
		switch (type) {
			case 0:
				result = 'platform.layoutsystem.systemviews';
				break;
			case 1:
				result = 'platform.layoutsystem.roleviews';
				break;
			case 2:
				result = 'platform.layoutsystem.userviews';
				break;
			case 3:
				result = 'platform.layoutsystem.portalviews';
				break;
		}
		return result;
	}

	/**
	 *
	 * @param tab
	 */
	public getTitle(tab: IModuleTab): string {
		return tab.Description ? tab.Description : '';
	}

	public isViewSelected(viewId:number){
		return this.activeTab?.activeView?.ModuleTabViewOriginFk === viewId ? 'selected' : '';
	}

	public trackById(index: number, item: IModuleTab) {
		return item.Id;
	}

}
