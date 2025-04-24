/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, InjectionToken, Renderer2, inject } from '@angular/core';
import { PlatformDateService } from '@libs/platform/common';
import { FieldType, getCustomDialogDataToken, IAdditionalSelectOptions, IControlContext, StandardDialogButtonId } from '@libs/ui/common';
import { IComparePrintSaveProfileDialogContext, IComparePrintSaveProfileEditorDialog } from '../../../../model/entities/print/compare-print-save-profile-options.interface';
import { IComparePrintProfileEntity } from '../../../../model/entities/print/compare-print-profile-entity.interface';
import { CompareProfileSaveLocations } from '../../../../model/enums/compare-profile-save-locations.enum';
import { DomainControlContext } from '../../../../model/classes/domain-control-context.class';
import { ProcurementPricecomparisonUtilService } from '../../../../services/util.service';

export const COMPARE_PRINT_DLG_SAVE_PROFILE_CONTEXT_TOKEN = new InjectionToken('compare-print-dlg-save-profile-context-token');

@Component({
	selector: 'procurement-pricecomparison-compare-print-profile-save',
	templateUrl: './compare-print-profile-save.component.html',
	styleUrls: ['./compare-print-profile-save.component.scss'],
})
export class ProcurementPricecomparisonComparePrintProfileSaveComponent implements AfterViewInit {
	private readonly dateSvc = inject(PlatformDateService);
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly dlgWrapper = inject(getCustomDialogDataToken<IComparePrintProfileEntity[], ProcurementPricecomparisonComparePrintProfileSaveComponent>());
	public readonly dialogContext = inject<IComparePrintSaveProfileDialogContext>(COMPARE_PRINT_DLG_SAVE_PROFILE_CONTEXT_TOKEN);
	public fieldType = FieldType;
	public loading: boolean = false;
	public profiles: IComparePrintProfileEntity[] = this.dialogContext.profiles;
	public dialogInfo: IComparePrintSaveProfileEditorDialog;

	public location: string = CompareProfileSaveLocations.user.toString();
	public locationContext: IControlContext = ((owner: ProcurementPricecomparisonComparePrintProfileSaveComponent) => {
		return new DomainControlContext('print-profile-save-location', false, {
			get value(): string {
				return owner.location;
			},
			set value(v: string) {
				owner.location = v;
				owner.profileOptions.itemsSource = {
					items: owner.buildProfileItems(owner.location, owner.profiles)
				};
			}
		});
	})(this);
	public locationOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: CompareProfileSaveLocations.user.toString(),
				displayName: {key: 'basics.common.configLocation.user'}
			}, {
				id: CompareProfileSaveLocations.role.toString(),
				displayName: {key: 'basics.common.configLocation.role'}
			}, {
				id: CompareProfileSaveLocations.system.toString(),
				displayName: {key: 'basics.common.configLocation.system'}
			}]
		}
	};

	public profile: string = '';
	public profileContext: IControlContext = ((owner: ProcurementPricecomparisonComparePrintProfileSaveComponent) => {
		return new DomainControlContext('print-profile-save-profile', false, {
			get value(): string {
				return owner.profile;
			},
			set value(v: string) {
				owner.profile = v;
			}
		});
	})(this);
	public profileOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: this.buildProfileItems(this.location, this.profiles)
		}
	};

	public profileName?: string;

	public constructor(
		private elementRef: ElementRef,
		private render: Renderer2
	) {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonComparePrintProfileSaveComponent): IComparePrintSaveProfileEditorDialog {
			return {
				get value(): IComparePrintProfileEntity[] {
					return owner.dlgWrapper.value as IComparePrintProfileEntity[];
				},
				set value(v: IComparePrintProfileEntity[]) {
					owner.dlgWrapper.value = v;
				},
				get loading(): boolean {
					return owner.loading;
				},
				set loading(v: boolean) {
					owner.loading = v;
				},
				get profileName(): string {
					return owner.profileName ?? '';
				},
				set profileName(v: string) {
					owner.profileName = v;
				},
				get location(): CompareProfileSaveLocations {
					return owner.location === CompareProfileSaveLocations.user.toString()
						? CompareProfileSaveLocations.user
						: (owner.location === CompareProfileSaveLocations.role.toString() ? CompareProfileSaveLocations.role : CompareProfileSaveLocations.system);
				},
				set location(v: CompareProfileSaveLocations) {
					owner.location = v.toString();
				},
				get profile(): IComparePrintProfileEntity | undefined {
					return owner.profiles.find(e => e.Id.toString() === owner.profile);
				},
				set profile(v: IComparePrintProfileEntity) {
					owner.profile = v.Id.toString();
				},
				get profiles(): IComparePrintProfileEntity[] {
					return owner.profiles;
				},
				set profiles(v: IComparePrintProfileEntity[]) {
					owner.profiles = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);

		this.dialogInfo.value = this.profiles;
	}

	private buildProfileItems(location: string, profiles: IComparePrintProfileEntity[]): Array<{ id: string, displayName: string }> {
		const types = CompareProfileSaveLocations;
		const filteredProfiles: IComparePrintProfileEntity[] = profiles.filter((item) => {
			return item.Description !== null && ((location === types.user.toString() && !!item.FrmUserFk) || (location === types.role.toString() && !!item.FrmAccessRoleFk) || (location === types.system.toString() && item.IsSystem));
		});
		return filteredProfiles.map((profile) => {
			const item = {
				id: profile.Id.toString(),
				displayName: ''
			};
			// TODO-DRIZZLE: let userName = platformUserInfoService.logonName(view.UpdatedBy || view.InsertedBy);
			// var userName = platformUserInfoService.logonName(profile.UpdatedBy || profile.InsertedBy);
			const userName = 'test';
			let extStr: string = '';

			if (userName) {
				extStr = userName + ' | ' + this.dateSvc.formatLocal(profile.UpdatedAt ?? profile.InsertedAt ?? new Date(), 'dd/MM/yyyy | hh:mm:ss');
				item.displayName = profile.Description + ' (' + extStr + ')' + (profile.IsDefault && (' (' + this.utilSvc.getTranslationText('basics.common.button.default') + ')') || '');
			} else {
				// TODO-DRIZZLE: To be checked.
				/*item.displayName = profile.Description + ' ( loading ...)';
				platformUserInfoService.loadUsers([profile.UpdatedBy || profile.InsertedBy]).then(function () {
					userName = platformUserInfoService.logonName(profile.UpdatedBy || profile.InsertedBy);
					extStr = userName + ' | ' + moment(profile.UpdatedAt || profile.InsertedAt).format('L | LTS');
					item.displayName = profile.Description + ' (' + extStr + ')' + (profile.IsDefault && (' (' + this.utilSvc.getTranslationText('basics.common.button.default') + ')') || '');
				});*/
			}

			return item;
		});
	}

	public ngAfterViewInit() {
		this.render.setAttribute(this.elementRef.nativeElement.querySelector('#print-profile-save-profile'), 'size', '5');
	}
}
