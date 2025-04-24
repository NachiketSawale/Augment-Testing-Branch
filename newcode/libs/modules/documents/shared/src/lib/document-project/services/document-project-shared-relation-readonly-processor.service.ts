/*
 * Copyright(c) RIB Software GmbH
 */

import {IDocumentProjectEntity} from '../../model/entities/document-project-entity.interface';
import { BasicsSharedNumberGenerationService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo, Rubric } from '@libs/basics/shared';
import { isNull, isUndefined } from 'lodash';
import { DocumentProjectDataRootService } from './document-project-data-root.service';

/**
 * document project entity processor
 */
export class DocumentProjectRelationReadonlyProcessorService<T extends object> extends EntityReadonlyProcessorBase<IDocumentProjectEntity> {
	private readonly  basicsSharedNumberGenerationService = new BasicsSharedNumberGenerationService();
	/**
	 * @param dataService
	 */
	public constructor(protected dataService: DocumentProjectDataRootService<T>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IDocumentProjectEntity> {
		return {
			PrjProjectFk:{
				shared:['EstHeaderFk', 'MdcControllingUnitFk', 'PrjLocationFk', 'PsdScheduleFk'],
				readonly:this.readonlyPrjProjectFk
			},
			PsdScheduleFk:{
				shared:['PsdActivityFk'],
				readonly:this.readonlyPsdScheduleFk
			},
			RubricCategoryFk:(e)=> this.dataService.getSelectedEntity()?.Version === 0,
			PsdActivityFk:(e)=> isUndefined(this.dataService.getSelectedEntity()?.PsdScheduleFk) && !isNull(this.dataService.getSelectedEntity()?.PsdScheduleFk),
			Code:(e)=> {
				const entity = this.dataService.getSelectedEntity();
				if (!entity?.RubricCategoryFk) {
					return true;
				}
				const hasGenerateConfig = this.basicsSharedNumberGenerationService.hasNumberGenerateConfig(entity?.RubricCategoryFk, Rubric.Documents);
				if (entity?.Version === 0) {
					return !hasGenerateConfig;
				} else {
					return entity?.Code === '' || isNull(entity?.Code);
				}
			}
		};

	}

	protected readonlyPrjProjectFk(info: ReadonlyInfo<IDocumentProjectEntity>) {
		return this.isReadonly(info);
	}

	protected readonlyPsdScheduleFk(info:ReadonlyInfo<IDocumentProjectEntity>){
		return this.isReadonly(info);
	}

	protected isReadonly(info: ReadonlyInfo<IDocumentProjectEntity>){
		const readonlyFields = this.dataService.getColumnConfig();
		if (readonlyFields) {
			const filedInColumnConfig = readonlyFields.find(e => e.documentField === info.field);
			return !filedInColumnConfig || !filedInColumnConfig.readOnly;
		}
		return true;
	}

}