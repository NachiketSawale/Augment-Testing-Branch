/*
 * Copyright (c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	IFormConfig,
	UiCommonFormDialogService,
	UiCommonMessageBoxService,
} from '@libs/ui/common';
import { PlatformHttpService } from '@libs/platform/common';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardDataService } from '../logistic-card-data.service';
import { BasicsSharedRubricCategoryLookupService } from '@libs/basics/shared';

interface IResponse {
	SucceededJobCards?: { Code: string };
	NotSucceededJobCards?: { Code: string };
	SucceededDispatchHeaders?: { Code: string };
	IsValidJobCardExisting: string;
}

interface IDispatchingResultData {
	SelectedCards: never[];
	JobCardIds: number[] | null | undefined;
	RubricFk: number | null | undefined;
}

@Injectable({
	providedIn: 'root',
})
export class LogisticCardsCreateDispatchingRecordsWizard {
	private readonly logisticCardDataService = inject(LogisticCardDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly http = inject(PlatformHttpService);

	public createDispatchingRecords(): void {
		const selected = this.logisticCardDataService.getSelectedEntity();
		if (!selected) {
			this.showNoSelectionMessage();
			return;
		}

		const cardIds = Array.isArray(selected) ? selected.map((item) => item.Id) : [selected.Id];
		this.fetchDefaultRubric().then((defaultRubric) => {
			const entityData: IDispatchingResultData = {
				JobCardIds: cardIds,
				RubricFk: defaultRubric || 0,
				SelectedCards: [],
			};

			this.showDispatchingDialog(entityData, selected);
		});
	}

	private async fetchDefaultRubric(): Promise<number> {
		try {
			return await this.http.post<number>('logistic/dispatching/header/getdefaultrubriccategory', {});
		} catch {
			this.messageBoxService.showMsgBox({
				headerText: 'Error',
				bodyText: 'Failed to fetch default rubric.',
				iconClass: 'ico-error',
			});
			return 0;
		}
	}

	private showDispatchingDialog(entityData: IDispatchingResultData, selected: ILogisticCardEntity): void {
		this.formDialogService
			.showDialog<IDispatchingResultData>({
				headerText: 'logistic.card.createDispatchNotesWizard.title',
				formConfiguration: this.getFormConfiguration,
				entity: entityData,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})
			?.then(() => this.handleOk(selected, entityData));
	}

	private handleOk(selected: ILogisticCardEntity, entityData: IDispatchingResultData): void {
		const postData = { JobCardIds: entityData.JobCardIds, RubricCategoryId: entityData.RubricFk };
		this.http.post<IResponse>('logistic/dispatching/header/createdispatchingnotesfromjobcardwizard', postData).then(
			(response) => {
				if (response?.IsValidJobCardExisting) {
					//message part
					const infoString = this.informationStringForGeneratedDispatchHeaders(
						(response.SucceededDispatchHeaders ?? []) as { Id: number; Code: string }[],
						(response.SucceededJobCards ?? []) as unknown as { Id: number; Code: string }[]
					);

					let notGeneratedInfoString = '';
					const generatedInfoString = 'logistic.card.createDispatchNotesWizard.generatedInfo';
					const generalItemInfoString = generatedInfoString + '<br/>';
					const genaralNotGeneratedInfoString ='logistic.card.createDispatchNotesWizard.genaralNotGeneratedInfo'+'<br/>';
					const notSucceededJobCards: Record<string, boolean> =
						response.NotSucceededJobCards
							? { [response.NotSucceededJobCards.Code]: true }
							: {};
					const notGeneratedInfoStringItems = this.informationStringForNotGeneratedJobCards(
						notSucceededJobCards,
						entityData.SelectedCards ?? [],
						'→ '
					);
					if (notGeneratedInfoStringItems !== '') {
						notGeneratedInfoString = genaralNotGeneratedInfoString + notGeneratedInfoStringItems;
					}

					const modalOptions = {
						headerText: 'logistic.card.createDispatchNotesWizard.title',
						bodyText: generalItemInfoString + infoString + '<br/>' + notGeneratedInfoString,
						iconClass: 'ico-info'
					};
					this.messageBoxService.showMsgBox(modalOptions);
					return;
				} else {
					this.showDispatchFailureMessage();
				}
			}
		);
	}

	private informationStringForGeneratedDispatchHeaders(
		succeededDispatchHeaders: Array<{ Code: string }>,
		succeededJobCards: Array<{ Code: string }>
	): string {
		return succeededDispatchHeaders
			.map((header, index) => `${succeededJobCards[index]?.Code || 'Unknown'} -> ${header.Code}`)
			.join('<br/>');
	}

	private informationStringForNotGeneratedJobCards(
		notSucceededCards: Record<string, boolean>,
		selectedCards: Array<{ Code: string }>,
		arrowIcon: string
	): string {
		let infoString = '';
		const arrayKeys = Object.keys(notSucceededCards);

		selectedCards.forEach((card) => {
			arrayKeys.forEach((key) => {
				if (card.Code === key) {
					infoString += `${arrowIcon}${card.Code}`;
				}
			});
		});

		return infoString;
	}

	private showNoSelectionMessage(): void {
		this.messageBoxService.showMsgBox({
			headerText: 'logistic.card.createDispatchNotesWizard.title',
			bodyText: 'cloud.common.noCurrentSelection',
			iconClass: 'ico-info',
		});
	}



	private showDispatchFailureMessage(): void {
		this.messageBoxService.showMsgBox({
			headerText: 'logistic.card.createDispatchNotesWizard.title',
			bodyText: 'No dispatch notes generated.',
			iconClass: 'ico-info',
		});
	}

	private readonly getFormConfiguration: IFormConfig<IDispatchingResultData> = {
		formId: 'logistic.card.createDispatchNote',
		showGrouping: false,
		groups: [{ groupId: 'baseGroup' }],
		rows: [
			{
				groupId: 'baseGroup',
				id: 'RubricFk',
				label: { key: 'mdc-material-catalog-rubric-category-filter' },
				type: FieldType.Lookup,
				model: 'RubricFk',
				required: true,
				sortOrder: 1,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Description',
				}),
			},
		],
	};
}
