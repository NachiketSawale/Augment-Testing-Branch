/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, DoCheck, inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {
	BasicsSharedDialogLookupBaseComponent,
	ChangeDetector,
	CustomDialogLookupOptions,
	ICreateOptions,
	ICustomFormEditorDialog,
	ICustomSearchDialogOptions,
	ISearchEntity
} from '../../../form-dialog-lookup-base';
import { Observable, of } from 'rxjs';
import { AddressEntity } from '../../model/address-entity';
import {
	ColumnDef,
	CountryEntity,
	createLookup,
	FieldType,
	FormRow,
	IClosingDialogButtonEventInfo,
	IDialogButtonBase,
	IFieldValueChangeInfo,
	IFormConfig,
	StandardDialogButtonId,
	UiCommonCountryLookupService
} from '@libs/ui/common';
import { IEntityContext, PropertyPath } from '@libs/platform/common';
import { BasicsSharedAddressMapWrapperComponent } from '../address-map-wrapper/address-map-wrapper.component';
import { BasicsSharedAddressService } from '../../services/address.service';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { BasicsSharedLanguageLookupService } from '../../../lookup-services/customize';
import { BasicsSharedStateLookupService } from '../../../lookup-services/basics-state-lookup.service';
import { IBasicsCustomizeLanguageEntity, IBasicsStateEntity } from '@libs/basics/interfaces';

@Component({
	selector: 'basics-shared-address-dialog',
	templateUrl: './address-dialog.component.html',
	styleUrls: ['./address-dialog.component.scss']
})
export class BasicsSharedAddressDialogComponent extends BasicsSharedDialogLookupBaseComponent<AddressEntity, object> implements OnInit, DoCheck {
	private changeDetector = new ChangeDetector<AddressEntity>(() => this.editFormEntity as AddressEntity);
	private countryService = inject(UiCommonCountryLookupService<CountryEntity>);
	private readonlyTrue: string[] = ['Street', 'ZipCode', 'City', 'County', 'CountryFk', 'StateFk'];
	private readonlyFalse: string[] = ['Address'];
	private countryRow: FormRow<AddressEntity> = {
		id: 'country',
		label: {
			text: 'Country',
			key: 'cloud.common.AddressDialogCountry'
		},
		type: FieldType.Lookup,
		lookupOptions: createLookup<AddressEntity, CountryEntity>({
			dataServiceToken: UiCommonCountryLookupService,
		}),
		model: 'CountryFk',
		sortOrder: 5,
		readonly: false,
		change: (info: IFieldValueChangeInfo<AddressEntity>) => {
			this.updateStateField(info.newValue as number, true);
		},
	};

	private stateRow: FormRow<AddressEntity> = {
		id: 'state',
		label: {
			text: 'State',
			key: 'cloud.common.AddressDialogState'
		},
		type: FieldType.Lookup,
		lookupOptions: createLookup<AddressEntity, IBasicsStateEntity>({
			dataServiceToken: BasicsSharedStateLookupService,
			showClearButton: true,
			serverSideFilter: {
				key: 'address-dialog-state-filter',
				execute(entity: IEntityContext<AddressEntity>): string | object {
					return 'CountryFk=' + entity.entity?.CountryFk;
				}
			}
		}),
		model: 'StateFk',
		sortOrder: 6,
		readonly: false,
		visible: false
	};

	private formConfig: IFormConfig<AddressEntity> = {
		formId: 'cloud.common.dialog.default.form',
		showGrouping: false,
		addValidationAutomatically: false,
		rows: [{
			id: 'street',
			label: {
				text: 'Street',
				key: 'cloud.common.AddressDialogStreet'
			},
			type: FieldType.Comment,
			model: 'Street',
			sortOrder: 1,
			readonly: false
		}, {
			id: 'zipcode',
			label: {
				text: 'Zip Code',
				key: 'cloud.common.AddressDialogZipCode'
			},
			type: FieldType.Description,
			model: 'ZipCode',
			maxLength: 20,
			sortOrder: 2,
			readonly: false
		}, {
			id: 'city',
			label: {
				text: 'City',
				key: 'cloud.common.AddressDialogCity'
			},
			type: FieldType.Description,
			model: 'City',
			sortOrder: 3,
			readonly: false
		}, {
			id: 'county',
			label: {
				text: 'County',
				key: 'cloud.common.AddressDialogCounty'
			},
			type: FieldType.Description,
			model: 'County',
			sortOrder: 4,
			readonly: false
		}, this.countryRow, this.stateRow, {
			id: 'languageFk',
			label: {
				text: 'Language',
				key: 'cloud.common.languageColHeader_Language'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup<AddressEntity, IBasicsCustomizeLanguageEntity>({
				dataServiceToken: BasicsSharedLanguageLookupService,
			}),
			model: 'LanguageFk',
			sortOrder: 7,
			readonly: false
		}, {
			id: 'latitude',
			label: {
				text: 'Latitude',
				key: 'cloud.common.AddressDialogLatitude'
			},
			type: FieldType.Decimal,
			model: 'Latitude',
			sortOrder: 8,
			readonly: true
		}, {
			id: 'longitude',
			label: {
				text: 'Longitude',
				key: 'cloud.common.AddressDialogLongitude'
			},
			type: FieldType.Decimal,
			model: 'Longitude',
			sortOrder: 9,
			readonly: true
		}, {
			id: 'supplement',
			label: {
				text: 'Address Supplement',
				key: 'cloud.common.entityAddressSupplement'
			},
			type: FieldType.Comment,
			model: 'Supplement',
			sortOrder: 10,
			readonly: false
		}, {
			id: 'addressModified',
			label: {
				text: 'Manual Input',
				key: 'cloud.common.AddressDialogManualInput'
			},
			type: FieldType.Boolean,
			model: 'AddressModified',
			sortOrder: 11,
			change: (info: IFieldValueChangeInfo<AddressEntity>) => {
				this.updateReadonly(info.newValue as boolean);
			},
			readonly: false
		}, {
			id: 'address',
			label: {
				text: 'Address',
				key: 'cloud.common.AddressDialogAddress'
			},
			type: FieldType.Remark,
			model: 'Address',
			sortOrder: 12,
			readonly: false
		}]
	};

	private formEntityRuntimeData: EntityRuntimeData<AddressEntity> = new EntityRuntimeData<AddressEntity>();

	private updateStateField(countryId: number, resetState: boolean = false) {
		this.countryService.getItemByKey({id: countryId}).subscribe((country) => {
			this.stateRow.visible = country.Recordstate;
			if (resetState && this.editFormEntity) {
				this.editFormEntity.StateFk = undefined;
			}
		});
	}

	private updateEntityRuntimeData<TR extends object>(entityRuntimeData: EntityRuntimeData<TR>, formConfig: IFormConfig<TR>) {
		formConfig.rows.forEach((row: FormRow<TR>) => {
			const field = entityRuntimeData.readOnlyFields.find(r => r.field === row.model);
			if (field) {
				field.readOnly = row.readonly as boolean;
			} else {
				entityRuntimeData.readOnlyFields.push({
					field: row.model as PropertyPath<TR>,
					readOnly: row.readonly as boolean
				});
			}
		});
	}

	private updateReadonly(addressModified: boolean) {
		const readonlyFields = [...this.readonlyTrue, ...this.readonlyFalse];
		this.formConfig.rows.forEach(row => {
			if (readonlyFields.some(f => f === row.model)) {
				row.readonly = addressModified ? this.readonlyTrue.some(field => field === row.model) : this.readonlyFalse.some(field => field === row.model);
			}
		});

		this.updateEntityRuntimeData(this.formEntityRuntimeData, this.formConfig);
	}

	private provideButtons(): IDialogButtonBase<ICustomFormEditorDialog<AddressEntity>>[] {
		return [{
			id: 'map',
			caption: {
				text: 'Map',
				key: 'cloud.common.addressDialogMap'
			},
			isVisible: true,
			isDisabled: false,
			fn: (event: MouseEvent, info: IClosingDialogButtonEventInfo<ICustomFormEditorDialog<AddressEntity>, void>) => {
				const sectionRight = info.dialog.options.sectionRight;
				if (sectionRight) {
					sectionRight.visible = !sectionRight.visible;
				}
			},
			autoClose: false
		}, {
			id: StandardDialogButtonId.Ok
		}, {
			id: StandardDialogButtonId.Cancel
		}];
	}

	private provideCreateOptions(): ICreateOptions<AddressEntity, object> {
		return {
			createUrl: 'basics/common/address/create',
			formDialogOptions: {
				id: '0B02B050BEEE4BF1B368A471B401E79B',
				headerText: 'cloud.common.addressDialogTitle',
				formConfiguration: this.formConfig,
				entityRuntimeData: this.formEntityRuntimeData,
				buttons: this.provideButtons(),
				sectionRight: {
					component: BasicsSharedAddressMapWrapperComponent,
					providers: [{
						provide: AddressEntity,
						useFactory: () => {
							return this.editFormEntity;
						}
					}]
				},
				resizeable: true,
				bottomDescription: {
					text: 'Loading map ...',
					key: 'basics.common.map.message.loadingMap'
				}
			},
			handleCreateSucceeded: (item: AddressEntity, entity: object) => {
				this.preprocess(item);
				return item;
			},
			onDialogOpening: (formEntity: AddressEntity) => {
				this.updateStateField(formEntity.CountryFk);
			}
		};
	}

	private provideSearchOptions(): ICustomSearchDialogOptions<AddressEntity, object> {
		const searchFormEntityRuntimeData: EntityRuntimeData<ISearchEntity> = new EntityRuntimeData<ISearchEntity>();
		const searchFormConfig: IFormConfig<ISearchEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: []
		};

		return {
			headerText: {
				text: 'Project Address Lookup',
				key: 'procurement.contract.addressDialogTitle'
			},
			form: {
				configuration: searchFormConfig,
				entityRuntimeData: searchFormEntityRuntimeData,
				entity: (entity: object) => {
					return {};
				}
			},
			grid: {
				config: {
					uuid: 'E9F9813B7B19477AA37020B904A9483F',
					columns: [{
						id: 'zipcode',
						label: {
							text: 'Zip Code',
							key: 'cloud.common.AddressDialogZipCode'
						},
						type: FieldType.Description,
						model: 'ZipCode',
						maxLength: 20,
						sortOrder: 1,
						readonly: false,
						width: 100,
						visible: true,
					}, {
						id: 'addressline',
						label: {
							text: 'Delivery Address',
							key: 'cloud.common.entityDeliveryAddress'
						},
						type: FieldType.Remark,
						model: 'Address',
						sortOrder: 2,
						readonly: false,
						width: 100,
						visible: true,
					}, {
						id: 'address',
						label: {
							text: 'Address',
							key: 'cloud.common.AddressDialogAddress'
						},
						type: FieldType.Remark,
						model: 'Address',
						sortOrder: 3,
						readonly: false,
						width: 100,
						visible: true,
					}] as ColumnDef<AddressEntity>[]
				}
			},
			resizeable: true,
			minWidth: '600px',
			width: '940px'
		};
	}

	private defaultOptions(): Observable<CustomDialogLookupOptions<AddressEntity, object>> {
		const createOptions: ICreateOptions<AddressEntity, object> = this.provideCreateOptions();
		const searchOptions: ICustomSearchDialogOptions<AddressEntity, object> = this.provideSearchOptions();

		const options: CustomDialogLookupOptions<AddressEntity, object> = {
			uuid: 'E9F9813B7B19477AA37020B904A9483F',
			displayMember: 'AddressLine',
			descriptionMember: 'AddressLine',
			dataServiceToken: BasicsSharedAddressService,
			serverSideFilter: {
				key: 'address-filter',
				execute: (context: IEntityContext<object>) => {
					return {
						PKey1: _.get(context.entity, 'ProjectFk')
					};
				}
			},
			showEditButton: true,
			showClearButton: true,
			cloneOnly: true,
			createOptions: createOptions,
			searchOptions: searchOptions,
			popupOptions: {
				options: {
					config: {
						uuid: 'lookup-popup-project2Address',
						columns: [{
							id: 'description',
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							type: FieldType.Description,
							model: 'Description',
							sortOrder: 1,
							width: 100,
							visible: true,
						}, {
							id: 'commentText',
							label: {
								text: 'Comment Text',
								key: 'basics.common.entityCommentText'
							},
							type: FieldType.Remark,
							model: 'CommentText',
							sortOrder: 2,
							width: 100,
							visible: true,
						}, {
							id: 'address',
							label: {
								text: 'Address',
								key: 'basics.common.entityAddress'
							},
							type: FieldType.Remark,
							model: 'Address',
							sortOrder: 3,
							width: 100,
							visible: true,
						}, {
							id: 'addressType',
							label: {
								text: 'Address Type',
								key: 'project.main.AddressTypeFk' // TODO: the key should be moved to basics.common from project.
							},
							type: FieldType.Integer,
							model: 'AddressTypeFk',
							sortOrder: 4,
							width: 100,
							visible: true,
						}] as ColumnDef<AddressEntity>[]
					}
				}
			}
		};

		return of(options);
	}

	private preprocess(item: AddressEntity) {
		let countryId = item.CountryFk;
		if (this.entity) {
			const countryStr = _.toLower('CountryFk');
			const countryProp = Object.keys(this.entity).find(key => _.toLower(key) === countryStr);
			if (countryProp) {
				countryId = _.get(this.entity, countryProp) as number;
			}
		}
		if (countryId && countryId > 0) {
			item.CountryFk = countryId;
		}
	}

	/**
	 * Initialize component.
	 */
	public override ngOnInit() {
		super.ngOnInit();
		this.changeDetector.watch('AddressModified').subscribe(state => {
			this.updateReadonly(state.newValue as boolean);
		});
	}

	/**
	 * Detect the changes.
	 */
	public ngDoCheck() {
		this.changeDetector.digest();
	}

	/**
	 * Initialize custom dialog options.
	 */
	public initializeOptions(): Observable<CustomDialogLookupOptions<AddressEntity, object>> {
		return this.defaultOptions();
	}

	/**
	 * Update selected item according to the user data cache.
	 * @param item The selected item.
	 */
	public override customHandleOK(item: AddressEntity | null | undefined) {
		if (item) {
			this.createService.setUserDataCache({
				CountryFk: item.CountryFk
			});
		}
	}
}
