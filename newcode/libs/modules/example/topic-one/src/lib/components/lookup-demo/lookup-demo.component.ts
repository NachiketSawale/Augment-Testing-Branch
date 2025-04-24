/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, ProviderToken, ViewEncapsulation } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import {
	createLookup,
	FieldType, FormRow,
	IFormConfig,
	ILookupContext,
	ILookupOptions,
	ILookupReadonlyDataService,
	LookupInputType,
	ServerSideFilterValueType
} from '@libs/ui/common';
import {
	BusinesspartnerSharedContactAbcLookupService,
	BusinesspartnerSharedContactOriginLookupService,
	BusinesspartnerSharedContactRoleLookupService,
	BusinesspartnerSharedContactTimelinessLookService,
	BusinesspartnerSharedSubsidiaryLookupService,
	BusinesspartnerSharedSubsidiaryStatusLookupService,
} from '@libs/businesspartner/shared';
import { ISubsidiaryLookupEntity } from '@libs/businesspartner/interfaces';

export type MainEntity = {
	[key: string]: LookupInputType;
};

@Component({
	selector: 'example-topic-one-lookup-demo',
	templateUrl: './lookup-demo.component.html',
	styleUrls: ['./lookup-demo.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LookupDemoComponent extends ContainerBaseComponent {
	/**
	 * 1. Added a lookup property like 'SubsidiaryStatusFK' in mainEntity.
	 * 2. Created a row in formConfig like 'this.createLookupField('SubsidiaryStatusFK', BusinesspartnerSharedSubsidiaryStatusLookupService)'.
	 */

	public mainEntity: MainEntity = {
		SubsidiaryFK: 1000777,
		ContactOriginFK: 1,
		ContactRoleFK: 1,
		TimelineFK: 1,
		SubsidiaryStatusFK: 1,
		ContactAbcFK: 1
	};

	public formConfig: IFormConfig<MainEntity> = {
		formId: 'cloud.common.dialog.default.form',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: [
			this.createLookupField('SubsidiaryFK', BusinesspartnerSharedSubsidiaryLookupService, {
				serverSideFilter: {
					key: 'contact-subsidiary-filter',
					execute: (context: ILookupContext<ISubsidiaryLookupEntity, MainEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> => {
						return {
							BusinessPartnerFk: 195
						};
					}
				}
			}),
			this.createLookupField('ContactOriginFK', BusinesspartnerSharedContactOriginLookupService),
			this.createLookupField('ContactRoleFK', BusinesspartnerSharedContactRoleLookupService),
			this.createLookupField('TimelineFK', BusinesspartnerSharedContactTimelinessLookService),
			this.createLookupField('SubsidiaryStatusFK', BusinesspartnerSharedSubsidiaryStatusLookupService),
			this.createLookupField('ContactAbcFK', BusinesspartnerSharedContactAbcLookupService)
		]
	};

	private createLookupField<TItem extends object>(
		model: string,
		dataServiceToken: ProviderToken<ILookupReadonlyDataService<TItem, MainEntity>>,
		lookupOptions?: ILookupOptions<TItem, MainEntity>
	): FormRow<MainEntity> {
		return {
			id: model.toLowerCase(),
			label: {
				text: model
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: dataServiceToken,
				...lookupOptions
			}),
			model: model
		};
	}
}
