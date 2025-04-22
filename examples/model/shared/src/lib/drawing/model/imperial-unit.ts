/*
 * Copyright(c) RIB Software GmbH
 */

export interface IImperialUnitEntity {
    text: string;
    id: number;
    left: boolean;
    right: boolean;
    inch: boolean;
}

export const imperialUnits : IImperialUnitEntity[] = [
    {text: '60\'', id: 12 * 60, left: false, right: true, inch: true},
    {text: '50\'', id: 12 * 50, left: false, right: true, inch: true},
    {text: '40\'', id: 12 * 40, left: false, right: true, inch: true},
    {text: '30\'', id: 12 * 30, left: false, right: true, inch: true},
    {text: '20\'', id: 12 * 20, left: false, right: true, inch: true},
    {text: '10\'', id: 12 * 10, left: false, right: true, inch: true},
    {text: '5\'', id: 12 * 5, left: false, right: true, inch: true},

    {text: '1\'', id: 12, left: true, right: true, inch: false},
    {text: '1"', id: 1, left: true, right: true, inch: false},
    {text: '1-1/2"', id: 1.5, left: true, right: true, inch: false},
    {text: '1/2"', id: 0.5, left: true, right: true, inch: false},
    {text: '1/4"', id: 0.25, left: true, right: true, inch: false},
    {text: '1/8"', id: 0.125, left: true, right: true, inch: false},
    {text: '3/4"', id: 0.75, left: true, right: true, inch: false},
    {text: '3/8"', id: 0.375, left: true, right: true, inch: false},
    {text: '3/16"', id: 0.1875, left: true, right: true, inch: false},
    {text: '3/32"', id: 0.09375, left: true, right: true, inch: false},
];