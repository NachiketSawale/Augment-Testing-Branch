/*
 * Copyright(c) RIB Software GmbH
 */
import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';

/**
 * The module info object for the `hsqe` preload module.
 */
export class HsqePreloadInfo extends ModulePreloadInfoBase {
	private static _instance?: HsqePreloadInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): HsqePreloadInfo {
		if (!this._instance) {
			this._instance = new HsqePreloadInfo();
		}

		return this._instance;
	}

	/**
	 * Initializes a new instance.
	 * The purpose of this declaration is to make the constructor private and ensure the class is a singleton.
	 */
	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'hsqe';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 *
	 * @return The desktop tile definitions.
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'hsqe.checklist',
				displayName: {
					text: 'Check List',
					key: 'cloud.desktop.moduleDisplayNameCheckList',
				},
				description: {
					text: 'Delivery Notice',
					key: 'cloud.desktop.moduleDisplayNameCheckList',
				},
				iconClass: 'ico-check-list',
				color: 9906232,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'hsqe/checklist',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '614a334ea7a94618b1fc2f672c4f5dad',
			},
			{
				id: 'hsqe.checklisttemplate',
				displayName: {
					text: 'Check List Template',
					key: 'cloud.desktop.moduleDisplayNameCheckListTemplate',
				},
				description: {
					text: 'Check List Template',
					key: 'cloud.desktop.moduleDisplayNameCheckListTemplate',
				},
				iconClass: 'ico-check-list-template',
				color: 14376303,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Large,
				targetRoute: 'hsqe/checklisttemplate',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '06be92f727ee4e2dbb4d047679f428b2',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *
	 * @return An array of objects that provide some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('checklist', () => import('@libs/hsqe/checklist').then((module) => module.HsqeChecklistModule)),
			ContainerModuleRouteInfo.create('checklisttemplate', () => import('@libs/hsqe/checklisttemplate').then((module) => module.HsqeChecklisttemplateModule)),
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

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: '030b5bd293b844e5b4800d54b86af643',
				name: 'Change CheckList Status',
				execute:async (context) => {
					const module = await import('@libs/hsqe/checklist');
					return new module.CheckListWizards().changeCheckListStatus(context);
				},
			},
			{
				uuid: '2ad89ac71bd24bbbbcea0b13d693023c',
				name: 'Create CheckList',
				execute:async (context) => {
					const module = await import('@libs/hsqe/checklist'); 
					return new module.CheckListWizards().createCheckListFromTemplate(context);
				},
			},
			{
				uuid: '3e8459f0dc9a4f13a5b1b29c7a85df90',
				name: 'Create Defect',
				execute:async (context) => {
					const module = await import('@libs/hsqe/checklist');
					return new module.CheckListWizards().createDefectFromCheckList();
				},
			},
		];
	}
}
