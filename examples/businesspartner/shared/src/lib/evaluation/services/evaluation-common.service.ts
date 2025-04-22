import {EventEmitter, inject, Injectable} from '@angular/core';
import {forEach, isArray, set, get} from 'lodash';
import {PlatformTranslateService, RgbColor, TranslationParamsSource} from '@libs/platform/common';
import {MODULE_INFO} from '../model/entity-info/module-info.model';
import {IMenuItemEventInfo} from '@libs/ui/common';
import {EvaluationBaseService} from '../services/evaluation-base.service';
import {Subscription} from 'rxjs';
import { IEvaluationDocumentEntity, IEvaluationEntity, IEvaluationGetChartDataDateSetResponseEntity, IEvaluationGroupDataEntity, IEvaluationItemDataGetListResponseEntity, IEventEmitterParam, ISummary, ScreenEvaluationCompleteEntity, TEvaluationSchemaChangedParam } from '@libs/businesspartner/interfaces';
import {IBasicsClerkEntity} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class EvaluationCommonService {
	private readonly translateService = inject(PlatformTranslateService);

	public adaptorService!: EvaluationBaseService<object, object>;

	public eventMap: Map<string, Subscription> = new Map<string, Subscription>();

	/*
		event for evaluation data
	 */
	public onEvaluationDataMergeDataEvent: EventEmitter<object> = new EventEmitter<object>();
	public onEvaluationDataGridRefreshEvent: EventEmitter<IEvaluationEntity[]> = new EventEmitter<IEvaluationEntity[]>();
	public onDataChangeMessenger: EventEmitter<null> = new EventEmitter<null>();
	public onCollectLocalEvaluationDataScreen: EventEmitter<Partial<ScreenEvaluationCompleteEntity>> = new EventEmitter<Partial<ScreenEvaluationCompleteEntity>>();

	/*
		event for evaluation detail
	 */
	public onEvaluationSchemaChanged: EventEmitter<TEvaluationSchemaChangedParam | null> = new EventEmitter<TEvaluationSchemaChangedParam | null>();

	/*
		tools event for group data view
	 */
	public onGroupViewLevel1Event: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewCollapseEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewExpandEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewCollapseNodeEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewExpandNodeEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewUpdateCalculation: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onGroupViewSelectionChanged: EventEmitter<IEvaluationGroupDataEntity | null> = new EventEmitter<IEvaluationGroupDataEntity | null>();

	public onGroupViewGridRefreshEvent: EventEmitter<IEvaluationGroupDataEntity[] | null> = new EventEmitter<IEvaluationGroupDataEntity[] | null>();
	public evaluationGroupValidationdMessenger: EventEmitter<IEventEmitterParam<boolean>> = new EventEmitter<IEventEmitterParam<boolean>>();

	/*
		event for item data view
	 */
	public onItemViewGridRefreshEvent: EventEmitter<IEvaluationItemDataGetListResponseEntity> = new EventEmitter<IEvaluationItemDataGetListResponseEntity>();

	/*
		tools event for document data view
	 */
	public onDocumentViewCreateDocEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onDocumentViewUpdateAndCreateDocEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onDocumentViewGridRefreshEvent: EventEmitter<IEvaluationDocumentEntity[] | null> = new EventEmitter<IEvaluationDocumentEntity[] | null>();

	/*
		tools event for clerk view
	 */
	public onClerkCommonIsEvaluationEvent: EventEmitter<IMenuItemEventInfo<void>> = new EventEmitter<IMenuItemEventInfo<void>>();
	public onEvalClerkValidationMessenger: EventEmitter<IEventEmitterParam<boolean>> = new EventEmitter<IEventEmitterParam<boolean>>();
	public onClerkViewGridRefreshEvent: EventEmitter<IBasicsClerkEntity[]> = new EventEmitter<IBasicsClerkEntity[]>();

	public constructor() {
		this.translateService.load([MODULE_INFO.evaluationSchemaModuleName, MODULE_INFO.prcCommonNameModuleName, MODULE_INFO.basicsCommonModuleName])
			.then();
	}

	public getTranslateText(key: string, interpolateParams?: TranslationParamsSource) {
		return this.translateService.instant(key, interpolateParams).text;
	}

	public summary(summaries: ISummary[], item: IEvaluationGetChartDataDateSetResponseEntity[]) {
		summaries = isArray(summaries)
			? forEach(item, function (value, key) {
				if (summaries[key] === undefined) {
					summaries[key] = {Total: value.Total};
				} else {
					summaries[key].Total += value.Total;
				}
			})
			: summaries;
	}

	public average(averages: ISummary[], summaries: ISummary[], count: number) {
		averages =
			isArray(averages) && count > 0
				? forEach(summaries, function (sum, key) {
					averages[key] = {Total: sum.Total / count};
				})
				: averages;
	}

	public get initColor() {
		return new RgbColor(0, 0, 0, 1);
	}

	public isDefined<T>(value: T | null | undefined): value is T {
		return value !== null && value !== undefined;
	}

	public markListAsBeingDeleted(items: object[]) {
		forEach(items, this.markAsBeingDeleted);
	}

	public markAsBeingDeleted(item: object) {
		set(item, '__rt$data.isBeingDeleted', true);
	}

	public removeMarkAsBeingDeleted(item: object) {
		set(item, '__rt$data.isBeingDeleted', false);
	}

	public isBeingDeleted(item: object) {
		return get(item, '__rt$data.isBeingDeleted', false);
	}

	public initEventEmit() {
		this.onClerkCommonIsEvaluationEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onEvalClerkValidationMessenger = new EventEmitter<IEventEmitterParam<boolean>>();
		this.onClerkViewGridRefreshEvent = new EventEmitter<IBasicsClerkEntity[]>();

		this.onGroupViewGridRefreshEvent = new EventEmitter<IEvaluationGroupDataEntity[] | null>();
		this.onEvaluationSchemaChanged = new EventEmitter<TEvaluationSchemaChangedParam | null>();
		this.onGroupViewLevel1Event = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewCollapseEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewExpandEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewCollapseNodeEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewExpandNodeEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewUpdateCalculation = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onGroupViewSelectionChanged = new EventEmitter<IEvaluationGroupDataEntity | null>();

		this.onItemViewGridRefreshEvent = new EventEmitter<IEvaluationItemDataGetListResponseEntity>();

		this.onDocumentViewCreateDocEvent = new EventEmitter<IMenuItemEventInfo<void>>();

		this.onDocumentViewCreateDocEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onDocumentViewUpdateAndCreateDocEvent = new EventEmitter<IMenuItemEventInfo<void>>();
		this.onDocumentViewGridRefreshEvent = new EventEmitter<IEvaluationDocumentEntity[] | null>();
	}

	public closeEventEmit() {
		this.onClerkCommonIsEvaluationEvent.unsubscribe();
		this.onEvalClerkValidationMessenger.unsubscribe();
		this.onClerkViewGridRefreshEvent.unsubscribe();

		this.onGroupViewGridRefreshEvent.unsubscribe();
		this.onEvaluationSchemaChanged.unsubscribe();
		this.onGroupViewLevel1Event.unsubscribe();
		this.onGroupViewCollapseEvent.unsubscribe();
		this.onGroupViewExpandEvent.unsubscribe();
		this.onGroupViewCollapseNodeEvent.unsubscribe();
		this.onGroupViewExpandNodeEvent.unsubscribe();
		this.onGroupViewUpdateCalculation.unsubscribe();
		this.onGroupViewSelectionChanged.unsubscribe();

		this.onItemViewGridRefreshEvent.unsubscribe();

		this.onDocumentViewCreateDocEvent.unsubscribe();
		this.onDocumentViewUpdateAndCreateDocEvent.unsubscribe();
		this.onDocumentViewGridRefreshEvent.unsubscribe();
	}
}
