/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService, Translatable } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { QtoMainHeaderGridDataService } from '../../header/qto-main-header-grid-data.service';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { IQtoImportResponse } from '../../model/interfaces/qto-import-response.interface';

@Injectable({
	providedIn: 'root',
})
export class QtoMainWizardRebImportService {
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly qtoHeaderService = inject(QtoMainHeaderGridDataService);

	/**
	 * importREB
	 */
	public importREB() {
		this.qtoHeaderService.updateAndExecute(() => {
			const selectedItem = this.qtoHeaderService.getSelectedEntity();
			if (!selectedItem) {
				this.showInfoDialog(this.translateService.instant('qto.main.qtoHeaderMissing').text);
				return;
			}

			// todo qtoMainHeaderReadonlyProcessor.getItemStatus
			/*const qtoStatusItem = this.qtoMainHeaderReadonlyProcessor.getItemStatus(selectedItem);
			if (selectedItem.PrjChangeStutasReadonly || qtoStatusItem && qtoStatusItem.IsReadOnly) {
				this.showInfoDialog(this.translateService.instant('qto.main.qtoHeaderReadOnly').text);
				return;
			}*/

			this.choiceDataFile((file) => {
				this.doImportREB(selectedItem, file);
			});
		});
	}

	private doImportREB(selectedItem: IQtoMainHeaderGridEntity, file: File) {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('model', selectedItem.Id.toString());
		this.http.post(this.configService.webApiBaseUrl + 'qto/main/exchange/importreb', formData).subscribe((res) => {
			const resObject = res as IQtoImportResponse;
			let isFailed = false;
			let message:Translatable = '';
			if (resObject.XmlImport) {
				if (resObject.WarningMessage) {
					message = resObject.WarningMessage;
					isFailed = true;
				}
			} else {
				if (resObject.timeStr && resObject.timeStr) {
					console.log(resObject.timeStr);
				}
				if (resObject.existAddressList) {
					message = this.translateService.instant('qto.main.existAddressList', {
						linereference: '[' + resObject.existAddressList.join('][').toString() + ']',
					});
					isFailed = true;
				} else if (resObject.errorQtoAddrssRange && resObject.errorQtosCode && resObject.errorQtosCode.length) {
					message = this.translateService.instant('qto.main.errorQtoAddrssRange', {
						linereference: '[' + resObject.errorQtosCode.join('][').toString() + ']',
					});
					isFailed = true;
				} else if (resObject.errorQtosCode && resObject.errorQtosCode.length) {
					message = this.translateService.instant('qto.main.errorQtosCode', {
						linereference: '[' + resObject.errorQtosCode.join('][').toString() + ']',
					});
					isFailed = true;
				}
			}
			if (!isFailed) {
				// todo reload container data
				/*qtoMainDetailService.load();
				qtoMainStructureDataService.load();
				qtoBoqStructureService.load();*/
			} else {
				this.showInfoDialog(message);
			}
		});
	}

	private choiceDataFile(callback: (file: File) => void) {
		const fileInputEle = document.createElement('input') as HTMLInputElement;
		const selectFile = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const files = target.files as FileList;
			const fileData = files[0];

			// todo depend on boqMainCrbSiaService.import function
			// invoke Boq side part CRBX importing
			/*if(fileData.name.toLowerCase().endsWith('.crbx')){
				const selectedItem = this.qtoHeaderService.getSelection();
				const boqTempDataService = {
					getRootBoqItem: function (){
						return {BoqHeaderFk: selectedItem.BoqHeaderFk};
					},
					getSelectedProjectId: function (){
						return selectedItem.ProjectFk;
					},
					isWicBoq: function (){
						return false;
					},
					getQtoHeaderId: function (){
						return selectedItem.Id;
					}
				};

				$injector.get('boqMainCrbSiaService').importCrbSia(boqTempDataService, fileData);

				return;
			}*/

			callback(fileData);
		};
		if (fileInputEle) {
			fileInputEle.type = 'file';
			fileInputEle.accept = '.d11, .x31, .crbx, .xml';
			fileInputEle.addEventListener('change', selectFile);
			fileInputEle.click();
		}
	}

	private showInfoDialog(bodyText: Translatable) {
		const modalOptions = {
			headerTextKey: this.translateService.instant('cloud.common.informationDialogHeader'),
			bodyTextKey: bodyText,
			showOkButton: true,
			iconClass: 'ico-info',
		};
		void this.messageBoxService.showMsgBox(modalOptions);
	}
}
