/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISubModuleRouteInfo, ITile, IWizard, LazyInjectableInfo, ModulePreloadInfoBase, TileGroup, TileSize } from '@libs/platform/common';
import { ContainerModuleRouteInfo } from '@libs/ui/container-system';
import { LAZY_INJECTABLES } from './lazy-injectable-info.model';

/**
 * Preloads the tiles, wizards and routes for logistic module.
 */
export class LogisticPreloadInfo extends ModulePreloadInfoBase {
	public static readonly instance = new LogisticPreloadInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 * @return {string}
	 */
	public get internalModuleName(): string {
		return 'logistic';
	}

	/**
	 * Returns the desktop tiles supplied by the module.
	 * @return {ITile[]}
	 */
	public override get desktopTiles(): ITile[] {
		return [
			{
				id: 'logistic.action',
				displayName: {
					text: 'Logistic Action',
					key: 'cloud.desktop.moduleDisplayNameLogisticAction'
				},
				description: {
					text: 'Logistic Action',
					key: 'cloud.desktop.moduleDescritptionNameLogisticAction'
				},
				iconClass: 'ico-check-list-template',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/action',
				defaultGroupId: TileGroup.Enterprise,
				defaultSorting: 12,
				permissionGuid: '85c9999550ad4285b7807c2a228e5c16'
			},
			{
				id: 'logistic.plantsupplier',
				displayName: {
					text: 'Logistic Plantsupplier',
					key: 'cloud.desktop.moduleDisplayNameLogisticPlantsupplier'
				},
				description: {
					text: 'Logistic Plantsupplier',
					key: 'cloud.desktop.moduleDescritptionNameLogisticPlantsupplier'
				},
				iconClass: 'ico-logistic-job',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/plantsupplier',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 1,
				permissionGuid: '298e60027048420da1e58629784e259d'
			},
			{
				id: 'logistic.cardtemplate',
				displayName: {
					text: 'Logistic Card Template',
					key: 'cloud.desktop.moduleDisplayNameLogisticCardTemplate',
				},
				description: {
					text: 'Logistic Card Template',
					key: 'cloud.desktop.moduleDescriptionLogisticCardTemplate',
				},
				iconClass: 'ico-jobcard-template',
				color: 1926037,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/cardtemplate',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 12,
				permissionGuid: 'd4e074087f984a4aa3b08f2d45f0b960',
			},
			{
				id: 'logistic.sundryservice',
				tileSize: TileSize.Small,
				color: 2324403,
				opacity: 1,
				iconClass: 'ico-sundry-service',
				iconColor: 16777215,
				textColor: 16777215,
				displayName: {
					text: 'Sundry Service',
					key: 'cloud.desktop.moduleDisplayNameLogisticSundryService',
				},
				description: {
					text: 'Logistic Sundry Service',
					key: 'cloud.desktop.moduleDescriptionNameLogisticSundryService',
				},
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 10,
				permissionGuid: '856c8c82f3464073890978adfe10e977',
				targetRoute: 'logistic/sundryservice',
			},
			{
				id: 'logistic.sundrygroup',
				displayName: {
					text: 'Sundry Service Group',
					key: 'cloud.desktop.moduleDisplayNameLogisticSundryServiceGroup',
				},
				description: {
					text: 'Logistic Sundry Service Group',
					key: 'cloud.desktop.moduleDescriptionNameLogisticSundryServiceGroup',
				},
				iconClass: 'ico-sundry-service-group',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/sundrygroup',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 11,
				permissionGuid: '0cb77666a7d94263b2b5b8184a929c56',
			},
			{
				id: 'logistic.pricecondition',
				displayName: {
					text: 'Logistic Price Condition',
					key: 'cloud.desktop.moduleDisplayNameLogisticPriceCondition',
				},
				description: {
					text: 'Logistic Price Condition',
					key: 'cloud.desktop.moduleDescriptionNameLogisticPriceCondition',
				},
				iconClass: 'ico-price-condition2',
				color: 4428614,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/pricecondition',
				defaultGroupId: TileGroup.Configuration,
				defaultSorting: 0, //TODO
				permissionGuid: '43c214ed51384731b1fea7ad7d3510e0',
			},
			{
				id: 'logistic.job',
				displayName: {
					text: 'Logistic Jobs',
					key: 'cloud.desktop.moduleDisplayNameLogisticJob',
				},
				description: {
					text: 'Management of Logistic',
					key: 'cloud.desktop.moduleDescriptionLogisticJob',
				},
				iconClass: 'ico-logistic-job',
				color: 3704191,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/job',
				defaultGroupId: TileGroup.Programs,
				defaultSorting: 0, //TODO
				permissionGuid: 'd85a004a4ea444368382338f36b5a41b',
			},
			{
				id: 'logistic.card',
				displayName: {
					text: 'Job Cards',
					key: 'cloud.desktop.moduleDisplayNameLogisticCard',
				},
				description: {
					text: 'Job Cards',
					key: 'cloud.desktop.moduleDescriptionLogisticCard',
				},
				iconClass: 'ico-job-card',
				color: 2324403,
				opacity: 0.9,
				textColor: 16777215,
				iconColor: 16777215,
				tileSize: TileSize.Small,
				targetRoute: 'logistic/card',
				defaultGroupId: TileGroup.MasterData,
				defaultSorting: 13,
				permissionGuid: '6f96696ffbcc40db9404497426cb4c53',
			},
		];
	}

	/**
	 * Returns some information on routes to all sub-modules in the module.
	 *	@protected
	 * @returns {ISubModuleRouteInfo[]} An array of objects that provides some information about the sub-module routes.
	 */
	protected override getRouteInfos(): ISubModuleRouteInfo[] {
		return [
			ContainerModuleRouteInfo.create('action', () => import('@libs/logistic/action').then((module) => module.LogisticActionModule)),
			ContainerModuleRouteInfo.create('plantsupplier', () => import('@libs/logistic/plantsupplier').then((module) => module.LogisticPlantsupplierModule)),
			ContainerModuleRouteInfo.create('cardtemplate', () => import('@libs/logistic/cardtemplate').then((module) => module.LogisticCardTemplateModule)),
			ContainerModuleRouteInfo.create('sundryservice', () => import('@libs/logistic/sundryservice').then((module) => module.LogisticSundryServiceModule)),
			ContainerModuleRouteInfo.create('sundrygroup', () => import('@libs/logistic/sundrygroup').then((module) => module.LogisticSundryGroupModule)),
			ContainerModuleRouteInfo.create('pricecondition', () => import('@libs/logistic/pricecondition').then((module) => module.LogisticPriceconditionModule)),
			ContainerModuleRouteInfo.create('job', () => import('@libs/logistic/job').then((module) => module.LogisticJobModule)),
			ContainerModuleRouteInfo.create('card', () => import('@libs/logistic/card').then((module) => module.LogisticCardModule))
		];
	}

	public override get wizards(): IWizard[] | null {
		return [
			{
				uuid: '88cc0e70d9d64390bfe823845af57049',
				name: 'disableSundryServiceGroup',
				execute: (context) => {
					return import('@libs/logistic/sundrygroup').then((module) => new module.LogisticSundryGroupWizard().sundryGroupDisableWizard(context));
				},
			},
			{
				uuid: '08745fea91ad46adaf812f265e8db38d',
				name: 'enableSundryServiceGroup',
				execute: (context) => {
					return import('@libs/logistic/sundrygroup').then((module) => new module.LogisticSundryGroupWizard().sundryGroupEnableWizard(context));
				},
			},
			{
				uuid: 'db22cbc273704edfb9cd9c28cf6d40b6',
				name: 'changeCardStatus',
				execute: (context) => {
					return import('@libs/logistic/card').then((module) => new module.LogiscticCardWizard().changeCardStatus(context));
				},
			},
			{
				uuid: 'd93ac7abc4f54688926a02a625fd437a',
				name: 'createDispatchNotesFromJobCards',
				execute: (context) => {
					return import('@libs/logistic/card').then((module) => new module.LogiscticCardWizard().createDispatchNotesFromJobCards(context));
				},
			},
			{
				uuid: '36418540fe5641b19edc4c7bb88119b7',
				name: 'reserveMaterialAndStock',
				execute: (context) => {
					return import('@libs/logistic/card').then((module) => new module.LogiscticCardWizard().reserveMaterialAndStock(context));
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
