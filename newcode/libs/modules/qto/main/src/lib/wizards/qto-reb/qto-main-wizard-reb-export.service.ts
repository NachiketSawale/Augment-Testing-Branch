/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ContextService, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { createLookup, CustomStep, FieldType, FormStep, IFormConfig, IWizardStep, LookupSimpleEntity, MultistepDialog, UiCommonDialogService, UiCommonMessageBoxService, UiCommonMultistepDialogService } from '@libs/ui/common';
import { MainDataDto } from '@libs/basics/shared';
import { QtoMainExportFormatLookupDataService } from '../../services/lookup-service/qto-main-export-format-lookup-data.service';
import { filter, forEach, get, some, startsWith } from 'lodash';
import { ExportQtoDocumentComponent } from '../../components/export/export-qto-document/export-qto-document.component';
import { firstValueFrom } from 'rxjs';
import { ICrbDocType, IQtoExportBasic2Config, IQtoExportBasicConfig, IQtoExportConfig, IRangesEntity } from '../../model/interfaces/qto-wizard-export-config.interface';
import { CrbDocumentKey, CrbOptionKey, QTO_FORMAT, QTO_SCOPE, StepId } from '../../model/enums/qto-wizard-export-key.enum';
import { QtoMainDetailGridDataService } from '../../services/qto-main-detail-grid-data.service';
import { IQtoMainDetailGridEntity } from '../../model/qto-main-detail-grid-entity.class';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';

@Injectable({
	providedIn: 'root',
})
export class QtoMainWizardRebExportService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly wizardDialogService = inject(UiCommonMultistepDialogService);
	private readonly qtoHeaderService = inject(QtoMainHeaderGridDataService);
	private readonly qtoMainDetailGridDataService = inject(QtoMainDetailGridDataService);
	private readonly context = inject(ContextService);
	private _stepDialog!: MultistepDialog<IQtoExportConfig>;
	private dataModel!: IQtoExportConfig;
	private readonly httpService = inject(PlatformHttpService);


	/**
	 * get Current model data
	 * @constructor
	 */
	public get DialogData() {
		return this.dataModel;
	}

	public basicFormConfig: IFormConfig<IQtoExportBasicConfig> = {
		formId: 'basicStep',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			},
		],
		rows: [
			{
				id: 'QtoScope',
				label: {
					text: 'Select QTO Scope',
					key: 'qto.main.wizard.QtoScope',
				},
				type: FieldType.Radio,
				model: 'QtoScope',
				sortOrder: 1,
				required: true,
				itemsSource: {
					items: [
						{
							id: QTO_SCOPE.RESULT_HIGHLIGHTED,
							displayName: { text: 'Highlighted Quantity takeoff line', key: 'qto.main.wizard.HighlightedQto' },
						},
						{
							id: QTO_SCOPE.RESULT_SET,
							displayName: { text: 'Current Result Set', key: 'qto.main.wizard.ResultSet' },
						},
						{
							id: QTO_SCOPE.ALL_QTO,
							displayName: { text: 'Entire Quantity takeoff', key: 'qto.main.wizard.EntireQto' },
						},
					],
				},
			},
			{
				id: 'RebFormatId',
				label: {
					text: 'Export Format',
					key: 'qto.main.RebFormat',
				},
				model: 'RebFormatId',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: QtoMainExportFormatLookupDataService,
				}),
				change: (info) => {
					if (this._stepDialog) {
						this._stepDialog.removeWizardSteps([StepId.Enhance, StepId.CrbSia]);
						if (info.newValue === QTO_FORMAT.XML) {
							this._stepDialog.insertWizardStep(this.newStep(StepId.Enhance), StepId.Basic);
						} else if (info.newValue === QTO_FORMAT.CRBX) {
							Promise.all([this.getSiaFilter(), this.getDocType()]).then((result) => {
								this._stepDialog.insertWizardStep(this.newStep(StepId.CrbSia), StepId.Basic);
							});
						}
					}
				},
			},
		],
	};

	public basic2FormConfig: IFormConfig<IQtoExportBasic2Config> = {
		formId: 'enhanceStep',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { text: 'Default Group' },
			},
		],
		rows: [
			{
				id: 'IncludeSheets',
				label: {
					text: 'QTO Detail',
					key: 'qto.main.wizard.includeSheets',
				},
				type: FieldType.Boolean,
				model: 'IncludeSheets',
				sortOrder: 1,
				required: false,
			},
			{
				id: 'IncludeQtoDetail',
				label: {
					text: 'Sheets',
					key: 'qto.main.wizard.includeQtoDetail',
				},
				type: FieldType.Boolean,
				model: 'IncludeQtoDetail',
				sortOrder: 2,
				required: false,
			},
			{
				id: 'IncludeGenerateDate',
				label: {
					text: 'General QTO data',
					key: 'qto.main.wizard.includeGenerateDate',
				},
				type: FieldType.Boolean,
				model: 'IncludeGenerateDate',
				sortOrder: 3,
				required: false,
			},
		],
	};

	private newStep(stepId?: StepId | null): IWizardStep {
		if (this.dataModel) {
			switch (stepId) {
				case StepId.Basic:
					return new FormStep(StepId.Basic, { key: 'qto.main.RebExport' }, this.basicFormConfig, 'Basic');
				case StepId.Enhance:
					return new FormStep(StepId.Enhance, { key: 'qto.main.RebExport' }, this.basic2FormConfig, 'Basic2');
				case StepId.CrbSia:
					return new CustomStep(StepId.CrbSia, 'crbSiaStep', ExportQtoDocumentComponent, [], 'BoqCrb');
			}
		}
		return new FormStep(StepId.Basic, { key: 'qto.main.RebExport' }, this.basicFormConfig, 'Basic');
	}

	/**
	 * QTO Document Export
	 */
	public async exportREB() {
		this.initModelData();
		const multistepDialog = new MultistepDialog(this.dataModel, [this.newStep()], { key: 'qto.main.RebExport' });
		this._stepDialog = multistepDialog;
		this.reSetBtn();
		await this.wizardDialogService.showDialog(multistepDialog);
	}

	private reSetBtn() {
		if (this.dataModel && this._stepDialog) {
			this._stepDialog.dialogOptions.buttons = [
				{
					id: 'previousStep',
					caption: { key: 'basics.common.button.previousStep' },
					isVisible: (info) => {
						return StepId.CrbSia === this._stepDialog.currentStep.id || StepId.Enhance === this._stepDialog.currentStep.id;
					},
					fn: (event, info) => {
						info.dialog.value?.goToPrevious();
					},
				},
				{
					id: 'nextBtn',
					caption: { key: 'basics.common.button.nextStep' },
					isVisible: (info) => {
						return this._stepDialog.currentStep.id === StepId.Basic && (QTO_FORMAT.XML === this.dataModel.Basic.RebFormatId || QTO_FORMAT.CRBX === this.dataModel.Basic.RebFormatId);
					},
					fn: (event, info) => {
						info.dialog.value?.goToNext();
					},
				},
				{
					id: 'finished',
					caption: { key: 'ui.common.dialog.multistep.finishBtn' },
					isDisabled: (info) => {
						if (this._stepDialog.currentStep.id === StepId.Basic) {
							return QTO_FORMAT.XML === this.dataModel.Basic.RebFormatId || QTO_FORMAT.CRBX === this.dataModel.Basic.RebFormatId;
						}
						return this._stepDialog.currentStep.id === StepId.Basic;
					},
					fn: (event, info) => {
						this.qtoHeaderService.updateAndExecute(() => {
							this.checkQtoDetailHaveError().then(() => {
								if (this.dataModel.Basic.RebFormatId !== QTO_FORMAT.CRBX) {
									this.exportBasic();
								} else {
									this.exportCrbSia();
								}
							});
						});
					},
					autoClose: true,
				},
				{
					id: 'closeWin',
					caption: { key: 'basics.common.button.cancel' },
					autoClose: true,
				},
			];
		}
	}

	private initModelData() {
		const culture = this.context.getCulture() ?? 'fr';
		const selectedCrbLanguage = startsWith(culture, 'fr') ? 7 : startsWith(culture, 'it') ? 10 : 2;
		this.dataModel = {
			Basic: {
				QtoScope: 1,
				RebFormatId: 1,
			},
			Basic2: {
				IncludeSheets: false,
				IncludeQtoDetail: true,
				IncludeGenerateDate: true,
			},
			BoqCrb: {
				CrbFormatId: 1,
				CrbLanguage: selectedCrbLanguage,
				CrbDocumentType: 1,
				CrbDocumentTypeItem: [],
				QtoExportBoqCrbOption: {
					OptionPrices: false,
					OptionPriceConditions: false,
					OptionQuantities: false,
				},
				GridData: [],
			},
		};
	}

	private async getDocType() {
		if (this.dataModel) {
			const culture = this.context.getCulture() ?? 'fr';
			const description = startsWith(culture, 'fr')
				? { A: 'Descriptif type', B: 'Appel offres', C: 'Offre', D: 'Contrat/Avenant', I: 'Métré' }
				: startsWith(culture, 'it')
					? { A: 'Descrizione tipica', B: 'Gara appalto', C: 'Offerta', D: 'Contratto/Avvenuta', I: 'Misurato' }
					: { A: 'Musterleistungsverzeichnis', B: 'Ausschreibung', C: 'Angebot', D: 'Vertrag/Nachtrag', I: 'Ausmass' };
			const boqHeaderId = this.qtoHeaderService.getSelectedEntity()?.BoqHeaderFk ?? -1; // test 1021479;
			const res = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'boq/main/crb/crbdocumenttype', { params: { boqHeaderId: boqHeaderId } }));
			const resString = res as string;
			const resObject = JSON.parse(resString) as ICrbDocType;
			this.dataModel.BoqCrb.CrbDocumentTypeItem = resObject.ValidCrbDocumentTypes.map((e) => {
				const des = new MainDataDto<string>(description);
				if (resObject.CurrentCrbDocumentType === e) {
					this.dataModel.BoqCrb.CrbDocumentType = get(CrbDocumentKey, e);
				}
				return new LookupSimpleEntity(get(CrbDocumentKey, e), e + ' - ' + des.getValueAs<string>(e));
			});
		}
	}

	private async getSiaFilter() {
		if (this.dataModel) {
			const boqHeaderId = this.qtoHeaderService.getSelectedEntity()?.BoqHeaderFk ?? -1; // test 1021479;
			const res = await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'boq/main/crb/siafilter', { params: { boqHeaderId: boqHeaderId } }));
			const resString = res as string;
			const resObject = JSON.parse(resString) as IRangesEntity;
			if (resObject) {
				resObject.Children.forEach((e) => {
					switch (e.Id) {
						case CrbOptionKey.Ranges:
							this.dataModel.BoqCrb.GridData = e.Children;
							break;
						case CrbOptionKey.Prices:
							this.dataModel.BoqCrb.QtoExportBoqCrbOption.OptionPrices = e.IsMarked;
							break;
						case CrbOptionKey.PriceConditions:
							this.dataModel.BoqCrb.QtoExportBoqCrbOption.OptionPriceConditions = e.IsMarked;
							break;
						case CrbOptionKey.Quantities:
							this.dataModel.BoqCrb.QtoExportBoqCrbOption.OptionQuantities = e.IsMarked;
							break;
					}
				});
			}
		}
	}

	private async exportBasic() {
		let qtoDetails: IQtoMainDetailGridEntity[] = [];

		if (this.dataModel.Basic.QtoScope === 1) {
			qtoDetails = this.qtoMainDetailGridDataService.getSelection();
		} else if (this.dataModel.Basic.QtoScope === 2) {
			// TODO qtoMainDetailGridDataService.getCurrentResultSet not work
			// qtoDetails = this.qtoMainDetailGridDataService.getCurrentResultSet();
		}

		const params = {
			QtoHeaderId: this.qtoMainDetailGridDataService.getCurrentQtoHeader()?.Id ?? -1,
			ExportType: this.dataModel.Basic.RebFormatId,
			QtoScope: this.dataModel.Basic.QtoScope,
			QtoDetailIds: qtoDetails.map((e) => e.Id),
			IncludeSheets: this.dataModel.Basic2.IncludeSheets,
			IncludeQtoDetail: this.dataModel.Basic2.IncludeQtoDetail,
			IncludeGenerateDate: this.dataModel.Basic2.IncludeGenerateDate,
		};
		return this.httpService.post<HttpResponse<Blob>>('qto/main/exchange/exportreb', params).then(res => {
			this.buildAndDownloadFile(res);
			/*const uri = res;
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute('display', 'none');
			link.href     = uri;
			// response.headers('Content-Disposition').slice(21);
			link.download = res.header.get('Content-Disposition').slice(21);
			link.type     = 'application/octet-stream';
			link.click();
			link.remove();*/
		});
	}

	private async exportCrbSia() {
		let qtoDetails: IQtoMainDetailGridEntity[] = [];

		if (this.dataModel.Basic.QtoScope === 1) {
			qtoDetails = this.qtoMainDetailGridDataService.getSelection();
		} else if (this.dataModel.Basic.QtoScope === 2) {
			// TODO qtoMainDetailGridDataService.getCurrentResultSet not work
			// qtoDetails = this.qtoMainDetailGridDataService.getCurrentResultSet();
		}

		const params = {
			boqHeaderId: this.qtoMainDetailGridDataService.getCurrentQtoHeader()?.Id ?? -1,
			isCrbx: this.dataModel.Basic.RebFormatId,
			dataLanguageId: this.dataModel.Basic.QtoScope,
			documentType: qtoDetails.map((e) => e.Id),
			siaFilter: this.dataModel.BoqCrb.GridData,
		};

		const res = await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'boq/main/crb/exportsia', params));

		const resJson = res as { Uri: string; FileName: string; LogInfo: string };
		if (!resJson.LogInfo) {
			const link = document.createElement('a');
			document.body.appendChild(link);
			link.setAttribute('display', 'none');
			link.href = resJson.Uri;
			link.download = resJson.FileName;
			link.type = 'application/octet-stream';
			link.click();
			link.remove();
		} else {
			this.showErrorMessageBox(resJson.LogInfo);
		}
	}

	private checkQtoDetailHaveError() {
		// todo
		/*let deferred = $q.defer();
		let validationErrorInfo = '';
		let details = this.qtoMainDetailGridDataService.getValidationErrors() .getSelection();

		forEach(details, function(detail){
			if (detail.__rt$data && detail.__rt$data.errors) {
				let errorStr = '';

				_.forEach(detail.__rt$data.errors, function(error){
					if(error && !_.isEmpty(error)){
						errorStr += error.error + '<br>';
					}
				});

				if(errorStr !== '') {
					errorStr = detail.Code + ': <br>' + errorStr;
				}

				validationErrorInfo += errorStr;
			}
		});

		if(validationErrorInfo !== ''){
			validationErrorInfo += 'Do you want to continue to do the REB Export?';
			let modalOptions = {
				headerTextKey: $translate.instant('cloud.common.informationDialogHeader'),
				bodyTextKey: validationErrorInfo,
				showYesButton: true,
				showCancelButton: true,
				iconClass: 'ico-warning'
			};

			deferred.promise =  platformModalService.showDialog(modalOptions);
		}else{
			deferred.resolve({'yes': true});
		}*/

		return Promise.resolve();
	}

	private showErrorMessageBox(logInfo: string) {
		let infoText = logInfo;
		const error2021List = filter(logInfo.match(/<Error [\s\S]*?>/gi), function (error) {
			return error.includes('N="2021"');
		});
		const error4721List = filter(logInfo.match(/<Error [\s\S]*?>/gi), function (error) {
			return error.includes('N="4721"');
		});
		const error6305List = filter(logInfo.match(/<Error [\s\S]*?>/gi), function (error) {
			return error.includes('N="6305"');
		});
		if (some(error2021List) || some(error4721List) || some(error6305List)) {
			infoText = '';
			if (some(error2021List)) {
				infoText += 'Error 2021 - ' + this.getErrorAttribValue(error2021List[0], 'T');
				infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError2021Comment').text;
				infoText += '\n\n';
			}

			if (some(error4721List)) {
				infoText += 'Error 4721 - ' + this.getErrorAttribValue(error4721List[0], 'T');
				infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError4721Comment').text;
				let lastAttribValue = '';
				forEach(error4721List, (error) => {
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
				infoText += '\n' + '	' + this.translateService.instant('boq.main.crbSiaExportError6305Comment').text;
				let lastAttribValue = '';
				forEach(error6305List, (error) => {
					const attribValue = this.getErrorAttribValue(error, 'I');
					if (attribValue != lastAttribValue) {
						infoText += '\n' + attribValue;
						lastAttribValue = attribValue;
					}
				});
				infoText += '\n\n';
			}
		}
		void this.messageBoxService.showMsgBox({
			headerText: this.translateService.instant('boq.main.siaExport'),
			topDescription: { text: this.translateService.instant('boq.main.exportFailed'), iconClass: 'tlb-icons ico-info' },
			bodyText: infoText,
		});
	}

	private getErrorAttribValue(error: string, attribName: string) {
		let ret = error;
		ret = ret.substring(ret.indexOf(attribName + '="') + 3);
		ret = ret.substring(0, ret.indexOf('"'));
		return ret;
	}

	private buildAndDownloadFile<T>(response: HttpResponse<T>) {
		//Prepare file details
		const fileName = response.headers.get('Content-Disposition')?.slice(21) ?? '';
		const contentType = response.headers.get('content-type') || 'application/octet-stream';

		//Create anchor to download file
		const url = window.URL || window.webkitURL;
		const link = document.createElement('a');
		document.body.appendChild(link);
		link.setAttribute('display', 'none');

		//Prepare file, attach to anchor and download the file
		const blob = new Blob([JSON.stringify(response.body)], { type: contentType });
		const objectDownloadUrl = url.createObjectURL(blob);
		link.href = objectDownloadUrl;
		link.download = fileName;
		link.click();

		//Remove the anchor
		window.URL.revokeObjectURL(objectDownloadUrl);
		link.remove();
	}
}
