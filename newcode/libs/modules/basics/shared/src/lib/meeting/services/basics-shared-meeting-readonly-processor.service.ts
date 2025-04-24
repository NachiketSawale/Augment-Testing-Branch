/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '../../readonly';
import { BasicsMeetingSection, IMtgHeaderEntity } from '@libs/basics/interfaces';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedMeetingDataService } from './basics-shared-meeting-data.service';

/**
 * Basics shared meeting readonly processor
 */
export class BasicsSharedMeetingReadonlyProcessorService<T extends IMtgHeaderEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	private readonly sectionId: BasicsMeetingSection;

	/**
	 *The constructor
	 */
	public constructor(
		sectionId: BasicsMeetingSection,
		protected dataService: BasicsSharedMeetingDataService<T, PT, PU>,
	) {
		super(dataService);
		this.sectionId = sectionId;
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			RfqHeaderFk: (info) => {
				return this.sectionId !== BasicsMeetingSection.RfQ;
			},
			QtnHeaderFk: (info) => {
				return this.sectionId !== BasicsMeetingSection.Quote;
			},
			CheckListFk: (info) => {
				return this.sectionId !== BasicsMeetingSection.CheckList;
			},
			DefectFk: (info) => {
				return this.sectionId !== BasicsMeetingSection.Defect;
			},
			Recurrence: {
				shared: ['BidHeaderFk'], //todo: PrjInfoRequestFk
				readonly: () => true,
			},
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.dataService.isParentAndSelectedReadonly();
	}
}
