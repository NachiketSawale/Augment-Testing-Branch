/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input, OnInit } from '@angular/core';
import { BusinessPartnerScope } from '../../../model/business-partner-scope';
import { FieldType, ILookupOptions, LookupEvent, UiCommonCountryLookupService, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import {
	BasicsCharacteristicHeader,
	BasicsSharedCharacteristicCodeLookupService,
	BasicsSharedComparisonOptionLookupService,
	BasicsSharedProcurementStructureLookupService,
	BasicsSharedRadiusLookupService,
	IProcurementStructureLookupEntity
} from '@libs/basics/shared';
import { BusinesspartnerSharedStatusMultipleLookupService } from '../../../../lookup-services/businesspartner-status-multiple-lookup.service';
import { BusinesspartnerSharedStatus2MultipleLookupService } from '../../../../lookup-services/businesspartner-status2-multiple-lookup.service';
import { BusinesspartnerSharedEvaluationSchemaLookupService } from '../../../../lookup-services/businesspartner-evaluation-schema-lookup.service';
import { BasicsCharacteristicSection, BasicsCharacteristicType } from '@libs/basics/interfaces';
import { ComparisonType } from '../../../model/data/comparison-enum';
import { PropertyType } from '@libs/platform/common';
import { differenceInDays } from 'date-fns';
import { LocationType } from '../../../model/data/location-enum';


/**
 * search view in business partner dialog
 */

@Component({
	selector: 'businesspartner-shared-business-partner-search',
	templateUrl: './business-partner-search.component.html',
	styleUrls: ['./business-partner-search.component.scss']
})

export class BusinessPartnerSearchComponent implements OnInit {
	/**
	 * Search scope
	 */
	@Input()
	public scope!: BusinessPartnerScope;


	protected readonly procurementStructureLookupService = inject(BasicsSharedProcurementStructureLookupService);
	protected readonly radiusLookupService = inject(BasicsSharedRadiusLookupService);
	protected readonly countryLookupService = inject(UiCommonCountryLookupService);
	protected readonly evaluationSchemaLookupService = inject(BusinesspartnerSharedEvaluationSchemaLookupService);
	protected readonly businesspartnerSharedStatusLookupService = inject(BusinesspartnerSharedStatusMultipleLookupService);
	protected readonly businesspartnerSharedStatus2LookupService = inject(BusinesspartnerSharedStatus2MultipleLookupService);
	protected readonly characteristicCodeLookupService = inject(BasicsSharedCharacteristicCodeLookupService);
	protected readonly comparisonLookupService = inject(BasicsSharedComparisonOptionLookupService).createLookupService();
	protected readonly multipleTypesLookupService = this.createTypesLookupService(false);
	protected readonly timeTypesLookupService = this.createTypesLookupService(true);
	protected readonly structureCustomOptions: ILookupOptions<IProcurementStructureLookupEntity, object> = {
		showDescription: true,
		descriptionMember: 'DescriptionInfo.Translated'
	};
	protected readonly characteristicCustomOptions: ILookupOptions<BasicsCharacteristicHeader, object> = {
		showDescription: true,
		descriptionMember: 'DescriptionInfo.Translated',
		serverSideFilter:
			{
				key: '',
				execute() {
					return {
						sectionId: BasicsCharacteristicSection.BusinessPartnerCharacteristic,
					};
				}
			}
	};

	protected readonly FieldType = FieldType;
	protected locationTypes = [
		{value: LocationType.Distance, label: 'businesspartner.main.distance'},
		{value: LocationType.Regional, label: 'businesspartner.main.regional'},
	];
	protected isCharTypeDate: boolean = false;
	protected selectedLocationType: string = LocationType.Distance;
	protected errorText: string | undefined;

	private charType: number | undefined = BasicsCharacteristicType.String;

	private isBidderSearchPreAllocation = false;


	public constructor(public lookupFactory: UiCommonLookupDataFactoryService) {

	}

	public async ngOnInit(): Promise<void> {
		if (this.scope.initialOptions.approvalBPRequired) {
			this.scope.setting.Status.isApprovedBP = await this.scope.searchService.checkApprovedBP();
		}
		this.isBidderSearchPreAllocation = await this.scope.searchService.checkBidderSearchPreAllocation();
		this.errorText = this.scope.translateService.instant('cloud.common.Error_EndDateTooEarlier').text;
	}

	protected ngModelChange(event: Event, ngMode: string) {
		const checked = (event.target as HTMLInputElement).checked as boolean;
		const target = Reflect.get(this.scope.setting, ngMode);
		if (target) {
			Reflect.set(target, 'IsActive', checked);
		} else {
			this.scope.setting.Status.isApprovedBP = checked;
		}
	}

	protected onSelectedLocationTypeChanged() {
		this.scope.setting.Location.IsRegionalActive = this.selectedLocationType === 'regional';
	}

	protected onChangeStartDate(newValue: PropertyType) {
		this.scope.setting.DateOrdered.StartDate = newValue as Date;
	}

	protected onChangeEndDate(newValue: PropertyType) {
		this.scope.setting.DateOrdered.EndDate = newValue as Date;
	}

	protected onSelectedItemCharacteristicChanged(event: LookupEvent<BasicsCharacteristicHeader, object>) {
		this.charType = (event.selectedItem as BasicsCharacteristicHeader).CharacteristicTypeFk;
		this.isCharTypeDate = (this.charType === BasicsCharacteristicType.Date || this.charType === BasicsCharacteristicType.DateTime);
	}

	protected hasError() {
		const startDate = this.scope.setting.DateOrdered.StartDate;
		const endDate = this.scope.setting.DateOrdered.EndDate;
		if (endDate && startDate) {
			return differenceInDays(endDate, startDate) < 0;
		}
		return false;
	}

	private createTypesLookupService(isTypeDate: boolean) {
		return this.lookupFactory.fromItems(
			[
				{
					id: ComparisonType.NoComparison,
					value: '',
					desc: {
						key: 'businesspartner.main.compareOperator.noComparison'
					}
				},
				{
					id: ComparisonType.Equals,
					value: '=',
					desc: {
						key: 'businesspartner.main.compareOperator.equals'
					}
				},
				{
					id: ComparisonType.GreaterThan,
					value: '>',
					desc: {
						key: isTypeDate ?
							'businesspartner.main.compareOperator.laterThan' : 'businesspartner.main.compareOperator.greaterThan'
					}
				},
				{
					id: ComparisonType.LessThan,
					value: '<',
					desc: {
						key: isTypeDate ?
							'businesspartner.main.compareOperator.earlierThan' : 'businesspartner.main.compareOperator.lessThan'
					}
				},
				{
					id: ComparisonType.Contains,
					value: 'contains',
					desc: {
						key: 'businesspartner.main.compareOperator.contains'
					}
				},
				{
					id: ComparisonType.NotNullOrEmpty,
					value: '!isNotNullOrEmpty',
					desc: {
						key: 'businesspartner.main.compareOperator.isNotNullOrEmpty'
					}
				}], {
				uuid: '',
				valueMember: 'value',
				displayMember: 'desc',
				translateDisplayMember: true,
				clientSideFilter: {
					execute: (item): boolean => {
						return this.filterComparisonOptionsByCharType(item.id);
					}
				}
			});

	}

	private filterComparisonOptionsByCharType(charId: number = 0) {
		switch (this.charType) {
			case BasicsCharacteristicType.Boolean: // bool
				return [ComparisonType.NoComparison, ComparisonType.Equals].includes(charId);
			case BasicsCharacteristicType.Lookup: // lookup
				return [ComparisonType.NoComparison, ComparisonType.Equals, ComparisonType.NotNullOrEmpty].includes(charId);
			case BasicsCharacteristicType.String: // description
			case BasicsCharacteristicType.NoValue: // no value.
				return [ComparisonType.NoComparison, ComparisonType.Equals,
					ComparisonType.Contains, ComparisonType.NotNullOrEmpty].includes(charId);
			case BasicsCharacteristicType.Integer: // integer
			case BasicsCharacteristicType.Percent: // percent
			case BasicsCharacteristicType.Money: // money
			case BasicsCharacteristicType.Quantity: // quantity
			case BasicsCharacteristicType.Date: // dateutc
			case BasicsCharacteristicType.DateTime: // datetimeutc
				return [ComparisonType.NoComparison, ComparisonType.Equals, ComparisonType.GreaterThan,
					ComparisonType.LessThan, ComparisonType.NotNullOrEmpty].includes(charId);
			default:
				return [ComparisonType.NoComparison].includes(charId);
		}
	}
}
