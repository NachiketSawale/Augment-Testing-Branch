/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { afterNextRender, AfterViewInit, Component, DestroyRef, inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ClientAreaBaseComponent } from '@libs/ui/main-frame';
import { ContainerModuleInfoBase } from '../../model/container-module-info-base.class';
import { ContainerDefinition } from '../../model/container-definition.class';
import { IModuleTab } from '../../model/tab/module-tab.interface';
import { Router } from '@angular/router';
import { IContainerLayout } from '../../model/layout/container-layout.interface';
import { IModuleTabView } from '../../model/tab/module-tab-view.interface';
import { INavigationBarControls, InitializationContext, PlatformConfigurationService, PlatformModuleNavigationService, PlatformSearchAccessService, PlatformPinningContextService, LoadingPhaseNotifierService } from '@libs/platform/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModuleLayoutService } from '../../services/module-layout.service';
import { ModuleNavBarService } from '../../services/nav-bar.service';
import { IMenuItemsList, LookupStaticProviderService, LOOKUP_STORAGE_TOKEN, ILookupStorage } from '@libs/ui/common';
import { NavBarIdentifier } from '../../model/nav-bar/nav-bar-identifier';
import { LayoutManager } from '../../model/layout/layout-manager.class';
import { UiContainerSystemModuleTabBarComponent } from '../module-tab-bar/module-tab-bar.component';
import { ILayoutManager } from '../../model/layout/layout-manager.interface';

@Component({
	selector: 'ui-container-system-module-client-area',
	templateUrl: './module-client-area.component.html',
	styleUrls: ['./module-client-area.component.scss'],
})
export class UiContainerSystemModuleClientAreaComponent extends ClientAreaBaseComponent implements OnInit, AfterViewInit {
	private readonly router = inject(Router);
	private readonly injector = inject(Injector);
	private readonly destroyRef = inject(DestroyRef);
	private readonly layoutService = inject(ModuleLayoutService);
	private readonly navBarService = inject(ModuleNavBarService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly platformSearchAccessService = inject(PlatformSearchAccessService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly platformPinningContextService = inject(PlatformPinningContextService);
	private readonly lookupProviderService = inject(LookupStaticProviderService);
	private readonly loadingPhaseNotifierService = inject(LoadingPhaseNotifierService);


	private layoutManager!: ILayoutManager;

	public activeTabId!: number;
	public activeTab!: IModuleTab;
	public tabs: IModuleTab[] = [];
	public navBar!: IMenuItemsList;
	private moduleHasUnsavedData: boolean = false;


	/**
	 * Default Constructor.
	 */
	public constructor() {
		super();

		afterNextRender(() => {
			this.tabbarCtrl.layoutHelper = this.layoutManager;
		});
	}

	/**
	 * Current module information.
	 */
	public get currentModule() {
		return this.moduleInfo as ContainerModuleInfoBase;
	}

	/**
	 * Current module's container definitions.
	 */
	public get containers(): ContainerDefinition[] {
		return this.currentModule.effectiveContainers;
	}

	/**
	 * Represent the activated view in current tab.
	 */
	public get activeTabView(): IModuleTabView {
		return this.activeTab.activeView as IModuleTabView;
	}

	/**
	 * Represent the current layout.
	 */
	public get containerLayout(): IContainerLayout {
		return this.activeTabView.Config as IContainerLayout;
	}

	@ViewChild(UiContainerSystemModuleTabBarComponent)
	public tabbarCtrl!: UiContainerSystemModuleTabBarComponent;

	/**
	 * Life cycle hook to trigger component initialize.
	 */
	public override ngOnInit(): void {
		super.ngOnInit();
		this.initialize();
		this.loadingPhaseNotifierService.notifyModuleNavigationComplete();
		this.currentModule.getMainEntityAccess(this.injector)?.entitiesModifiedInfo$.subscribe(() => {
			if (!this.moduleHasUnsavedData) {
				this.setModuleHasUnsavedData(true);
				this.setUnloadHandler();
			}
		});
	}

	private setUnloadHandler() {
		const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = true;
		};
		if (this.moduleHasUnsavedData) {
			window.onbeforeunload = beforeUnloadHandler;
		} else {
			window.onbeforeunload = null;
		}
	}

	private setModuleHasUnsavedData(isUnsaved: boolean) {
		this.moduleHasUnsavedData = true;
		const saveItem = this.navBarService.getById(NavBarIdentifier.id.save);
		if (saveItem) {
			saveItem.svgImage = isUnsaved ? 'ico-save2' : 'ico-save';
		}
	}

	/**
	 * Initialize module tab information.
	 */
	private initialize() {
		this.activatedRoute.data.subscribe(data => {
			this.tabs = data['moduleTabs'] as IModuleTab[];
			this.activeTabId = Number(data['activeTabId']);
			this.checkNavigation();
		});

		this.layoutManager = new LayoutManager({
			moduleInfo: this.currentModule,
			tabs: this.tabs,
			layoutApi: this.layoutService,
			permissionRoleId: this.configService.permissionRoleId,
			isPortal: this.configService.isPortal
		});

		this.navBarService.changed.pipe(
			takeUntilDestroyed(this.destroyRef)
		).subscribe(() => {
			this.setNavBar();
		});

		this.destroyRef.onDestroy(() => {
			this.navBarService.clearMenuItems();
		});

		this.setActiveTabById(this.activeTabId);
		this.setNavBar();

		this.lookupProviderService.configure([
			{
				provide: LOOKUP_STORAGE_TOKEN,
				useValue: <ILookupStorage>{
					getViewData: async uuid => {
						// TODO - get lookup view data, blocked by https://rib-40.atlassian.net/browse/DEV-17942
						return null;
					},
					setViewData: async (uuid, data) => {
						// TODO - set lookup view data, blocked by https://rib-40.atlassian.net/browse/DEV-17942
					},
				},
			}
		]);
	}

	private checkNavigation() {
		const navInfo = this.platformModuleNavigationService.navigationPayload;
		if (navInfo && this.currentModule.internalModuleName == navInfo.internalModuleName) {
			const entityAccess = this.currentModule.getMainEntityAccess(this.injector);
			const searchPayLoad = this.platformSearchAccessService.currentSearchPayload();

			let identificationData = typeof navInfo.entityIdentifications === 'function' ? navInfo.entityIdentifications(new InitializationContext(this.injector)) : navInfo.entityIdentifications;
			if (identificationData === undefined) {
				identificationData = [];
			}
			const pKeys: number[] = [];
			identificationData?.forEach((e) => {
				if (e.pKey1) {
					pKeys.push(e.pKey1);
				}
			});
			searchPayLoad.pKeys = pKeys;

			const pinningContext = typeof navInfo.getPinningContext === 'function' ? navInfo.getPinningContext() : false;
			if (pinningContext) {
				searchPayLoad.pinningContext = this.platformPinningContextService.addPinningContext(pinningContext);
			} else {
				searchPayLoad.pinningContext = this.platformPinningContextService.addPinningContext([{Token: navInfo.internalModuleName, Id: pKeys[0], Info: ''}]);
			}
			entityAccess?.sidebarSearchSupport?.executeSidebarSearch(searchPayLoad);
		}
	}

	/**
	 * Initialize nav bar and bind event handler.
	 */
	private setNavBar() {
		this.navBar = this.navBarService.getCurrent();
		const entityAccess = this.currentModule.getMainEntityAccess(this.injector);
		if (entityAccess && entityAccess.navBarCommands) {
			this.bindNavBarEventHandler(entityAccess.navBarCommands);
		} else {
			this.hideEntityBasedMenuItems();
		}
	}

	private hideEntityBasedMenuItems() {
		this.navBar.items?.forEach(item => {
			if (item.groupId === NavBarIdentifier.group.entityBased) {
				item.hideItem = true;
			}
		});
	}

	private bindNavBarEventHandler(commands: INavigationBarControls) {
		this.navBarService.setHandler(NavBarIdentifier.id.save, () => {
			commands.save().then(() => {
				this.setModuleHasUnsavedData(false);
				this.moduleHasUnsavedData = false;
				this.setUnloadHandler();
			});
		}, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.prev, commands.goToPrevious, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.next, commands.goToNext, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.refreshSelection, commands.refreshSelected, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.refresh, commands.refreshAll, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.first, commands.goToFirst, commands);
		this.navBarService.setHandler(NavBarIdentifier.id.last, commands.goToLast, commands);
	}

	private setActiveTabById(tabId: number) {
		const activeTab = this.tabs.find(tab => tab.Id === tabId);
		if (activeTab) {
			this.setActiveTab(activeTab);
		}
	}

	private setActiveTab(tab: IModuleTab) {
		this.activeTab = tab;
		this.layoutManager.setActiveTab(tab.Id);
	}

	/**
	 * Handle tab changed
	 * @param tabId
	 */
	public tabChanged(tabId: number) {
		const paths = this.moduleInfo.internalModuleName.split('.').concat(tabId.toString());
		this.router.navigate(paths).then(() => {
			this.setActiveTabById(tabId);
		});
	}

	/**
	 * Handle layout changed.
	 * @param layout
	 */
	public layoutChanged(layout: IContainerLayout) {
		this.layoutManager.updateLayout(layout);
	}

	/**
	 * Apply the selected view to current.
	 * @param id
	 */
	public viewChanged(id: number) {
		const view = this.layoutManager.getViewById(id);
		this.layoutManager.changeView(view);
	}

	/**
	 * Navigate to desktop.
	 */
	public goToDesktop() {
		this.router.navigate(['app/main']);
	}

	/**
	 * Apply layout from manager dialog
	 * @param layout
	 */
	public applyLayout(layout: IContainerLayout) {
		this.layoutManager.applyLayout(layout);
	}

	public ngAfterViewInit(): void {
		this.loadingPhaseNotifierService.notifyModuleLoadingComplete();
	}
}
