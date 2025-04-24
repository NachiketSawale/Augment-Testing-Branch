/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom, Subject, Subscription } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { get, set, sortBy, isString } from 'lodash';

import { PlatformHttpService } from '@libs/platform/common';
import {
	ConstructionSystemSharedParameterTypeHelperService,
	ICosHeaderEntity,
	ConstructionSystemSharedParameterValidationHelperService,
	IEvalCodeValidatorResponse,
	ICosParameterValueEntity,
	ICosParameterGroupEntity,
} from '@libs/constructionsystem/shared';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ICosTestInputEntity } from '../model/models';
import { IScriptResponseEntity } from '../model/entities/script-response-entity.interface';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ConstructionSystemMasterScriptDataService } from './construction-system-master-script-data.service';
import { ConstructionSystemMasterParameterValueLookupService } from './lookup/construction-system-master-parameter-value-lookup.service';
import { DataServiceHierarchicalLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IEntityProcessor } from '@libs/platform/data-access';

interface ICosTestParamInputResponse {
	ParameterGroups: ICosParameterGroupEntity[];
	ParameterValue: { ParameterValue: ICosParameterValueEntity[] };
	Parameters: ICosTestInputEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTestParameterInputDataService extends DataServiceHierarchicalLeaf<ICosTestInputEntity, ICosHeaderEntity, CosMasterComplete> {
	private readonly http = inject(PlatformHttpService);
	private readonly paramValueLookup = inject(ConstructionSystemMasterParameterValueLookupService);
	private readonly cosScriptDataService = inject(ConstructionSystemMasterScriptDataService);
	private readonly paramTypeHelperService = inject(ConstructionSystemSharedParameterTypeHelperService);
	private readonly paramValidationHelperService = inject(ConstructionSystemSharedParameterValidationHelperService<ICosTestInputEntity>);

	private _parameterGroups: ICosParameterGroupEntity[] = [];
	private _currentEntity: ICosTestInputEntity | null = null;
	private initialTestInput: string = '';

	public readonly CosInsHeaderFkSelectionChanged = new Subject<null>();
	// public readonly getSelectedModelObjects = new Subject<null>();
	public readonly scriptValidator = new Subject<null>();

	public canExecute = true;
	private readonly _scriptValidatorSubscription?: Subscription;

	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosTestInputEntity> = {
			apiUrl: 'constructionsystem/master/testInput',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getalllist',
				usePost: false,
			},
			entityActions: { createSupported: false, deleteSupported: false },
			roleInfo: <IDataServiceChildRoleOptions<ICosTestInputEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosParameter',
				parent: parentService,
			},
		};
		super(options);

		this.processor.addProcessor([this.provideItemProcessor(), this.provideDateMomentProcessor()]);

		this.entitiesModified$.subscribe(() => {
			this.updateTestInput();
		});

		if (!this._scriptValidatorSubscription) {
			this._scriptValidatorSubscription = this.scriptValidator.subscribe(async () => {
				this.validateScript(this.getParameterList());
			});
		}
		this.scriptValidator.next(null);

		this.parentService.selectionChanged$.subscribe(() => {
			this._currentEntity = null;
		});
		this.parentService.updatedDoneMessenger.subscribe(() => {
			const parent = this.getSelectedParent();
			if (parent) {
				this.load({ id: parent.Id }).then();
			}
		});

		this.paramValidationHelperService.validationInfoChanged.subscribe((value) => {
			this.onValidationInfoChanged(value.needToHide, value.validationInfo);
		});
	}

	public getParameterGroups() {
		return this._parameterGroups;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the test parameter input data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosTestParamInputResponse): ICosTestInputEntity[] {
		this._parameterGroups = loaded.ParameterGroups;
		this.paramValueLookup.cache.setItems(loaded.ParameterValue.ParameterValue);
		const dataSource = this.formatterData(loaded);
		// service.goToFirst(); todo-allen

		this.loadDataFromScript(this.getParameterList());

		this.scriptValidator.next(null);
		// service.gridRefresh();

		this.generateCurrentEntity();
		return dataSource ?? [];
	}

	public override childrenOf(element: ICosTestInputEntity): ICosTestInputEntity[] {
		return element.ChildrenItem ?? [];
	}

	public override parentOf(element: ICosTestInputEntity): ICosTestInputEntity | null {
		if (!element.CosParameterGroupFk) {
			return null;
		}
		const parentId = element.CosParameterGroupFk;
		const foundParent = this.flatList().find((candidate) => candidate.Id === parentId);
		if (foundParent === undefined) {
			return null;
		}
		return foundParent;
	}

	public override isParentFn(parentKey: object, entity: ICosTestInputEntity): boolean {
		return true;
	}

	public override getSelectedParent(): ICosHeaderEntity | undefined {
		if (this.typedParent) {
			const parent = this.typedParent.getSelectedEntity();
			return parent ? parent : undefined;
		}
		return undefined;
	}

	private provideItemProcessor(): IEntityProcessor<ICosTestInputEntity> {
		return {
			process: async (item: ICosTestInputEntity) => {
				if (item.IsLookup) {
					item.Value = Number(item.Value);
					item.DefaultValue = item.Value;
					const paramValue = await firstValueFrom(this.paramValueLookup.getItemByKey({ id: item.Value }));
					const value = paramValue ? paramValue.ParameterValue : '';
					item.InputValue = this.paramTypeHelperService.convertValue(item.CosParameterTypeFk, value);
				} else {
					item.Value = this.paramTypeHelperService.convertValue(item.CosParameterTypeFk, item.Value);
					item.DefaultValue = item.Value;
					item.InputValue = item.Value;
				}
			},
			revertProcess() {},
		};
	}

	private provideDateMomentProcessor(): IEntityProcessor<ICosTestInputEntity> {
		const fields = this.getDateFields();
		return {
			process: (toProcess: ICosTestInputEntity) => {
				fields.forEach((field) => {
					const fieldValue = get(toProcess, field);
					if (fieldValue) {
						set(toProcess, field, new Date(fieldValue));
					}
				});
			},
			revertProcess(toProcess: ICosTestInputEntity) {
				fields.forEach((field) => {
					const fieldValue = get(toProcess, field);
					if (fieldValue && !isString(fieldValue)) {
						// always format as utc string, Newtonsoft sometimes has issues with localised strings!
						set(toProcess, field, fieldValue.utc().format());
					}
				});
			},
		};
	}

	private formatterData(readData: ICosTestParamInputResponse) {
		const dataSource: ICosTestInputEntity[] = [];
		if (readData && readData.ParameterGroups && readData.Parameters) {
			readData.ParameterGroups.forEach((group) => {
				const parameters = readData.Parameters.filter((parameter) => {
					return group.Id === parameter.CosParameterGroupFk;
				});

				if (parameters.length > 0) {
					parameters.forEach((item) => {
						if (item.nodeInfo) {
							item.nodeInfo.collapsed = false;
						} else {
							item.nodeInfo = { collapsed: false, lastElement: true, level: 1 };
						}
					});

					const parameterGroup: ICosTestInputEntity = {
						CosHeaderFk: null,
						CosInsHeaderFk: null,
						EstHeaderFk: null,
						ProjectFk: null,
						QuantityQueryInfo: null,

						Id: -group.Id,
						CosParameterGroupFk: null,
						UomFk: 0,
						PropertyName: null,
						VariableName: null,
						Value: null,
						IsLookup: true,
						CosParameterTypeFk: 0,
						DescriptionInfo: group.DescriptionInfo,
						ChildrenItem: parameters,
						nodeInfo: { collapsed: false, lastElement: false, level: 0 },
					};
					this.setEntityReadOnlyFields(parameterGroup, [{ field: 'Value', readOnly: true }]);
					dataSource.push(parameterGroup);
				}
			});
		}
		return dataSource;
	}

	public getParameterList() {
		return this.getList().filter((item) => {
			return item.ChildrenItem === null || item.ChildrenItem === undefined;
		});
	}

	private loadDataFromScript(parameters: ICosTestInputEntity[]) {
		let oldData: object = {};
		try {
			// oldData = JSON.parse(constructionsystemMasterScriptDataService.currentItem.TestInput);
		} catch (err) {
			oldData = {};
		}
		oldData = oldData || {};
		parameters.forEach((item) => {
			// if (Object.prototype.hasOwnProperty.call(oldData, 'm' + item.Id)) {
			// 	item.Value = oldData['m' + item.Id];
			// }
			const property = get(oldData, `m${item.Id}`);
			if (property) {
				item.Value = property;
			}
		});
	}

	private getDateFields() {
		const parameterList = this.getParameterList() || [];
		const dateFields: string[] = [];

		parameterList.forEach((item) => {
			if (item.IsLookup === false && item.CosParameterTypeFk === 11) {
				dateFields.push('m' + item.Id);
			}
		});

		return dateFields;
	}

	public getCurrentEntity(): ICosTestInputEntity {
		if (!this._currentEntity) {
			this.generateCurrentEntity();
		}

		const cosHeader = this.getSelectedParent();
		if (cosHeader) {
			if (cosHeader.Id !== this._currentEntity?.Id) {
				this.generateCurrentEntity();
			}
		}
		return this._currentEntity as ICosTestInputEntity;
	}

	private generateCurrentEntity() {
		const dataEntity: ICosTestInputEntity = {
			Id: this._currentEntity?.Id ?? -1,
			ProjectFk: this._currentEntity?.ProjectFk ?? null,
			EstHeaderFk: this._currentEntity?.EstHeaderFk ?? null,
			CosInsHeaderFk: this._currentEntity?.CosInsHeaderFk ?? null,
			ModelFk: this._currentEntity?.ModelFk ?? null,
			PsdScheduleFk: this._currentEntity?.PsdScheduleFk ?? null,
			BoqHeaderFk: this._currentEntity?.BoqHeaderFk ?? null,

			CosHeaderFk: 0,
			CosParameterGroupFk: 0,
			CosParameterTypeFk: 0,
			IsLookup: false,
			QuantityQueryInfo: null,
			UomFk: 0,
		};
		const cosHeader = this.parentService.getSelectedEntity();
		if (cosHeader) {
			dataEntity.Id = cosHeader.Id;
		}
		this.getParameterList().forEach((item) => {
			set(dataEntity, `m${item.Id}`, item);
		});
		this._currentEntity = dataEntity;
	}

	private updateTestInput() {
		const dataEntity = this.getCurrentEntity();
		const result = {
			ProjectFk: dataEntity.ProjectFk,
			EstHeaderFk: dataEntity.EstHeaderFk,
			CosInsHeaderFk: dataEntity.CosInsHeaderFk,
			ModelFk: dataEntity.ModelFk,
			PsdScheduleFk: dataEntity.PsdScheduleFk,
			BoqHeaderFk: dataEntity.BoqHeaderFk,
		};
		this.getParameterList().forEach((parameter) => {
			const tmp = get(dataEntity, `m${parameter.Id}`) as unknown as ICosTestInputEntity;
			set(result, `m${parameter.Id}`, tmp.Value);
		});

		if (this.initialTestInput !== JSON.stringify(result)) {
			this.cosScriptDataService.currentItem.TestInput = this.initialTestInput = JSON.stringify(result);
		}
	}

	private collectUpdateData() {
		const testInputUpdateData = this.getCurrentEntity();
		const parameters = this.getParameterList();
		const parentItem = this.getSelectedParent();

		if (!testInputUpdateData || !parentItem) {
			return;
		}

		testInputUpdateData.ParameterList = parameters;
		testInputUpdateData.CosHeaderFk = parentItem.Id;

		// const selectedModelObjects = this.getSelectedModelObjects.fire(); // todo-allen: Wait for the constructionSystemMasterModelObjectDataService
		// if (Array.isArray(selectedModelObjects)) {
		// 	testInputUpdateData.ModelObjectIds = selectedModelObjects.map(function (item) {
		// 		return {
		// 			ModelFk: item.ModelFk,
		// 			Id: item.Id,
		// 		};
		// 	});
		// }

		return testInputUpdateData;
	}

	private onValidationInfoChanged(needToHide: IEvalCodeValidatorResponse[], validationInfo: IEvalCodeValidatorResponse[]) {
		this.handleValidatorInfoForFormEntity(validationInfo);
		if (needToHide) {
			const parameters = this.getParameterList();

			needToHide.forEach((p) => {
				const param = parameters.find((item) => item.VariableName === p.Name);
				if (!param || !param.CosParameterGroupFk) {
					return;
				}
				const treeChildren = this.getList().find((item) => item.Id === -(param.CosParameterGroupFk as number));
				if (treeChildren && treeChildren.ChildrenItem) {
					if (treeChildren.ChildrenItem.find((item) => item.Id === param.Id) === undefined) {
						treeChildren.ChildrenItem.push(param);
					}
				}
			});

			this.getList().forEach((e) => {
				if (e.ChildrenItem) {
					e.ChildrenItem = sortBy(e.ChildrenItem, function (c) {
						return c.Sorting;
					});
				}
			});
			this.generateCurrentEntity();
		}
		// service.gridRefresh(); todo-allen: wait for gridRefresh
	}

	private handleValidatorInfoForFormEntity(validationInfo: IEvalCodeValidatorResponse[]) {
		const formEntity = this.getCurrentEntity();
		const parameters = this.getParameterList();

		parameters.forEach((param) => {
			const model = 'm' + param.Id + '.Value';

			const vInfo = validationInfo.filter((info) => param.VariableName === info.Name);

			if (vInfo) {
				const errorInfo = vInfo.filter((info) => {
					return Object.prototype.hasOwnProperty.call(info, 'HasError') && info.HasError === true;
				});
				if (errorInfo.length === 0) {
					this.paramValidationHelperService.applyError({ HasError: false }, formEntity, model, this); // no error at all, so clear previous error info if it exists
				} else {
					this.paramValidationHelperService.applyError(errorInfo[0], formEntity, model, this); // always apply the first one
				}

				const disableInfo = vInfo.filter((info) => Object.prototype.hasOwnProperty.call(info, 'IsDisabled'));
				disableInfo.forEach((info) => {
					this.paramValidationHelperService.applyDisable(info, formEntity, model, this);
				});
			}
		});
	}

	public async execute() {
		this.canExecute = false;
		const testInputUpdateData = this.collectUpdateData();
		if (testInputUpdateData) {
			testInputUpdateData.Script = this.cosScriptDataService.currentItem.ScriptData;

			await this.parentService.save();
			// const modelObjectService = $injector.get('constructionSystemMasterModelObjectDataService'); //todo-allen: wait for constructionSystemMasterModelObjectDataService
			// modelObjectService.setSelectedObjects(testInputUpdateData.ModelObjectIds);
			const response = await this.http.post<IScriptResponseEntity>('constructionsystem/master/testInput/execute', testInputUpdateData);
			this.cosScriptDataService.setExecutionResult(response);
			this.setCanExecute2Ture();
		}
	}

	private setCanExecute2Ture() {
		this.canExecute = true;
	}

	public validateScript(parameters: ICosTestInputEntity[]) {
		// const scriptData = {
		// 	ParameterList: parameters,
		// 	ValidateScriptData: this.cosScriptDataService.currentItem.ValidateScriptData,
		// };
		// const response = constructionsystemMasterScriptEvalService.validate(scriptData);
		// if (response && response.length > 0) {
		// 	this.paramValidationHelper.handleValidatorInfo(response, parameters, 'Value');
		// }
	}
}
