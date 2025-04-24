import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IFormConfig, IGridConfiguration, IMessageBoxOptions, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IInitializationContext, PlatformHttpService, PlatformReportLanguageItemService } from '@libs/platform/common';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { BoqItemDataService, BoqItemDataServiceBase } from '../boq-main-boq-item-data.service';
import { filter, find, forEach, isEmpty, some } from 'lodash';
import { BoqWizardServiceBase } from './boq-main-wizard.service';
import { BoqWizardUuidConstants } from '@libs/boq/interfaces';

@Injectable({providedIn: 'root'})
export abstract class BoqCrbSiaExportWizardService extends BoqWizardServiceBase{
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private boqItemDataService!:BoqItemDataServiceBase;
	private languageItemService = inject(PlatformReportLanguageItemService);
	private culture: string = this.languageItemService.getCulture();
	public getUuid(): string {
		return BoqWizardUuidConstants.CrbSiaExportWizardUuid;
	}
	protected async exec(boqItemDataService: BoqItemDataServiceBase) {
		this.boqItemDataService = boqItemDataService;
		this.startExport();
	}

	public exportCrb: ExportCrbSia = {
		CrbSiaFormat: 1,
		CrbLanguage: this.culture.startsWith('fr') ? 7 : this.culture.startsWith('it') ? 10 : 2,
		CrbDocumentType: 'B', //TODO-BOQ set CrbDocumentType
		OptionPrices: undefined,
		OptionPriceconditions: undefined,
		OptionQuantities: undefined,
		IsCrbx: true,
		SiaRanges: undefined,
		SiaFilter: new SiaFilter(),
	};

	public async startExport() {
		let boqHeaderId: number;
		if (this.boqItemDataService.getSelectedBoqHeaderId()) {
			boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId() || 0;
			boqHeaderId = 1076053; // TODO-BOQ entfernen. Temporär ein Projekt-LV BoqHeader, CRB Export von WIC-BoqHeaders ist nicht möglich
		} else {
			this.showFailedWarning('boq.main.gaebImportBoqMissing');
			return;
		}
		// TODO-BOQ activate
		//if (this.boqItemDataService.isWicBoq()) {
		//	this.showImportFailedWarning('boq.main.wicDisabledFunc');
		//	return;
		//}

		this.openExportGaebDialog(boqHeaderId);
	}

	private async openExportGaebDialog(boqHeaderId: number) {
		this.http.get$<string>( 'boq/main/crb/siafilter?boqHeaderId=' + boqHeaderId)
			.subscribe(res => {
				const response = JSON.parse(res as string);
				this.exportCrb.SiaFilter = response;

				this.exportCrb.OptionPrices = find(response.Children, { Id: 'prices' });
				this.exportCrb.OptionPriceconditions = find(response.Children, { Id: 'priceconditions' });
				this.exportCrb.OptionQuantities = find(response.Children, { Id: 'quantities' });

				this.exportCrb.SiaRanges = find(response.Children, { Id: 'ranges' }).Children;
				this.exportCrb.SiaRanges?.forEach(par => par.Children.forEach(ch => ch.Parent == par));

				const gridConfiguration: IGridConfiguration<SiaFilter> = {
					uuid: '3c219ad234a24e9f98b990980aeea14b',
					idProperty: 'Id',
					skipPermissionCheck: true,
					marker: true,
					treeConfiguration: {
						parent: entity => {
							return entity.Parent;
						},
						children: entity => {
							return entity.Children || [];
						}
					},
					columns: [{
						id: 'IsMarked',
						model: 'IsMarked',
						sortable: false,
						label: 'boq.main.Filter',
						type: FieldType.Boolean,
						visible: true,
						keyboard: {
							enter: false,
							tab: false
						},
						pinned: true
					},
					{
						id: 'Name',
						model: 'Name',
						sortable: false,
						label: 'boq.main.Description',
						type: FieldType.Description,
						width: 300,
						visible: true,
						keyboard: {
							enter: false,
							tab: false
						},
						pinned: true
					},]
				};

				const exportCrbFormConfig: IFormConfig<ExportCrbSia> = {
					formId: 'export-crb-form',
					showGrouping: false,
					rows: [
						{
							id: 'CrbSiaFormat',
							label: 'boq.main.crbOutputFormat',
							type: FieldType.Radio,
							model: 'CrbSiaFormat',
							itemsSource: {
								items: [
									{
										id: 1,
										displayName: 'SIA CRBX17',
									}
								],
							},
						},
						{
							id: 'CrbLanguage',
							label: 'basics.customize.language',
							type: FieldType.Lookup,
							model: 'CrbLanguage',
							lookupOptions: createLookup({
								dataServiceToken: CrbLanguageLookupService
							})
						},

						{
							id: 'CrbDocumentType',
							label: 'boq.main.crbDocumentType',
							type: FieldType.Lookup,
							model: 'CrbDocumentType',
							lookupOptions: createLookup({
								dataServiceToken: CrbDocumentTypeLookupService,

							}),
						},


						{
							id: 'OptionPrices',
							label: 'boq.main.optionPrices',
							type: FieldType.Boolean,
							model: 'OptionPrices.IsMarked'
						},

						{
							id: 'OptionPriceconditions',
							label: 'boq.main.optionPriceconditions',
							type: FieldType.Boolean,
							model: 'OptionPriceconditions.IsMarked'
						},

						{
							id: 'OptionQuantities',
							label: 'boq.main.optionQuantities',
							type: FieldType.Boolean,
							model: 'OptionQuantities.IsMarked'
						},

						{
							id: 'SiaRanges',
							label: 'boq.main.siaRanges',
							type: FieldType.Grid,
							configuration: gridConfiguration as IGridConfiguration<object>,
							height: 200,
							model: 'SiaRanges',
						},
					],

				};

				this.formDialogService.showDialog<ExportCrbSia>({
					id: 'exportCrbSiaDialog',
					headerText: 'boq.main.siaExport',
					formConfiguration: exportCrbFormConfig,
					entity: this.exportCrb,
				})?.then(result => {
					if (result?.closingButtonId === StandardDialogButtonId.Ok) {
						// set Parent.IsMarked for marked children (analogous to old client)
						result.value?.SiaRanges?.forEach(par => par.Children.forEach(ch => {
 if (ch.IsMarked) {
 par.IsMarked = true;
}
}));

						let boqHeaderId: number;
						if (this.boqItemDataService.getSelectedBoqHeaderId()) {
							boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId() || 0;
						} else {
							return;
						}

						boqHeaderId = 1076053; // TODO-BOQ entfernen. Temporär ein Projekt-LV BoqHeader, CRB Export von WIC-BoqHeaders ist nicht möglich

						let params = '';
						params += '?boqHeaderId=' + boqHeaderId;
						params += '&isCrbx=' + result.value?.IsCrbx;
						params += '&dataLanguageId=' + result.value?.CrbLanguage;
						params += '&documentType=' + result.value?.CrbDocumentType;
						// TODO-BOQ params += $scope.dialog.modalOptions.qtoHeaderId ? '&qtoHeaderId=' + $scope.dialog.modalOptions.qtoHeaderId : '';

						this.http.post$('boq/main/crb/exportsia' + params, result.value?.SiaFilter).subscribe(res => {
							const response = res as SiaExportResponse;
							if (isEmpty(response.LogInfo)) {
								//Create anchor to download file
								const link = document.createElement('a');
								document.body.appendChild(link);
								link.setAttribute('display', 'none');
								link.href = response.Uri;
								link.download = response.FileName; // TODO-BOQ download-name doesn't work
								link.type = 'application/octet-stream';
								link.click();
							} else {
								const error2021List = filter(response.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) {
 return error.includes('N="2021"');
});
								const error4721List = filter(response.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) {
 return error.includes('N="4721"');
});
								const error6305List = filter(response.LogInfo.match(/<Error [\s\S]*?>/gi), function (error) {
 return error.includes('N="6305"');
});

								let infoText = response.LogInfo;
								if (some(error2021List) || some(error4721List) || some(error6305List)) {
									infoText = '';
									if (some(error2021List)) {
										infoText += 'Error 2021 - ' + this.getErrorAttribValue(error2021List[0], 'T');
										infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError2021Comment');
										infoText += '\n\n';
									}

									if (some(error4721List)) {
										infoText += 'Error 4721 - ' + this.getErrorAttribValue(error4721List[0], 'T');
										infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError4721Comment');
										let lastAttribValue = '';
										forEach(error4721List,  (error)=> {
											const attribValue = this.getErrorAttribValue(error, 'I');
											if (attribValue != lastAttribValue) {
												infoText += '\n' + attribValue;
												lastAttribValue = attribValue;
											}
										});
										infoText += '\n\n';
									}

									if (some(error6305List)) {
										infoText += 'Error 6305 - ' + this.getErrorAttribValue(error6305List[0], 'T');
										infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError6305Comment');
										let lastAttribValue = '';
										forEach(error6305List,  (error)=> {
											const attribValue = this.getErrorAttribValue(error, 'I');
											if (attribValue != lastAttribValue) {
												infoText += '\n' + attribValue;
												lastAttribValue = attribValue;
											}
										});
										infoText += '\n\n';
									}
								}

								const messageBoxOptions: IMessageBoxOptions = {
									headerText: this.translateService.instant('boq.main.siaExport').text,
									topDescription: { text: this.translateService.instant('boq.main.exportFailed'), iconClass: 'tlb-icons ico-info' },
									bodyText: infoText,
								};
								// TODO-BOQ: platformLongTextDialogService.showDialog
								this.messageBoxService.showMsgBox(messageBoxOptions);
							}
						});
					}
				});
			});
	}
	private getErrorAttribValue(error: string, attribName: string): string {
		let ret = error;
		ret = ret.substring(ret.indexOf(attribName + '="') + 3);
		ret = ret.substring(0, ret.indexOf('"'));
		return ret;
	}
	private showFailedWarning(message: string) {
		this.messageBoxService.showMsgBox(this.translateService.instant(message).text, this.translateService.instant('boq.main.warning').text, 'ico-warning');
	}
}

@Injectable({providedIn: 'root'})
export class BoqMainCrbSiaExportWizardService extends BoqCrbSiaExportWizardService {
	public async execute(context: IInitializationContext) {
		await this.exec(context.injector.get(BoqItemDataService));
	}
}

@Injectable({ providedIn: 'root' })
export class CrbLanguageLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<CrbLanguage, TEntity> {

	public constructor() {

		const makeItems = () => {
			const items = [];
			items.push(new CrbLanguage(2, 'Deutsch'));
			items.push(new CrbLanguage(7, 'Français'));
			items.push(new CrbLanguage(10, 'Italiano'));
			return items;
		};

		super(makeItems(), {
			uuid: 'db36b0fed507469e838a3410b7d6d914',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Name',
		});
	}
}

@Injectable({ providedIn: 'root' })
export class CrbDocumentTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<CrbDocumentType, TEntity> {
	private languageItemService = inject(PlatformReportLanguageItemService);
	private culture: string = this.languageItemService.getCulture();
	private boqItemDataService: BoqItemDataService = inject(BoqItemDataService);
	private readonly httpService = inject(PlatformHttpService);
	public constructor() {

		const makeItems = () => {
			const items: CrbDocumentType[] = [];

			// TODO-BOQ let boqHeaderId = this.boqItemDataService.getSelectedBoqHeaderId();
			const boqHeaderId = 1076053; // ein Projekt-LV BoqHeader, CRB Export von WIC-BoqHeaders ist nicht möglich

			const description: { [id: string]: string;} = this.culture.startsWith('fr') ? { 'A': 'Descriptif type', 'B': 'Appel d\'offres', 'C': 'Offre', 'D': 'Contrat/Avenant', 'I': 'Métré' } :
				this.culture.startsWith('it') ? { 'A': 'Descrizione tipica', 'B': 'Gara d\'appalto', 'C': 'Offerta', 'D': 'Contratto/Avvenuta', 'I': 'Misurato' } :
					{ 'A': 'Musterleistungsverzeichnis', 'B': 'Ausschreibung', 'C': 'Angebot', 'D': 'Vertrag/Nachtrag', 'I': 'Ausmass' };

			this.httpService.get$('boq/main/crb/crbdocumenttype?boqHeaderId=' + boqHeaderId)
				.subscribe(res => {
					const response: GetCrbDocumentTypeResponse = JSON.parse(res as string);
					if (response) {
						let i: number = 0;
						forEach(response.ValidCrbDocumentTypes, (documentTypeCode) => {
							items.push(new CrbDocumentType(i++, documentTypeCode, documentTypeCode + ' - ' + description[documentTypeCode]));
						});
						this.setItems(items);
					}
				});
		};

		super([], {
			uuid: 'c9de4af7474d4115a394df1f06983527',
			idProperty: 'Id',
			valueMember: 'Code',
			displayMember: 'Name'
		});

		makeItems();
	}
}

class GetCrbDocumentTypeResponse {
	public CurrentCrbDocumentType: string = '';
	public ValidCrbDocumentTypes: string[] = [];
}

class ExportCrbSia {
	public CrbSiaFormat?: number;
	public CrbLanguage?: number;
	public CrbDocumentType?: string;
	public OptionPrices?: SiaFilter;
	public OptionPriceconditions?: SiaFilter;
	public OptionQuantities?: SiaFilter;
	public IsCrbx?: boolean;
	public SiaRanges?: SiaFilter[];
	public SiaFilter?: SiaFilter;
}

class SiaFilter {
	public Id: number = 0;
	public Name: string = '';
	public IsMarked: boolean = false;
	public Children: SiaFilter[] = [];
	public Parent: SiaFilter | null = null;
}

class SiaExportResponse {
	public Uri: string = '';
	public FileName: string = '';
	public LogInfo: string = '';
}

class CrbLanguage {
	public Id: number;
	public Name: string;

	public constructor(public id: number, public name: string) {
		this.Id = id;
		this.Name = name;
	}
}

class CrbDocumentType {
	public Id: number = 0;
	public Code: string = '';
	public Name: string = '';

	public constructor(public id: number, public code: string, public name: string) {
		this.Id = id;
		this.Code = code;
		this.Name = name;
	}
}
