/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, FormStep, IFormConfig } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { IEstMainCreateBidContext } from '../create-bid-context.interface';
import { EstimateSharedCreateBidStructureTypeLookService } from '@libs/estimate/shared';
import { EstMainUdpCheckBoxListComponent } from './components/udp-checkbox-list.component';

@Injectable({
	providedIn: 'root'
})
export class EstimateMainStructureSettingService {
	private readonly translateService = inject(PlatformTranslateService);

	private structureSettingForm: IFormConfig<IEstMainCreateBidContext> = {
		formId: 'structureSettingForm',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			}
		],
		rows: [
			{
				id: 'StructureType',
				label: {key: 'Structure Type', text: 'Structure Type'},
				model: 'StructureType',
				sortOrder: 1,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateSharedCreateBidStructureTypeLookService,
					showDialog: false
				})
			},
			{
				id: 'MajorLineItems',
				label: {key: 'estimate.main.basedOnMajorLineItems', text: 'Based on major line items'},
				type: FieldType.Boolean,
				model: 'MajorLineItems',
				sortOrder: 2
			},
			{
				id: 'ProjectChangeLineItems',
				label: {key: 'estimate.main.basedOnProjectChangeLineItems', text: 'Based on project change line items'},
				type: FieldType.Boolean,
				model: 'ProjectChangeLineItems',
				sortOrder: 3
			},
			{
				id: 'bidBoqUintRateGen',
				label: {key: 'estimate.main.bidCreationWizard.bidBoqUnitRateCri', text: 'Bid BoQ Unit Rate Generate Criteria'},
				type: FieldType.CustomComponent,
				componentType: EstMainUdpCheckBoxListComponent,
				sortOrder: 4
			},
			{
				id: 'EstUppUsingURP',
				label: {key: 'estimate.main.basedOnURB', text: 'Use UR Breakdown'},
				type: FieldType.Boolean,
				model: 'EstUppUsingURP',
				sortOrder: 5
			},
			{
				id: 'CalculateHours',
				label: {key: 'estimate.main.calculateHours', text: 'Update Hours'},
				type: FieldType.Boolean,
				model: 'CalculateHours',
				sortOrder: 6
			},
			{
				id: 'EstimateScope',
				label: {key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label', text: 'Select Estimate Scope'},
				type: FieldType.Radio,
				model: 'EstimateScope',
				sortOrder: 7,
				itemsSource: {
					items: [
						{
							id: 1,
							displayName:  { text: 'Current Result Set', key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet'}
						},
						{
							id: 0,
							displayName:  { text: 'Entire Estimate', key: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate'}
						}
					]
				}
			},
			{
				id: 'DeleteOriginalBidBoq',
				label: {key: 'estimate.main.bidCreationWizard.deleteOriginalBoq', text: 'Delete Original Bid Boq'},
				type: FieldType.Boolean,
				model: 'DeleteOriginalBidBoq',
				sortOrder: 8
			}
		]
	};

	public getStructureSetting(){
		return new FormStep('structureSettingStep', this.translateService.instant('estimate.main.bidCreationWizard.structure').text, this.structureSettingForm, 'StructureSetting');
	}

	public getEmptySetting(){
		return {
			StructureType: 1,
			MajorLineItems: true,
			ProjectChangeLineItems: false,
			EstUppUsingURP: false,
			CalculateHours: false,
			EstimateScope: 0,
			DeleteOriginalBidBoq: false,
			CopyLineItemRete: ''
		};
	}
}