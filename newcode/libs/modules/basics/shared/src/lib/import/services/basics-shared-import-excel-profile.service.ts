import { inject } from '@angular/core';
import { BasicsSharedImportModel } from '../models/types/basics-shared-import-model.type';
import { ProfileContext } from '../../model/enums/profile-context.enums';
import { map, Subject } from 'rxjs';
import { PlatformConfigurationService, PlatformHttpService, PlatformPermissionService } from '@libs/platform/common';
import { cloneDeep, pick } from 'lodash';
import { BasicsSharedImportOptions } from '../models/types/basics-shared-import-options.type';
import { BasicsSharedImportProfileLookup } from '../models/types/basics-shared-import-profile-lookup.type';
import { BasicsSharedImportDescriptor, BasicsSharedImportField } from '../models/types/basics-shared-import-descriptor.type';
import { UiCommonProfileDialogService } from '@libs/ui/common';

export class BasicsSharedImportExcelProfileService<TCustom extends object> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly configService = inject(PlatformConfigurationService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	public readonly profileService = inject(UiCommonProfileDialogService);

	/**
	 * Selected item changed
	 */
	public selectedItemChanged = new Subject<void>();

	// private http = inject(HttpClient);
	// private configService = inject(PlatformConfigurationService);

	private _selectedId = -1;
	private _data: BasicsSharedImportModel<TCustom>[] = [];
	private static Profiles: BasicsSharedImportProfileLookup[] = [];
	private readonly _newProfile: BasicsSharedImportModel<TCustom> = {
		id: 0,
		ProfileName: 'New Profile',
		File2Import: '',
		ImportFormat: ProfileContext.FreeExcel, // excel
		ExcelSheetName: '',
		ImportType: 1, //this property use material BasicsSharedImport // TODO: can not found the usage, maybe can remove it.
		ImportDescriptor: { DoubletFindMethods: [], Fields: [] },
	};

	private _defaultProfile: BasicsSharedImportModel<TCustom> = cloneDeep(this._newProfile);

	private _profileInDb: BasicsSharedImportModel<TCustom>[] = [];

	// in the past, profile will save all frontend config to db, which cause many bugs after UI changed.
	// now, only will get below properties form profile save in db.
	private readonly _modelFieldsFromDb: (keyof BasicsSharedImportModel<TCustom>)[] = ['ProfileName', 'ProfileAccessLevel', 'ImportFormat'];
	private readonly _descriptorFieldsFromDb: (keyof BasicsSharedImportDescriptor<TCustom>)[] = ['CustomSettings', 'DoubletFindMethods'];
	private readonly _mappingFieldsFromDb: (keyof BasicsSharedImportField)[] = ['PropertyName', 'MappingName', 'DefaultValue'];

	public constructor() {
		this._data = this._data.concat(this._newProfile);
	}

	/**
	 * use for lookup
	 */
	public getListForLookup() {
		return BasicsSharedImportExcelProfileService.Profiles;
	}

	/**
	 * get item by profile name
	 * @param value
	 */
	public getItemByProfileName(value: string) {
		if (!this._data || this._data.length === 0) {
			return null;
		}

		let item = this._data[0]; // default: new record
		for (const element of this._data) {
			if (element.ProfileName === value) {
				item = element;
				break;
			}
		}
		return item;
	}

	/**
	 * get profile in db
	 * @param profileName
	 */
	public getDbProfileByName(profileName: string) {
		if (this._profileInDb.length === 0) {
			return null;
		}
		return this._profileInDb.find((item) => {
			return item.ProfileName === profileName;
		});
	}

	/**
	 * is new profile
	 * @param profileId
	 */
	public isNewProfile(profileId: number) {
		return profileId === 0;
	}

	public saveProfile(profile: BasicsSharedImportModel<TCustom>) {
		// validate profile name
		if (!profile.ProfileName || profile.ProfileName.length === 0) {
			throw new Error('Name must not be empty!');
		}

		if (profile.ProfileName === this._data[0].ProfileName) {
			throw new Error('Name not valid!');
		}

		// ensure uniqe name for new profiles
		const lookupProfile = this._data.find((item) => {
			return item.ProfileName === profile.ProfileName && item.id !== profile.id;
		});
		if (lookupProfile) {
			throw new Error('Profile name already exists!');
		}

		return this.http.post$('basics/import/profile/saveas', profile).pipe(
			map(() => {
				if (this.isNewProfile(profile.id)) {
					profile.id = this._data.length;
					this._data.push(profile);
				} else {
					for (let i = 0, len = this._data.length; i < len; i++) {
						if (this._data[i].id === profile.id) {
							this._data[i] = profile;
							return;
						}
					}
				}
				this.updateProfileNames();
				this.setSelectedId(profile.id);
			}),
		);
	}

	public showSaveProfileAsDialog(profile: BasicsSharedImportModel<TCustom>) {
		// TODO: lack of showSaveProfileAsDialog
		// const modalOptions = {
		// 	headerText: $translate.instant('basics.import.header.saveImportDefinition'),
		// 	areaLabelText: $translate.instant('basics.common.dialog.saveProfile.labelAccessLevel'),
		// 	nameLabelText: $translate.instant('basics.common.dialog.saveProfile.labelProfileName'),
		// 	bodyText: $translate.instant('basics.common.dialog.saveProfile.placeholderProfileName'),
		// 	areaSystem: service.hasSystemPermission(permissions.create),    // todo: user.hasPermisson ? true : false
		// 	value: {selectedArea: {}, textProfileName: ''}  // object that will be returned
		// };
		//
		// platformDialogService.showSaveProfileAsDialog(modalOptions).then(
		// 	function (result) {
		// 		//var selectedItem = service.getSelectedItem();
		// 		service.saveAs(profile, result.value.textProfileName, result.value.selectedArea.description);
		// 	}
		// );
		const options = {
			headerText: 'basics.import.header.saveImportDefinition',
		};
		this.profileService.showSaveProfileAsDialog(options);
	}

	public setImportOptions(importOptions: BasicsSharedImportOptions<TCustom>) {
		this._defaultProfile = cloneDeep(this._newProfile);
		this._defaultProfile.ImportDescriptor = importOptions.ImportDescriptor;
		// field array needs unique id for using with grid!
		this._defaultProfile.ImportDescriptor.Fields.forEach((field, key) => {
			field.Id = key;
		});
	}

	/**
	 * load profiles from server
	 */
	public async loadData(importOptions: BasicsSharedImportOptions<TCustom>) {
		return this.http.get<BasicsSharedImportModel<TCustom>[]>('basics/import/profile/list?moduleName=' + importOptions.moduleName).then((data) => {
			this._profileInDb = data;
			this._data = [];
			this._defaultProfile.ModuleName = importOptions.moduleName ?? '';
			this._data.push(cloneDeep(this._defaultProfile)); // add "new BasicsSharedImportdefinition" item
			for (let i = 0, len = data.length; i < len; i++) {
				let newProfile = cloneDeep(this._defaultProfile);

				const newModelFromDb = pick(data[i], this._modelFieldsFromDb);
				const newDescriptorFromDb = pick(data[i].ImportDescriptor, this._descriptorFieldsFromDb);
				const newFieldsFromDb: Pick<BasicsSharedImportField, keyof BasicsSharedImportField>[] = [];
				data[i].ImportDescriptor.Fields.forEach((field) => {
					newFieldsFromDb.push(pick(field, this._mappingFieldsFromDb));
				});

				newProfile = { ...newProfile, ...newModelFromDb };
				newProfile.ImportDescriptor = { ...newProfile.ImportDescriptor, ...newDescriptorFromDb };
				newProfile.ImportDescriptor.Fields.forEach((field) => {
					const fieldInDb = newFieldsFromDb.find((item) => item['PropertyName'] === field.PropertyName);
					if (fieldInDb) {
						field = { ...field, ...fieldInDb };
					}
				});

				newProfile.id = i + 1;
				this._data.push(newProfile);
			}
			this.updateProfileNames();
			this.setSelectedId(0); // default: select new object item
		});
	}

	public async loadPermissions() {
		const accessRightDescriptors = ['9eaa7843becc49f1af5b4b11e8fa09ee'];
		return await this.platformPermissionService.loadPermissions(accessRightDescriptors);
	}

	/**
	 * get selected item.
	 */
	public getSelectedItem() {
		if (this._selectedId === -1) {
			return this._newProfile;
		} else {
			return this._data[this._selectedId];
		}
	}

	public setSelectedId(id: number) {
		if (this._selectedId !== id) {
			this._selectedId = id;
			this.selectedItemChanged.next();
		}
	}

	private updateProfileNames() {
		BasicsSharedImportExcelProfileService.Profiles = [];
		this._data.forEach((item) => {
			BasicsSharedImportExcelProfileService.Profiles.push({ id: item.id, ProfileName: item.ProfileName, ProfileAccessLevel: item.ProfileAccessLevel });
		});
	}
}
