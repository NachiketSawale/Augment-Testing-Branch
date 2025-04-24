import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, IFormConfig, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { ProjectStockLocationLookupService } from '@libs/project/shared';
import { LogisticCardDataService } from '../logistic-card-data.service';
import { ProjectStockLookupService } from '@libs/procurement/shared';

interface IResponse {
	message: string;
}

interface IReserveMaterialResultData {
	ProjectFk: number | null;
	PrjStockFk: number | null;
	PrjStockLocationFk: number | null;
}

interface IPerformingJob {
	ProjectFk: number | null;
}

interface IProjectStock {
	Id: number;
}

@Injectable({
	providedIn: 'root',
})
export class LogisticCardsReserveMaterialAndStockWizard {
	private readonly logisticCardDataService = inject(LogisticCardDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(PlatformHttpService);

	public reserveMaterialAndStock(): void {
		const selectedJobCard = this.logisticCardDataService.getSelectedEntity();

		if (!selectedJobCard) {
			this.showMessage('cloud.common.noCurrentSelection');
			return;
		}

		const jobPerformingFk = selectedJobCard.JobPerformingFk;
		if (!jobPerformingFk) {
			this.showMessage('logistic.card.performingJobinfmissing');
			return;
		}

		this.fetchPerformingJob(jobPerformingFk).then((performingJob) => {
			if (!performingJob){
				return;
			}
			this.fetchProjectStock(performingJob.ProjectFk).then((projectStock) => {
				const entityData: IReserveMaterialResultData = {
					ProjectFk: performingJob.ProjectFk ?? null,
					PrjStockFk: projectStock?.Id ?? null,
					PrjStockLocationFk: null,
				};
				this.showReserveMaterialDialog(selectedJobCard, entityData);
			});
		});
	}

	private async fetchPerformingJob(jobId: number): Promise<IPerformingJob | null> {
		try {
			return await this.http.get<IPerformingJob>(`logistic/job/getbyid?jobId=${jobId}`);
		} catch {
			this.showMessage('logistic.card.performingJobinfmissing');
			return null;
		}
	}

	private async fetchProjectStock(projectFk: number | null): Promise<IProjectStock | null> {
		if (!projectFk) {
			return null;
		}
		try {
			const projectStocks = await this.http.post<IProjectStock[]>('project/stock/instances', { PKey1: projectFk });
			return projectStocks.length > 0 ? projectStocks[0] : null;
		} catch {
			this.showMessage('logistic.card.performingJobinfmissing');
			return null;
		}
	}

	private showReserveMaterialDialog(selectedJobCard: ILogisticCardEntity, entityData: IReserveMaterialResultData): void {
		this.formDialogService.showDialog<IReserveMaterialResultData>({
			headerText: 'logistic.card.titelreservematerialandstock',
			formConfiguration: this.getFormConfiguration,
			entity: entityData,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		})?.then(() => this.handleOk(selectedJobCard, entityData));
	}

	private getFormConfiguration: IFormConfig<IReserveMaterialResultData> = {
		formId: 'logistic.card.reservematerialandstock',
		showGrouping: false,
		groups: [{ groupId: 'baseGroup' }],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'StockCode',
				label: { key: 'logistic.card.entityProjectStock' },
				type: FieldType.Lookup,
				model: 'PrjStockFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({ dataServiceToken: ProjectStockLookupService, showDescription: true }),
			},
			{
				groupId: 'baseGroup',
				id: 'StockLocation',
				label: { key: 'logistic.card.entityStock' },
				type: FieldType.Lookup,
				model: 'PrjStockLocationFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({ dataServiceToken: ProjectStockLocationLookupService, showDescription: true }),
			},
		],
	};

	private handleOk(selected: ILogisticCardEntity, entityData: IReserveMaterialResultData): void {
		const postData = {
			ProjectStockId: entityData.PrjStockFk,
			Cards: [selected],
		};

		this.http.post<IResponse>('logistic/card/card/reservematerial', postData).then((response) => {
			if (response) {
				this.showMessage('Reserve material in stock successfully', 'Reserve material in stock');
			} else {
				this.showMessage('logistic.card.performingJobinfmissing');
			}
		});
	}

	private showMessage(bodyText: string, headerText: string = 'logistic.card.titelreservematerialandstock'): void {
		this.messageBoxService.showMsgBox({
			headerText,
			bodyText,
			iconClass: 'ico-info',
		});
	}
}
