/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, FormStep, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { ISplitLineItems, SplitByQuantityForm} from './estimate-main-split-line-item-configuration';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SplitLineItemByQuantityStep{
	public readonly title = 'estimate.main.splitLineItemWizard.splitByPercentAndQuantity';
	public readonly id = 'splitByQuantityForm';

	/**
	 * Create Split LineItem By Quantity Form
	 * @param createProjectAlternativeConfiguration 
	 * @returns 
	 */
	public createForm(createProjectAlternativeConfiguration : SplitByQuantityForm): FormStep<SplitByQuantityForm>{
		const fromStep = new FormStep(this.id,this.title, this.createFormConfiguration(), createProjectAlternativeConfiguration);
		fromStep.canFinish = false;
		return fromStep;
	}
	private createFormConfiguration():IFormConfig<SplitByQuantityForm>{
		return {
			formId: this.id,
			showGrouping: false,
			rows: [
				{
					id: 'doSplitAsReference',
					label: { key: 'estimate.main.splitLineItemWizard.createLineItemReference' },
					type: FieldType.Boolean,
					model: 'doSplitAsReference'
				},
				{
					id: 'splitLineItems',
					label: 'Grid',
					type: FieldType.Grid,
					configuration: this.gridConfiguration as IGridConfiguration<object>,
					height: 100,
					model: 'splitLineItems'
				},
				{
					id: 'applySplitResultTo',
					label: { key: 'estimate.main.splitLineItemWizard.applySplitResultTo' },
					type: FieldType.Radio,
					model: 'applySplitResultTo',
					itemsSource: {
						items: [
							{
								id: 'Quantity',
								displayName: { key: 'estimate.main.splitLineItemWizard.splitQuantity'},
							},
							{
								id: 'QuantityTarget',
								displayName: { key: 'estimate.main.splitLineItemWizard.splitQuantityItem' },
							},
						],
					},
					change: e => {
						//$injector.get('estimateMainSplitLineItemQuantityDialogService').recalculateItems(result);
					}
				},
				{
					id: 'noRelation',
					label: { key: 'estimate.main.splitLineItemWizard.entityNoRelation' },
					type: FieldType.Boolean,
					model: 'noRelation'
					//visible: entity.applySplitResultTo === 'QuantityTarget'
				}
			],
			
		};
	}
	
	private gridConfiguration:  IGridConfiguration<ISplitLineItems> =  {
		uuid: '136e13f7403a424db237b762abf9088b',
		idProperty: 'code',
		columns: [{
			id: 'info',
			model: 'info',
			sortable: true,
			label: {
				text: 'estimate.main.info',
			},
			type: FieldType.Image,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.info',
			},
			width: 20,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: true
		}, 
		{
			id: 'code',
			model: 'code',
			sortable: true,
			label: {
				text: 'cloud.common.entityCode',
			},
			type: FieldType.Code,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'cloud.common.entityCode',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, 
		{
			id: 'desc',
			model: 'desc',
			sortable: true,
			label: {
				text: 'cloud.common.entityDescription',
			},
			type: FieldType.Description,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'cloud.common.entityDescription',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}, 
		{
			id: 'quantitypercent',
			model: 'quantitypercent',
			sortable: true,
			label: {
				text: 'estimate.main.splitLineItemWizard.quantityPercent',
			},
			type: FieldType.Integer,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.splitLineItemWizard.quantityPercent',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false,
			//todo - validator
		},
		{
			id: 'quantitytotal',
			model: 'quantitytotal',
			sortable: true,
			label: {
				text: 'estimate.main.quantityTotal',
			},
			type: FieldType.Integer,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.quantityTotal',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
			//todo - validator
		},
		{
			id: 'splitdifference',
			model: 'splitdifference',
			sortable: true,
			label: {
				text: 'estimate.main.splitDifference',
			},
			type: FieldType.Integer,
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.splitDifference',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'estlineitemFk',
			model: 'estlineitemFk',
			sortable: true,
			label: {
				text: 'estimate.main.estLineItemFk',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.estLineItemFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'mdccontrollingunitfk',
			model: 'mdccontrollingunitfk',
			sortable: true,
			label: {
				text: 'estimate.main.mdcControllingUnitFk',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.mdcControllingUnitFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'boqrootref',
			model: 'boqrootref',
			sortable: true,
			label: {
				text: 'estimate.main.boqRootRef',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.boqRootRef',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'estboqfk',
			model: 'estboqfk',
			sortable: true,
			label: {
				text: 'estimate.main.boqItemFk',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.boqItemFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'psdactivityschedulefk',
			model: 'psdactivityschedulefk',
			sortable: true,
			label: {
				text: 'estimate.main.activitySchedule',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.activitySchedule',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'psdactivityfk',
			model: 'psdactivityfk',
			sortable: true,
			label: {
				text: 'estimate.main.psdActivityFk',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.psdActivityFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		},
		{
			id: 'prjlocationfk',
			model: 'prjlocationfk',
			sortable: true,
			label: {
				text: 'estimate.main.prjLocationFk',
			},
			type: FieldType.Integer, //todo - lookup
			readonly: false,
			searchable: true,
			tooltip: {
				text: 'estimate.main.prjLocationFk',
			},
			width: 100,
			visible: true,
			keyboard: {
				enter: false,
				tab: false
			},
			pinned: false
		}
	],
	skipPermissionCheck: true,
	};
}