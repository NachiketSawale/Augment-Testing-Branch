import {ContainerLayoutConfiguration} from '@libs/ui/business-base';
import {IPpsFormulaInstanceEntity} from './entities/pps-formula-instance-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';

export const PpsFormulaInstanceLayoutConfiguration: ContainerLayoutConfiguration<IPpsFormulaInstanceEntity> = {
    groups: [
        {
            gid: 'baseGroup',
            attributes: ['Code', 'DescriptionInfo', 'CommentText']
        }
    ],
    labels: {
        ...prefixAllTranslationKeys('productionplanning.formulaconfiguration.', {
            CommentText: 'CommentText',
        }),
    },
};