import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MODULE_INFO_PROCUREMENT, ProcurementCommonItemExcelImportService, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { BasicsSharedImportEditorType, BasicsSharedImportExcelService, BasicsSharedQuoteStatusLookupService } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteRequisitionDataService } from '../quote-requisitions-data.service';
import { IQuoteRequisitionEntity } from '../../model/entities/quote-requisition-entity.interface';
import { createLookup, FieldType, IGridConfiguration } from '@libs/ui/common';
import { ProcurementShareReqLookupService } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteExcelImportWizardService extends ProcurementCommonWizardBaseService<IQuoteHeaderEntity, QuoteHeaderEntityComplete, IQuoteRequisitionEntity> {
	protected readonly basicsShareImportExcelService = inject(BasicsSharedImportExcelService);
	protected readonly itemImportService = inject(ProcurementCommonItemExcelImportService);
	protected readonly quoteStatusLookup = inject(BasicsSharedQuoteStatusLookupService);
	protected readonly quoteRequisitionService = inject(ProcurementQuoteRequisitionDataService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementQuoteHeaderDataService)
		});
	}

	protected override async showWizardDialog() {
		const reqEntity = this.quoteRequisitionService.getSelectedEntity();
		if (!reqEntity) {
			return this.messageBoxService.showMsgBox('procurement.quote.selectedQuote', 'cloud.common.errorMessage', 'ico-error');
		}
		const entity = this.config.rootDataService.getSelectedEntity();
		if (entity?.StatusFk) {
			const statusItem = await firstValueFrom(this.quoteStatusLookup.getItemByKey({id: entity.StatusFk}));
			if (statusItem?.IsReadonly) {
				return this.messageBoxService.showMsgBox('procurement.quote.quoteStatusIsReadonly', 'cloud.common.errorMessage', 'ico-error');
			}
		}

		const showReq = (this.quoteRequisitionService?.getList().length > 1) as boolean;
		const option = this.getQuoteImportOption(showReq);
		option.nextStepPreprocessFn = () => {
			const quoteEntity = this.config.rootDataService.getSelectedEntity();
			if (!quoteEntity) {
				this.messageBoxService.showMsgBox('procurement.quote.importQuote.mustSelectQuote', 'cloud.common.errorMessage', 'ico-error');
				return Promise.resolve(false);
			}
			const reqList = this.quoteRequisitionService.getList();
			if (reqList.length === 1) {
				reqList.forEach(item => item.IsSelected = true);
			} else {
				this.quoteRequisitionService.importToAll(this.quoteRequisitionService.editorMode);
			}
			option.ImportDescriptor.CustomSettings = {
				GridData: this.quoteRequisitionService.getList(),
				Quote: quoteEntity.Code
			};
			return Promise.resolve(true);
		};
		return await this.basicsShareImportExcelService.showImportDialog(option);
	}

	private getQuoteImportOption(showReq: boolean) {
		const option = this.itemImportService.getImportOption(MODULE_INFO_PROCUREMENT.ProcurementQuoteModuleName);
		if (showReq) {
			option.customSettingsPage?.config?.groups?.unshift({
				groupId: '1',
				header: '',
				open: true,
				visible: true,
				sortOrder: 1
			});
			option.customSettingsPage?.config?.rows.unshift({
				id: '1',
				groupId: '1',
				label: '',
				type: FieldType.Grid,
				model: 'GridData',
				configuration: this.reqConfiguration as IGridConfiguration<object>,
				visible: true,
				sortOrder: 1
			});
		}
		option.ImportDescriptor.CustomSettings = {
			GridData: {},
			Quote: null
		};
		option.ImportDescriptor.Fields.unshift({
			PropertyName: 'REQ_CODE',
			EntityName: 'QuoteRequisition',
			DomainName: 'description',
			Editor: BasicsSharedImportEditorType.domain,
			readonly: true,
			DisplayName: 'procurement.quote.importQuote.reqCode'
		});
		option.ImportDescriptor.Fields.push({
			PropertyName: 'PRC_ITEMEVALUATION_FK',
			EntityName: 'PrcItemEvaluation',
			DomainName: 'integer',
			Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
			NotUseDefaultValue: true,
			DisplayMember: 'description',
			DisplayName: 'procurement.common.prcItemEvaluation',
			LookupQualifier: 'prc.item.evaluation'
		});
		const fieldsToBeRemoved = ['IsFreeQuantity', 'COMMENT_CONTRACTOR'];
		option.ImportDescriptor.Fields = option.ImportDescriptor.Fields.filter(f => !fieldsToBeRemoved.includes(f.PropertyName));
		return option;
	}

	// TODO may need to customize the page or communicate with your requirements to change the new frame page that is different from the old one
	// In the old logic, there were single options and full options
	private reqConfiguration() {
		return {
			uuid: 'c583b10f1ca248a8852ad94272ca1ebe',
			items: [],
			columns: [
				{
					id: 'isselected',
					model: 'IsSelected',
					type: FieldType.Boolean,
					label: {text: 'Is Selected', key: 'procurement.quote.isSelected'},
					sortable: true,
				},
				{
					id: 'reqheaderfk',
					model: 'ReqHeaderFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementShareReqLookupService,
						showDescription: false
					}),
					additionalFields: [{
						displayMember: 'StatusInfo.Translated',
						label: {
							key: 'cloud.common.entityState',
						},
						column: true,
						singleRow: true,
					}, {
						displayMember: 'Code',
						label: {
							key: 'cloud.common.entityCode',
						},
						column: true,
						singleRow: true,
					}, {
						displayMember: 'Description',
						label: {
							key: 'cloud.common.entityDescription',
						},
						column: true,
						singleRow: true,
					}, {
						displayMember: 'ProjectNo',
						label: {
							key: 'cloud.common.entityProjectNo',
							text: 'Project No.'
						},
						column: true,
						singleRow: true,
					}, {
						displayMember: 'ProjectName',
						label: {
							key: 'cloud.common.entityProjectName',
							text: 'Project No.'
						},
						column: true,
						singleRow: true,
					}],
					sortable: true
				}
			]
		};
	}
}