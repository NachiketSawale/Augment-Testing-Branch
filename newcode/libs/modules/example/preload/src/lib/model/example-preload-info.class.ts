/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IInitializationContext,
	ISubModuleRouteInfo,
	ITile,
	IWizard, LazyInjectableInfo,
	ModulePreloadInfoBase, PlatformModuleManagerService, PlatformTranslateService,
	TileGroup,
	TileSize
} from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

export class ExamplePreloadInfo extends ModulePreloadInfoBase {

	public static readonly instance = new ExamplePreloadInfo();

	private constructor(){
		super();
	}
	
	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'example';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'example.topic-one',
				tileSize: TileSize.Large,
				color: 0x00ecbb,
				opacity: 1,
				iconClass: 'ico-rib-logo',
				iconColor: 0x001914,
				textColor: 0x001914,
				displayName: {
					text: 'Example 1',
					//key: 'cloud.desktop.moduleDisplayNameExampleOne',
				},
				description: {
					text: 'Allows for testing available container types.',
					key: '',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 10,
				permissionGuid: '713b7d2a532b43948197621ba89ad67a',
				targetRoute: 'example/topic-one',
			}, {
				id: 'example.topic-two',
				tileSize: TileSize.Large,
				color: 0x00f3c1,
				opacity: 1,
				iconClass: 'ico-rib-logo',
				iconColor: 0x001914,
				textColor: 0x001914,
				displayName: {
					text: 'Example 2',
					//key: 'cloud.desktop.moduleDisplayNameExampleTwo',
				},
				description: {
					text: 'Example of a business module.',
					key: '',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 20,
				permissionGuid: '713b7d2a532b43948197621ba89ad67a',
				targetRoute: 'example/topic-two',
			}, {
				id: 'example.container-layout-demo',
				tileSize: TileSize.Large,
				color: 0x00dcae,
				opacity: 1,
				iconClass: 'ico-rib-logo',
				iconColor: 0x001914,
				textColor: 0x001914,
				displayName: {
					text: 'Example 3',
					//key: 'cloud.desktop.moduleDisplayNameExampleContainerLayout',
				},
				description: {
					text: 'A module to demonstrate container layouts.',
					key: '',
				},
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 10,
				permissionGuid: '713b7d2a532b43948197621ba89ad67a',
				targetRoute: 'example/container-layout-demo',
			}
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			{
				subModuleName: 'topic-one',
				loadChildren: () => import('@libs/example/topic-one').then((module) => module.ExampleTopicOneModule),
			},
			{
				subModuleName: 'topic-two',
				loadChildren: () => import('@libs/example/topic-two').then((module) => module.ExampleTopicTwoModule),
			},
			{
				subModuleName: 'container-layout-demo',
				loadChildren: () => import('@libs/example/container-layout-demo').then((module) => module.ExampleContainerLayoutDemoModule),
			},
		];
	}

	/**
	 * Returns all wizards provided by the module.
	 *
	 * @returns The array of wizard declarations.
	 */
	public override get wizards(): IWizard[] {
		return [
			{
				uuid: '6180b22860f2401fb704a16ad7406051',
				name: 'Test Wizard',
				description: 'Tests the wizard system.',
				execute(context: IInitializationContext): Promise<void> {
					return import('@libs/example/topic-one').then((m) => {
						new m.SampleWizard().execute();
					});
				},
			},
			{
				uuid: '24dcb652cf5c488a8d871abaa914f55a',
				name: 'Other Wizard',
				description: 'Also Tests the wizard system.',
				async execute(context: IInitializationContext): Promise<void> {
					const m = await import('@libs/example/topic-two');
					const moduleMgr = context.injector.get(PlatformModuleManagerService);
					await moduleMgr.initializeModule(m);
					new m.OtherWizard(context).execute(context.injector.get(PlatformTranslateService));
				},
			},
			{
				uuid: 'ba2623b2c4f84c75af896fc0e1e79709',
				name: 'Yet another Wizard',
				description: 'Shares a service with Other Wizard.',
				execute(context: IInitializationContext): Promise<void> {
					return import('@libs/example/topic-two').then((m) => {
						new m.YetAnotherWizard(context).execute();
					});
				},
			},
		];
	}

	/**
	 * Returns all lazy injectable providers from all sub-modules of the module.
	 *
	 * @returns The lazy injectable providers.
	 */
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
