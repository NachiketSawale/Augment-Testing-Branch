import { inject, Injectable } from '@angular/core';
import {
	EvaluationSchemaComplete,
	EvaluationSchemaEntity,
	IEvaluationSchemaEntity
} from '@libs/businesspartner/interfaces';
import { DataServiceFlatRoot, IDataServiceOptions, IEntityList, ServiceRole } from '@libs/platform/data-access';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerEvaluationschemaHeaderService extends DataServiceFlatRoot<IEvaluationSchemaEntity, EvaluationSchemaComplete> {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly gridId = '6003E88EB8734DA693F6FBB8DBEE621E';
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	public formFieldIds: number[] = [];
	public oldFormFieldId: number | null = null;
	public constructor() {
		const options: IDataServiceOptions<IEvaluationSchemaEntity> = {
			apiUrl: 'businesspartner/evaluationschema',
			readInfo: {
				endPoint: 'getlist',
				usePost: true
			},
			updateInfo: {
				endPoint: 'updatenew',
				usePost: true
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			deleteInfo: {
				endPoint: 'deleteschemas',
				usePost: true
			},
			entityActions: {
				createSupported: true,
				deleteSupported: true
			},
			roleInfo: {
				itemName: 'EvaluationSchema',
				role: ServiceRole.Root
			}
		};

		super(options);
		this.selectionChanged$.subscribe((e) => {
			this.onSelectionChanged();
		});
	}

	public override createUpdateEntity(modified: IEvaluationSchemaEntity | null): EvaluationSchemaComplete {
		const complete = new EvaluationSchemaComplete();
		if (null !== modified) {
			complete.MainItemId = modified.Id;
			complete.EvaluationSchemas = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: EvaluationSchemaComplete): IEvaluationSchemaEntity[] {
		if (!complete.EvaluationSchema) {
			complete.EvaluationSchema = new EvaluationSchemaEntity();
		}
		const groupsToSave = complete.GroupToSave;
		if (this.oldFormFieldId) {
			this.formFieldIds = this.formFieldIds.filter(item => item !== this.oldFormFieldId);
		}
		if (groupsToSave) {
			groupsToSave.forEach(group => {
				const subGroupsToSave = group.SubgroupToSave;
				if (subGroupsToSave) {
					subGroupsToSave.forEach(subgroupToSave => {
						const subgroup = subgroupToSave.Subgroup;
						if (subgroup?.FormFieldFk && this.formFieldIds.indexOf(subgroup.FormFieldFk) < 0) {
							this.formFieldIds.push(subgroup.FormFieldFk);
						}
						const subgroupItemsToSave = subgroupToSave.ItemToSave;
						if (subgroupItemsToSave) {
							subgroupItemsToSave.forEach(subgroupItem => {
								if (subgroupItem?.FormFieldFk && this.formFieldIds.indexOf(subgroupItem.FormFieldFk) < 0) {
									this.formFieldIds.push(subgroupItem.FormFieldFk);
								}
							});
						}
					});
				}
			});
		}

		return [complete.EvaluationSchema];
	}

	protected override checkCreateIsAllowed(entities: IEvaluationSchemaEntity[] | IEvaluationSchemaEntity | null): boolean {
		if (entities === null) {
			return false;
		}

		return typeof entities !== typeof EvaluationSchemaEntity;
	}

	protected takeOverUpdatedFromComplete(complete: EvaluationSchemaComplete, entityList: IEntityList<IEvaluationSchemaEntity>) {
		if (complete && complete.EvaluationSchema) {
			entityList.updateEntities([complete.EvaluationSchema]);
		}
	}

	public override delete(entities: IEvaluationSchemaEntity[] | IEvaluationSchemaEntity, skipDialog: boolean = false): void {
		if (!skipDialog) {
			this.messageBoxService.deleteSelectionDialog({ dontShowAgain: true, id: this.gridId })?.then(result => {
				if (result.closingButtonId === 'yes' || result.closingButtonId === 'ok') {
					super.delete(entities);
				}
			});
		}
	}

	private onSelectionChanged(): void {
		this.formFieldIds.length = 0;
		this.oldFormFieldId = null;
		const schemaEntity = this.getSelectedEntity();
		if (schemaEntity?.FormFk) {
			this.http.get(this.configService.webApiBaseUrl + 'businesspartner/evaluationschema/getformfields', {
				params: {
					mainItemId: schemaEntity.Id
				}
			}).subscribe(e => {
				const respone = e as number[];
				if (respone?.length > 0) {
					this.formFieldIds = respone;
				}
			});
		}
	}
}