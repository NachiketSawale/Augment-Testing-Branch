/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { get, set } from 'lodash';
import { createLookup, FieldType, IFormConfig } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { EstimateMainModifyPriceAdjustmentLookupService } from '../../containers/price-adjustment/toolbar/estimate-main-modify-price-adjustment-lookup.service';
import { ModifyAdjustPriceType } from '../../containers/price-adjustment/toolbar/estimate-main-modify-adjust-price.type';

@Component({
	selector: 'estimate-main-price-adjust-modify',
	templateUrl: './price-adjust-modify.component.html',
	styleUrls: ['./price-adjust-modify.component.scss'],
})
export class PriceAdjustModifyComponent {
	protected readonly translateService = inject(PlatformTranslateService);

	public constructor() {}

	public modifyOption: ModifyAdjustPriceType = {
		boqHeaderId: null,
		FromBoq: null,
		ToBoq: null,
		FromRefNo: 0,
		ToRefNo: 0,
		Prices: true,
		Factor: '1.000',
		BaseUnitRateType: 1,
		TargetUnitRateType: 1,
		OverwriteExistPrices: false,
		AddComment: false,
		AqFromWqQuantity: false,
		AqDivWq: '0.000',
		DelAdjustPrices: false,
		DelTenderPrices: false,
		DelFixedPriceFlag: false,
		ResetAqToWqQuantity: false,
		DelComment: false,
		SelectAreaType: 1,
		ResetAqFromBoqAqQuantity: false
	};

	//_.extend(this.modifyOption, estimateMainModifyPriceAdjustmentService.getPrevEntity());

	public baseUnitRateTypeChange() {
		if (this.modifyOption.BaseUnitRateType && [3, 4].indexOf(this.modifyOption.BaseUnitRateType) > -1) {
			this.modifyOption.TargetUnitRateType = 2;
		}
	}

	/*public formConfiguration = {
		'FromRefNo': {
			gid: 'target',
			rid: 'FromBoqItemId',
			label$tr$: 'boq.main.fromRN',
			type: 'directive',
			model: 'FromBoqItemId',
			directive: 'basics-lookupdata-lookup-composite',
			'options': {
				'lookupDirective': 'basics-lookup-data-by-custom-data-service',
				'descriptionMember': 'BriefInfo.Translated',
				'lookupOptions':
					{
						'dataServiceName': 'estimateMainPriceAdjustmentModifyLookupService',
						'valueMember': 'Id',
						'displayMember': 'Reference',
						'disableDataCaching': true,
						'filter': function (entity) {
							return {
								projectId: estimateMainService.getSelectedProjectId(),
								boqHeaderId: entity.ToBoq
							};
						},
						'isClientSearch': true,
						'lookupModuleQualifier': 'estimateMainPriceAdjustmentModifyLookupService',
						'columns': [
							{
								'id': 'Reference',
								'field': 'Reference',
								'name': 'Reference',
								'formatter': 'description',
								'name$tr$': 'cloud.common.entityReference'
							},{
								'id': 'Brief',
								'field': 'BriefInfo.Description',
								'name': 'Brief',
								'formatter': 'description',
								'name$tr$': 'cloud.common.entityBrief'
							},{
								'id': 'BasUomFk',
								'field': 'BasUomFk',
								'name': 'Uom',
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'uom',
									displayMember: 'Unit'
								},
								'name$tr$': 'cloud.common.entityUoM'
							}
						],
						'treeOptions': {
							'parentProp': 'BoqItemFk',
							'childProp': 'BoqItems'
						},
						'events': [{
							name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {
								let entity = arguments[1].entity;
								let selectItem = arguments[1].selectedItem;
								entity.FromBoq = selectItem ? selectItem.BoqHeaderFk : null;
							}
						}],
						'lookupType': 'estimateMainPriceAdjustmentModifyLookupService',
						'showClearButton': true,
					}
			},
			'sortOrder': 3
		},
		'ToRefNo': {
			gid: 'target',
			rid: 'ToBoqItemId',
			label$tr$: 'boq.main.toRN',
			type: 'directive',
			model: 'ToBoqItemId',
			directive: 'basics-lookupdata-lookup-composite',
			'options': {
				'lookupOptions':
					{
						'dataServiceName': 'estimateMainPriceAdjustmentModifyLookupService',
						'valueMember': 'Id',
						'displayMember': 'Reference',
						'filter': function (entity) {
							return {
								projectId: estimateMainService.getSelectedProjectId(),
								boqHeaderId: entity.FromBoq
							};
						},
						'events': [{
							name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged() {
								let entity = arguments[1].entity;
								let selectItem = arguments[1].selectedItem;
								entity.ToBoq = selectItem ? selectItem.BoqHeaderFk : null;
							}
						}],
						'lookupType': 'estimateMainPriceAdjustmentModifyLookupService',
						'disableDataCaching': true,
						'showClearButton': true,
						'isClientSearch': true,
						'lookupModuleQualifier': 'estimateMainPriceAdjustmentModifyLookupService',
						'columns': [
							{
								'id': 'Reference',
								'field': 'Reference',
								'name': 'Reference',
								'formatter': 'description',
								'name$tr$': 'cloud.common.entityReference'
							},{
								'id': 'Brief',
								'field': 'BriefInfo.Description',
								'name': 'Brief',
								'formatter': 'description',
								'name$tr$': 'cloud.common.entityBrief'
							},
							{
								'id': 'BasUomFk',
								'field': 'BasUomFk',
								'name': 'Uom',
								'formatter': 'lookup',
								'formatterOptions': {
									lookupType: 'uom',
									displayMember: 'Unit'
								},
								'name$tr$': 'cloud.common.entityUoM'
							}
						],
						'treeOptions': {
							'parentProp': 'BoqItemFk',
							'childProp': 'BoqItems'
						}
					},
				'lookupDirective': 'basics-lookup-data-by-custom-data-service',
				'descriptionMember': 'BriefInfo.Translated',
			},
			sortOrder: 4
		}
	};*/

	public readOnlyOption = {
		SelectAreaType: (type: number) => {
			return this.modifyOption.SelectAreaType !== type;
		},
		BaseUnitRateType: () => {
			return !(this.modifyOption.SelectAreaType === 1 && this.modifyOption.Prices);
		},
		priceAdjust: () => {
			return !(this.modifyOption.SelectAreaType === 1 && this.modifyOption.Prices && (this.modifyOption.BaseUnitRateType === 1 || this.modifyOption.BaseUnitRateType === 2));
		},
		AddComment: () => {
			return !(this.modifyOption.SelectAreaType === 1 && (this.modifyOption.Prices || this.modifyOption.AqFromWqQuantity));
		},
		AqDivWq: () => {
			return !(this.modifyOption.SelectAreaType === 1 && this.modifyOption.AqFromWqQuantity);
		},
		ResetAqFromWq: () => {
			return this.modifyOption.SelectAreaType === 1 || (this.modifyOption.SelectAreaType === 2 && this.modifyOption.ResetAqFromBoqAqQuantity);
		},
		ResetAqFromBoqAq: () => {
			return this.modifyOption.SelectAreaType === 1 || (this.modifyOption.SelectAreaType === 2 && this.modifyOption.ResetAqToWqQuantity);
		}
	};

	public showAreaGroup = true;
	public showGenerateGroup = true;
	public showResetGroup = true;

	public toggleOpen(index: number) {
		switch (index) {
			case 0:
				this.showAreaGroup = !this.showAreaGroup;
				break;
			case 1:
				this.showGenerateGroup = !this.showGenerateGroup;
				break;
			case 2:
				this.showResetGroup = !this.showResetGroup;
				break;
		}
	}

	public factorChange(target: string) {
		let factor = get(this.modifyOption, target);
		if (!factor || factor === '') {
			set(this.modifyOption, target, '1.000');
		}

		if (factor && factor.indexOf('.') < 0) {
			factor = factor + '.000';
		} else {
			const idx = factor.lastIndexOf('.');
			const rigthPart = factor.substr(idx, factor.length - idx - 1);
			let i = 3 - rigthPart.length;
			while (i > 0) {
				factor = factor + '0';
				i--;
			}
		}

		set(this.modifyOption, target, factor);
	}

	public stopEnter(event: Event | null) {
		if (event && (event as KeyboardEvent).key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	protected formConfiguration: IFormConfig<ModifyAdjustPriceType> = {
		formId: 'project.material.update.price.from.quote',
		showGrouping: false,
		addValidationAutomatically: false,
		rows: [
			{
				id: 'FromBoqItemId',
				label: this.translateService.instant('boq.main.fromRN').text,
				model: 'FromRefNo',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateMainModifyPriceAdjustmentLookupService,
					displayMember: 'Reference',
					valueMember: 'Id',
					showClearButton: true
				})
			},
			{
				id: 'ToBoqItemId',
				label: this.translateService.instant('boq.main.toRN').text,
				model: 'ToRefNo',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateMainModifyPriceAdjustmentLookupService,
					displayMember: 'Reference',
					valueMember: 'Id',
					showClearButton: true
				})
			}
		]
	};

	public initModalData() {
		/*const selected = this.dataService.getSelected();
		if (selected && selected.Id !== -1) {
			this.modifyOption.FromRefNo = selected.Id;
			this.modifyOption.FromBoq = selected.BoqHeaderFk;
			this.modifyOption.ToRefNo = selected.Id;
			this.modifyOption.ToBoq = selected.BoqHeaderFk;
		}*/
	}
}
