/*
 * Copyright(c) RIB Software GmbH
 */

import {
	BusinessModuleInfoBase, EntityContainerInjectionTokens, EntityInfo
} from '@libs/ui/business-base';
import { QtoMainDetailGridBehavior } from '../behaviors/qto-main-detail-grid-behavior.service';

import { QtoMainDetailGridDataService } from '../services/qto-main-detail-grid-data.service';

import { QtoShareDetailEntityInfo } from '@libs/qto/shared';
import { QtoMainDetailValidationService } from '../services/validation/qto-main-detail-validation.service';
import {ContainerDefinition, IContainerDefinition} from '@libs/ui/container-system';
import {QTO_MAIN_DETAIL_COMMENTS_ENTITY_INFO} from '../detail_comment/qto-main-detail-comments-entity-info.model';
import {QTO_MAIN_SHEET_ENTITY_INFO} from '../sheet/qto-main-sheet-entity-info.model';
import {QTO_MAIN_PROJECT_DOCUMENT_ENTITY_INFO} from '../project_document/qto-main-project-document-entity-info.model';
import {QTO_MAIN_HEADER_ENTITY_INFO} from '../header/qto-main-header-entity-info.model';
import {DrawingContainerDefinition} from '@libs/model/shared';
import {QTO_MAIN_DETAIL_DOCUMENT_ENTITY_INFO} from '../detail_document/qto-main-detail-document-entity-info.model';
import {BasicsSharedPhotoEntityViewerComponent, PHOTO_ENTITY_VIEWER_OPTION_TOKEN} from '@libs/basics/shared';
import {IQtoMainDetailGridEntity} from './qto-main-detail-grid-entity.class';
import {QTO_MAIN_LOCATION_ENTITY_INFO} from '../location/qto-main-location-entity-info.model';
import {QTO_MAIN_SUBTOTAL_ENTITY_INFO} from '../subtotal/qto-main-subtotal-entity-info.model';
import {QTO_MAIN_COST_GROUP_ENTITY_INFO} from '../cost-group/qto-main-cost-group-entity-info.model';
import {QTO_MAIN_HISTORY_ENTITY_INFO} from '../history/qto-header-history-entity-info.model';

export class QtoMainModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new QtoMainModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'qto.main';
	}

	public override get entities(): EntityInfo[] {
		return [
			QTO_MAIN_HEADER_ENTITY_INFO,
			QTO_MAIN_SHEET_ENTITY_INFO,
			QTO_MAIN_DETAIL_COMMENTS_ENTITY_INFO,
			QTO_MAIN_LOCATION_ENTITY_INFO,
			...QTO_MAIN_PROJECT_DOCUMENT_ENTITY_INFO,
			QTO_MAIN_DETAIL_DOCUMENT_ENTITY_INFO,
			QTO_MAIN_SUBTOTAL_ENTITY_INFO,
			QTO_MAIN_COST_GROUP_ENTITY_INFO,
			QTO_MAIN_HISTORY_ENTITY_INFO,
			QtoShareDetailEntityInfo.create({
				permissionUuid: '6d3013bd4af94808bec8d0ec864119c9',
				formUuid: '051c10ad93904e5abf98e31208fb7334',
				dataServiceToken: QtoMainDetailGridDataService,
				validationServiceToken: QtoMainDetailValidationService,
				behavior: QtoMainDetailGridBehavior
			}),
		];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations, 'cloud.common', 'basics.customize','documents.shared', 'model.wdeviewer'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'c08b71ab6fb74c45a079ad5ad5320776'
			}),
			new ContainerDefinition({
				uuid: '1c05d2f405a54679b12e70524919e19c',
				id: 'qto.main.imageSpecification',
				title: {
					text: 'Image and Specification',
					key: 'qto.main.imagSpecification'
				},
				containerType: BasicsSharedPhotoEntityViewerComponent,
				permission: 'd9ffa97470f345b4a8817b700dc65720',
				providers: [{
					provide: new EntityContainerInjectionTokens<IQtoMainDetailGridEntity>().dataServiceToken,
					useExisting: QtoMainDetailGridDataService
				}, {
					provide: PHOTO_ENTITY_VIEWER_OPTION_TOKEN,
					useValue: {
						isSingle: true,
						canCreate:() => {
							return false;
						},
						canDelete:() => {
							return false;
						},
						canChange:() => {
							return false;
						},
					}
				}]
			}),
		]);
	}

	/**
	 * Returns the translation container UUID for the qto main module.
	 */
	protected override get translationContainer(): string | undefined {
		return '87db2f74d87844e79447d7f0ed576610';
	}

}
