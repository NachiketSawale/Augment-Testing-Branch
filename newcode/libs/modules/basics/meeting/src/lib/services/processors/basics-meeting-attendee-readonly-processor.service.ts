/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IMtgAttendeeEntity } from '@libs/basics/interfaces';
import { BasicsMeetingAttendeeDataService } from '../basics-meeting-attendee-data.service';

/**
 * Basics Meeting Attendee readonly processor
 */
export class BasicsMeetingAttendeeReadonlyProcessorService extends EntityReadonlyProcessorBase<IMtgAttendeeEntity> {

	/**
	 *The constructor
	 */
	public constructor(protected dataService: BasicsMeetingAttendeeDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IMtgAttendeeEntity> {
		return {
			Title: {
				shared: ['Role', 'FirstName', 'FamilyName', 'Department', 'FirstName', 'Email', 'TelephoneNumberFk', 'TelephoneMobilFk'],
				readonly: () => true,
			},
			BusinessPartnerFk: {
				shared: ['SubsidiaryFk', 'ContactFk'],
				readonly: (info) => !!info.item.ClerkFk,
			},
			ClerkFk: (info) => {
				return !!info.item.BusinessPartnerFk;
			},
		};
	}

	protected override readonlyEntity(item: IMtgAttendeeEntity): boolean {
		return !this.dataService.getEntityEditable();
	}
}
