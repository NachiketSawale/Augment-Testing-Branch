/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { QtoFormulaRubricCategoryGridDataService } from '../services/qto-formula-rubric-category-grid-data.service';
import { QtoFormulaRubricCategoryGridBehavior } from '../behaviors/qto-formula-rubric-category-grid-behavior.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {IRubricCategoryEntity} from './entities/rubric-category-entity.interface';


 export const QTO_FORMULA_RUBRIC_CATEGORY_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IRubricCategoryEntity> ({
                grid: {
                    title: {key: 'qto.formula.rubric.gridViewTitle'},
						  behavior: ctx => ctx.injector.get(QtoFormulaRubricCategoryGridBehavior),
                },

                dataService: ctx => ctx.injector.get(QtoFormulaRubricCategoryGridDataService),
                dtoSchemeId: { moduleSubModule: 'Qto.Formula', typeName: 'RubricCategoryDto' },
                permissionUuid: '7cbac2c0e6f6435aa602a72dccd50880',
                layoutConfiguration: {
                    groups: [{
                        gid: 'default',
                        attributes: ['DescriptionInfo']
                    }],
                    labels: {
                        ...prefixAllTranslationKeys('cloud.common.', {
                            DescriptionInfo: {key: 'entityDescription', text: '*Description'}
                        })
                    }
                }
            });