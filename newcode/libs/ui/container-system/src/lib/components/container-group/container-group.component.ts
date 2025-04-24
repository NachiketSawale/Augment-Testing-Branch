/*
 * Copyright(c) RIB Software GmbH
 */

import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Injector,
	Input, Output,
	StaticProvider,
	Type,
	ViewEncapsulation
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
	PlatformLazyInjectorService,
	PlatformPermissionService, Translatable
} from '@libs/platform/common';

import {
	IInfoOverlay,
	IMenuItem,
	IMenuItemsList,
	IMenuList,
	IModuleNavigationManager,
	IModuleNavigator,
	InsertPosition,
	IResizeArgs,
	IResizeMessenger,
	MenuListContent,
	ModuleNavigatorIdentification,
	ToolbarWrapper,
	UiModuleNavigationHelperService
} from '@libs/ui/common';

import { IContainerUiAddOns } from '../../model/container-ui-add-ons.interface';

import { ContainerDefinition } from '../../model/container-definition.class';
import { IContainerInitializationContext } from '../../model/container-initialization-context.interface';

import { ContainerInjectionInfo } from '../../model/container-injection-info.model';
import { ContainerBaseComponent } from '../container-base/container-base.component';
import { UiContainerSystemAccessDeniedContainerComponent } from '../access-denied-container/access-denied-container.component';
import { DelayedContainerComponent } from '../delayed-container/delayed-container.component';
import { ContainerInitializationContext } from '../../model/container-initialization-context.class';
import { ILayoutSplitter } from '../../model/container-pane.model';
import { LOADING_ERRORS_TOKEN, LoadingErrorsContainerComponent } from '../loading-errors-container/loading-errors-container.component';
import { PlaceholderContainerComponent } from '../placeholder-container/placeholder-container.component';

/**
 * Checks whether a given container type value is a function that returns a promise that gets resolved to the actual container type.
 * @param containerType The value to check.
 */
function isDelayedContainerFunc(containerType: Type<ContainerBaseComponent> | ((context: IContainerInitializationContext) => Promise<Type<ContainerBaseComponent>>)): containerType is (context: IContainerInitializationContext) => Promise<Type<ContainerBaseComponent>> {
	return !(containerType.prototype instanceof ContainerBaseComponent);
}

/**
 * Stores the data used by a component outlet to render the container component.
 * Instances of this class contain the loaded, ready-for-use data, no placeholders or
 * injection tokens.
 */
interface IMutableContainerInitData {

	containerType?: Type<ContainerBaseComponent>;

	localInjector?: Injector;
}

type IContainerInitData = Readonly<Required<IMutableContainerInitData>>;

/**
 * Describes the state of a container loader.
 */
enum ContainerLoaderState {

	/**
	 * The container data has not been loaded, but could be provided immediately.
	 */
	NotLoaded,

	/**
	 * The container data has not been loaded, and requires a loading phase once requested.
	 */
	LoadingRequired,

	/**
	 * The container data has not been loaded, but the loading phase has begun and loading is in progress.
	 * A wait message may be displayed to the user.
	 */
	LoadingInProgress,

	/**
	 * The container data has been loaded and the container can be displayed.
	 */
	Loaded
}

/**
 * This class is responsible for loading a container component and any data
 * or objects related to it based on a {@link ContainerDefinition} object.
 * The output of a `ContainerLoader` is a {@link IContainerInitData} instance.
 */
class ContainerLoader {

	/**
	 * Initializes a new instance.
	 * @param containerDef The container definition to load.
	 * @param permissionService The permission service.
	 */
	public constructor(
		public readonly containerDef: ContainerDefinition,
		private readonly permissionService: PlatformPermissionService
	) {
		let hasLazyLoadedContent = false;

		const ct = containerDef.containerType;
		if (isDelayedContainerFunc(ct)) {
			hasLazyLoadedContent = true;
			this.delayedContainerFunc = (context: IContainerInitializationContext) => Promise.resolve(ct(context));
		} else {
			this.delayedContainerFunc = () => Promise.resolve(ct);
		}

		const p = containerDef.providers;
		if (p) {
			if (Array.isArray(p)) {
				this.delayedProvidersFunc = () => Promise.resolve(p);
			} else {
				hasLazyLoadedContent = true;
				this.delayedProvidersFunc = (context: IContainerInitializationContext) => Promise.resolve(p(context));
			}
		} else {
			this.delayedProvidersFunc = () => Promise.resolve([]);
		}

		const loadPermissions = containerDef.loadPermissions;
		if (loadPermissions) {
			if (Array.isArray(loadPermissions) || typeof loadPermissions === 'string') {
				this.delayedPermissionsFunc = () => Promise.resolve(loadPermissions);
			} else {
				hasLazyLoadedContent = true;
				this.delayedPermissionsFunc = (context: IContainerInitializationContext) => Promise.resolve(loadPermissions(context));
			}
		} else {
			this.delayedPermissionsFunc = () => Promise.resolve([]);
		}

		this.state = hasLazyLoadedContent ? ContainerLoaderState.LoadingRequired : ContainerLoaderState.NotLoaded;
	}

	private state: ContainerLoaderState;

	private readonly delayedContainerFunc: (context: IContainerInitializationContext) => Promise<Type<ContainerBaseComponent>>;

	private readonly delayedProvidersFunc: (context: IContainerInitializationContext) => Promise<StaticProvider[]>;

	private readonly delayedPermissionsFunc: (context: IContainerInitializationContext) => Promise<string | string[]>;

	private loadingErrors: string[] = [];

	private saveLoadingError(error: unknown) {
		if (error !== undefined && error !== null) {
			if (typeof error === 'string') {
				this.loadingErrors.push(error);
			} else if (Array.isArray(error)) {
				for (const item of error) {
					this.saveLoadingError(item);
				}
			} else if (error && typeof error === 'object') {
				if ('message' in error) {
					this.saveLoadingError(error.message);
				} else {
					this.loadingErrors.push(error + '');
				}
			} else {
				this.loadingErrors.push(error + '');
			}
		}
	}

	/**
	 * Triggers the loading process.
	 * @param context The context to use for the initialization.
	 * @param updateFunc This function is called whenever a container is ready
	 *   for display. This might happen multiple times due to intermediate
	 *   placeholder containers.
	 */
	public async loadAsync(context: IContainerInitializationContext, updateFunc: (initData: IContainerInitData) => void): Promise<void> {
		if (this.isAborted) {
			return;
		}

		if (this.containerDef.isUnknownContainerPlaceholder) {
			updateFunc({
				containerType: PlaceholderContainerComponent,
				localInjector: context.injector
			});
			return;
		}

		this.loadingErrors = [];

		const hasRead = this.permissionService.hasRead(this.containerDef.permission);

		if (!hasRead) {
			updateFunc(this.generateAccessDeniedContainerInitData(context));
			return;
		}

		switch (this.state) {
			case ContainerLoaderState.NotLoaded:
				await this.doLoad(context, updateFunc);
				break;
			case ContainerLoaderState.LoadingRequired:
				updateFunc(this.generateDelayedContainerInitData(context));
				await this.doLoad(context, updateFunc);
				break;
			case ContainerLoaderState.LoadingInProgress:
			case ContainerLoaderState.Loaded:
				break;
		}
	}

	private async doLoad(context: IContainerInitializationContext, updateFunc: (initData: IContainerInitData) => void): Promise<void> {
		this.state = ContainerLoaderState.LoadingInProgress;
		const initData = await this.loadDataAsync(context);
		this.state = ContainerLoaderState.Loaded;

		if (this.isAborted) {
			return;
		}

		updateFunc(initData);
	}

	private async loadDataAsync(context: IContainerInitializationContext): Promise<IContainerInitData> {
		this.state = ContainerLoaderState.LoadingInProgress;

		const initData: IMutableContainerInitData = {};

		await Promise.all([
			this.loadContainerTypeAsync(context, initData),
			this.loadProvidersAsync(context, initData),
			this.loadPermissionsAsync(context)
		]);

		if (this.loadingErrors.length > 0) {
			return this.generateLoadingErrorContainerInitData(context);
		}

		return initData as IContainerInitData;
	}

	private async loadContainerTypeAsync(context: IContainerInitializationContext, dest: IMutableContainerInitData): Promise<void> {
		try {
			dest.containerType = await this.delayedContainerFunc(context);
		} catch (error) {
			this.saveLoadingError(error);
		}
	}

	private async loadProvidersAsync(context: IContainerInitializationContext, dest: IMutableContainerInitData): Promise<void> {
		try {
			const providers = await this.delayedProvidersFunc(context);
			dest.localInjector = Injector.create({
				providers,
				parent: context.injector
			});
		} catch (error) {
			this.saveLoadingError(error);
		}
	}

	private async loadPermissionsAsync(context: IContainerInitializationContext): Promise<void> {
		try {
			let permissions = await this.delayedPermissionsFunc(context);

			if (typeof permissions === 'string') {
				permissions = [permissions];
			}

			if (permissions.length > 0) {
				await this.permissionService.loadPermissions(permissions.map(p => p.toLowerCase()));
			}
		} catch (error) {
			this.saveLoadingError(error);
		}
	}

	/**
	 * Generates initialization data for a standard placeholder container that can be
	 * displayed while a container is getting loaded.
	 * @param context The initialization context used for containers.
	 */
	private generateDelayedContainerInitData(context: IContainerInitializationContext): IContainerInitData {
		return {
			containerType: DelayedContainerComponent,
			localInjector: context.injector
		};
	}

	private generateAccessDeniedContainerInitData(context: IContainerInitializationContext): IContainerInitData {
		return {
			containerType: UiContainerSystemAccessDeniedContainerComponent,
			localInjector: context.injector
		};
	}

	private generateLoadingErrorContainerInitData(context: IContainerInitializationContext): IContainerInitData {
		const injector = Injector.create({
			parent: context.injector,
			providers: [{
				provide: LOADING_ERRORS_TOKEN,
				useValue: this.loadingErrors
			}]
		});

		return {
			containerType: LoadingErrorsContainerComponent,
			localInjector: injector
		};
	}

	private isAborted: boolean = false;

	/**
	 * Aborts the loading process and marks the loader as aborted. The loader will not
	 * cause any changes to the linked container group.
	 */
	public abort() {
		this.isAborted = true;
	}
}

/**
 * Stores information about a container based on its definition and handles the lazy loading of
 * the container component, if necessary.
 */
class ContainerInfo {
	public constructor(public readonly containerDef: ContainerDefinition) {
	}

	public createLoader(permissionService: PlatformPermissionService): ContainerLoader {
		return new ContainerLoader(this.containerDef, permissionService);
	}
}

/**
 * The parent of one or more containers shown in one place.
 *
 * The container group is a component that hosts one or more containers, one of which will be active at any moment.
 * If there is more than one container, a tab bar can be used to switch between the containers.
 *
 * ## Responsibilities
 *
 * The container group hosts the standard elements of a container (such as the title bar, the toolbar, and the status bar), and instantiates the container-specific content.
 * Anything that happens in the client area of the container is up to the container content component to decide.
 *
 * The container group allows the active container component to access the standard elements.
 * This happens by providing a custom implementation of the {@link IUiContainerAddOns} interface.
 * That custom implementation directly accesses elements like the toolbar or the status bar of the surrounding container group component instance.
 */
@Component({
	selector: 'ui-container-system-container-group',
	templateUrl: './container-group.component.html',
	styleUrls: ['./container-group.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContainerGroupComponent {
	/**
	 *  All container related toolbar items list.
	 */
	public toolsList!: IMenuItemsList[];

	/**
	 * Subscription of container Toolbar list .
	 */
	private toolbarDataSubscription$!: Subscription;

	/**
	 * Instantiate container group component with dependencies
	 */
	public constructor() {
		this._uiAddOns = this.initializeUiAddOns(this);
		this._localInjector = Injector.create({
			providers: [
				{
					provide: ContainerInjectionInfo.uiAddOnsInjectionToken,
					useValue: this._uiAddOns,
				},
				{
					provide: ContainerInjectionInfo.containerDefInjectionToken,
					useFactory: () => this.activeContainer,
				},
			],
			parent: this.injector,
		});
	}

	/**
	 * provides injector
	 */
	private readonly injector = inject(Injector);

	/**
	 * The lazy injector service.
	 */
	private readonly lazyInjectorSvc = inject(PlatformLazyInjectorService);

	/**
	 * injection for changeDetector
	 */
	private readonly cdr = inject(ChangeDetectorRef);

	/**
	 * injection for permission service
	 */
	public readonly permissionService = inject(PlatformPermissionService);

	private readonly uiModuleNavigationHelperService = inject(UiModuleNavigationHelperService);

	// Passed this as parameter to that to resolve es lint error aliasing of 'this' to local variable.
	private initializeUiAddOns(that: ContainerGroupComponent): IContainerUiAddOns {
		return {
			get busyOverlay(): IInfoOverlay {
				return {
					info: '',
					visible: false,
					showInfo(info: Translatable): void {
					}, // TODO: implement busy overlay
				};
			},
			get statusBar() {
				return {
					addItems(newItems: IMenuItem | IMenuItem[], groupId?: string) {
					}, // TODO: implement status bar DEV-16988
					addItemsAtId(newItems: IMenuItem | IMenuItem[], itemId: string, position?: InsertPosition): boolean {
						return false;
					},
					deleteItems(itemIds: string | string[]): boolean {
						return false;
					},
					clear: () => {
					},
					setVisibility: (isVisible: boolean) => {
					},
					isVisible: false // TODO: properly implement as getter/setter in DEV-16988
				};
			},
			get toolbar(): IMenuList {
				return that.toolbarContent;
			},
			get whiteboard(): IInfoOverlay {
				return {
					info: '',
					visible: false,
					showInfo(info: Translatable): void {
					}, // TODO: implement info overlay
				};
			},
			get resizeMessenger(): IResizeMessenger {
				return {
					register(handler: (args: IResizeArgs) => void) {
						if (that.resizeMessenger) {
							that.resizeMessenger.register(handler);
						} else {
							console.warn('resize messenger not found!');
						}
					},
					unregister(handler: (args: IResizeArgs) => void) {
						if (that.resizeMessenger) {
							that.resizeMessenger.unregister(handler);
						} else {
							console.warn('resize messenger not found!');
						}
					}
				};
			},
			get navigation(): IModuleNavigationManager {
				return {
					addNavigator(navigator: IModuleNavigator) {
						that.uiModuleNavigationHelperService.createAndAdd(navigator, that._uiAddOns.toolbar);
					},
					removeNavigator(navigator: ModuleNavigatorIdentification) {
						that.uiModuleNavigationHelperService.remove(that._uiAddOns.toolbar, navigator);
					},
					removeAllNavigator() {
						that.uiModuleNavigationHelperService.remove(that._uiAddOns.toolbar);
					}
				};
			}
			// TODO: implement getters to return objects referencing parts of 'that'
		};
	}

	@Output()
	public activeContainerInitDataChange = new EventEmitter();

	private _activeContainerInitData?: IContainerInitData;

	public get activeContainerInitData(): IContainerInitData | undefined {
		return this._activeContainerInitData;
	}

	private updateActiveContainerInitData(value?: IContainerInitData) {
		if (this._activeContainerInitData !== value) {
			this._activeContainerInitData = value;
			this.activeContainerInitDataChange.emit(value);
			this.cdr.detectChanges();
		}
	}

	private readonly _localInjector: Injector;

	private readonly _uiAddOns: IContainerUiAddOns;

	private _containers?: ContainerInfo[];

	private _resizeMessenger?: IResizeMessenger;

	private isDifferentContainerList(cnt: ContainerDefinition[] | undefined): boolean {
		if (!cnt && !this._containers) {
			return false;
		}

		if (!cnt || !this._containers) {
			return true;
		}

		if (this._containers.length !== cnt.length) {
			return true;
		}

		for (let idx = cnt.length - 1; idx >= 0; idx--) {
			if (cnt[idx].uuid !== this._containers[idx].containerDef.uuid) {
				return true;
			}
		}

		return false;
	}

	/**
	 * create a toolbar base class instance.
	 * @returns {ToolbarWrapper} The toolbar base class instance
	 */
	public get toolbarInstance(): ToolbarWrapper {
		const activeContainer = this.activeContainer;
		let activeToolbarInstance = this._toolbarInstance;
		if (activeToolbarInstance && activeContainer && activeToolbarInstance.containerUuid === activeContainer.uuid) {
			return activeToolbarInstance;
		}
		if (activeContainer && !activeToolbarInstance) {
			this._toolbarInstance = activeToolbarInstance = new ToolbarWrapper(activeContainer.uuid);
			return activeToolbarInstance;
		}
		throw new Error('activeContainer is null');
	}

	private _toolbarInstance!: ToolbarWrapper;

	/**
	 * A resize changed messenger.
	 */
	@Input()
	public set resizeMessenger(messenger: IResizeMessenger | undefined) {
		this._resizeMessenger = messenger;
	}

	/**
	 * Retrieves the resize messenger.
	 */
	public get resizeMessenger(): IResizeMessenger | undefined {
		return this._resizeMessenger;
	}

	/**
	 * Assigns a list of containers to show in the group.
	 * @param cnt The containers.
	 */
	@Input()
	public set containers(cnt: ContainerDefinition[] | undefined) {
		if (this.isDifferentContainerList(cnt)) {
			this._containers = cnt?.map((c) => new ContainerInfo(c));
			this.activeContainerIndex = this._containers?.length ?? 0 > 0 ? 0 : -1;
		}
	}

	/**
	 * Returns the current list of containers shown in the group.
	 */
	public get containers(): ContainerDefinition[] | undefined {
		return this._containers?.map((c) => c.containerDef);
	}

	/**
	 * Returns the definition object of the active container.
	 */
	public get activeContainer(): ContainerDefinition | null {
		return this.activeContainerInfo?.containerDef ?? null;
	}

	private get activeContainerInfo(): ContainerInfo | null {
		return this._activeContainerIndex >= 0 && this._containers ? this._containers[this._activeContainerIndex] : null;
	}

	/**
	 * Indicates whether there is any container active in the group.
	 */
	public get isContainerActive(): boolean {
		return Boolean(this._activeContainerInitData);
	}

	/**
	 * Indicates whether the tab bar should be shown (which is the case as soon as there is
	 * more than one container in the group).
	 */
	public get showTabs(): boolean {
		if (typeof this.containers === 'object') {
			return this.containers.length > 1;
		} else {
			return false;
		}
	}

	private _containerLoader?: ContainerLoader;

	private _activeContainerIndex = 0;

	public get activeContainerIndex(): number {
		return this._activeContainerIndex;
	}

	@Input()
	public set activeContainerIndex(value: number) {
		this.updateActiveContainerInitData(undefined);
		this._containerLoader?.abort();
		this._containerLoader = undefined;

		this.toolbarContent.clear();

		if (value >= 0 && value < (this._containers?.length ?? 0)) {
			this._activeContainerIndex = value;

			this._containerLoader = this.activeContainerInfo?.createLoader(this.permissionService);
			if (!this._containerLoader) {
				throw new Error(`No container info found for container ${this._activeContainerIndex}.`);
			}

			const initCtx = new ContainerInitializationContext(this._localInjector, this._containerLoader.containerDef.uuid);
			this._containerLoader.loadAsync(initCtx, initData => this.updateActiveContainerInitData(initData));
		} else {
			this._activeContainerIndex = -1;
		}
	}

	@Output()
	public activeContainerIndexChange = new EventEmitter<number>();

	/**
	 * Update active container index from user interface.
	 * @param value
	 */
	public updateActiveContainerIndex(value: number) {
		this.activeContainerIndex = value;
		this.activeContainerIndexChange.emit(value);
	}

	private readonly toolbarContent = new MenuListContent();

	/**
	 * Provides a reference to the current content of the toolbar.
	 */
	public get currentTools(): IMenuItemsList | undefined {
		this.sortToolbarItems(this.toolbarContent.items);
		return this.toolbarContent.items;
	}

	/**
	 * Shows or hides the toolbar based on the current uiaddon configuration.
	 * @default true Always shows the toolbar by default
	 */
	public get isToolbarVisible(): boolean {
		return this.toolbarContent.isVisible !== undefined ? this.toolbarContent.isVisible : true;
	}

	private sortToolbarItems(targetList?: IMenuItemsList<void>) {
		if (targetList && targetList.items) {
			targetList.items.sort((item1, item2) => {
				if (item1.sort === undefined) {
					return 1;
				}

				if (item2.sort === undefined) {
					return -1;
				}

				return item1.sort - item2.sort;
			});
		}
	}

	/**
	 * Panel name
	 */
	public _paneName!: string;

	/**
	 * Used to set panel name
	 * @param {string} name panel name
	 */
	@Input()
	public set paneName(name: string) {
		this._paneName = name;
	}

	/**
	 * Used to get panel name
	 * @returns {string} panel name
	 */
	public get paneName(): string {
		return this._paneName;
	}

	/**
	 * An input property of type ILayoutSplitter
	 */
	@Input() public data!: ILayoutSplitter;

	/**
	 * Show/hide full-size button component for single layout.
	 */
	public get isFullSizeButtonVisible(): boolean {
		return !!this.data && !!this.data.panes && this.data?.panes[0]?.name !== 'pane-0';
	}

	/**
	 * Used to emit clicked panel name.
	 */
	@Output()
	public fullSizePane = new EventEmitter<string>();


	/**
	 * Handles fullscreen toggle and emits the active panel name.
	 *
	 * @param {string} activePanelName name of the active pane
	 */
	public handleFullscreenToggle(activePanelName: string) {
		this.fullSizePane.emit(activePanelName);
	}
}