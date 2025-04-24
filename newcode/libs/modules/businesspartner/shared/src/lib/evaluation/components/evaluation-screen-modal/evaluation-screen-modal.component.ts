import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FieldType, IFormConfig } from '@libs/ui/common';
import { BusinesspartnerSharedEvaluationItemDataViewComponent } from '../evaluation-item-data-view/evaluation-item-data-view.component';
import { BusinesspartnerSharedEvaluationDocumentDataViewComponent } from '../evaluation-document-data-view/evaluation-document-data-view.component';
import { EvaluationDetailService } from '../../services/evaluation-detail.service';
import { BusinesspartnerSharedEvaluationGroupDataViewComponent } from '../evaluation-group-data-view/evaluation-group-data-view.component';
import { MODULE_INFO } from '../../model/entity-info/module-info.model';
import { EvaluationScreenModalLayoutService } from '../../services/layouts/evaluation-screen-modal-layout.service';
import {EvaluationCommonService} from '../../services/evaluation-common.service';
import { EvaluationExtendCreateOptionsToken, EvaluationExtendUpdateOptionsToken, EvaluationToolbarList, EvaluationToolbarListToken, IEvaluationEntity, IEvaluationGetListResponseEntity, IExtendCreateOptions, IExtendUpdateOptions } from '@libs/businesspartner/interfaces';


@Component({
	selector: 'businesspartner-shared-evaluation-screen-modal',
	templateUrl: './evaluation-screen-modal.component.html',
	styleUrl: './evaluation-screen-modal.component.scss',
})
export class BusinesspartnerSharedEvaluationScreenModalComponent implements OnInit, OnDestroy {
	private readonly evaluationScreenModalLayoutService = inject(EvaluationScreenModalLayoutService);
	private readonly extendCreateOptionsToken: IExtendCreateOptions = inject<IExtendCreateOptions>(EvaluationExtendCreateOptionsToken);
	private readonly extendUpdateOptionsToken: IExtendUpdateOptions = inject<IExtendUpdateOptions>(EvaluationExtendUpdateOptionsToken);
	private readonly commonService: EvaluationCommonService = inject(EvaluationCommonService);

	public toolbarList = inject<EvaluationToolbarList>(EvaluationToolbarListToken);
	public evaluationEntity?: IEvaluationEntity;
	public evaluationDetailService: EvaluationDetailService;

	public areaSizes = [40, 60];

	public constructor() {
		this.commonService.initEventEmit();

		this.evaluationDetailService = inject(EvaluationDetailService);
	}

	public configuration: IFormConfig<IEvaluationEntity> = {
		formId: MODULE_INFO.businesspartnerMainModuleName + '.screenEvaluatoinDailog',
		showGrouping: true,
		groups: this.evaluationScreenModalLayoutService.getFormGroup(),
		rows: [
			...this.evaluationScreenModalLayoutService.getFormRows(),

			//Evaluation Schema Group
			{
				groupId: 'evaluationSchema',
				id: 'evaluationSchemaData',
				type: FieldType.CustomComponent,
				componentType: BusinesspartnerSharedEvaluationGroupDataViewComponent,
				providers:[
					{
						provide: EvaluationToolbarListToken,
						useValue: this.toolbarList
					}
				]
			},

			//Evaluation Items Group
			{
				groupId: 'evaluationItems',
				id: 'evaluationItemData',
				type: FieldType.CustomComponent,
				componentType: BusinesspartnerSharedEvaluationItemDataViewComponent,
				providers:[
					{
						provide: EvaluationToolbarListToken,
						useValue: this.toolbarList
					}
				]
			},

			//Evaluation Document Group
			{
				groupId: 'evaluationDocument',
				id: 'evaluationDocumentData',
				type: FieldType.CustomComponent,
				componentType: BusinesspartnerSharedEvaluationDocumentDataViewComponent,
			},
		],
	} as IFormConfig<IEvaluationEntity>;

	public ngOnInit() {
		if (this.extendCreateOptionsToken) {
			this.evaluationDetailService.createItem(this.extendCreateOptionsToken).then((result) => {
				this.assignData(result);
			});
		} else if (this.extendUpdateOptionsToken) {
			this.evaluationDetailService.loadItem(this.extendUpdateOptionsToken).then((result) => {
				const value = result as IEvaluationGetListResponseEntity;
				this.evaluationDetailService.select(value);
				this.evaluationDetailService.setList([value]);
				this.assignData(value);
			});
		}
	}

	public assignData(data: IEvaluationGetListResponseEntity) {
		this.evaluationEntity = undefined;
		if (!data) {
			return;
		}
		let dto: IEvaluationEntity | null = null;
		if (Array.isArray(data.dtos)) {
			dto = data.dtos[0];
		}else{
			dto = data.dtos as unknown as IEvaluationEntity;
		}

		if (dto) {
			this.evaluationEntity = dto;
		}
		this.evaluationDetailService.currentSelectItem = dto;
	}

	public ngOnDestroy(): void {
		this.commonService.closeEventEmit();
	}
}
