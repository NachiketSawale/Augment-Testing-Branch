// TODO: https://github.com/angular/components/commit/cda5c8e686b0c4394b382db08c2d0b4b793ac7d6
// TODO: ComponentFactoryResolver not longer needed in Angular 18 and will be removed in Angular 20
import { ApplicationRef, ComponentFactoryResolver, inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { BasicsSharedImportOptions } from '../models/types/basics-shared-import-options.type';
import {
	ColumnDef,
	createLookup,
	DomainControlInfoService,
	FieldType,
	FormStep,
	GridApiService,
	GridStep,
	IColumnGroupingProperties,
	ICustomDialog,
	IDialogButtonEventInfo,
	IFormConfig,
	IGridConfiguration,
	MultistepDialog,
	MultistepDialogAdvanced,
	MultistepTitleFormat,
	StandardDialogButtonId,
	UiCommonLookupDataFactoryService,
	UiCommonMessageBoxService,
	UiCommonMultistepDialogService,
} from '@libs/ui/common';
import { BasicsSharedImportModel } from '../models/types/basics-shared-import-model.type';
import { IFileSelectControlResult, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedImportExcelProfileService } from './basics-shared-import-excel-profile.service';
import { ProfileContext } from '../../model/enums/profile-context.enums';
import { cloneDeep, extend, isArray, isFunction, isNil, isUndefined, noop, sortBy } from 'lodash';
import { BasicsSharedImportExcelFormatService } from './basics-shared-import-excel-format.service';
import { HttpClient } from '@angular/common/http';
import { finalize, firstValueFrom, map, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { BasicsSharedCheckedListBoxComponent, createCheckedListBoxLookupProvider } from '../../checked-list-box/checked-list-box.component';
import { IPageSkip } from '../models/interfaces/basics-shared-import-config.interface';
import { BasicsSharedImportExcelHeaderService } from './basics-shared-import-excel-header.service';
import { BasicsSharedImportExcelProfileLookupService } from '../lookup-services/basics-shared-import-excel-profile-lookup.service';
import { BasicsSharedImportExcelSheetsLookupService } from '../lookup-services/basics-shared-import-excel-sheets-lookup.service';
import { BasicsSharedImportField } from '../models/types/basics-shared-import-descriptor.type';
import { BasicsSharedImportInfo } from '../models/types/basics-shared-import-info.type';
import { BasicsSharedImportResult } from '../models/types/basics-shared-import-result.type';
import { BasicsSharedImportSelectedData, ImportResult } from '../models/types/import-selected-data.type';
import { ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedImportEditorType } from '../models/enums/basics-shared-import-editor-type.enums';
import { GlobalStyleComponent } from '../components/global-style/global-style.component';
import { BasicsSharedImportObjectStatus } from '../models/enums/basics-shared-object-status.enums';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { PrintImportResultComponent } from '../components/print-import-result/print-import-result.component';

type BtnInfo<TCustom extends object> = IDialogButtonEventInfo<ICustomDialog<MultistepDialog<BasicsSharedImportModel<TCustom>>, object>, void>;

// This is a workaround to access the grouping related api.
type GridGrouping = {
	gridHostApi?: {
		dataView?: {
			setGrouping: (grouping: IColumnGroupingProperties[]) => void;
			setInitialGrouping: (grouping: IColumnGroupingProperties[]) => void;
		};
		refresh: (invalidate?: boolean) => void;
		resizeGrid: () => void;
	};
};

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedImportExcelService<TCustom extends object = object> {
	private readonly _injector = inject(Injector);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly multistepService = inject(UiCommonMultistepDialogService);
	private readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	private readonly domainControlInfoService = inject(DomainControlInfoService);
	private readonly appRef = inject(ApplicationRef);
	private readonly componentFactoryResolver = inject(ComponentFactoryResolver);
	/**
	 * get the profiles
	 */
	private readonly _importProfileService = runInInjectionContext(this._injector, () => {
		return new BasicsSharedImportExcelProfileService<TCustom>();
	});

	public get importProfileService(): BasicsSharedImportExcelProfileService<TCustom> {
		return this.instance ? this.instance.importProfileService : this._importProfileService;
	}

	private readonly _importFormatService = new BasicsSharedImportExcelFormatService();
	public get importFormatService(): BasicsSharedImportExcelFormatService {
		return this.instance ? this.instance.importFormatService : this._importFormatService;
	}

	/**
	 * get the headers
	 */
	private readonly _importHeaderService = new BasicsSharedImportExcelHeaderService();
	public get importHeaderService(): BasicsSharedImportExcelHeaderService {
		return this.instance ? this.instance.importHeaderService : this._importHeaderService;
	}

	private readonly http = inject(HttpClient);
	private readonly gridApi = inject(GridApiService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly msgboxService = inject(UiCommonMessageBoxService);
	protected instance?: BasicsSharedImportExcelService<TCustom>;

	private _canNext = true;
	private readonly _canSave = true;
	private readonly _canSaveAs = true;
	private _file?: IFileSelectControlResult;
	private _previewData: (BasicsSharedImportSelectedData & Record<string, unknown>)[] = [];
	private _importInfo: BasicsSharedImportInfo = {
		Headers: null,
		DocumentsPath: null,
		ErrorMessage: null,
		LocalFileName: null,
	};
	private _multistepDialog!: MultistepDialog<BasicsSharedImportModel<TCustom>>;
	private readonly _mappingGridId = '4aea8b65ee5248129d2164e00868fea4';
	private readonly _editImportGridId = '768c40a320c8426d982e336ca63c2dc3';
	private readonly _previewResultGridId = '98eb8070f2454c42a4ad66b3daca1811';
	private readonly _fileSelection: keyof BasicsSharedImportOptions<TCustom> = 'fileSelectionPage';
	private readonly _checkDuplicationPage: keyof BasicsSharedImportOptions<TCustom> = 'checkDuplicationPage';
	private readonly _customSettingsPage: keyof BasicsSharedImportOptions<TCustom> = 'customSettingsPage';
	private readonly _fieldMappings: keyof BasicsSharedImportOptions<TCustom> = 'fieldMappingsPage';
	private readonly _editImport: keyof BasicsSharedImportOptions<TCustom> = 'editImportDataPage';
	private readonly _previewResult: keyof BasicsSharedImportOptions<TCustom> = 'previewResultPage';
	private readonly _nextOrOkBtnId = 'nextOrOk';

	private readonly _cancelParseImport = new Subject<void>();
	private readonly _cancelPreviewImport = new Subject<void>();
	private readonly _cancelProcessImport = new Subject<void>();

	// private model: BasicsSharedImportModel = {
	// 	id: 0,
	// 	profileName: 'New Profile',
	// 	file2Import: '',
	// 	importFormat: ProfileContext.FreeExcel,
	// 	excelSheetName: '',
	// 	importType: 1,
	// 	importDescriptor: {},
	// 	desc: 'New Profile'
	// };

	private _isLoading = false;
	private get isLoading() {
		return this._isLoading;
	}

	private set isLoading(value: boolean) {
		this._isLoading = value;
		if (value) {
			this._multistepDialog.currentStep.loadingMessage = ' ';
		} else {
			this._multistepDialog.currentStep.loadingMessage = undefined;
		}
	}

	private enabledMappingGrouping: boolean = false;

	private groupColumn: ColumnDef<BasicsSharedImportField> = {
		id: 'groupName',
		model: 'GroupName',
		type: FieldType.Description,
		label: 'cloud.desktop.design.desktop.groupName',
		grouping: {
			title: 'Group Name',
			getter: 'Group Name',
			aggregators: [],
			aggregateCollapsed: true,
			generic: false,
			ascending: true,
			columnId: 'groupName',
		} as IColumnGroupingProperties,
		sortable: true,
		width: 150,
		readonly: true,
	};

	private notMapColumns: (ColumnDef<object> & { defaultValue?: string })[] = [];

	// public constructor(injector: Injector) {
	// }

	/**
	 * create an BasicsSharedImport dialog instance
	 * @param importOptions
	 */
	public async showImportDialog(importOptions: BasicsSharedImportOptions<TCustom>) {
		await this.translateService.load(['basics.shared']);
		// instance the service each call to init the private properties.
		const instance = runInInjectionContext(this._injector, () => {
			return new BasicsSharedImportExcelService<TCustom>();
		});

		this.instance = instance;

		if (importOptions.preOpenImportDialogFn) {
			const callbackRes = await importOptions.preOpenImportDialogFn();
			if (!callbackRes) {
				return;
			}
		}

		const res = await instance.showImportDialogInternal(importOptions);
		// cancel all requests after finish or close dialog.
		this.cancelRequest();

		if (res?.value && res?.closingButtonId === this._nextOrOkBtnId && importOptions.postImportFn) {
			importOptions.postImportFn(res.value);
		}

		if (importOptions.showInTabAfterImport && res?.value?.importResult) {
			this.showInTabAfterImport(res.value.importResult);
		}

		return res;
	}

	protected async showImportDialogInternal(importOptions: BasicsSharedImportOptions<TCustom> & Record<string, unknown>) {
		let model: BasicsSharedImportModel<TCustom> = {
			id: 0,
			ProfileName: 'New Profile',
			File2Import: '',
			ImportFormat: ProfileContext.FreeExcel,
			ExcelSheetName: '',
			ImportType: 1,
			ImportDescriptor: importOptions.ImportDescriptor,
		};

		this.importProfileService.selectedItemChanged.subscribe(() => {
			model = cloneDeep(this.importProfileService.getSelectedItem());
			//model.fileData = this._file;
		});

		this.importProfileService.setImportOptions(importOptions);
		this.importFormatService.addValidExcelProfileContexts(importOptions.fileSelectionPage?.excelProfileContexts ?? []);

		await Promise.all([this.importProfileService.loadData(importOptions), this.importProfileService.loadPermissions()]);
		this.enabledMappingGrouping = !!this.getFilteredFields(model.ImportDescriptor.Fields, model.ImportFormat).find((row) => !!row.GroupName);

		const stepTitle = this.translateService.instant('cloud.common.importDialogTitle');

		const formConfigFileSelection: IFormConfig<BasicsSharedImportModel<TCustom>> = {
			showGrouping: false,
			rows: [
				{
					id: 'SelectFile2Import',
					model: 'fileData',
					// TODO chase:  set to .xlsx?
					// TODO chase:  how to show text in the placeholder
					// TODO chase:  how to hide the delete btn or is there some callback of the delete
					// TODO chase:  bug: can't re-select the file after deleted the file.
					options: {
						retrieveDataUrl: true,
						retrieveFile: true,
						onSelectionChanged: () => {
							this._file = model.fileData;
							if (model.fileData) {
								model.File2Import = model.fileData.name;
								model.fileData = undefined;
							}
						},
						//fileFilter: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					},
					type: FieldType.FileSelect,
					sortOrder: 10,
					label: {
						text: 'File to BasicsSharedImport',
						key: 'basics.import.entityFile2Import',
					},
				},
				{
					id: 'ProfileName',
					model: 'ProfileName',
					type: FieldType.Lookup,
					sortOrder: 20,
					lookupOptions: createLookup({
						dataService: runInInjectionContext(this._injector, () => {
							return new BasicsSharedImportExcelProfileLookupService(this.importProfileService);
						}),
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: (e) => {
									if (e.context.lookupInput?.selectedItem?.id != undefined) {
										this.importProfileService.setSelectedId(e.context.lookupInput.selectedItem.id);
										const selectItem = e.context.lookupInput?.selectedItem;
										const isSystemProfile = 'System' === selectItem.ProfileAccessLevel;
										if (isSystemProfile) {
											//model.canSave = BasicsSharedImportExcelProfileService.hasSystemPermission(permissions.write);
										} else {
											model.canSave = true;
										}
									}
								},
							},
						],
					}),
					label: {
						text: 'Profile',
						key: 'basics.import.entityUserProfile',
					},
				},
				{
					id: 'ImportFormat',
					model: 'ImportFormat',
					type: FieldType.Lookup,
					sortOrder: 30,
					lookupOptions: createLookup({
						dataService: this.lookupServiceFactory.fromSimpleItemClass(this.importFormatService.getList()),
					}),
					label: {
						text: 'Import Format',
						key: 'basics.import.entityExcelProfile',
					},
					change: (changeInfo) => {
						if (importOptions.fileSelectionPage?.excelProfileChangedFn) {
							importOptions.fileSelectionPage.excelProfileChangedFn(changeInfo);
						}
					},
				},
				{
					id: 'SheetName',
					model: 'ExcelSheetName',
					type: FieldType.Lookup,
					sortOrder: 40,
					lookupOptions: createLookup({
						dataService: runInInjectionContext(this._injector, () => {
							return new BasicsSharedImportExcelSheetsLookupService(this);
						}),
						// dataService: this.lookupServiceFactory.fromSimpleObservable(this.getExcelSheetNames(model.fileData?.file).pipe(map(
						// 	result => {
						// 		const lookupItems: LookupSimpleEntity[] = [];
						// 		if (result) {
						// 			result.forEach((item, index) => {
						// 				lookupItems.push(new LookupSimpleEntity(index, item));
						// 			});
						// 		}
						// 		return lookupItems;
						// 	}
						// )), {
						// 	uuid: '',
						// 	idProperty: 'desc',
						// 	valueMember: 'desc',
						// 	displayMember: 'desc',
						// 	isClientSearch: false
						// }),
					}),
					label: {
						text: 'Sheet Name',
						key: 'basics.import.entityExcelSheetName',
					},
					visible: !this.importFormatService.isFixedRibFormat(model.ImportFormat),
				},
			],
		};

		if (importOptions.fileSelectionPage?.customFormRows) {
			formConfigFileSelection.rows = importOptions.fileSelectionPage.customFormRows.concat(formConfigFileSelection.rows);
		}

		const stepFileSelection = new FormStep(this._fileSelection, stepTitle, formConfigFileSelection, model);

		const formConfigDoubletFindMethods: IFormConfig<BasicsSharedImportModel<TCustom>> = {
			showGrouping: false,
			rows: [
				{
					id: 'doubletFindMethods',
					model: 'ImportDescriptor.DoubletFindMethods',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedCheckedListBoxComponent,
					providers: [
						createCheckedListBoxLookupProvider({
							valueMember: 'Selected',
							displayMember: 'Description',
						}),
					],
					label: {
						text: 'Identify doublets by comparing',
						key: 'basics.import.entityDoubletFindMethods',
					},
				},
			],
		};

		const stepDoubletFindMethods = new FormStep(this._checkDuplicationPage, stepTitle, formConfigDoubletFindMethods, model);

		if (!model.ImportDescriptor.CustomSettings) {
			model.ImportDescriptor.CustomSettings = {} as TCustom;
		}

		const stepCustomSetting = new FormStep(this._customSettingsPage, stepTitle, importOptions.customSettingsPage?.config ?? { rows: [] }, model.ImportDescriptor.CustomSettings ?? ({} as TCustom & object));

		this.translateMappingGrid(model.ImportDescriptor.Fields);

		const gridConfigFieldMappings: IGridConfiguration<BasicsSharedImportField> = {
			uuid: this._mappingGridId,
			indicator: true,
			iconClass: '',
			// TODO: Bug? gird force to show the search panel.
			showSearchPanel: false,
			showColumnSearchPanel: false,
			skipPermissionCheck: true,
			columns: [
				{
					id: 'PropertyName',
					model: 'PropertyName',
					type: FieldType.Description,
					readonly: true,
					sortable: false,
					visible: true,
					width: 150,
					label: {
						text: 'Destination Field',
						key: 'basics.import.entityDestinationField',
					},
				},
				{
					id: 'DisplayName',
					model: 'DisplayName',
					type: FieldType.Description,
					readonly: true,
					sortable: false,
					visible: true,
					width: 180,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription',
					},
				},
				{
					id: 'MappingName',
					model: 'MappingName',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.importHeaderService,
					}),
					//readonly: false,
					validator: (info) => {
						if (importOptions.fieldMappingsPage?.mapFieldValidator) {
							return importOptions.fieldMappingsPage.mapFieldValidator(info);
						}
						return new ValidationResult();
					},
					sortable: false,
					visible: true,
					width: 180,
					label: {
						text: 'Source Field',
						key: 'basics.import.entityMappingName',
					},
				},
				{
					id: 'DefaultValue',
					model: 'DefaultValue',
					type: FieldType.Description,
					readonly: false,
					sortable: false,
					visible: true,
					width: 120,
					label: {
						text: 'Default Value',
						key: 'basics.import.entityDefaultValue',
					},
					validator: (info) => {
						if (importOptions.fieldMappingsPage?.defaultFieldValidator) {
							return importOptions.fieldMappingsPage.defaultFieldValidator(info);
						}
						return new ValidationResult();
					},
				},
			],
		};

		if (this.enabledMappingGrouping && gridConfigFieldMappings.columns) {
			gridConfigFieldMappings.columns.push(this.groupColumn);
		}
		const stepFieldMappings = new GridStep(this._fieldMappings, stepTitle, gridConfigFieldMappings, this.getFilteredFields(model.ImportDescriptor.Fields, model.ImportFormat) ?? []);

		const editColumns: ColumnDef<BasicsSharedImportSelectedData>[] = [
			{
				id: 'selected',
				model: 'Selected',
				type: FieldType.Boolean,
				readonly: false,
				sortable: false,
				visible: true,
				headerChkbox: true,
				width: 75,
				label: {
					text: 'Selected',
					key: 'basics.import.entitySelected',
				},
			},
			{
				id: 'rowNum',
				model: 'RowNum',
				type: FieldType.Description,
				readonly: true,
				sortable: false,
				visible: true,
				width: 75,
				label: {
					text: 'rowNum',
					key: 'basics.import.rowNum',
				},
			},
		];

		const gridConfigEditImport: IGridConfiguration<BasicsSharedImportSelectedData> = {
			uuid: this._editImportGridId,
			idProperty: 'Ix',
			columns: editColumns,
			skipPermissionCheck: true,
			items: [],
		};

		const stepEditImport = new GridStep(this._editImport, stepTitle, gridConfigEditImport, []);

		const previewColumns = cloneDeep(editColumns);
		//TODO: need a custom component to display the icon?
		previewColumns.push({
			id: 'ImportResult',
			model: 'ImportResult',
			//type: FieldType.Description,
			type: FieldType.CustomComponent,
			readonly: true,
			sortable: false,
			visible: true,
			width: 75,
			label: {
				text: 'ImportResult',
				key: 'basics.import.entityImportResult',
			},
		} as ColumnDef<BasicsSharedImportSelectedData>);

		const gridConfigPreviewResult: IGridConfiguration<BasicsSharedImportSelectedData> = {
			uuid: this._previewResultGridId,
			columns: previewColumns,
			idProperty: 'Ix',
			skipPermissionCheck: true,
			items: [],
		};

		const stepPreviewResult = new GridStep(this._previewResult, stepTitle, gridConfigPreviewResult, []);

		const multistepDialog = new MultistepDialogAdvanced(model, [stepFileSelection, stepDoubletFindMethods, stepCustomSetting, stepFieldMappings, stepEditImport, stepPreviewResult]);

		this._multistepDialog = multistepDialog;
		this._multistepDialog.dialogOptions.width = '900px';
		this._multistepDialog.dialogOptions.backdrop = false;

		multistepDialog.titleFormat = MultistepTitleFormat.StepTitle;
		multistepDialog.hideIndicators = true;
		multistepDialog.hideDisplayOfNextStep = true;

		multistepDialog.sectionTop = {
			visible: true,
			component: GlobalStyleComponent,
			providers: [],
		};

		// cancel always the last button, so it is different from old angularjs.
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'mappingProposal',
				caption: { key: 'basics.import.button.mappingProposal' },
				autoClose: false,
				fn: () => {
					this.updateMappingNamesWithAI(model);
				},
				isDisabled: (info) => {
					return info.dialog.value?.stepIndex !== 3;
				},
			},
			{
				id: 'save',
				caption: { key: 'basics.common.button.save' },
				isDisabled: !this._canSave,
				fn: (event, info) => {
					if (info.dialog.value?.dataItem) {
						this.save(info.dialog.value?.dataItem);
					}
				},
			},
			{
				id: 'saveAs',
				caption: { key: 'basics.common.button.saveAs' },
				isDisabled: !this._canSaveAs,
				fn: (event, info) => {
					if (info.dialog.value?.dataItem) {
						this.saveAs(info.dialog.value?.dataItem);
					}
				},
			},
			{
				id: 'previousStep',
				caption: { key: 'basics.common.button.previousStep' },
				isDisabled: (info) => {
					return !this.canExecutePreviousButton(info);
				},
				fn: (event, info) => {
					this._canNext = true;
					info.dialog.value?.goToPrevious();
				},
			},
			{
				id: this._nextOrOkBtnId,
				caption: (info) => {
					if (info.dialog.value) {
						const multistepDialog = info.dialog.value;
						if (multistepDialog.currentStep.id === this.getLastStep(multistepDialog, importOptions).id) {
							return 'basics.common.button.ok';
						}
						if (multistepDialog.currentStep.id === this._editImport) {
							return 'basics.common.button.simulate';
						}
					}
					return 'basics.common.button.nextStep';
				},
				isDisabled: (info) => {
					return !this.canExecuteNextButton(info, importOptions);
				},
				fn: (event, info) => {
					this.clickNext(info, importOptions);
				},
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: { key: 'basics.common.button.cancel' },
				fn: () => {
					// cancel qll request when click cancel.
					this.cancelRequest();
				},
				autoClose: true,
			},
		];

		multistepDialog.onChangeStep = (dialog, event) => {
			// handle skip
			if (importOptions[dialog.currentStep.id]) {
				const page = importOptions[dialog.currentStep.id] as IPageSkip<TCustom>;

				const skipFunc = () => {
					if (event.selectedIndex > event.previouslySelectedIndex) {
						dialog.goToNext();
					} else {
						dialog.goToPrevious();
					}
					return;
				};

				if (this.importFormatService.isFixedRibFormat(model.ImportFormat)) {
					page.skip = true;
				}

				if (isFunction(page.skip)) {
					if (page.skip(dialog.dataItem)) {
						skipFunc();
					}
				} else if (page.skip) {
					skipFunc();
				}
			}
			if (dialog.currentStep.id === this._fieldMappings) {
				this.updateMappingGrid(dialog.dataItem, true);
			}
		};
		return this.multistepService.showDialog(multistepDialog);
	}

	private async clickNext(info: BtnInfo<TCustom>, importOptions: BasicsSharedImportOptions<TCustom> & Record<string, unknown>) {
		const dialog = info.dialog.value;

		if (!dialog) {
			return;
		}

		if (importOptions.nextStepPreprocessFn) {
			const preventResult = await importOptions.nextStepPreprocessFn(dialog);
			if (!preventResult) {
				return;
			}
		}

		if (dialog.currentStep.id === this.getLastStep(dialog, importOptions).id) {
			await this.handleLastStep(dialog, importOptions, info);
		} else {
			await this.handleNextStep(dialog, importOptions);
		}
	}

	private async handleLastStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, importOptions: BasicsSharedImportOptions<TCustom>, info: BtnInfo<TCustom>) {
		if (importOptions.applyImportFn) {
			await importOptions.applyImportFn(dialog.dataItem, info);
		} else {
			await this.processImport(dialog.dataItem, false).then((res) => {
				if (res && res.ErrorCounter === 0) {
					dialog.dataItem.importResult = res;
					info.dialog.close(info.button.id);
				} else {
					const previewStep = dialog.currentStep as GridStep<object>;
					if (isArray(res.ImportObjects)) {
						previewStep.model = res.ImportObjects;
					}
				}
			});
		}
	}

	private async handleNextStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, importOptions: BasicsSharedImportOptions<TCustom>) {
		const nextStep = this.getNextStepIndex(dialog, importOptions);

		switch (dialog.wizardSteps[nextStep].id) {
			case this._fieldMappings:
				await this.handleFieldMappingsStep(dialog);
				break;
			case this._editImport:
				await this.handleEditImportStep(dialog, importOptions);
				break;
			case this._previewResult:
				await this.handlePreviewResultStep(dialog, importOptions);
				break;
			default:
				break;
		}
		dialog?.goToNext();
	}

	private getNextStepIndex(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, importOptions: BasicsSharedImportOptions<TCustom> & Record<string, unknown>): number {
		let nextStep = dialog.stepIndex + 1;
		for (let i = 1; i < dialog.wizardSteps.length; i++) {
			const page = importOptions[dialog.wizardSteps[dialog.stepIndex + i].id] as IPageSkip<TCustom>;
			if (page?.skip === undefined || (isFunction(page?.skip) ? !page?.skip(dialog.dataItem) : !page?.skip)) {
				nextStep = dialog.stepIndex + i;
				break;
			}
		}
		return nextStep;
	}

	private async handleFieldMappingsStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>) {
		await this.parseImportFile(dialog.dataItem, false).then(async (data) => {
			//this.updateMappingGrid(dialog.dataItem, true);
			if (data.ErrorMessage) {
				await this.msgboxService.showMsgBox(data.ErrorMessage, 'cloud.common.informationDialogHeader', 'ico-info');
				return;
			}
		});
	}

	private async handleEditImportStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, importOptions: BasicsSharedImportOptions<TCustom>) {
		await this.previewImport(importOptions, dialog.dataItem, false).then((res) => {
			const editImportStep = dialog.wizardSteps[dialog.stepIndex + 1] as GridStep<object>;
			if (isArray(res)) {
				editImportStep.model = res;
			}
			this.updateEditOrPreviewGridColumns(editImportStep.gridConfiguration, importOptions, false);
		});
	}

	private async handlePreviewResultStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, importOptions: BasicsSharedImportOptions<TCustom>) {
		await this.simulateImport(dialog.dataItem).then((res) => {
			if (res && res.ErrorCounter !== 0) {
				this._canNext = false;
			}
			const previewImportStep = dialog.wizardSteps[dialog.stepIndex + 1] as GridStep<object>;
			if (isArray(res.ImportObjects)) {
				previewImportStep.model = res.ImportObjects;
			}
			this.updateEditOrPreviewGridColumns(previewImportStep.gridConfiguration, importOptions, true);
		});
	}

	public getExcelSheetNames(): Observable<string[]> {
		if (this.instance) {
			return this.instance.getExcelSheetNames();
		}

		if (this._file?.file) {
			const formData = new FormData();
			formData.append('thumbnail', this._file.file);
			return this.http.post<string[]>(this.configService.webApiBaseUrl + 'basics/import/getsheetnames', formData);
		}
		return of([]);
	}

	private canExecuteNextButton(info: BtnInfo<TCustom>, importOptions: BasicsSharedImportOptions<TCustom>) {
		const dialog = info.dialog.value;

		if (!dialog) {
			return false;
		}

		const stepIndex = dialog.stepIndex;
		const dataItem = dialog.dataItem;

		if (stepIndex === 0) {
			return this.canExecuteFileSelectionNext(importOptions, dataItem);
		} else if (stepIndex === 1) {
			return this.canExecuteCheckDuplicationNext(importOptions, dataItem);
		} else if (stepIndex === 2) {
			return this.canExecuteCustomSettingsNext(importOptions, dataItem);
		} else if (stepIndex === 3) {
			return this.canExecuteFieldMappingsNext(importOptions, dataItem);
		} else if (stepIndex === 4) {
			return this.canExecuteEditImportDataNext(importOptions);
		} else if (stepIndex === 5) {
			return this.canExecutePreviewResultNext();
		} else {
			return !this.isLoading && this._canNext;
		}
	}

	private canExecuteFileSelectionNext(importOptions: BasicsSharedImportOptions<TCustom>, dataItem: BasicsSharedImportModel<TCustom>) {
		if (importOptions.fileSelectionPage?.canExecuteNext) {
			return importOptions.fileSelectionPage.canExecuteNext(dataItem);
		}
		return dataItem.File2Import !== undefined && dataItem.File2Import.length > 0 && !!this._file;
	}

	private canExecuteCheckDuplicationNext(importOptions: BasicsSharedImportOptions<TCustom>, dataItem: BasicsSharedImportModel<TCustom>) {
		if (importOptions.checkDuplicationPage?.canExecuteNext) {
			return importOptions.checkDuplicationPage.canExecuteNext(dataItem);
		}
		return true;
	}

	private canExecuteCustomSettingsNext(importOptions: BasicsSharedImportOptions<TCustom>, dataItem: BasicsSharedImportModel<TCustom>) {
		if (importOptions.customSettingsPage?.canExecuteNext) {
			return importOptions.customSettingsPage.canExecuteNext(dataItem);
		}
		return true;
	}

	private canExecuteFieldMappingsNext(importOptions: BasicsSharedImportOptions<TCustom>, dataItem: BasicsSharedImportModel<TCustom>) {
		if (importOptions.fieldMappingsPage?.canExecuteNext) {
			const grid = this.gridApi.get<object>(this._mappingGridId);
			return importOptions.fieldMappingsPage.canExecuteNext(dataItem, grid);
		}
		return true;
	}

	private canExecuteEditImportDataNext(importOptions: BasicsSharedImportOptions<TCustom>) {
		if (importOptions.editImportDataPage?.canExecuteNext) {
			return importOptions.editImportDataPage.canExecuteNext(this._previewData);
		}
		return true;
	}

	private canExecutePreviewResultNext() {
		let countSelected = 0;
		let hasErrs = false;
		if (!this.isLoading) {
			this._previewData.forEach((item) => {
				if (item.Selected && item.ImportResult) {
					if (item.ImportResult.Status === 9) {
						hasErrs = true;
					}
					countSelected++;
				}
			});
		}
		return countSelected > 0 && !hasErrs;
	}

	private canExecutePreviousButton(info: BtnInfo<TCustom>) {
		const dialog = info.dialog.value;
		return dialog?.stepIndex !== 0 && !dialog?.currentStep.loadingMessage;
	}

	private async updateMappingNamesWithAI(importModel: BasicsSharedImportModel<TCustom>) {
		// TODO chase:  replace it after basicsCommonAIService is done.
		// basicsCommonAIService.checkPermission('c5aab6bef3454793aacbf967cf8d62d4', false).then(function (canProceed) {
		// 	if (!canProceed) {
		// 		return;
		// 	}
		// 	var fieldNames = [];
		// 	_.forEach($scope.entity.ImportDescriptor.Fields, function (item) {
		// 		fieldNames.push(item.DisplayName);
		// 	});
		//
		// 	BasicsSharedImportExcelService.getMappingInfoByAI(fieldNames).then(function (response) {
		// 		_.forEach($scope.entity.ImportDescriptor.Fields, function (item) {
		// 			_.forEach(response.data, function (mapping) {
		// 				if (item.DisplayName === mapping.FieldName) {
		// 					item.MappingName = mapping.MappingName;
		// 				}
		// 			});
		// 		});
		// 		platformGridAPI.grids.refresh(mappingGridId, true);
		// 		return response;
		// 	});
		// });
		const excelHeaders: Record<string, string> = {};
		const list = this.importHeaderService.getData();
		list.forEach((header) => {
			excelHeaders[(header.desc as string).toLowerCase().replace(/\W/g, '')] = header.desc as string;
		});

		importModel.ImportDescriptor.Fields.forEach((field) => {
			const justifiedPropName = field.PropertyName.toString().toLowerCase().replace(/\W/g, ''); // consider only A-Z and 0-9
			field.MappingName = (excelHeaders[justifiedPropName] || field.MappingName) ?? '';

			const justDisplayName = field.DisplayName.toLowerCase().replace(/\W/g, '');
			if (excelHeaders[justDisplayName]) {
				field.MappingName = excelHeaders[justDisplayName];
			}
		});
	}

	private collectMapping4AI(importModel: BasicsSharedImportModel<TCustom>) {
		const mappings: { fieldName: string; MappingName: string }[] = [];
		importModel.ImportDescriptor.Fields.forEach((item) => {
			if (item.MappingName && item.MappingName !== 'null' && item.MappingName !== 'undefined') {
				mappings.push({
					fieldName: item.DisplayName,
					MappingName: item.MappingName,
				});
			}
		});

		const url = 'basics/import/mtwoai/collectmappings';
		this.http.post(this.configService.webApiBaseUrl + url, mappings);
	}

	private updateMappingFields(importModel: BasicsSharedImportModel<TCustom>) {
		const fieldProcessor = importModel.ImportDescriptor.FieldProcessor;
		if (fieldProcessor) {
			let oldProfile = this.importProfileService.getDbProfileByName(importModel.ProfileName);
			if (isUndefined(oldProfile)) {
				oldProfile = this.importProfileService.getItemByProfileName(importModel.ProfileName);
			}
			fieldProcessor(importModel, oldProfile);
		}
	}

	private save(importModel: BasicsSharedImportModel<TCustom>) {
		if (this.importProfileService.isNewProfile(importModel.id)) {
			this.saveAs(importModel);
		} else {
			const profile = cloneDeep(importModel);
			this.importProfileService.saveProfile(profile);
		}
	}

	private saveAs(importModel: BasicsSharedImportModel<TCustom>) {
		this.importProfileService.showSaveProfileAsDialog(importModel);
	}

	private getFilteredFields(allFields: BasicsSharedImportField[], importFormat: ProfileContext) {
		const result: BasicsSharedImportField[] = [];

		allFields.forEach((field) => {
			if (field.only4RibFormat && !this.importFormatService.isFixedRibFormat(importFormat)) {
				noop();
			} else if (field.notShowInMappingGrid) {
				noop();
			} else {
				result.push(field);
			}
		});

		// Ensures 'Id' uniqueness
		for (let i = 0; i < result.length; i++) {
			result[i].Id = i;
		}

		return result;
	}

	private translateMappingGrid(mappingGridField: BasicsSharedImportField[]) {
		mappingGridField.forEach((item) => {
			if (!item.MappingName) {
				item.MappingName = '';
			}

			if (item.DisplayName) {
				item.DisplayName = this.translateService.instant(item.DisplayName).text;
			} else {
				item.DisplayName = item.PropertyName;
			}
		});
	}

	public parseImportFile(importSettings: BasicsSharedImportModel<TCustom>, processImport: boolean): Promise<BasicsSharedImportInfo & BasicsSharedImportResult> {
		if (this.instance) {
			return this.instance.parseImportFile(importSettings, processImport);
		}

		this._cancelParseImport.next();

		//service.cancelPendingRequest('new request started');
		this.isLoading = true;
		const importResult = this.parseImportFileCall(importSettings, processImport)
			.pipe(takeUntil(this._cancelParseImport))
			.pipe(
				tap((response) => {
					// act like process BasicsSharedImport
					if (processImport) {
						if (response.ImportObjects) {
							this._previewData = response.ImportObjects;
						}
					} else {
						if (response.Headers) {
							this.importHeaderService.setList(response.Headers);
						}
						this._importInfo = response;
					}
				}),
				finalize(() => {
					this.isLoading = false;
				}),
			);

		return firstValueFrom(importResult);

		// function (reason) {
		// 	console.log('parseImportFile canceled - reason: ' + reason.config.timeout.$$state.value);
		// }).finally(function () {
		// clearRequest();
		//});
	}

	private parseImportFileCall(importSettings: BasicsSharedImportModel<TCustom>, processImport: boolean) {
		const formData = new FormData();
		importSettings = extend(importSettings, { ProcessImport: processImport });
		formData.append('model', JSON.stringify(importSettings));
		if (this._file?.file) {
			formData.append('file', this._file?.file);
		}

		return this.http.post<BasicsSharedImportInfo & BasicsSharedImportResult>(this.configService.webApiBaseUrl + 'basics/import/parseimport', formData);
	}

	private updateMappingGrid(model: BasicsSharedImportModel<TCustom>, updateMappingNames: boolean) {
		this.updateMappingFields(model);
		if (updateMappingNames && model.id === 0) {
			this.updateMappingNamesWithAI(model);
		}

		if (this.enabledMappingGrouping) {
			// after grid is rendered, set grouping
			setTimeout(() => {
				const grid = this.gridApi.get<object>(this._mappingGridId) as unknown as GridGrouping;
				const dataView = grid?.gridHostApi?.dataView;
				if (dataView && dataView.setGrouping && this.groupColumn.grouping) {
					dataView.setInitialGrouping([this.groupColumn.grouping]);
					dataView.setGrouping([this.groupColumn.grouping]);
				}
			}, 1);
		}
	}

	public previewImport(options: BasicsSharedImportOptions<TCustom>, importSettings: BasicsSharedImportModel<TCustom>, processImport: boolean): Promise<BasicsSharedImportResult | (BasicsSharedImportSelectedData & Record<string, unknown>)[]> {
		if (this.instance) {
			return this.instance.previewImport(options, importSettings, processImport);
		}

		this._cancelPreviewImport.next();
		this.isLoading = true;
		const previewImport = this.previewImportCall(importSettings, processImport)
			.pipe(takeUntil(this._cancelPreviewImport))
			.pipe(
				map((res) => {
					if (options.previewResultPage?.previewFn) {
						options.previewResultPage?.previewFn(importSettings, res);
					}
					// act like process BasicsSharedImport
					if (processImport) {
						this._previewData = (res as BasicsSharedImportResult).ImportObjects || [];
					} else {
						this._previewData = res as (BasicsSharedImportSelectedData & Record<string, unknown>)[];
						this._previewData.forEach((item) => {
							item.Selected = true;
						});
					}

					return res;
				}),
				finalize(() => {
					this.isLoading = false;
				}),
			);

		return firstValueFrom(previewImport);
	}

	private previewImportCall(importSettings: BasicsSharedImportModel<TCustom>, processImport: boolean) {
		const formData = new FormData();
		const parser = new DOMParser();
		for (const element of importSettings.ImportDescriptor.Fields) {
			const mapName = element.MappingName ?? '';
			const doc = parser.parseFromString(mapName, 'text/html').documentElement.innerText;
			if (isNil(doc) || doc === 'null' || doc === 'undefined') {
				element.MappingName = '';
			} else {
				element.MappingName = doc;
			}
		}
		importSettings = extend(importSettings, {
			LocalFileName: this._importInfo.LocalFileName,
			DocumentsPath: this._importInfo.DocumentsPath,
			ProcessImport: processImport,
		});
		formData.append('model', JSON.stringify(importSettings));

		return this.http.post<BasicsSharedImportResult | (BasicsSharedImportSelectedData & Record<string, unknown>)[]>(this.configService.webApiBaseUrl + 'basics/import/previewimport', formData);
	}

	//private setupEditOrPreviewGrid(gridConfig: IGridConfiguration<object>, preview: boolean) {
	//this.updateEditOrPreviewGridColumns(gridConfig, preview);
	// 	var gridColumns = this.updateEditOrPreviewGridColumns(gridConfig, preview);
	// 	var gridId = preview ? previewGridId : editGridId;
	// 	if ($scope.options.importOptions.GetGridColumn) {
	// 		$scope.options.importOptions.GetGridColumn(gridColumns);
	// 	}
	//
	// 	// noinspection JSCheckFunctionSignatures
	// 	if (!platformGridAPI.grids.exist(gridId)) {
	// 		var gridConfig = {
	// 			columns: gridColumns,
	// 			data: [],
	// 			id: gridId,
	// 			isStaticGrid: true,
	// 			lazyInit: true,
	// 			options: {
	// 				tree: false,
	// 				indicator: true,
	// 				idProperty: 'Ix',
	// 				iconClass: ''
	// 			}
	// 		};
	// 		platformGridAPI.grids.config(gridConfig);
	// 		platformTranslateService.translateGridConfig(gridConfig.columns);
	//
	// 		platformGridAPI.events.register(editGridId, 'onHeaderCheckboxChanged', headerCheckBoxChange);
	// 	}
	//}

	//
	//
	private updateEditOrPreviewGridColumns(gridConfig: IGridConfiguration<object>, importOptions: BasicsSharedImportOptions<TCustom>, preview: boolean) {
		if (!gridConfig.columns) {
			return;
		}
		// if (preview) {
		// 	gridConfig.columns.push({
		// 		id: 'ImportResult',
		// 		model: 'ImportResult',
		// 		label: {
		// 			text: 'ImportResult',
		// 			key: 'basics.import.entityImportResult'
		// 		},
		// 		type: FieldT
		// 		sortable: false
		// 		// formatterOptions:{
		// 		// 	importResultFormatter
		// 		// }
		// 	});

		let columns: ColumnDef<object>[];
		if (preview) {
			columns = gridConfig.columns.slice(0, 3);
		} else {
			columns = gridConfig.columns.slice(0, 2);
		}

		const pushOriginalColumn = (originalColDef: ColumnDef<object>, item: BasicsSharedImportField) => {
			if (item.colDef) {
				originalColDef = { ...originalColDef, ...item.colDef } as ColumnDef<object>;
			}
			columns.push(originalColDef);
		};

		const pushNewColumn = (newColDef: ColumnDef<object>, item: BasicsSharedImportField) => {
			if (item.colDef) {
				newColDef = { ...newColDef, ...item.colDef } as ColumnDef<object>;
			}
			columns.push(newColDef);
		};

		const setNotMapped = (colDef: ColumnDef<object>) => {
			colDef = {
				...colDef,
				type: FieldType.CustomComponent,
			} as ColumnDef<object>;
		};

		const setupColumn = (item: BasicsSharedImportField, originalColDef: ColumnDef<object>, newColDef: ColumnDef<object>) => {
			const readonly = item.readonly ?? false;

			switch (item.Editor) {
				case 'domain':
				case BasicsSharedImportEditorType.domain: {
					pushOriginalColumn(originalColDef, item);
					if (!readonly) {
						if (!item.MappingName || item.MappingName.length === 0) {
							// TODO: grid doesn't support custom component or formatter currently.
							newColDef = {
								...newColDef,
								type: FieldType.CustomComponent,
								providers: [],
							} as ColumnDef<object>;
						}
						this.notMapColumns.push(newColDef);
						pushNewColumn(newColDef, item);
					}
					break;
				}
				case 'idLookup':
				case BasicsSharedImportEditorType.idLookup: {
					originalColDef.label = newColDef.label;
					pushOriginalColumn(originalColDef, item);
					break;
				}
				case 'customlookup':
				case BasicsSharedImportEditorType.customlookup: {
					originalColDef = { ...originalColDef, type: FieldType.Lookup } as ColumnDef<object>;
					newColDef = { ...newColDef, type: FieldType.Lookup } as ColumnDef<object>;

					pushOriginalColumn(originalColDef, item);
					pushNewColumn(newColDef, item);
					break;
				}
				case 'simplelookup':
				case 'simpledescriptionlookup':
				case BasicsSharedImportEditorType.simpledescriptionlookup:
				case BasicsSharedImportEditorType.simplelookup: {
					const lookupOptions = createLookup({
						dataService: this.lookupServiceFactory.fromSimpleDataProvider(item.LookupQualifier ?? '', {
							uuid: 'import.excel.' + item.LookupQualifier,
							valueMember: 'Id',
							displayMember: 'Description',
						}),
					});

					originalColDef = {
						...originalColDef,
						type: FieldType.Lookup,
						lookupOptions: lookupOptions,
					} as ColumnDef<object>;
					newColDef = { ...newColDef, type: FieldType.Lookup, lookupOptions: lookupOptions } as ColumnDef<object>;

					if (!item.MappingName || item.MappingName.length === 0) {
						setNotMapped(newColDef);
					}

					pushOriginalColumn(originalColDef, item);
					pushNewColumn(newColDef, item);
					break;
				}
				default: {
					if (!item.MappingName) {
						setNotMapped(originalColDef);
					}
					pushOriginalColumn(originalColDef, item);

					break;
				}
			}
		};

		//const columns = gridConfig.columns;
		this.notMapColumns = [];
		this._multistepDialog.dataItem.ImportDescriptor.Fields.forEach((item) => {
			const needMapping = (item.MappingName && item.MappingName.trim().length > 0) || !!item.DefaultValue;
			if (!needMapping) {
				return;
			}
			const newVal = ' (' + this.translateService.instant('basics.import.fieldNewValue').text + ')';
			const currentVal = ' (' + this.translateService.instant('basics.import.fieldCurrentValue').text + ')';

			const domainControlInfo = this.domainControlInfoService.getComponentInfoByFieldType(item.DomainName as FieldType);

			const originalColDef = {
				id: item.PropertyName,
				model: item.PropertyName,
				label: {
					text: (item.DisplayName || item.PropertyName) + currentVal,
				},
				type: item.DomainName,
				cssClass: 'import-dest-column',
				sortable: false,
				readonly: true,
				visible: true,
				...domainControlInfo,
			} as ColumnDef<object>;

			const newColDef = {
				id: item.PropertyName + '_New',
				model: item.PropertyName + '_New',
				label: {
					text: (item.DisplayName || item.PropertyName) + newVal,
				},
				type: item.DomainName,
				sortable: false,
				visible: true,
				readonly: true,
				defaultValue: item.DefaultValue,
				...domainControlInfo,
			} as ColumnDef<object>;

			setupColumn(item, originalColDef, newColDef);
		});

		if (importOptions.modifyColumnsDefFn) {
			importOptions.modifyColumnsDefFn(columns);
		}
		gridConfig.columns = columns;

		(
			gridConfig as {
				dataItemColumnValueExtractor: (
					item: Record<string, unknown>,
					columnDef: ColumnDef<object> & {
						field: string;
					},
				) => string;
			}
		).dataItemColumnValueExtractor = (item, columnDef) => {
			if (columnDef.type === FieldType.CustomComponent) {
				const columnConfig = this.notMapColumns.find((col) => col.id.toString() === columnDef.field);
				if (columnConfig) {
					return this.notMapped(columnConfig.defaultValue);
				} else if (columnDef.field === 'ImportResult') {
					return this.importResultFormatter(item[columnDef.field] as ImportResult);
				}
				return 'unknown component';
			}

			return item[columnDef.field] as string;
		};
	}

	public simulateImport(importSettings: BasicsSharedImportModel<TCustom>): Promise<BasicsSharedImportResult> {
		if (this.instance) {
			return this.instance.simulateImport(importSettings);
		}
		return this.processImport(importSettings, true);
	}

	public processImport(importSettings: BasicsSharedImportModel<TCustom>, simulate: boolean): Promise<BasicsSharedImportResult> {
		if (this.instance) {
			return this.instance.processImport(importSettings, simulate);
		}

		let url: string;
		let stepId: string;
		this._cancelProcessImport.next();
		if (simulate) {
			url = 'basics/import/simulateimport';
			stepId = this._editImport;
		} else {
			url = 'basics/import/processimport';
			stepId = this._previewResult;
		}
		this.isLoading = true;
		const processImportCall = this.processImportCall(stepId, url, importSettings)
			.pipe(takeUntil(this._cancelProcessImport))
			.pipe(
				tap((res) => {
					if (res.ImportObjects) {
						this._previewData = res.ImportObjects;
					}
					// if errorCounter > 0, then user can't click ok button, and have to handle the error in Excel file first.
					// So move those items includes error info to top Grid, don't need to find error info everywhere in Grid.
					if (res && res.ErrorCounter && res.ErrorCounter > 0) {
						let sortIndex = 0,
							total = this._previewData.length;
						this._previewData.forEach((item) => {
							if (item.ImportResult && item.ImportResult.Status === 9) {
								item.sort = sortIndex++;
							} else {
								item.sort = total++;
							}
						});
						this._previewData = sortBy(this._previewData, ['sort']);
					}
				}),
				finalize(() => {
					this.isLoading = false;
				}),
			);
		return firstValueFrom(processImportCall);
	}

	public showInTabAfterImport(importResult: BasicsSharedImportResult): void {
		const newTab = window.open('');
		if (newTab) {
			const printImportResult = new ComponentPortal(PrintImportResultComponent);
			const style = document.createElement('style');
			style.textContent = `* {
    box-sizing: border-box; font-family: Arial, "Times New Roman", Georgia, Serif;
}
html {
    margin-left: auto;
    margin-right: auto;
    position: relative;
}
body {
    -webkit-user-select: text; padding: 1px 10px;
}`;
			const head = newTab.document.getElementsByTagName('head')[0];
			const body = newTab.document.getElementsByTagName('body')[0];
			head.appendChild(style);
			const outlet = new DomPortalOutlet(body, this.componentFactoryResolver, this.appRef);
			const printImportResultRef = outlet.attach(printImportResult);
			printImportResultRef.setInput('importResult', importResult);
		} else {
			console.error('Failed to open a new tab.');
		}
	}

	private notMapped(defaultValue?: string): string {
		if (defaultValue && defaultValue.length > 0) {
			return '(' + defaultValue + ')';
		}
		return '(not mapped)';
	}

	private fillResultInfo(value: ImportResult) {
		let imageName;
		let tooltip: string;
		let status = '';
		switch (value.Status) {
			case BasicsSharedImportObjectStatus.NotSelected: // skipped
				imageName = 'stop';
				tooltip = 'Not selected';
				break;
			case BasicsSharedImportObjectStatus.NoChanges: // nochanges
				imageName = 'transition';
				tooltip = 'No changes';

				break;
			case BasicsSharedImportObjectStatus.Failed: // failed
				imageName = 'error';
				tooltip = 'Import Failed!';
				status = 'Failed';
				break;
			case BasicsSharedImportObjectStatus.Warning: // warning
				imageName = 'warning';
				tooltip = 'Warning';
				status = 'Warning';
				break;
			default:
				imageName = 'tick';
				tooltip = 'Success!';
				status = 'Success';
				break;
		}
		// noinspection JSUnresolvedVariable
		if (value.LogEntries) {
			for (let i = 0; i < value.LogEntries.length; i++) {
				tooltip = tooltip + '&#10' + value.LogEntries[i];
			}
		}
		if (value.LogErrorMsg) {
			for (let j = 0; j < value.LogErrorMsg.length; j++) {
				tooltip = tooltip + '&#10' + value.LogErrorMsg[j];
			}
		}
		return { imageName: imageName, toolTip: tooltip, status: status };
	}

	private importResultFormatter(value?: ImportResult) {
		if (!value) {
			return '';
		}
		const formatterRes = this.fillResultInfo(value);
		let path: string;
		if (value.Status === 9 || value.Status === 16) {
			path = '/assets/ui/common/images/tlb-icons.svg#ico-';
		} else {
			path = '/assets/ui/common/images/control-icons.svg#ico-';
		}
		const imageName = formatterRes.imageName;
		const tooltip = formatterRes.toolTip;

		if (this._canNext) {
			this._canNext = !(value.Status === 1 || value.Status === 2 || value.Status === 9);
		}

		return '<img src="' + path + imageName + '" title="' + tooltip + '">';
	}

	private processImportCall(stepId: string, url: string, importSettings: BasicsSharedImportModel<TCustom>) {
		//var dto = {ImportRequest: getUserInput(), BasicsSharedImportData: _previewData};
		const previewDataIx: BasicsSharedImportSelectedData[] = [];
		const editImport = this._multistepDialog.getWizardStep(stepId) as GridStep<BasicsSharedImportSelectedData>;
		editImport.model.forEach((ix) => {
			if (ix.Selected === true) {
				previewDataIx.push({ Ix: ix.Ix });
			}
		});

		const dto = { ImportRequest: importSettings, ImportData: previewDataIx };

		return this.http.post<BasicsSharedImportResult>(this.configService.webApiBaseUrl + url, dto);
	}

	private getLastStep(dialog: MultistepDialog<BasicsSharedImportModel<TCustom>>, options: BasicsSharedImportOptions<TCustom> & Record<string, unknown>) {
		for (let i = dialog.wizardSteps.length - 1; i > 0; i--) {
			const page = options[dialog.wizardSteps[i].id] as IPageSkip<TCustom>;
			if (page?.skip === undefined || (isFunction(page?.skip) ? !page?.skip(dialog.dataItem) : !page?.skip)) {
				return dialog.wizardSteps[i];
			}
		}
		return dialog.wizardSteps[0];
	}

	private cancelRequest() {
		this._cancelParseImport.next();
		this._cancelPreviewImport.next();
		this._cancelProcessImport.next();
	}
}
