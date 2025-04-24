/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	IReadOnlyField,
	ServiceRole
} from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { IPinningContext, PlatformHttpService } from '@libs/platform/common';
import {
	ICustomDialog,
	ICustomDialogOptions,
	IDialogButtonBase,
	StandardDialogButtonId,
	UiCommonDialogService
} from '@libs/ui/common';
import { CopyInstanceHeaderComponent } from '../components/copy-instance-header/copy-instance-header.component';
import { isUndefined } from 'lodash';
import { PinningContextToken } from '@libs/basics/shared';

export const COPY_INSTANCE_HEADER_OPTION_TOKEN = new InjectionToken<IInstanceHeaderEntity>('COPY_INSTANCE_HEADER_OPTION_TOKEN');
export const CLOSE_DIALOG_TOKEN = new InjectionToken<(res: {
	ok: boolean,
	data?: IInstanceHeaderEntity
}) => void>('CLOSE_DIALOG_TOKEN');
export const CHANGE_BUTTON_VISIBLE = new InjectionToken<(step: string) => void>('CHANGE_BUTTON_VISIBLE');

@Injectable({ providedIn: 'root' })
export class constructionSystemProjectInstanceHeaderService extends DataServiceFlatLeaf<IInstanceHeaderEntity, IProjectEntity, IProjectComplete> {
	public readonly projectMainDataService: ProjectMainDataService;
	private readonly http = inject(PlatformHttpService);
	private readonly modalDialogService = inject(UiCommonDialogService);

	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IInstanceHeaderEntity> = {
			apiUrl: 'constructionsystem/project/instanceheader',
			roleInfo: <IDataServiceRoleOptions<IInstanceHeaderEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CosInstanceHeader',
				parent: projectMainDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { projectId: ident.pKey1 };
				}
			}
		};

		super(options);
		this.projectMainDataService = projectMainDataService;
	}

	protected override provideCreatePayload(): object {
		const selectedProject = this.getSelectedParent();
		if (selectedProject) {
			return {
				projectId: selectedProject.Id
			};
		}

		return {};
	}

	public override isParentFn(project: IProjectEntity, instanceHeaderEntity: IInstanceHeaderEntity): boolean {
		return instanceHeaderEntity.ProjectFk === project.Id;
	}

	public isVisibleStep1Btn: boolean = true;
	private step1Buttons: IDialogButtonBase<ICustomDialog<IInstanceHeaderEntity, CopyInstanceHeaderComponent, void>, void>[] = [
		{
			id: StandardDialogButtonId.Ok,
			caption: { key: 'constructionsystem.project.labelNext' },
			isDisabled: (info) => {
				//todo canNext()
				return false;
			},
			isVisible: (info) => {
				return this.isVisibleStep1Btn;
			},
			fn: async (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				await componet.goToNext();
			}
		},
		{
			id: StandardDialogButtonId.Cancel,
			isVisible: (info) => {
				return this.isVisibleStep1Btn;
			},
			fn: (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				componet.close();
			}
		}
	];
	public isVisibleStep2Btn: boolean = false;
	private step2Buttons: IDialogButtonBase<ICustomDialog<IInstanceHeaderEntity, CopyInstanceHeaderComponent, void>, void>[] = [
		{
			id: StandardDialogButtonId.Ok,
			isVisible: (info) => {
				return this.isVisibleStep2Btn;
			},
			fn: (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				componet.update();
			}
		},
		{
			id: StandardDialogButtonId.Cancel,
			isVisible: (info) => {
				return this.isVisibleStep2Btn;
			},
			fn: async (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				await componet.deleteCreatedInstanceHeader();
			}
		}
	];
	public isVisibleStep3Btn: boolean = false;
	private step3Buttons: IDialogButtonBase<ICustomDialog<IInstanceHeaderEntity, CopyInstanceHeaderComponent, void>, void>[] = [
		{
			id: StandardDialogButtonId.Ok,
			caption: { key: 'platform.wizard.finish' },
			isVisible: (info) => {
				return this.isVisibleStep3Btn;
			},
			fn: (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				componet.finish();
			}
		},
		{
			id: StandardDialogButtonId.Cancel,
			caption: { key: 'platform.cancelBtn' },
			isVisible: (info) => {
				return this.isVisibleStep3Btn;
			},
			fn: async (event, info) => {
				const componet = info.dialog.body as CopyInstanceHeaderComponent;
				await componet.deleteCreatedInstanceHeader();
			}
		}
	];

	public createDeepCopy() {
		this.modalDialogService.show(this.createFormConfiguration());
		// 	?.then((result: IEditorDialogResult<IInstanceHeaderEntity>) => {
		// 	if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
		// 		this.append(result.value);
		// 		this.select(result.value); //select new create item
		// 		const readonlyFields: IReadOnlyField<IInstanceHeaderEntity>[] = [
		// 			{ field: 'ModelFk', readOnly: result.value.ModelFk !== null && result.value.ModelFk !== undefined },
		// 			{ field: 'EstimateHeaderFk', readOnly: true },
		// 			{ field: 'ModelOldFk', readOnly: !result.value.IsIncremental },
		// 			{ field: 'Hint', readOnly: true },
		// 		];
		// 		this.setEntityReadOnlyFields(result.value, readonlyFields);
		// 	}
		// });
	}

	public deepDelete() {
		const selectedItem = this.getSelectedEntity();
		if (selectedItem) {
			if (selectedItem.Version === 0) {
				this.delete(selectedItem);
			} else {
				this.http
					.get<string>('constructionsystem/project/instanceheader/deleteinstanceheader', {
						params: {
							InstanceHeaderId: selectedItem.Id
						}
					})
					.then(() => {
						this.selectNext();
						this.delete(selectedItem);
					});
			}
		}
	}

	private createFormConfiguration(): ICustomDialogOptions<IInstanceHeaderEntity, CopyInstanceHeaderComponent> {
		const selectedItem = this.getSelectedEntity();
		return <ICustomDialogOptions<IInstanceHeaderEntity, CopyInstanceHeaderComponent>>{
			headerText: { text: 'Copy record including dependencies', key: 'cloud.common.deepCopy' },
			id: 'deepCopy',
			buttons: [...this.step1Buttons, ...this.step2Buttons, ...this.step3Buttons],
			value: selectedItem,
			bodyComponent: CopyInstanceHeaderComponent,
			bodyProviders: [
				{ provide: COPY_INSTANCE_HEADER_OPTION_TOKEN, useValue: selectedItem },
				{ provide: CLOSE_DIALOG_TOKEN, useValue: this.closeCopyInstanceDialog },
				{ provide: CHANGE_BUTTON_VISIBLE, useValue: this.changeBtnVisible }
			]
		};
	}

	private changeBtnVisible(step: string) {
		switch (step) {
			case '0':
				this.isVisibleStep1Btn = true;
				this.isVisibleStep2Btn = false;
				this.isVisibleStep3Btn = false;
				break;
			case '1':
				this.isVisibleStep1Btn = false;
				this.isVisibleStep2Btn = true;
				this.isVisibleStep3Btn = false;
				break;
			case '2':
				this.isVisibleStep1Btn = false;
				this.isVisibleStep2Btn = false;
				this.isVisibleStep3Btn = true;
				break;
		}
	}

	private closeCopyInstanceDialog(res: { ok: boolean, data?: IInstanceHeaderEntity }) {
		if (res.ok && !isUndefined(res.data)) {
			this.append(res.data);
			this.select(res.data); //select new create item
			const readonlyFields: IReadOnlyField<IInstanceHeaderEntity>[] = [
				{ field: 'ModelFk', readOnly: res.data.ModelFk !== null && res.data.ModelFk !== undefined },
				{ field: 'EstimateHeaderFk', readOnly: true },
				{ field: 'ModelOldFk', readOnly: !res.data.IsIncremental },
				{ field: 'Hint', readOnly: true }
			];
			this.setEntityReadOnlyFields(res.data, readonlyFields);
		}
	}

	// todo: CosInstanceHeaderToSave IIIdentifyable[] in IProjectComplete
	// public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IInstanceHeaderEntity[] {
	// 	if (complete && complete.CosInstanceHeaderToSave) {
	// 		return complete.CosInstanceHeaderToSave;
	// 	}
	//
	// 	return [];
	// }

	public override preparePinningContext(dataService: this): IPinningContext[] {
		const pinningContext: IPinningContext[] = [];
		const entity = dataService.getSelectedEntity();
		const projectEntity = dataService.getSelectedParent();

		if (!entity || !projectEntity) {
			throw new Error('No selected entity or project entity');
		}

		pinningContext.push({Id: entity.Id, Token: PinningContextToken.Cos, Info: entity.Code});
		pinningContext.push({Id: entity.ProjectFk, Token: PinningContextToken.Project, Info: projectEntity.ProjectNo});

		// todo - show meaningful info when related lookup service is ready
		pinningContext.push({Id: entity.EstimateHeaderFk, Token: PinningContextToken.Estimate, Info: ''});

		if (entity.ModelFk) {
			pinningContext.push({Id: entity.ModelFk, Token: PinningContextToken.Model, Info: ''});
		}
		if (entity.BoqHeaderFk) {
			pinningContext.push({Id: entity.BoqHeaderFk, Token: PinningContextToken.Boq, Info: ''});
		}

		return pinningContext;
	}
}
