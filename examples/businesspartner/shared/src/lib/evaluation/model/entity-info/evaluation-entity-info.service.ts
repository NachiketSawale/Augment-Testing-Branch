import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken } from '@libs/ui/business-base';

import { runInInjectionContext } from '@angular/core';
import { BusinesspartnerSharedEvaluationContainerComponent } from '../../components/evaluation/evaluation.component';
import { CompleteIdentification, IInitializationContext } from '@libs/platform/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { BusinesspartnerSharedEvaluationDataService } from '../../services/evaluation-data.service';
import { BusinesspartnerSharedEvaluationChartDataService } from '../../services/evaluation-chart-data.service';
import { BusinesspartnerSharedEvaluationLayoutConfigurationService } from '../../services/evaluation-layout-configuration.service';
import { EvaluationBaseServiceToken} from '../../services/evaluation-base.service';
import { IEvaluationEntity, IEvaluationGetTreeResponse } from '@libs/businesspartner/interfaces';

import { IEvaluationDataEntityInfoOptions } from '../evaluation-data-entity-info-options.interface';

export class BusinesspartnerSharedEvaluationEntityInfoService {
	private static readonly _dataServiceCache = new Map<string, IEntitySelection<IEvaluationEntity>>();

	private static readonly businesspartnerMainModuleName = 'businesspartner.main';
	private static readonly businesspartnerMainPascalCasedModuleName = 'BusinessPartner.Main';

	public constructor() {}

	private static getDataService<PT extends object, MT extends object, PU extends CompleteIdentification<PT>>(options: IEvaluationDataEntityInfoOptions<PT, MT>, context: IInitializationContext) {
		const uuid = options.containerUuid || options.adaptorService.permissionUuid;
		let instance = BusinesspartnerSharedEvaluationEntityInfoService.getDataServiceFromCache(uuid);

		if (!instance) {
			instance = runInInjectionContext(
				context.injector,
				() =>
					new BusinesspartnerSharedEvaluationDataService<PT, PU>({
						parentService: options.adaptorService.getParentService(),
						adaptorService: options.adaptorService
					}),
			);
			BusinesspartnerSharedEvaluationEntityInfoService._dataServiceCache.set(uuid, instance);
		}
		return instance as BusinesspartnerSharedEvaluationDataService<PT, PU>;
	}

	private static getChartService<PT extends object, MT extends object>(options: IEvaluationDataEntityInfoOptions<PT, MT>, context: IInitializationContext) {
		const instance = runInInjectionContext(
			context.injector,
			() =>
				new BusinesspartnerSharedEvaluationChartDataService({
					parentService: options.adaptorService?.getParentService(),
					adaptorService: options.adaptorService
				}),
		);
		return instance as BusinesspartnerSharedEvaluationChartDataService;
	}

	private static getBehavior<PT extends object, MT extends object>(options: IEvaluationDataEntityInfoOptions<PT, MT>, context: IInitializationContext) {
		const instance = runInInjectionContext(
			context.injector,
			() =>
				new BusinesspartnerSharedEvaluationChartDataService({
					parentService: options.adaptorService.getParentService(),
					adaptorService: options.adaptorService
				}),
		);
		return instance as BusinesspartnerSharedEvaluationChartDataService;
	}

	public static getDataServiceFromCache(uuid: string) {
		return BusinesspartnerSharedEvaluationEntityInfoService._dataServiceCache.get(uuid);
	}

	public static create<PT extends object, MT extends object, PU extends CompleteIdentification<PT>>(option: IEvaluationDataEntityInfoOptions<PT, MT>): EntityInfo {
		const layout = BusinesspartnerSharedEvaluationLayoutConfigurationService.removeColumns(option.excludeColumns);

		return EntityInfo.create<IEvaluationGetTreeResponse>({
			grid: {
				title: option.gridTitle ? option.gridTitle : {
					text: 'Evaluation',
					key: this.businesspartnerMainModuleName + '.evaluatoinContainerTitle',
				},
				containerType: BusinesspartnerSharedEvaluationContainerComponent,
				providers: (ctx) => [
					{
						provide: SplitGridConfigurationToken,
						useValue: <ISplitGridConfiguration<IEvaluationGetTreeResponse, IEvaluationEntity>>{
							parent: {
								uuid: option.adaptorService.permissionUuid,
								columns: layout,
								dataService: BusinesspartnerSharedEvaluationEntityInfoService.getDataService<PT, MT, PU>(option, ctx),
								treeConfiguration: {
									parent: function(entity: IEvaluationEntity) {
										// const mainService = ServiceLocator.injector.get(BusinessPartnerSharedEvaluationDataService);
										const mainService = BusinesspartnerSharedEvaluationEntityInfoService.getDataService<PT, MT, PU>(option, ctx);
										return mainService.parentOf(entity);
									},
									children: function(entity: IEvaluationEntity) {
										// const mainService = ServiceLocator.injector.get(BusinessPartnerSharedEvaluationDataService);
										const mainService = BusinesspartnerSharedEvaluationEntityInfoService.getDataService<PT, MT, PU>(option, ctx);
										return mainService.childrenOf(entity);
									},
								},
							},
						},
					},
					{
						provide: EvaluationBaseServiceToken,
						useValue: option.adaptorService,
					},
				],
			},
			dataService: (ctx) => {
				return BusinesspartnerSharedEvaluationEntityInfoService.getChartService(option, ctx);
			},
			dtoSchemeId: {
				moduleSubModule: BusinesspartnerSharedEvaluationEntityInfoService.businesspartnerMainPascalCasedModuleName,
				typeName: 'EvaluationDto',
			},
			permissionUuid: option.adaptorService.permissionUuid,
		});
	}
}
