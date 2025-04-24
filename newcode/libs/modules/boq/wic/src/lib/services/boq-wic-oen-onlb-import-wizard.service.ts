import { IInitializationContext, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { WicGroupDataService } from './boq-wic-group.service';
import _, { split } from 'lodash';
import { IWicBoqCompositeEntity } from '@libs/boq/interfaces';

export class OenOnlbImportWizardService {
	private dialogService: UiCommonDialogService;
	private messageBoxService: UiCommonMessageBoxService;
	private translateService: PlatformTranslateService;
	private http: PlatformHttpService;
	private wicGroupDataService: WicGroupDataService;

	public constructor(context: IInitializationContext) {
		this.dialogService = context.injector.get(UiCommonDialogService);
		this.messageBoxService = context.injector.get(UiCommonMessageBoxService);
		this.http = context.injector.get(PlatformHttpService);
		this.translateService = context.injector.get(PlatformTranslateService);
		this.wicGroupDataService = context.injector.get(WicGroupDataService);
	}

	public succeededImports: string[] = [];
	public warnigedImports: string[] = [];
	public failedImports: string[] = [];

	public import() {
		const selectedWicGroup = this.wicGroupDataService.getSelectedEntity();
		if (!selectedWicGroup) {
			this.messageBoxService.showInfoBox('boq.main.npkImportWicMissing', 'info', false);
			return;
		}

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.onlb';
		input.multiple = false;
		input.onchange = () => {
			this.importOnlb(input.files, 0, selectedWicGroup.Id);
		};
		input.click();
	}

	private importOnlb(files: FileList | null, index: number, wicGroupId: number) {
		if (files) {
			const selectedFile = files[0];
			const fileReader = new FileReader();
			fileReader.readAsDataURL(selectedFile);
			fileReader.onload = (e) => {
				const request = new OnlbImportRequest();
				request.WicGroupId = wicGroupId;
				request.FileName = selectedFile.name;
				request.FileContent = new FileContent();
				request.FileContent.Content = split(e.target?.result?.toString(), ',')[1];
				this.http.post$('boq/wic/boq/importoenonlb', request).subscribe(res => {
					const response = res as OnlbImportResponse;
					if (response) {
						if (response.ErrorDescription) {
							this.failedImports.push(response.FileName + '\n' + response.ErrorDescription);
						} else {
							//TODO-BOQ boqWicBoqService.addWicBoq(response.WicBoqComposite);
							if (_.some(response.Warnings)) {
								this.warnigedImports.push(response.FileName + '\n' + response.Warnings.join('\n'));
							} else {
								this.succeededImports.push(response.FileName);
							}
						}

						if (++index < files.length) {
							this.importOnlb(files, index, wicGroupId);
						} else {
							//TODO-BOQ
							//platformLongTextDialogService.showDialog({
							//	headerText$tr$: 'boq.main.oen.onlbImport',
							//	codeMode: true,
							//	hidePager: true,
							//	dataSource: new function () {
							//		var infoText = '';
							//		_.forEach(failedImports, function (failedImport) {
							//			infoText += $translate.instant('boq.main.importFailed') + '\n' + failedImport + '\n\n';
							//		});
							//		_.forEach(warnigedImports, function (waringedImport) {
							//			infoText += $translate.instant('boq.main.importSucceeded') + '\n' + waringedImport + '\n\n';
							//		});
							//		if (_.some(succeededImports)) {
							//			infoText += $translate.instant('boq.main.importSucceeded') + '\n' + succeededImports.join('\n') + '\n\n';
							//		}
							//		platformLongTextDialogService.LongTextDataSource.call(this);
							//		this.current = infoText;
							//	}
							//});

							let infoText = '';
							this.failedImports.forEach(imp => {
								infoText += 'boq.main.importFailed' + '\n' + imp + '\n\n';
							});
							this.warnigedImports.forEach(imp => {
								infoText += 'boq.main.importSucceeded' + '\n' + imp + '\n\n';
							});
							if (_.some(this.succeededImports)) {
								infoText += 'boq.main.importSucceeded' + '\n' + this.succeededImports.join('\n') + '\n\n';
							}
							this.messageBoxService.showMsgBox(infoText, 'boq.main.oen.onlbImport', 'ico-info');
						}
					}
				});
			};
		}
	}
}
class OnlbImportRequest {
	public WicGroupId?: number;
	public FileName?: string;
	public FileContent?: FileContent;
}
class OnlbImportResponse {
	public FileName: string = '';
	public Warnings: string[] = [];
	public ErrorDescription?: string;
	public WicBoqComposite?: IWicBoqCompositeEntity;
}

class FileContent {
	public Content: string | ArrayBuffer | null | undefined;
}
