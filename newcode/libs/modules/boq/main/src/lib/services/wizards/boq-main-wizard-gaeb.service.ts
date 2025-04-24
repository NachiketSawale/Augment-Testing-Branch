import { inject, Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	IFormConfig,
	IGridDialogOptions,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonGridDialogService,
	UiCommonLookupItemsDataService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { Dictionary, IInitializationContext, PlatformHttpService } from '@libs/platform/common';
import { Observable } from 'rxjs';
// references across modules without an alias are not allowed!
// import { SimpleUploadService } from '../../../../../../basics/common/src/lib/services/simple-upload.service';
// import { IFileUploadServerSideResponse } from '../../../../../../basics/common/src/lib/models/IFileUploadServerSideResponse';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { isEmpty } from 'lodash';
import { BoqWizardUuidConstants, IBoqItemEntity } from '@libs/boq/interfaces';
import { BoqMainProjectBoqItemLookupDataService } from './boq-main-wic-wizard.service';
import { BoqLineType } from '../../model/boq-main-boq-constants';


class ExportGaeb {
	public gaebFormat?: number;
	public gaebType?: number;
	public gaebSelectionType: number = 0;
	public from?: number;
	public to?: number;
	public specification?: boolean;
	public quantityAdj?: boolean;
	public price?: boolean;
	public isUrb?: boolean;

	public constructor(gaebFormat: number, gaebType: number) {
		this.gaebFormat = gaebFormat;
		this.gaebType = gaebType;
	}

}

export interface CreateBoqItemFunc {
	// TODO-BOQ: eslint any (deactivated)
	// (): Promise<any>;
	(): Promise<object>;
}


export class ImportOptions {
	public allowedExtensions: string[] = [];
	public allowMultipleFileSelection: boolean = false;
	public gaebInfo: GaebInfoData = new GaebInfoData();
	public boqItemDataService: BoqItemDataServiceBase = {} as BoqItemDataServiceBase;
	public boqRootItem: IBoqItemEntity = {} as IBoqItemEntity;
	public projectId: number = 0;
	public createBoqItemFunc: CreateBoqItemFunc | undefined = undefined;
	// TODO-BOQ: eslint any (deactivated) public mainService: any | undefined = undefined;

	public allowedGaebExtensions: string | undefined = undefined;
	public defaultGaebExtension: string | undefined = undefined;
	public showPartialImportPage: boolean = false;
	public showCatalogAssignmentPage: boolean = false;

	public constructor(wizardParameters?: Dictionary<string, unknown>) {
		if (wizardParameters) {
			const allowedGaebExtensions = wizardParameters.get('AllowedGaebExtensions');
			if (allowedGaebExtensions) {
				this.allowedGaebExtensions = String(allowedGaebExtensions);
			}

			const defaultGaebExtension = wizardParameters.get('DefaultGaebExtension');
			if (defaultGaebExtension) {
				this.defaultGaebExtension = String(defaultGaebExtension);
			}
		}
	}
}

@Injectable({providedIn: 'root'})
export abstract class BoqImportGaebWizardService extends BoqWizardServiceBase {
	private boqItemDataService!: BoqItemDataServiceBase;
	private gaebFormatList: GaebFormat[] = [];
	private gaebTypeList: GaebType[] = [];
	//private simpleUploadService = inject(SimpleUploadService);
	private boqMainWizardGaebService = inject(BoqMainWizardGaebService);

	public constructor() {
		super();
		this.gaebFormatList.push(new GaebFormat(0, 'GAEB_90', '.d', this.translateService.instant('boq.main.gaeb90').text));
		this.gaebFormatList.push(new GaebFormat(1, 'GAEB_2000', '.p', this.translateService.instant('boq.main.gaeb2000').text));
		this.gaebFormatList.push(new GaebFormat(2, 'GAEB_XML', '.x', this.translateService.instant('boq.main.gaebXML').text));

		this.gaebTypeList.push(new GaebType(0, '81', this.translateService.instant('boq.main.gaebFile81').text));
		this.gaebTypeList.push(new GaebType(1, '82', this.translateService.instant('boq.main.gaebFile82').text));
		this.gaebTypeList.push(new GaebType(2, '83', this.translateService.instant('boq.main.gaebFile83').text));
		this.gaebTypeList.push(new GaebType(3, '84', this.translateService.instant('boq.main.gaebFile84').text));
		this.gaebTypeList.push(new GaebType(4, '85', this.translateService.instant('boq.main.gaebFile85').text));
		this.gaebTypeList.push(new GaebType(5, '86', this.translateService.instant('boq.main.gaebFile86').text));
	}

	public getUuid(): string {
		return BoqWizardUuidConstants.ImportGaebWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase, wizardParameters?: Dictionary<string, unknown>) {
		this.boqItemDataService = boqItemDataService;
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (boqItemDataService.isCrbBoq()) {
					this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'info', true);
					return;
				}
				const options = new ImportOptions(wizardParameters);
				options.boqItemDataService = this.boqItemDataService;
				this.openImportGaebDialog(options);
			}
		});

	}

	public async openImportGaebDialog(importOptions: ImportOptions) {
		if (!importOptions.boqItemDataService) {
			console.warn('Must pass boqItemDataService!');
			return;
		}

		//TODO-BOQ importOptions.boqRootItem = importOptions.boqItemDataService.getRootBoqItem();
		importOptions.boqRootItem = importOptions.boqItemDataService.rootEntities()[0];

		if (isEmpty(importOptions.boqRootItem)) {
			this.boqMainWizardGaebService.showImportFailedWarning('boq.main.gaebImportBoqMissing');
			console.warn('GAEB import not possible - reason: No BoQ is selected!');
		}

		if (!Object.prototype.hasOwnProperty.call(importOptions, 'projectId')) {
			importOptions.projectId = importOptions.boqItemDataService.getSelectedProjectId() || 0;
		}

		importOptions.gaebInfo = new GaebInfoData();
		importOptions.gaebInfo.BoqHeaderId = importOptions.boqRootItem.BoqHeaderFk;
		importOptions.gaebInfo.ProjectId = importOptions.projectId; // WIC has no Project assignment!
		importOptions.allowMultipleFileSelection = false;

		this.selectGaebFile(importOptions);
	}

	private async selectGaebFile(importOptions: ImportOptions) {
		const fileElement = document.createElement('input');
		fileElement.type = 'file';

		importOptions.allowedExtensions = this.getAllowedGaebExt(importOptions);
		const fileFilter = importOptions.allowedExtensions.toString();
		fileElement.accept = fileFilter;
		fileElement.multiple = importOptions.allowMultipleFileSelection;

		fileElement.onchange = () => {
			const files = fileElement.files;
			if (files) {
				this.recursiveFileLoop(files, 0, importOptions);
			}
		};

		fileElement.click();
	}

	private recursiveFileLoop(files: FileList, fileIx: number, importOptions: ImportOptions) {

		if (fileIx < files.length) {

			const file = files[fileIx];
			this.processSelectedGaebFile(importOptions, file); //TODO-BOQ async call: .then(res => {
			//this.recursiveFileLoop(files, ++fileIx, importOptions) //TODO-BOQ angular.copy(importOptions)
			//});
		}
	}

	private processSelectedGaebFile(importOptions: ImportOptions, file: File) {
		const boqItemDataService = importOptions.boqItemDataService;

		const fileExt = this.getFileExt(file.name);
		if (fileExt.includes('84') && boqItemDataService.getList().length <= 1) {
			this.boqMainWizardGaebService.showImportFailedWarning('boq.main.gaebX84ImportError');
			//return promise;
		}

		const result = this.validateFileExt(file.name, importOptions.allowedExtensions);
		if (result.error) {
			this.boqMainWizardGaebService.showImportFailedWarning(result.message);
			//return promise;
		} else {
			this.createBoqItem(importOptions).then(() => {
				this.updateAndExecute(importOptions, () => {
					this.parseGaebFile(importOptions.gaebInfo, file).subscribe(data => {
						// importOptions.gaebInfo = data;   // add gaeb info // TODO-BOQ
						const errorCounter = importOptions.gaebInfo.Errors.length;
						// TODO-BOQ: eslint any (deactivated) const bodyText = this.translateService.instant('boq.main.GaebFileContainsErrors', { p1: importOptions.gaebInfo.OriginalFileName, p2: errorCounter }).text + ' ' + this.translateService.instant('basics.common.continue').text;

						// TODO-BOQ: eslint any (deactivated)
						/*
						const logOptions: any = {};
						logOptions.title = 'GAEB Import Preview';
						logOptions.content = '<h1>Preview GAEB file ' + importOptions.gaebInfo.OriginalFileName + ' import</h1>';
						logOptions.content += '<p>Label:' + importOptions.gaebInfo.LblBoQ + '</p>';
						logOptions.content += '<p>Error(s):</p>';
						importOptions.gaebInfo.Errors.forEach((item : any) => {
							logOptions.content += '<p>' + item + '</p>';
						});
						*/

						if (errorCounter === 0 || importOptions.gaebInfo.SuppressGaebImportErrorCheck) {
							this.continueImport(importOptions);
						} else {
							// TODO-BOQ: eslint any (deactivated)
							/*
							const options = {
								width: '700px',
								headerText$tr$: 'basics.common.questionDialogDefaultTitle',
								iconClass: 'ico-question',
								bodyText: bodyText,
								details: {
									show: true,
									type: 'longtext',
									value: logOptions.content
								},
								buttons: [
									{ id: 'yes' },
									{ id: 'no' }
								]
							};
							*/

							//platformDialogService.showDetailMsgBox(options).then(function (result) {
							//	if (result.yes) {
							//		continueImport(importOptions);
							//	}
							//});
							// TODO-BOQ Schow showDetailMsgBox
							// TODO-BOQ: eslint any (deactivated)
							/*
							this.messageBoxService.showYesNoDialog(bodyText + ' ' + logOptions.content, this.translateService.instant('basics.common.questionDialogDefaultTitle').text)?.then(result => {
								if (result.closingButtonId == StandardDialogButtonId.Yes) {
									this.continueImport(importOptions);
								}
							});
							*/
						}
					});
				});
			});
		}
		//return promise;
	}

	private validateFileExt(filename: string, allowedExt: string[]) {

		const fileExt = '.' + this.getFileExt(filename).toLowerCase();
		if (allowedExt.findIndex(item => {
			return fileExt === item.toLowerCase();
		}) === -1) {
			return {error: true, message: 'File extension ' + fileExt + ' is NOT accepted!'};
		} else {
			return {error: false, message: ''};
		}
	}

	private continueImport(importOptions: ImportOptions) {
		//importOptions.gaebInfo = data; // TODO-BOQ
		importOptions.gaebInfo.AddNewItems = true;
		importOptions.gaebInfo.OverwriteExistingItems = true;

		// setup wizard
		const hasOnlyRootItem = isEmpty(importOptions.boqRootItem.BoqItems);
		const whitelist = ['82', '83', '85', '86'];
		importOptions.showPartialImportPage = whitelist.includes(this.getFileExt(importOptions.gaebInfo.OriginalFileName).slice(-2)) && !hasOnlyRootItem;
		importOptions.showCatalogAssignmentPage = importOptions.gaebInfo.HasCatalogs;
		const showWizard = importOptions.showPartialImportPage || importOptions.showCatalogAssignmentPage;

		if (showWizard) {
			return this.showMappingDialog(importOptions);
		} else {
			return this.importGaebFile(importOptions);
		}
	}

	private importGaebFile(importOptions: ImportOptions) {
		const request = this.http.post$<GaebImportResponse>('boq/main/import/importlocalgaebfile', importOptions.gaebInfo);

		return request.subscribe(response => { //TODO-BOQ subscribe is deprecated?
				if (response.Result === true && importOptions.boqItemDataService !== null) {
					importOptions.boqItemDataService.refreshAll();  // call succeeded function
				}
				const topDescription = response.Result ? this.translateService.instant('boq.main.importSucceeded').text : this.translateService.instant('boq.main.importFailed').text;
				const iconClass = response.Result ? 'tlb-icons ico-info' : 'tlb-icons ico-error';

				this.messageBoxService.showMsgBox(this.translateService.instant(topDescription).text, this.translateService.instant('boq.main.gaebImport').text, iconClass);
				//TODO-BOQ messageBoxService.showMsgBox --> platformLongTextDialogService.showDialog
				//return platformLongTextDialogService.showDialog({
				//	headerText$tr$: 'boq.main.gaebImport',
				//	topDescription: { text: topDescription, iconClass: iconClass },
				//	codeMode: true,
				//	hidePager: true,
				//	dataSource: new function () {
				//		var detailText = '';
				//		if (response.Info) {
				//			detailText += response.Info.split('\\n').join('\n') + '\n\n'; // split+join reformats the text
				//		}
				//		if (_.some(response.Warnings)) {
				//			detailText += response.Warnings.join('\n');
				//		}
				//		platformLongTextDialogService.LongTextDataSource.call(this);
				//		this.current = detailText;
				//	}
				//});

			},
			function (reason) {              /* jshint ignore:line */
				console.log('processImport canceled - reason: ' + reason.config.timeout.$$state.value);
			});
	}

	private showMappingDialog(importOptions: ImportOptions) {
		//TODO-BOQ
		//	var modalOptions = {
		//		templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-gaeb-import-wizard.html',
		//		backdrop: false,
		//		windowClass: 'form-modal-dialog',
		//		headerTextKey: 'boq.main.gaebImport',
		//		resizeable: true,
		//		width: '75%',
		//		importOptions: importOptions
		//		// value: { selectedId: -1 }  // object that will be returned
		//	};

		//	return platformModalService.showDialog(modalOptions).then(function (result) {
		//		if (result) {
		//			return service.importGaebFile(importOptions);
		//		} else {
		//			return deleteTempFileOnServer(importOptions.GaebInfo);
		//		}
		//		// return result;
		//	});

		//};
		return this.importGaebFile(importOptions);
	}

	private createBoqItem(importOptions: ImportOptions): Promise<boolean> {
		const promise = Promise.resolve(true);

		if (importOptions.createBoqItemFunc) {
			// TODO-BOQ: eslint any (deactivated)
			/*
			importOptions.createBoqItemFunc().then((newCompositeItem: any) => { // TODO-BOQ
				importOptions.boqRootItem = newCompositeItem.BoqRootItem;
				importOptions.gaebInfo.BoqHeaderId = newCompositeItem.BoqRootItem.BoqHeaderFk;
			});
			*/
		}

		return promise;
	}

	// TODO-BOQ: eslint any (deactivated)
	private updateAndExecute(importOptions: ImportOptions, fn: object /*, fn: any */) {
		/*
		if (importOptions.mainService) {
			importOptions.mainService.updateAndExecute(fn);
		} else {
			fn();
		}
		*/
	}

	private getAllowedGaebExt(importOptions: ImportOptions): string[] {
		let allowedExt = [];
		for (let i = 0; i < this.gaebFormatList.length; i++) {
			for (let z = 0; z < this.gaebTypeList.length; z++) {
				allowedExt.push(this.gaebFormatList[i].pattern + this.gaebTypeList[z].phase);
			}
		}
		allowedExt.push('.ribx81');
		allowedExt.push('.ribx83');    // not really gaeb!

		if (importOptions.allowedGaebExtensions) {
			if (importOptions.allowedGaebExtensions.trim().replace('*', '') !== '') {
				allowedExt = importOptions.allowedGaebExtensions.split(',');
			}
		}

		return allowedExt;
	}

	private getFileExt(filename: string) {
		return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
	}

	private parseGaebFile(gaebInfo: GaebInfoData, fileData: File) {
		//return this.parseGaebFileCall(fileData, JSON.stringify(defaultGaebInfo)).pipe(map(res => {
		//	return res; // TODO-BOQ res.GaebInfoData;
		//}));

		return this.parseGaebFileCall(fileData, JSON.stringify(gaebInfo));
	}

	private parseGaebFileCall(file: File, model: string): Observable</*IFileUploadServerSideResponse*/ object> {
		// TODO-BOQ: Error in SimpleUploadService.uploadFile: A JSON object is expected at this point. A string is currently being delivered by the server:
		// this.beginUploadApiCall(effectiveConfig).subscribe((responseData: string) => {
		/*return this.simpleUploadService.uploadFile(file, {
			basePath: 'boq/main/import/',
			customRequest: {
				Model: model,
				OriginalFileName: file.name
			}
		});*/
		throw new Error('not implemented');
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainImportGaebWizardService extends BoqImportGaebWizardService {
	public async execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) {
		await this.exec(context.injector.get(BoqItemDataService, wizardParameters));
	}
}

export class ExportOptions {
	public boqItemDataService: BoqItemDataServiceBase = {} as BoqItemDataServiceBase;
	public defaultGaebExtension: string | undefined = undefined;
	public selectedExt: string = '';
	public showProtocol: boolean = true;
	public ProjectChangeFk: number | null = null;
	public DeviantBidderInfo: GaebBidderInfo = new GaebBidderInfo();
	public from?: number;
	public to?: number;
	public isUrb?: boolean = false;
	public price?: boolean = false;
	public quantityAdj?: boolean = false;
	public specification?: boolean = false;
	public selectionType?: number;

	public constructor(wizardParameters?: Dictionary<string, unknown>) {
		if (wizardParameters) {
			const defaultGaebExtension = wizardParameters.get('DefaultGaebExtension');
			if (defaultGaebExtension) {
				this.defaultGaebExtension = String(defaultGaebExtension);
			}
		}
	}
}

//TODO-BOQ generated GaebBidderInfo?
export class GaebBidderInfo {
	public Name1: string = '';
	public Street: string = '';
	public PCode: string = '';
	public City: string = '';
}

@Injectable({providedIn: 'root'})
export abstract class BoqExportGaebWizardService extends BoqWizardServiceBase {
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqMainWizardGaebService = inject(BoqMainWizardGaebService);
	private boqItemDataService!: BoqItemDataServiceBase;
	private validationService = new BoqMainValidationService();

	public getUuid(): string {
		return BoqWizardUuidConstants.ExportGaebWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase, wizardParameters?: Dictionary<string, unknown>) {
		this.boqItemDataService = boqItemDataService;
		if (boqItemDataService.isCrbBoq()) {
			this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'info', true);
			return;
		}

		const options = new ExportOptions(wizardParameters);
		options.boqItemDataService = this.boqItemDataService;
		this.openExportGaebDialog(options);
	}

	public async openExportGaebDialog(options: ExportOptions) {
		const exportGaeb = new ExportGaeb(this.boqMainWizardGaebService.getGaebFormatId(options), this.boqMainWizardGaebService.getGaebTypeId(options));

		let fromLineType: number;
		let toLineType: number;

		const exportGaebFormConfig: IFormConfig<ExportGaeb> = {
			formId: 'export-gaeb-form',
			showGrouping: true,
			groups: [
				{
					groupId: 'formatGroup',
					header: 'boq.main.Format',
					open: true
				},
				{
					groupId: 'selectionGroup',
					header: 'boq.main.Selection',
					open: true
				},
				{
					groupId: 'settings',
					header: 'boq.main.Settings',
					open: true
				}],
			rows: [
				{
					id: 'gaebFormat',
					groupId: 'formatGroup',
					label: 'boq.main.GaebFormat',
					type: FieldType.Lookup,
					model: 'gaebFormat',
					lookupOptions: createLookup({
						dataServiceToken: GaebFormatLookupService
					}),
					change: changeInfo => {
						//TODO-BOQ: Set readonly state of checkboxes
					}
				},
				{
					id: 'gaebType',
					groupId: 'formatGroup',
					label: 'boq.main.Gaebtype',
					type: FieldType.Lookup,
					model: 'gaebType',
					lookupOptions: createLookup({
						dataServiceToken: GaebTypeLookupService
					}),
					change: changeInfo => {
						//TODO-BOQ: Set readonly state of checkboxes
					}
				},
				{
					id: 'gaebSelectionType',
					groupId: 'selectionGroup',
					label: 'boq.main.SelectionType',
					model: 'gaebSelectionType',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: GaebSelectionTypeLookupService
					}),
					change: (changeInfo) => {
						if(changeInfo.newValue == 2){
							//TODO-BOQ: use platformRuntimeDataService to Set readonly state of specification lookups
						}
					}
				},
				{
					id: 'from',
					groupId: 'selectionGroup',
					label: 'boq.main.From',
					model: 'from',
					type: FieldType.Lookup,
					readonly: false,
					lookupOptions: createLookup({
						dataServiceToken: BoqMainProjectBoqItemLookupDataService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									fromLineType = e.context.lookupInput?.selectedItem?.BoqLineTypeFk || 0;
								},
							},
						],
					})
				},
				{
					id: 'to',
					groupId: 'selectionGroup',
					label: 'boq.main.To',
					model: 'to',
					type: FieldType.Lookup,
					readonly: false,
					lookupOptions: createLookup({
						dataServiceToken: BoqMainProjectBoqItemLookupDataService,
						events: [
							{
								name: 'onSelectedItemChanged',
								handler(e) {
									toLineType = e.context.lookupInput?.selectedItem?.BoqLineTypeFk || 0;
								},
							},
						],
					}),
				},
				{
					id: 'specification',
					groupId: 'settings',
					label: 'boq.main.Specification',
					model: 'specification',
					type: FieldType.Boolean
				},
				{
					id: 'quantityAdj',
					groupId: 'settings',
					label: 'boq.main.QuantityAdj',
					model: 'quantityAdj',
					type: FieldType.Boolean
				},
				{
					id: 'price',
					groupId: 'settings',
					label: 'boq.main.Prices',
					model: 'price',
					type: FieldType.Boolean
				},
				{
					id: 'isUrb',
					groupId: 'settings',
					label: 'boq.main.UrBreakdown',
					model: 'isUrb',
					type: FieldType.Boolean
				},
			]
		};

		if (!options.boqItemDataService.getSelectedBoqHeaderId()) {
			this.boqMainWizardGaebService.showImportFailedWarning('boq.main.gaebImportBoqMissing');
			return;
		}

		await this.formDialogService.showDialog<ExportGaeb>({
			id: 'exportGaebDialog',
			headerText: 'boq.main.gaebExport',
			formConfiguration: exportGaebFormConfig,
			entity: exportGaeb
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				options.selectedExt = this.boqMainWizardGaebService.getGaebExt(result?.value?.gaebFormat, result?.value?.gaebType);

				if(result?.value?.gaebSelectionType === 1 && !result?.value?.from && !!result?.value?.to){
					this.messageBoxService.showInfoBox('boq.main.fromToNotNullError', 'fromToNotNullError', false);
					return;
				}

				if(result.value?.gaebSelectionType === 1 && fromLineType !== BoqLineType.Root && !(fromLineType >= BoqLineType.DivisionLevelFirst && fromLineType <= BoqLineType.DivisionLevelLast)){
					this.messageBoxService.showInfoBox('boq.main.rootAndDivisionAllowedInFrom', 'rootAndDivisionAllowedInFrom', false);
					return; //TODO-BOQ: Do not close form dialog
				}

				if(result.value?.gaebSelectionType === 1 && toLineType !== BoqLineType.Root && !(fromLineType >= BoqLineType.DivisionLevelFirst && fromLineType <= BoqLineType.DivisionLevelLast)){
					this.messageBoxService.showInfoBox('boq.main.rootAndDivisionAllowedInTo', 'rootAndDivisionAllowedInTo', false);
					return;
				}

				if(result?.value?.gaebSelectionType === 1){
					options.from = result.value?.from;
					options.to = result.value?.to;
				}

				options.isUrb = result.value?.isUrb;
				options.price = result.value?.price;
				options.quantityAdj = result.value?.quantityAdj;
				options.specification = result.value?.specification;
				options.selectionType = result.value?.gaebSelectionType;

				let boqHeaderId: number;
				if (this.boqItemDataService.getSelectedBoqHeaderId()) {
					boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId() || 0;
				} else {
					return;
				}

				this.validationService.scanBoqBeforeExport2Gaeb(boqHeaderId, options.selectedExt).then(res => {
					if (res) {
						const boqItemDataService = options.boqItemDataService;
						const projectId: number = boqItemDataService.getSelectedProjectId() || 0; // Map to 0 if no project id is given to follow expected data type in following http request.

						const params = new Params();
						params.BoqHeaderId = boqHeaderId;
						params.ProjectId = projectId;
						params.GaebExt = options.selectedExt;
						params.Check = options.showProtocol;
						params.ProjectChangeFk = options.ProjectChangeFk || null;
						params.DeviantBidderInfo = options.DeviantBidderInfo || null;
						params.SelectionType = options.selectionType;
						if(params.SelectionType === 1){
							params.From = options.from;
							params.To = options.to;
						}
						params.Specification = options.specification || false;
						params.QuantityAdj = options.quantityAdj || false;
						params.Price = options.price || false;
						params.IsUrb = options.isUrb || false;

						this.http.post$('boq/main/exportgaeb', params).subscribe(res => {

							const response = res as GaebExportResponse;
							//Create anchor to download file
							const link = document.createElement('a');
							document.body.appendChild(link);
							link.setAttribute('display', 'none');
							link.href = response.LocalFileName;
							link.download = response.OriginalFileName; // TODO-BOQ download-name doesn't work
							link.type = 'application/octet-stream';
							link.click();

						});
					}
				});
			}
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainExportGaebWizardService extends BoqExportGaebWizardService {
	public async execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) {
		await this.exec(context.injector.get(BoqItemDataService, wizardParameters));
	}
}

@Injectable({providedIn: 'root'})
export abstract class BoqScanBoqWizardService extends BoqWizardServiceBase {
	private boqItemDataService!: BoqItemDataServiceBase;
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqMainWizardGaebService = inject(BoqMainWizardGaebService);
	private validationService = new BoqMainValidationService();

	public getUuid(): string {
		return BoqWizardUuidConstants.ScanBoqWizardUuid;
	}

	protected async exec(boqItemDataService: BoqItemDataServiceBase, wizardParameters?: Dictionary<string, unknown>) {
		this.boqItemDataService = boqItemDataService;
		//TODO-BOQ: assertBoqIsNotReadOnly
		this.assertIsNotReadOnly(boqItemDataService).then(response => {
			if (response) {
				if (this.boqItemDataService.isCrbBoq()) {
					this.messageBoxService.showInfoBox('boq.main.crbDisabledFunc', 'info', false);
					return;
				} else if (this.boqItemDataService.isOenBoq()) {
					this.messageBoxService.showInfoBox('boq.main.oenDisabledFunc', 'info', false);
					return;
				}

				const options = new ExportOptions(wizardParameters);
				options.boqItemDataService = this.boqItemDataService;

				this.openScanBoqDialog(options);
			}
		});
	}

	public openScanBoqDialog(options: ExportOptions) {
		const exportGaeb = new ExportGaeb(this.boqMainWizardGaebService.getGaebFormatId(options), this.boqMainWizardGaebService.getGaebTypeId(options));

		const scanBoqFormConfig: IFormConfig<ExportGaeb> = {
			formId: 'boq-validate-gaeb',
			showGrouping: false,
			rows: [
				{
					id: 'gaebType',
					label: {
						key: 'boq.main.Gaebtype',
					},
					type: FieldType.Lookup,
					model: 'gaebType',
					lookupOptions: createLookup({
						dataServiceToken: GaebTypeLookupService
					})
				}
			],

		};

		this.formDialogService.showDialog<ExportGaeb>({
			id: 'scanBoqDialog',
			headerText: {key: 'boq.main.validateGaebExport'},
			formConfiguration: scanBoqFormConfig,
			entity: exportGaeb
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				options.selectedExt = this.boqMainWizardGaebService.getGaebExt(result?.value?.gaebFormat, result?.value?.gaebType);

				let boqHeaderId: number;
				if (this.boqItemDataService.getSelectedBoqHeaderId()) {
					boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId() || 0;
				} else {
					return;
				}
				this.validationService.scanBoqAndShowResult(boqHeaderId, options.selectedExt, false);
			}
		});
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainScanBoqGaebWizardService extends BoqScanBoqWizardService {
	public async execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>) {
		await this.exec(context.injector.get(BoqItemDataService, wizardParameters));
	}
}

@Injectable({providedIn: 'root'})
export abstract class BoqMainWizardGaebService extends BoqWizardServiceBase {
	private gaebFormatList: GaebFormat[] = [];
	private gaebTypeList: GaebType[] = [];

	public constructor() {
		super();
		this.gaebFormatList.push(new GaebFormat(0, 'GAEB_90', '.d', this.translateService.instant('boq.main.gaeb90').text));
		this.gaebFormatList.push(new GaebFormat(1, 'GAEB_2000', '.p', this.translateService.instant('boq.main.gaeb2000').text));
		this.gaebFormatList.push(new GaebFormat(2, 'GAEB_XML', '.x', this.translateService.instant('boq.main.gaebXML').text));

		this.gaebTypeList.push(new GaebType(0, '81', this.translateService.instant('boq.main.gaebFile81').text));
		this.gaebTypeList.push(new GaebType(1, '82', this.translateService.instant('boq.main.gaebFile82').text));
		this.gaebTypeList.push(new GaebType(2, '83', this.translateService.instant('boq.main.gaebFile83').text));
		this.gaebTypeList.push(new GaebType(3, '84', this.translateService.instant('boq.main.gaebFile84').text));
		this.gaebTypeList.push(new GaebType(4, '85', this.translateService.instant('boq.main.gaebFile85').text));
		this.gaebTypeList.push(new GaebType(5, '86', this.translateService.instant('boq.main.gaebFile86').text));
	}

	public getGaebFormatId(exportOptions: ExportOptions): number {
		let defaultGaebFormatId = 2; // '.x'

		if (exportOptions.defaultGaebExtension) {
			if (exportOptions.defaultGaebExtension.length >= 2) {
				const found = this.gaebFormatList.find(r => r.Pattern == exportOptions.defaultGaebExtension?.substring(0, 2));
				if (found) {
					defaultGaebFormatId = found.Id;
				}
			}
		}

		return defaultGaebFormatId;
	}

	public getGaebFormatList(): GaebFormat[] {
		return this.gaebFormatList;
	}

	public getGaebTypeList(): GaebType[] {
		return this.gaebTypeList;
	}

	public getGaebTypeId(exportOptions: ExportOptions): number {
		let defaultGaebTypeId = 2; // '83'

		if (exportOptions.defaultGaebExtension) {
			if (exportOptions.defaultGaebExtension.length >= 2) {
				const found = this.gaebTypeList.find(r => r.Phase == exportOptions.defaultGaebExtension?.substring(exportOptions.defaultGaebExtension?.length - 2, exportOptions.defaultGaebExtension?.length));
				if (found) {
					defaultGaebTypeId = found.Id;
				}
			}
		}

		return defaultGaebTypeId;
	}


	public showImportFailedWarning(message: string) {
		this.messageBoxService.showMsgBox(this.translateService.instant(message).text, this.translateService.instant('boq.main.warning').text, 'ico-warning');
	}

	public getGaebExt(formatId: number | undefined, typeId: number | undefined): string {
		let ext = '';
		for (let i = 0; i < this.gaebFormatList.length; i++) {
			if (formatId === this.gaebFormatList[i].id) {
				ext = this.gaebFormatList[i].pattern;
				break;
			}
		}
		for (let z = 0; z < this.gaebTypeList.length; z++) {
			if (typeId === this.gaebTypeList[z].id) {
				ext = ext + this.gaebTypeList[z].phase;
				break;
			}
		}
		return ext;
	}
}

export class GaebInfoData {
	public PreventImport: boolean = false;
	public Errors: string[] = [];
	public SuppressGaebImportErrorCheck: boolean = false;
	public MaxUnitRateBreakDownCountReached: number = 0;
	public HasAssignedCatalog: boolean = false;
	public HasCatalogs: boolean = false;
	public PartialImport: boolean = false;
	public OverwriteExistingElements: boolean = false;
	public AddNewElements: boolean = false;
	public OverwriteExistingItems: boolean = false;
	public AddNewItems: boolean = false;
	public AllowPartialImport: boolean = false;
	public HasSplitQuantities: boolean = false;
	// TODO-BOQ: eslint any (deactivated) public UpComps: any; //TODO-BOQ List < GaebUpCompInfo >
	// TODO-BOQ: eslint any (deactivated) public PrcStructureAssignments: any; //TODO-BOQ List<PrcStructureAssignment>
	// TODO-BOQ: eslint any (deactivated) public Catalogs: any; //TODO-BOQ List<GaebCatalogInfo>
	public Name: string = '';
	public LblBoQ: string = '';
	public Date: string = '';
	public GaebType: string = '';
	public LocalFileName: string = '';
	public OriginalFileName: string = '';
	public ProjectId: number = -1;
	public BoqHeaderId: number = -1;
	// TODO-BOQ: eslint any (deactivated) public SplitQuantities: any; //TODO-BOQ List<BoqQtySplit>
	// TODO-BOQ: eslint any (deactivated) public LocationCtlgDatas: any; //TODO-BOQ List<GaebLocationCtlgDataInfo>
}

class Params {
	public BoqHeaderId: number = 0;
	public ProjectId: number = 0;
	public GaebExt: string = '';
	public Check: boolean = false;
	public ProjectChangeFk: number | null = null;
	public DeviantBidderInfo: GaebBidderInfo | null = new GaebBidderInfo();
	public RequisitionBoqVariantId: number | null = null;
	public CustomFileName: string = '';
	public From?: number;
	public To?: number;
	public IsUrb: boolean = false;
	public Price: boolean = false;
	public QuantityAdj: boolean = false;
	public Specification: boolean = false;
	public SelectionType?: number;
}

class GaebExportResponse {
	public LocalFileName: string = '';
	public OriginalFileName: string = '';
}

class GaebFormat {
	public Id: number = 0;
	public Name: string = '';
	public Pattern: string = '';
	public Description: string = '';

	public constructor(public id: number, public name: string, public pattern: string, public description: string) {
		this.Id = id;
		this.Name = name;
		this.Pattern = pattern;
		this.Description = description;
	}
}

class GaebImportResponse {
	public Result: boolean = false;
	public Info: string = '';
	public Warnings: string[] = [];
}

@Injectable({providedIn: 'root'})
export class GaebFormatLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<GaebFormat, TEntity> { // TODO-WW: export?

	public constructor() {

		const boqMainWizardGaebService = inject(BoqMainWizardGaebService);

		const makeItems = () => {
			return boqMainWizardGaebService.getGaebFormatList();
		};

		super(makeItems(), {
			uuid: 'a5b495c8788145e59d6f1a26300ad076',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}

class GaebType {
	public Id: number = 0;
	public Phase: string = '';
	public Description: string = '';

	public constructor(public id: number, public phase: string, public description: string) {
		this.Id = id;
		this.Phase = phase;
		this.Description = description;
	}
}

@Injectable({providedIn: 'root'})
export class GaebTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<GaebType, TEntity> {

	public constructor() {

		const boqMainWizardGaebService = inject(BoqMainWizardGaebService);

		const makeItems = () => {
			return boqMainWizardGaebService.getGaebTypeList();
		};

		super(makeItems(), {
			uuid: 'a9c0074772ba458096751bdda7b16bb1',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}

@Injectable({providedIn: 'root'})
export class GaebSelectionTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IGaebSelectionType, TEntity> {
	public constructor() {
		super(gaebSelectionTypeOptions, {
			uuid: '21e0d8508d1043bca45a0af8b2a1fe53',
			idProperty: 'id',
			valueMember: 'id',
			displayMember: 'displayMember',
			disableInput: true
		});
	}
}

class BoqMainValidationService {
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private http = inject(PlatformHttpService);

	public scanBoqBeforeExport2Gaeb(boqHeaderId: number, gaebExt: string): Promise<boolean> {

		if (!gaebExt) {     // todo: open user dialog to select gaebExt
			gaebExt = '.x83';
		}

		return this.scanBoq(boqHeaderId, gaebExt).then(value => {
			if (value.length > 0) {
				return this.openGridDialog(value, true).then((res) => {
					return res;
				});
			} else {
				return true;
			}
		});
	}

	public scanBoqAndShowResult(boqHeaderId: number, gaebExt: string, supressNoErrDialog: boolean) {

		this.scanBoq(boqHeaderId, gaebExt).then(value => {
			if (value.length > 0) {
				this.openGridDialog(value, false);
			} else if (!supressNoErrDialog) {
				this.dialogService.showInfoBox('boq.main.scanWasSuccessful', 'boq.main.scanResultPopup', true);
			}
		});
	}


	private scanBoq(boqHeaderId: number, gaebExt: string): Promise<ScanBoqResponse[]> {

		return (this.http.get<ScanBoqResponse[]>('boq/main/scanboq?boqHeaderId=' + boqHeaderId + '&gaebPhase=' + gaebExt));

	}


	public async openGridDialog(scanBoqResponse: ScanBoqResponse[], isButtonContinueVisible: boolean): Promise<boolean> {
		const gridDialogData: IGridDialogOptions<ScanBoqResponse> = {
			width: '40%',
			headerText: 'boq.main.scanResultPopup',
			windowClass: 'grid-dialog',
			gridConfig: {
				uuid: '0adcd488568f4bcfb7c2397a6809fb6b',
				columns: [
					{
						type: FieldType.Integer,
						id: 'Id',
						required: true,
						model: 'Id',
						label: 'boq.main.DoubletFindMethod0',
						visible: false,
						sortable: false,
					},
					{
						type: FieldType.Code,
						id: 'Reference',
						required: true,
						model: 'Reference',
						label: 'boq.main.scanBoqColReference',
						sortable: true,
						width: 150,
					},
					{
						type: FieldType.Text,
						id: 'Message',
						required: false,
						model: 'Message',
						label: 'boq.main.scanBoqColMsg',
						sortable: true,
						width: 850,
					}
				],
				idProperty: 'Id',
			},
			items: scanBoqResponse,
			isReadOnly: true,
			selectedItems: [],
			resizeable: true,
			buttons: [
				{id: 'continue', caption: {key: 'ui.common.dialog.continueBtn'}, isVisible: isButtonContinueVisible},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}]
		};

		const result = await this.gridDialogService.show(gridDialogData);

		return result?.closingButtonId === 'continue';

	}
}

class ScanBoqResponse {
	public Id: number = 0;
	public Reference = '';
	public Message = '';
}

interface IGaebSelectionType {
	id: number,
	displayMember: string,
}

const gaebSelectionTypeOptions: IGaebSelectionType[] = [
	{id: 0, displayMember: 'boq.main.completeBoqDocument'},
	{id: 1, displayMember: 'boq.main.boqArea'}
];




