/*
 * Copyright(c) RIB Software GmbH
 */

import { LogisticSundryServiceGroupLookupDataService } from '@libs/logistic/shared';
import { inject, Injectable } from '@angular/core';
import { IBasicsCustomizeAccountingEntity, IBasicsCustomizeMdcControllingGroupDetailEntity, IBasicsCustomizeSundryNominalDimensionAssignmentEntity } from '@libs/basics/interfaces';
import { ConcreteFieldOverload, createLookup, FieldType, IAdditionalLookupOptions, ILookupContext } from '@libs/ui/common';
import { SchedulingControllingGroupDetailLookup } from '@libs/scheduling/shared';
import { ILogisticSundryServiceGroupAccountEntity } from '@libs/logistic/interfaces';
import { BasicsSharedAccountingLookupService } from '@libs/basics/shared';


/**
 * Logistic Sundry Service Group Dynamic Nominal Dimensions service
 */
@Injectable({
	providedIn: 'root'
})
export class LogisticSundryServiceGroupLookupOverloadProvider {
	private lookupDataService: LogisticSundryServiceGroupLookupDataService;

	public constructor() {
		this.lookupDataService = inject(LogisticSundryServiceGroupLookupDataService);
	}

	public provideNominalDimensionLookupOverload<T extends object>(attribute: string): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T> {

		const accountInstance = this.lookupDataService.getAccount() as IBasicsCustomizeSundryNominalDimensionAssignmentEntity;
		if (accountInstance) {
			const assignmentNo = attribute.slice(-4);
			const ControllingGrpKey = 'ControllingGroup' + assignmentNo + 'Fk';
			const controllingGroupFk = accountInstance[ControllingGrpKey as keyof IBasicsCustomizeSundryNominalDimensionAssignmentEntity];

			if (controllingGroupFk !== null) {
				return {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SchedulingControllingGroupDetailLookup,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Translated',
						clientSideFilter: {
							execute(item: IBasicsCustomizeMdcControllingGroupDetailEntity): boolean {
								return item['ControllinggroupFk'] === controllingGroupFk;
							}
						},
						events: [{
							name: 'onSelectedItemChanged',
							handler: (e) => {

								if (e.context.lookupInput?.selectedItem && e.context.entity) {
									const selectedItem = e.context.entity;
									const selectedLookupItem = e.context.lookupInput.selectedItem;

									const groupField = 'Controllinggrpdetail' + assignmentNo + 'Fk';
									selectedItem[groupField as keyof ILogisticSundryServiceGroupAccountEntity] = selectedLookupItem.Id;

									const nomDimField = 'NominalDimension' + assignmentNo;
									selectedItem[nomDimField as keyof ILogisticSundryServiceGroupAccountEntity] = selectedLookupItem.Code;
								}
							}
						}],
						// TODO: Add Formatter
						/*formatter: function (row, cell, value, m) {
							var assignmentNo =m.field.slice(-4);
							var controllingGroupFk = assignment['ControllingGroup' + assignmentNo + 'Fk'];
							var lookupResult = _.find(logisticSundryLookupService.getControllingUnitDetails(controllingGroupFk), {
								Code: value
							});
							if (m.id && lookupResult) {
								if (m.id.toLowerCase().match('description')) {
									return lookupResult.DescriptionInfo.Translated;
								}
								else if (m.id.toLowerCase().match('commenttext')) {
									return lookupResult.CommentText;
								}
								else if (m.id.toLowerCase().match('code')) {
									return lookupResult.Code;
								}
							}
							return value;
						}*/
					})
				};

			} else {
				const NominalDimKey = 'NominalDimension' + assignmentNo + 'Name';
				let maxLen = 32;
				if (accountInstance[NominalDimKey as keyof IBasicsCustomizeSundryNominalDimensionAssignmentEntity]){
					maxLen = (accountInstance[NominalDimKey as keyof IBasicsCustomizeSundryNominalDimensionAssignmentEntity] as string).length || 32;
				}
				return { maxLength: maxLen };
			}


		}
		return {};
	}

	public provideAccountingLookupOverload<T extends object>(): ConcreteFieldOverload<T> | IAdditionalLookupOptions<T>{
		return {
			type: FieldType.Lookup,
			lookupOptions:  createLookup({
				dataServiceToken: BasicsSharedAccountingLookupService,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
				clientSideFilter: {
					execute(item: IBasicsCustomizeAccountingEntity, context: ILookupContext<IBasicsCustomizeAccountingEntity, ILogisticSundryServiceGroupAccountEntity>): boolean {
						return item['LedgerContextFk'] === context.entity?.LedgerContextFk;
					}
				},
				showClearButton: true
			})
		};
	}
}