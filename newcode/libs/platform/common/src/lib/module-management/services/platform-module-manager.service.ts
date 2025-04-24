/*
 * Copyright(c) RIB Software GmbH
 */

import { uniq } from 'lodash';
import { Injectable, inject, Injector } from '@angular/core';
import { ModulePreloadInfoBase } from '../model/module-preload-info-base.class';
import { ModuleInfoBase } from '../model/module-info-base.class';
import { ITile } from '../../model/ui-defs/tile.interface';
import { ActivatedRouteSnapshot, NavigationStart, Route, Router, Event, RouterStateSnapshot, Routes } from '@angular/router';
import { catchError, forkJoin, from, lastValueFrom, map, Observable, ObservableInput, of, Subject, Subscription, switchMap } from 'rxjs';
import { PlatformPermissionService } from '../../services/platform-permission.service';
import { IWizard } from '../../model/wizards/wizard.interface';
import { PlatformTranslateService } from '../../services/platform-translate.service';
import { PlatformConfigurationService } from '../../services/platform-configuration.service';
import { LazyInjectableInfo } from '../../lazy-injection/index';
import { Translatable } from '../../model/translation/translatable.interface';
import { IApplicationModule } from '../model/application-module.interface';
import { FeatureProvider, IFeatureProvider } from '../../feature-registry/index';
import { IApplicationModuleInfo } from '../model/application-module-info.interface';
import { InitializationContext } from '../../model';
import { LoadingPhaseNotifierService } from '../../services/loading-phase-notifier.service';

type WizardData = {
	allWizards: IWizard[],
	wizardsById: {
		[wizardGuid: string]: IWizard
	}
};

/**
 * Keeps track of all available modules in the application.
 *
 * The module manager service is an injectable global singleton.
 * It keeps track of all preload modules in the application and provides utility routines to collect data across all preload modules.
 *
 * Preload modules are responsible for registering themselves with the service once they are initialized.
 * At that occasion, they must pass their module info object to the module manager service.
 * The global `preloadModules` array ensures that all preload modules get initialized during application start-up.
 *
 * ## Current Module
 *
 * To retrieve information about the current module, access the `activeModule` property.
 * It will provide you with the {@link ModuleInfoBase} implementation for the module whose user interface is currently displayed in the client area of the application.
 *
 * You can also subscribe to `activeModule$` in order to get notified whenever another module gets activated.
 *
 * @group Module Management
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformModuleManagerService {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		this.currentSelectionInfo$.next('');
		this.router.events.subscribe((event: Event) => {
			if (event instanceof NavigationStart) {
				this.loadingPhaseNotifierService.notifyModuleNavigationStart(event.url);
			}
		});
	}

	/**
	 * The resize subject
	 */
	public isResize$ = new Subject<boolean>();
	private readonly preloadModules: ModulePreloadInfoBase[] = [];
	private preloadModulesRoutes$: Subject<Routes> = new Subject<Routes>();
	private permissionService = inject(PlatformPermissionService);
	private configurationService = inject(PlatformConfigurationService);
	private translateService = inject(PlatformTranslateService);
	private readonly injector = inject(Injector);
	private readonly router = inject(Router);
	private readonly loadingPhaseNotifierService = inject(LoadingPhaseNotifierService);


	/**
	 * Registers a preload module.
	 * @param preloadInfo The information object of the module.
	 */
	public registerPreloadModule(preloadInfo: ModulePreloadInfoBase): void {
		this.preloadModules.push(preloadInfo);
		this.preloadModulesRoutes$.next(this.getAllRoutes());
	}

	public get allPreloadModules(): ModulePreloadInfoBase[] {
		return this.preloadModules;
	}

	private readonly _activeModule = new Subject<ModuleInfoBase>();

	private _currentModule?: ModuleInfoBase;

	/**
	 * Returns an observable that provides the {@link ModuleInfoBase} implementation for the
	 * module whose user interface is currently shown in the client area.
	 */
	public get activeModule$(): Observable<ModuleInfoBase> {
		return this._activeModule;
	}

	/**
	 * Returns the module info object of the module whose user interface is currently shown
	 * in the client area.
	 */
	public get activeModule(): ModuleInfoBase | undefined {
		return this._currentModule;
	}

	/**
	 * Activates a module that is shown in the client area of the application.
	 * @param moduleInfo The info object of the module.
	 */
	public activateModule(moduleInfo: ModuleInfoBase) {
		if (this.currentModuleSelectionInfoSubscription) {
			this.currentModuleSelectionInfoSubscription.unsubscribe();
			this.currentModuleSelectionInfoSubscription = undefined;
			this.currentSelectionInfo$.next('');
		}

		this._currentModule?.finalizeModule(this.injector);
		this.featureProvider.source = undefined;

		this._currentModule = moduleInfo;
		this.featureProvider.source = moduleInfo.featureSource;
		this.currentModuleSelectionInfoSubscription = moduleInfo.selectionInfo$.subscribe(selInfo => this.currentSelectionInfo$.next(selInfo));

		this._currentModule.initializeModule(this.injector);

		this._activeModule.next(moduleInfo);
	}

	/**
	 * Function to get desktop tiles data from Preload Module
	 * @return {ITile[]}
	 */
	public preloadDesktopTileData(): ITile[] {
		const preloadDesktopTiles = this.preloadModules.map((data) => {
			return data.desktopTiles;
		});
		return Array.prototype.concat.apply([], preloadDesktopTiles);
	}

	/**
	 * Returns all routes collected from all registered modules.
	 *
	 * @return {Array<Route>} All routes to sub-modules in any of the registered modules.
	 */
	public getAllRoutes(): Route[] {
		const result: Route[] = [];

		for (const pm of this.preloadModules) {
			result.push(...pm.getRoutes());
		}

		return result;
	}

	public getAllPreloadRoutes$(): Observable<Routes> {
		return this.preloadModulesRoutes$.asObservable();
	}

	// permissions to be always resolved/available
	private preloadedPermissions = [
		'1b77aedb2fae468cb9fd539af120b87a', // layout save system views
		'00f979839fb94839a2998b4ca9dd12e5', // layout save user views
		'842f845cb6934b109a40983366f981ef', // layout save role views
		'c9e2ece5629b4037b4f8695c92e59c1b', // layout save portal views
		'b92e1f10594d4e7daa2cba19be14d5aa', // import/export layout
		'91c3b3b31b5d4ead9c4f7236cb4f2bc0', // Access Right to enable the Grid Layout option
		'a1013e0c2c12480c9292deaed7cb11dd', // Access Right to enable the Edit View option
		'7ee17da2cd004de6a53c63af7cb4d3d9', // Right to maintain Role | System Configuration of Lookups
		'511ee30db32342c6808b02994435bf50', // BI+ Admin
		'54d412d4bd54444b9f9d93cc2e69b182'  // BI+ Admin or Editor
	];

	private preloadedPermissionsExecuted = false;

	private providePreloadedPermissions(): string[] {
		if (!this.preloadedPermissionsExecuted) {
			const tilesPermissions = this.preloadDesktopTileData().map(tile => tile.permissionGuid);

			return this.preloadedPermissions.concat(tilesPermissions);
		}

		return [];
	}

	private loadPrerequisites(permissions: string[], translations: string[], prepareFunc: () => ObservableInput<void>) {
		return forkJoin([
			this.permissionService.loadPermissions(uniq(permissions).map(p => p.toLowerCase())),
			this.translateService.load(uniq(translations))
		]).pipe(
			switchMap(prepareFunc),
			map(() => true),
			catchError(() => of(false))
		);
	}

	private loadPrerequisitesFromModule(moduleInfo: IApplicationModuleInfo): Observable<boolean> {
		const modulePermissions = moduleInfo.preloadedPermissions ?? [];
		const permissions = this.providePreloadedPermissions().concat(modulePermissions);
		const translations = moduleInfo.preloadedTranslations ?? [];

		const initCtx = new InitializationContext(this.injector);
		const modulePrepFunc = async () => {
			if (moduleInfo.prepareModule) {
				await moduleInfo.prepareModule(initCtx);
			}
		};

		if (this.configurationService.getContextResult) {
			return this.loadPrerequisites(permissions, translations, modulePrepFunc);
		} else {
			return this.configurationService.getContextResult$().pipe(
				switchMap((result) => {
					return this.loadPrerequisites(permissions, translations, modulePrepFunc);
				}),
				catchError(() => of(false))
			);
		}
	}

	/**
	 * Module resolver handles required operations to provide module state like (layout, permissions)
	 * @param route
	 * @param state
	 * @returns Observable<boolean>
	 */
	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | unknown {
		const moduleInfo = (route.data['moduleInfo'] as ModuleInfoBase);
		return from(this.loadPrerequisitesFromModule(moduleInfo));
	}

	private wizards?: WizardData;

	private prepareWizardsList(): WizardData {
		if (!this.wizards) {
			const allWizards: IWizard[] = [];

			for (const preloadModule of this.preloadModules) {
				const moduleWizards = preloadModule.wizards;
				if (moduleWizards) {
					allWizards.push(...moduleWizards);
				}
			}

			const allWizardsById: {
				[wizardGuid: string]: IWizard;
			} = {};
			for (const wz of allWizards) {
				allWizardsById[wz.uuid] = wz;
			}

			this.wizards = {
				allWizards: allWizards,
				wizardsById: allWizardsById
			};
		}

		return this.wizards;
	}

	/**
	 * Retrieves a wizard by its unique ID.
	 * @param {string} uuid The unique ID of the wizard.
	 * @returns {IWizard | null} The wizard identified by the ID, or null if no such wizard is found.
	 */
	public findWizardByGuid(uuid: string): IWizard | null {
		return this.prepareWizardsList().wizardsById[uuid];
	}

	/**
	 * Returns a listing of all known wizard headers.
	 * @returns {IWizard[]} All wizards registered in the system.
	 */
	public listWizards(): IWizard[] {
		return this.prepareWizardsList().allWizards;
	}

	/**
	 * To inform container resize based on splitter position.
	 * @param {boolean} data Informs whether container resize or not
	 * @returns {void}
	 */
	public informContainerResized(data: boolean): void {
		this.isResize$.next(data);
	}

	/**
	 * Returns all definitions of lazy injectables from all modules.
	 *
	 * @returns The array of lazy injectable info objects that are able to instantiate the injectables lazily.
	 */
	public getLazyInjectables(): LazyInjectableInfo[] {
		const items = this.allPreloadModules.map(pm => pm.lazyInjectables);
		return items.reduce((li1, li2) => li1.concat(li2));
	}

	private readonly currentSelectionInfo$ = new Subject<Translatable>();

	/**
	 * Returns an observable that provides the current selection info.
	 */
	public get selectionInfo$(): Observable<Translatable> {
		return this.currentSelectionInfo$;
	}

	private currentModuleSelectionInfoSubscription?: Subscription;

	/**
	 * Initializes an application module.
	 *
	 * When lazy-loading a module, code declared within such a module may rely on the
	 * completion of certain preparation steps. This method ensures the respective
	 * steps are executed.
	 *
	 * @param module The module to initialize.
	 *
	 * @returns A promise that is resolved when the operation has concluded.
	 */
	public async initializeModule(module: IApplicationModule): Promise<void> {
		await lastValueFrom(this.loadPrerequisitesFromModule(module.getModuleInfo()));
	}

	private readonly featureProvider = new FeatureProvider(this.injector);

	/**
	 * Provides access to the key-identified features registered for the current module.
	 *
	 * Use this object to obtain typed features identified by a {@link FeatureKey}.
	 * It is a way for modules to supply module-specific implementations of functionality
	 * invoked from different modules.
	 */
	public get currentModuleFeatures(): IFeatureProvider {
		return this.featureProvider;
	}
}
