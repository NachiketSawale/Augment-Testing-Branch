import {ContainerLayoutConfiguration} from '@libs/ui/business-base';
import {IPpsFormulaEntity} from './entities/pps-formula-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';

export const PpsFormulaLayoutConfiguration : ContainerLayoutConfiguration<IPpsFormulaEntity> = {
    groups: [{
        gid: 'baseGroup',
        attributes: ['Description', 'CommentText']
    }],
    labels: {
        ...prefixAllTranslationKeys('productionplanning.formulaconfiguration.', {
            CommentText: 'CommentText',
        }),
    },
};