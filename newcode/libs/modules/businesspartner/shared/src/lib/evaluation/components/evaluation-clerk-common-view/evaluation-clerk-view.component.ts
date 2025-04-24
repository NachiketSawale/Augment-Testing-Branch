import { Component, ElementRef, inject, Input, runInInjectionContext, ViewChild } from '@angular/core';
import { EvaluationDataViewBaseService } from '../../services/evaluation-data-view-base.service';
import { IBasicsClerkEntity } from '@libs/basics/shared';
import { EvaluationClerkLayoutService } from '../../services/layouts/evaluation-clerk-layout.service';
import { IMenuItemsList } from '@libs/ui/common';
import { EvaluationDetailService } from '../../services/evaluation-detail.service';
import { EvaluationPermissionService } from '../../services/evaluation-permission.service';
import { EvaluationClerkDataService } from '../../services/evaluation-clerk-data.service';
import {PlatformPermissionService, ServiceLocator} from '@libs/platform/common';
import { EvaluationGroupDataService } from '../../services/evaluation-group-data.service';
import {
	EvaluationClerkType,
	EvaluationPermissionEnum,
	EvaluationToolbarList,
	IEvaluationClerkDataCreateParam,
	TEvaluationClerkInfo
} from '@libs/businesspartner/interfaces';
import {EvaluationDynamicGridOptionService} from '../../services/evaluation-dynamic-grid-option.service';

@Component({
	selector: 'businesspartner-shared-evaluation-clerk-view',
	templateUrl: './evaluation-clerk-view.component.html',
	styleUrl: './evaluation-clerk-view.component.scss',
})
export class BusinesspartnerSharedEvaluationClerkViewComponent extends EvaluationDataViewBaseService<IBasicsClerkEntity> {
	@Input()
	public toolbarList!: EvaluationToolbarList;

	@ViewChild('clerkCommonDiv')
	public clerkCommonDiv!: ElementRef;

	private readonly layoutService: EvaluationClerkLayoutService;
	private readonly evaluationDetailService: EvaluationDetailService;
	private readonly evaluationGroupService: EvaluationGroupDataService;
	private readonly evaluationPermissionService: EvaluationPermissionService;

	private readonly evalClerkService: EvaluationClerkDataService<IBasicsClerkEntity>;
	private readonly evalGroupClerkService: EvaluationClerkDataService<IBasicsClerkEntity>;

	private readonly permissionService: PlatformPermissionService;
	private readonly dynamicGridOptionService: EvaluationDynamicGridOptionService;

	public evalClerkHasRead: boolean = false;
	private evalGrpDataClerkHasRead: boolean = false;
	private evalSubGrpDataClerkHasRead: boolean = false;
	private clerkInfo!: TEvaluationClerkInfo;

	public containerTitle = 'Clerk - Evaluation';

	public constructor() {
		super();

		this.layoutService = inject(EvaluationClerkLayoutService);
		this.evaluationDetailService = inject(EvaluationDetailService);
		this.evaluationGroupService = inject(EvaluationGroupDataService);
		this.evaluationPermissionService = inject(EvaluationPermissionService);
		this.permissionService = inject(PlatformPermissionService);
		this.dynamicGridOptionService = inject(EvaluationDynamicGridOptionService);

		this.evalClerkService = this.getClerkDataService(this.getEvalClerkDataParam());
		this.evalGroupClerkService = this.getClerkDataService(this.getEvalGroupClerkDataParam());
	}

	public ngOnInit(): void {
		this.gridConfig = {
			idProperty: 'Id',
			uuid: '2902e129fa9c4c2d9e3f8cd1bfa6b7d8',
			columns: [...this.layoutService.columns],
			items: [],
		};

		this.permissionService.loadPermissions(this.evaluationPermissionService.getPermissions()).then(() => {
			this.evalClerkHasRead = this.permissionService.hasRead(this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVALCLERK));
			this.evalGrpDataClerkHasRead = this.permissionService.hasRead(this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVALGROUPCLERK));
			this.evalSubGrpDataClerkHasRead = this.permissionService.hasRead(this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVALSUBGROUPCLERK));
			//
			this.clerkInfo = this.dynamicGridOptionService.getClerkInfo(EvaluationClerkType.EVAL, this.evalClerkHasRead);
		});
	}

	public override initEvent() {
		this.commonService.onClerkCommonIsEvaluationEvent.subscribe((info) => {
			// isEvalGrpOrSubGrpClerkOn = !isEvalGrpOrSubGrpClerkOn;
			// updateClerkGrid(isEvalGrpOrSubGrpClerkOn, null, true);
		});

		this.commonService.onClerkViewGridRefreshEvent.subscribe(data => {
			this.refreshGridItems(data);
		});
	}

	public get tools(): IMenuItemsList {
		return this.toolbarList.clerkCommonViewTools as unknown as IMenuItemsList;

		// return {
		// 	cssClass: 'tools',
		// 	items: [
		// 		{
		// 			id: 'isEvaluation',
		// 			iconClass: 'control-icons ico-active',
		// 			type: ItemType.Check,
		// 			caption: {
		// 				text: 'businesspartner.main.screenEvaluationClerkDataOnOffButtonText',
		// 			},
		// 			value: false,
		// 			fn: (info) => {
		//
		// 			},
		// 			disabled: false,
		// 			hideItem: false,
		// 		}
		// 	]
		// } as IMenuItemsList;
	}

	public getEvalClerkDataParam(): IEvaluationClerkDataCreateParam {
		return {
			serviceDescriptor: this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVAL),
			parentService: this.evaluationDetailService,
			evalClerkType: EvaluationClerkType.EVAL,
			qualifier: this.commonService.adaptorService.evalClerkQualifier,
			options: {
				moduleName: this.commonService.adaptorService.getModuleName(),
				itemName: 'Evaluation2Clerk',
				canLoad: (isEvalGrpOrSubGrpClerkOn: boolean) => {
					return !isEvalGrpOrSubGrpClerkOn;
				},
			},
		} as IEvaluationClerkDataCreateParam;
	}

	public getEvalGroupClerkDataParam(): IEvaluationClerkDataCreateParam {
		const serviceDescriptor = this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVAL);
		this.evaluationGroupService.serviceDescriptor = serviceDescriptor;
		return {
			serviceDescriptor: serviceDescriptor,
			parentService: this.evaluationGroupService,
			evalClerkType: EvaluationClerkType.GROUP,
			qualifier: this.commonService.adaptorService.evalGroupClerkQualifier,
			options: {
				moduleName: this.commonService.adaptorService.getModuleName(),
				itemName: 'EvalGroupData2Clerk',
				canLoad: (isEvalGrpOrSubGrpClerkOn: boolean) => {
					return isEvalGrpOrSubGrpClerkOn;
				},
			},
		} as IEvaluationClerkDataCreateParam;
	}

	public getClerkDataService(param: IEvaluationClerkDataCreateParam): EvaluationClerkDataService<IBasicsClerkEntity> {
		return runInInjectionContext(ServiceLocator.injector, () => new EvaluationClerkDataService(param));
	}

	private refreshGridItems(result: IBasicsClerkEntity[] | null) {
		if (result && result.length > 0) {
			this.gridConfig = {
				...this.gridConfig,
				items: [...result]
			};
		} else {
			this.gridConfig.items = [];
		}
	}

	public updateClerkGrid(isEvalGrpOrSubGrpClerkOn: boolean, clerkType: EvaluationClerkType | null, isExchange: boolean | null) {
		isExchange = isExchange || false;
		if (!isExchange) {
			this.updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, false);
		} else {
			clerkType = isEvalGrpOrSubGrpClerkOn ? EvaluationClerkType.GROUP : EvaluationClerkType.EVAL;
			this.clerkInfo = this.dynamicGridOptionService.getClerkInfo(clerkType);
		// 	var currentService = tryGetService(clerkInfo.serviceName);
		// 	if (currentService) {
		// 		var currentParentService = currentService.parentService();
		// 		if (currentParentService) {
		// 			var parentItem = currentParentService.getSelected();
		// 			if (parentItem) {
		// 				if (parentItem.IsEvaluationSubGroupData && isEvalGrpOrSubGrpClerkOn) {
		// 					clerkType = businessPartnerMainEvaluationClerkType.SUBGROUP;
		// 					clerkInfo = null;
		// 				}
		// 				var permissionObjectInfo = parentItem.EvalPermissionObjectInfo;
		// 				businessPartnerMainEvaluationPermissionService.setPermissionObjectInfo(permissionObjectInfo)
		// 					.then(function () {
		// 						updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, false);
		// 					});
		// 			} else {
		// 				updateGrid(isEvalGrpOrSubGrpClerkOn, clerkType, true);
		// 			}
		// 		}
		// 	}
		}
	}

	private updateGrid(isEvalGrpOrSubGrpClerkOn: boolean, clerkType: EvaluationClerkType | null, useOriginalRight: boolean) {
		const clerkInfo = this.dynamicGridOptionService.getClerkInfo(clerkType);
		if (!useOriginalRight) {
			if (clerkType === EvaluationClerkType.GROUP) {
				clerkInfo.hasRead = this.permissionService.hasRead(this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVALGROUPCLERK));
			} else if (clerkType === EvaluationClerkType.SUBGROUP) {
				clerkInfo.hasRead = this.permissionService.hasRead(this.evaluationPermissionService.getPermission(EvaluationPermissionEnum.EVALSUBGROUPCLERK));
			}
		} else {
			if (clerkType === EvaluationClerkType.GROUP) {
				clerkInfo.hasRead = this.evalGrpDataClerkHasRead;
			} else if (clerkType === EvaluationClerkType.SUBGROUP) {
				clerkInfo.hasRead = this.evalSubGrpDataClerkHasRead;
			}
		}

		// $rootScope.$emit('dynamic-grid-permission:changed', {
		// 	clerk: angular.extend(clerkInfo, {
		// 		isEvalGrpOrSubGrpClerkOn: isEvalGrpOrSubGrpClerkOn
		// 	})
		// });
	}
}
