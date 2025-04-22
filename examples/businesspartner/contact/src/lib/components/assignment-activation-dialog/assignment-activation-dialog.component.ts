import {Component, inject} from '@angular/core';
import {
	ColumnDef,
	createLookup,
	FieldType,
	IGridConfiguration,
	LookupSimpleEntity
} from '@libs/ui/common';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedContactRoleLookupService,
	BusinesspartnerSharedSubsidiaryLookupService,
} from '@libs/businesspartner/shared';
import {ASSIGNMENT_ACTIVATION_DATA_TOKEN} from '../../services/wizards/assignment-activation.service';
import { IBusinessPartnerAssignmentEntity, IBusinessPartnerSearchMainEntity, ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

@Component({
	selector: 'businesspartner-contact-assignment-activation-dialog',
	templateUrl: './assignment-activation-dialog.component.html',
	styleUrls: ['./assignment-activation-dialog.component.scss']
})
export class ContactAssignmentActivationDialogComponent {
	private readonly columns: ColumnDef<IBusinessPartnerAssignmentEntity>[];
	private readonly dataList: IBusinessPartnerAssignmentEntity[] = [];
	public configuration!: IGridConfiguration<IBusinessPartnerAssignmentEntity>;

	public constructor() {
		this.dataList = inject(ASSIGNMENT_ACTIVATION_DATA_TOKEN);
		this.columns = [
			{
				id: 'islive',
				model: 'IsLive',
				type: FieldType.Boolean,
				label: {text: 'Active', key: 'cloud.common.entityIsLive'},
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'businesspartnerfk',
				model: 'BusinessPartnerFk',
				type: FieldType.Lookup,
				label: {text: 'Business Partner', key: 'businesspartner.main.businessPartnerName1'},
				readonly: true,
				visible: true,
				sortable: true,
				lookupOptions: createLookup<IBusinessPartnerAssignmentEntity, IBusinessPartnerSearchMainEntity>({
					dataServiceToken: BusinessPartnerLookupService
				}),
			},
			{
				id: 'subsidiaryfk',
				model: 'SubsidiaryFk',
				type: FieldType.Lookup,
				label: {text: 'Branch', key: 'sales.common.entitySubsidiaryFk'},
				sortable: true,
				visible: true,
				readonly: true,
				lookupOptions: createLookup<IBusinessPartnerAssignmentEntity, ISubsidiaryLookupEntity>({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
				}),
			},
			{
				id: 'contactrolefk',
				model: 'ContactRoleFk',
				type: FieldType.Lookup,
				label: {text: 'Contact Role', key: 'procurement.rfq.wizard.contacts.contactRole'},
				sortable: true,
				visible: true,
				readonly: true,
				lookupOptions: createLookup<IBusinessPartnerAssignmentEntity, LookupSimpleEntity>({
					dataServiceToken: BusinesspartnerSharedContactRoleLookupService
				}),
			},
		];

		this.initializeGrid();
	}

	private initializeGrid(): void {
		this.configuration = {
			uuid: '489312f78f1c48b58881c43950837428',
			columns: this.columns,
			skipPermissionCheck: true,
			items: this.dataList
		};
	}
}