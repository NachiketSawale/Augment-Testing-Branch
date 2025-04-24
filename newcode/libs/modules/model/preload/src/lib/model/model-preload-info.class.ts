/*
 * Copyright(c) RIB Software GmbH
 */

import { ISubModuleRouteInfo, ITile, LazyInjectableInfo, IWizard, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';
import { MODEL_CHANGESET_WIZARD } from './wizards/change-set-preload-wizard';
import { MODEL_PROJECT_WIZARD } from './wizards/model-project-wizard';
import { MODEL_MAP_WIZARD } from './wizards/map-preload-wizard';
import { MODEL_CHANGE_ANNOTATION_STATUS_WIZARD } from './wizards/model-annotation-status-wizard';
import { MODEL_ANNOTATION_BCF_EXPORT_WIZARD } from './wizards/model-annotation-bcf-export-wizard';
import { MODEL_MAIN_WIZARD } from './wizards/model-main-preload-wizard';

export class ModelPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new ModelPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return The internal name of the module.
	 */
	public override get internalModuleName(): string {
		return 'model';
	}

	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('administration', () => import('@libs/model/administration').then((module) => module.ModelAdministrationModule)),
			ContainerModuleRouteInfo.create('changeset', () => import('@libs/model/changeset').then((module) => module.ModelChangesetModule)),
			ContainerModuleRouteInfo.create('change', () => import('@libs/model/change').then((module) => module.ModelChangeModule)),
			ContainerModuleRouteInfo.create('annotation', () => import('@libs/model/annotation').then((module) => module.ModelAnnotationModule)),
			ContainerModuleRouteInfo.create('administration', () => import('@libs/model/administration').then((module) => module.ModelAdministrationModule)),
			ContainerModuleRouteInfo.create('measurements', () => import('@libs/model/measurements').then((module) => module.ModelMeasurementsModule)),
			ContainerModuleRouteInfo.create('map', () => import('@libs/model/map').then((module) => module.ModelMapModule)),
			ContainerModuleRouteInfo.create('main', () => import('@libs/model/main').then((module) => module.ModelMainModule)),
		];
	}

	/**
	 * Returns desktop tiles defined by the module.
	 */
	public override get desktopTiles(): ITile[] | null {
		return [
			{
				id: 'model.administration',
				tileSize: TileSize.Small,
				color: 2974255,
				opacity: 0.9,
				iconClass: 'ico-model-configuration',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					key: 'cloud.desktop.moduleDisplayNameModelAdministration',
				},
				description: {
					key: 'cloud.desktop.moduleDescriptionModelAdministration',
				},
				defaultGroupId: TileGroup.Enterprise, // TODO: change to "BIM" once defined
				defaultSorting: 0,
				permissionGuid: '45f90ffded3f42b1bd724aaca01f2235',
				targetRoute: 'model/administration',
			},
			{
				id: 'model.changeset',
				displayName: {
					text: 'Model Comparison',
					key: 'cloud.desktop.moduleDisplayNameModelChangeSet',
				},
				description: {
					text: 'Comparison Between Models',
					key: 'cloud.desktop.moduleDescriptionModelChangeSet',
				},
				iconClass: 'ico-model-comparison',
				color: 690687,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'model/changeset',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'd6b0ebf4e17946d58ac49be19db22ce3',
			},
			{
				id: 'model.measurements',
				displayName: {
					key: 'cloud.desktop.moduleDisplayNameModelMeasurements',
				},
				description: {
					key: 'cloud.desktop.moduleDescriptionModelMeasurements',
				},
				iconClass: 'ico-measurements',
				color: 1412863,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'model/measurements',
				defaultGroupId: TileGroup.Enterprise, // TODO: change to "BIM" once defined
				defaultSorting: 0, //TODO
				permissionGuid: '2e34512690b14deea950a0b1ce31cb28',
			},
			{
				id: 'model.annotation',
				displayName: {
					text: 'Model Annotation',
					key: 'cloud.desktop.moduleDisplayNameModelAnnotation',
				},
				description: {
					text: '',
					key: 'cloud.desktop.moduleDescriptionModelAnnotation',
				},
				iconClass: 'ico-model-annotation',
				color: 1412863,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'model/annotation',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '9b4ef62e8a41475cab97e7f630514091',
			},
			{
				id: 'model.map',
				displayName: {
					text: 'Model Map',
					key: 'cloud.desktop.moduleDisplayNameModelMap',
				},
				description: {
					text: 'Map',
					key: 'cloud.desktop.moduleDescriptionModelMap',
				},
				iconClass: 'ico-model-map',
				color: 1412863,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'model/map',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'd7ce341c086b4c158d895432e71a011f',
			},
			{
				id: 'model.main',
				displayName: {
					text: 'Model',
					key: 'cloud.desktop.moduleDisplayNameModel',
				},
				description: {
					text: 'Geometrical Model',
					key: 'cloud.desktop.moduleDescriptionModel',
				},
				iconClass: 'ico-model',
				color: 3054335,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'model/main',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: '5e10c50f173549aa8530f68496ec621d',
			},
		];
	}

	/**
	 * Retrieves the wizards available for managing the change set.
	 * @returns {IWizard[] | null} An array containing the available wizards,
	 * or null if no wizards are available.
	 */
	public override get wizards(): IWizard[] | null {
		return [...MODEL_CHANGESET_WIZARD, ...MODEL_PROJECT_WIZARD, ...MODEL_MAP_WIZARD, ...MODEL_CHANGE_ANNOTATION_STATUS_WIZARD, ...MODEL_ANNOTATION_BCF_EXPORT_WIZARD, ...MODEL_MAIN_WIZARD];
	}
	public override get lazyInjectables(): LazyInjectableInfo[] {
		return LAZY_INJECTABLES;
	}
}
