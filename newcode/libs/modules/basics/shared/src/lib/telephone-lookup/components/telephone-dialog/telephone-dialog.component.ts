/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, DestroyRef, inject } from '@angular/core';
import { BasicsSharedTelephoneService } from '../../services/telephone.service';
import { CountryEntity, createLookup, FieldType, FormRow, IFieldValueChangeInfo, IFormConfig, UiCommonCountryLookupService } from '@libs/ui/common';
import { TelephoneEntity } from '../../model/telephone-entity';
import { forkJoin, Observable, map, of, concatAll, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TelephoneBracketMode } from '../../model/enums/telephone-bracket-mode';
import { CustomDialogLookupOptions } from '../../../form-dialog-lookup-base';
import { TelephoneScheme } from '../../model/interfaces/telephone-scheme';
import { BasicsSharedDialogLookupBaseComponent } from '../../../form-dialog-lookup-base/';

@Component({
	selector: 'basics-shared-telephone-dialog',
	templateUrl: './telephone-dialog.component.html',
	styleUrls: ['./telephone-dialog.component.css']
})
export class BasicsSharedTelephoneDialogComponent extends BasicsSharedDialogLookupBaseComponent<TelephoneEntity, object> {
	private destroyRef = inject(DestroyRef);
	private countryService = inject(UiCommonCountryLookupService<CountryEntity>);
	private telephoneService = inject(BasicsSharedTelephoneService);
	private telephoneBracketMode!: TelephoneBracketMode;
	private telephoneScheme!: TelephoneScheme;

	private provideButtons() {
		// Call telephone button
		const buttons = [];
		if (this.telephoneScheme && this.telephoneScheme.id) {
			buttons.push({
				id: 'call',
				content: '',
				order: 2,
				disabled: false,
				hidden: false,
				shownOnReadonly: true,
				css: {
					class: 'btn btn-default ' + this.telephoneScheme.css
				},
				execute: () => {
					if (this.objectValue) {
						this.callTelephone(this.objectValue, this.telephoneScheme);
					}
				},
				canExecute: () => {
					return !!this.objectValue && !!this.objectValue.Telephone;
				},
				isDisabled: () => {
					return !this.objectValue || !this.objectValue.Telephone;
				}
			});
		}
		return buttons;
	}

	private defaultOptions(): Observable<CustomDialogLookupOptions<TelephoneEntity, object>> {
		const options = {
			displayMember: 'Telephone',
			descriptionMember: 'Telephone',
			createOptions: {
				createUrl: 'basics/common/telephonenumber/create',
				formDialogOptions: {
					id: 'D42704A59B394C8383602161D8E4FA88',
					headerText: 'cloud.common.telephoneDialogTitle',
					formConfiguration: this.formConfig(),
				},
				handleCreateSucceeded: (item: TelephoneEntity, entity: object) => {
					this.preprocess(item);
					return item;
				},
				onDialogOpening: (formEntity: TelephoneEntity) => {
					this.countryService.getItemByKey({id: formEntity.CountryFk as number}).subscribe(() => {
						this.formatTelephone(this.editFormEntity);
					});
				}
			},
			buttons: this.provideButtons(),
			showClearButton: true,
			showEditButton: true
		};

		return of(options);
	}

	private createFormRows(rows: FormRow<TelephoneEntity>[]) {
		const finalRows = rows ? rows : [];

		finalRows.forEach(row => {
			row.change = (changeInfo: IFieldValueChangeInfo<TelephoneEntity>) => {
				this.formatTelephone(changeInfo.entity);
			};
		});

		return finalRows;
	}

	private formConfig(): IFormConfig<TelephoneEntity> {
		return {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: this.createFormRows([{
				id: 'countryfk',
				label: {
					text: 'Country',
					key: 'cloud.common.TelephoneDialogCountry'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup<TelephoneEntity, CountryEntity>({
					dataServiceToken: UiCommonCountryLookupService,
				}),
				model: 'CountryFk',
				sortOrder: 1,
				required: true
			}, {
				id: 'areacode',
				label: {
					text: 'Area Code',
					key: 'cloud.common.TelephoneDialogAreaCode'
				},
				type: FieldType.Description,
				model: 'AreaCode',
				maxLength: 252,
				sortOrder: 2,
			}, {
				id: 'phonenumber',
				label: {
					text: 'Phone Number',
					key: 'cloud.common.TelephoneDialogPhoneNumber'
				},
				type: FieldType.Description,
				model: 'PhoneNumber',
				maxLength: 252,
				sortOrder: 3
			}, {
				id: 'extention',
				label: {
					text: 'Extension',
					key: 'cloud.common.TelephoneDialogExtention'
				},
				type: FieldType.Description,
				model: 'Extention',
				maxLength: 252,
				sortOrder: 4,
			}, {
				id: 'telephone',
				label: {
					text: 'Telephone',
					key: 'cloud.common.TelephoneDialogTelephone'
				},
				type: FieldType.Description,
				model: 'Telephone',
				maxLength: 100,
				sortOrder: 5,
				readonly: true
			}, {
				id: 'commenttext',
				label: {
					text: 'Comment Text',
					key: 'cloud.common.TelephoneDialogCommentText'
				},
				type: FieldType.Comment,
				model: 'CommentText',
				maxLength: 255,
				sortOrder: 6,
			}])
		};
	}

	private callTelephone(telephone: TelephoneEntity, scheme: TelephoneScheme): void {
		window.location.href = scheme.scheme + ':' + telephone.Telephone;
	}

	private preprocess(item: TelephoneEntity) {
		const userData = this.createService.getUserDataCache<TelephoneEntity>();
		item.CountryFk = userData && userData.CountryFk ? userData.CountryFk.value as number : item.CountryFk;
	}

	private formatTelephone(entity?: TelephoneEntity) {
		if (entity) {
			entity.Telephone = this.telephoneService.formatTelephone(entity, this.telephoneBracketMode);
			entity.Pattern = this.telephoneService.formatPattern(entity);
		}
	}

	/**
	 * Initialize custom dialog options.
	 */
	public initializeOptions(): Observable<CustomDialogLookupOptions<TelephoneEntity, object>> {
		return forkJoin([
			this.telephoneService
				.getTelephoneBracketMode()
				.pipe(
					takeUntilDestroyed(this.destroyRef)
				),
			this.telephoneService
				.getTelephoneScheme()
				.pipe(
					takeUntilDestroyed(this.destroyRef)
				)
		]).pipe(
			tap(values => {
				this.telephoneBracketMode = values[0] as TelephoneBracketMode;
				this.telephoneScheme = values[1] as TelephoneScheme;
			}),
			map(() => this.defaultOptions()),
			concatAll()
		);
	}

	/**
	 * Update selected item according to the user data cache.
	 * @param item The selected item.
	 */
	public override customHandleOK(item: TelephoneEntity | null | undefined) {
		if (item) {
			this.createService.setUserDataCache({
				CountryFk: item.CountryFk
			});
		}
	}
}
