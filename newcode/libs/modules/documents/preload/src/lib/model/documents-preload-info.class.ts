import { ITile, ModulePreloadInfoBase, LazyInjectableInfo, ISubModuleRouteInfo, TileSize, TileGroup, IWizard } from '@libs/platform/common';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { DOCUMENT_CENTER_QUERY_WIZARDS } from './wizards/documents-centralquery-wizards';

export class DocumentsPreloadInfo extends ModulePreloadInfoBase {
	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public override get internalModuleName(): string {
		return 'documents';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'documents.centralquery',
				displayName: {
					text: 'Document Central Query',
					key: 'cloud.desktop.moduleDisplayNameDocumentCentral',
				},
				description: {
					text: 'Document Central Query',
					key: 'cloud.desktop.moduleDescriptionDocumentCentral',
				},
				iconClass: 'ico-document-central-query',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'documents/centralquery',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'a50c30bf268f4c7b8bc74dadd6c0a259',
			},
			{
				id: 'documents.project',
				displayName: {
					text: 'documents project',
					key: '',
				},
				description: {
					text: 'Sample description',
					key: '',
				},
				iconClass: 'ico-rib-logo',
				color: 0x00ecbb,
				opacity: 0.9,
				textColor: 0x001914,
				iconColor: 0x001914,
				tileSize: TileSize.Small,
				targetRoute: 'documents/project',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '',
			},
			{
				id: 'documents.import',
				displayName: {
					text: 'Document Import',
					key: 'cloud.desktop.moduleDisplayNameDocumentImport',
				},
				description: {
					text: 'Document Import',
					key: 'cloud.desktop.moduleDescriptionDocumentImport',
				},
				iconClass: 'ico-document-folder',
				color: 0x00ecbb,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'documents/import',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '77b85482867d4efb851dfe08f0a1569f',
			},
		];
	}

	/**
	 * Returns some information on routes to all submodules in the module.
	 * @protected
	 *
	 * @return {Array<ISubModuleRouteInfo>} An array of objects that provides some information about the submodule routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('centralquery', () => import('@libs/documents/centralquery').then((module) => module.DocumentsCentralqueryModule)),
			ContainerModuleRouteInfo.create('project', () => import('@libs/documents/project').then((module) => module.DocumentsProjectModule)),
			ContainerModuleRouteInfo.create('import', () => import('@libs/documents/import').then((module) => module.DocumentsImportModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/documents/main').then((module) => module.DocumentsMainModule)),
		];

		// return [
		// 	ContainerModuleRouteInfo.create('centralquery', () => import('@libs/documents/centralquery').then((module) => module.DocumentsCentralqueryModule)),
		// 	ContainerModuleRouteInfo.create('common', () => import('@libs/documents/common').then((module) => module.DocumentsCommonModule)),
		// 	ContainerModuleRouteInfo.create('shared', () => import('@libs/documents/shared').then((module) => module.DocumentsSharedModule)),
		// ];
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
		return [...DOCUMENT_CENTER_QUERY_WIZARDS];
	}
}
