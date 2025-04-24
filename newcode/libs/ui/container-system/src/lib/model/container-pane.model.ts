/*
 * Copyright(c) RIB Software GmbH
 */

import {Orientation} from '@libs/platform/common';
import {ContainerDefinition} from './container-definition.class';

/**
 * Layout splitter data interface
 */
export interface ILayoutSplitter {
    /**
     * Splitter orientation for panes
     */
    orientation?: Orientation;
    /**
     *
     */
    selectorName?: string;
    /**
     * Sub panes
     */
    panes?: IPaneDefinition[];
}

/**
 * Pane definition
 */
export interface IPaneDefinition extends ILayoutSplitter {
    /**
     * Pane name
     */
    name: string;
    /**
     * Pane NO.
     */
    no?: number;
    /**
     * Pane size in percentage
     */
    size?: number | null;
    /**
     * Record size before pane is collapsed
     */
    sizeBeforeCollapse?: number | null;
    /**
     * The index of the initially active tab in the group.
     */
    activeTab?: number;
    /**
     * Indicates whether the pane is collapsed.
     */
    collapsed?: boolean;
    /**
     * Containers in pane
     */
    containers?: ContainerDefinition[];
    /**
     * Tabbed containers
     */
    tabContainers?: ILayoutTabContainer[];
}

/**
 * Pane layout
 */
export interface IPaneLayout extends ILayoutSplitter {
    /**
     * Layout id
     */
    layout: string;
    /**
     * Splitter orientation for panes, Required
     */
    orientation: Orientation;
    /**
     * Required
     */
    selectorName: string;
    /**
     * Sub panes, Required
     */
    panes: IPaneDefinition[];
}

/**
 *  Pane layouts, layout0-31
 */
export const paneLayouts: {[key:string]: IPaneLayout} = {
    layout0: {
        layout: 'layout0',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-0',
                no: 1
            }
        ]
    },
    layout1: {
        layout: 'layout1',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 50
            },
            {
                name: 'pane-r',
                no: 2,
                size: 50
            }
        ]
    },
    layout2: {
        layout: 'layout2',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        no: 3,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                no: 2,
                size: 50
            }
        ]
    },
    layout3: {
        layout: 'layout3',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 3,
                        size: 50
                    }
                ],
                size: 50
            }
        ]
    },
    layout4: {
        layout: 'layout4',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 30
                    },
                    {
                        name: 'pane-lc',
                        no: 3,
                        size: 40
                    },
                    {
                        name: 'pane-lb',
                        no: 4,
                        size: 30
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                no: 2,
                size: 50
            }
        ]
    },
    layout5: {
        layout: 'layout5',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 30
                    },
                    {
                        name: 'pane-rc',
                        no: 3,
                        size: 40
                    },
                    {
                        name: 'pane-rb',
                        no: 4,
                        size: 30
                    }
                ],
                size: 50
            }
        ]
    },
    layout6: {
        layout: 'layout6',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        no: 3,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 4,
                        size: 50
                    }
                ],
                size: 50
            }
        ]
    },
    layout7: {
        layout: 'layout7',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-lc',
                        no: 3,
                        size: 34
                    },
                    {
                        name: 'pane-lb',
                        no: 5,
                        size: 33
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 33
                    },
                    {
                        name: 'pane-rc',
                        no: 4,
                        size: 34
                    },
                    {
                        name: 'pane-rb',
                        no: 6,
                        size: 33
                    }
                ],
                size: 50
            }
        ]
    },
    layout8: {
        layout: 'layout8',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                no: 3,
                size: 25
            }
        ]
    },
    layout9: {
        layout: 'layout9',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 4,
                        size: 50
                    }
                ],
                size: 25
            }
        ]
    },
    layout10: {
        layout: 'layout10',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        no: 4,
                        size: 50
                    }
                ],
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                no: 3,
                size: 25
            }
        ]
    },
    layout11: {
        layout: 'layout11',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        no: 4,
                        size: 50
                    }
                ],
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 50
                    }
                ],
                size: 25
            }
        ]
    },
    layout12: {
        layout: 'layout12',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 33
                    },
                    {
                        name: 'pane-rc',
                        no: 4,
                        size: 33
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 34
                    }
                ],
                size: 25
            }
        ]
    },
    layout13: {
        layout: 'layout13',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-lc',
                        no: 4,
                        size: 33
                    },
                    {
                        name: 'pane-lb',
                        no: 5,
                        size: 34
                    }
                ],
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                no: 3,
                size: 25
            }
        ]
    },
    layout14: {
        layout: 'layout14',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-lc',
                        no: 4,
                        size: 33
                    },
                    {
                        name: 'pane-lb',
                        no: 6,
                        size: 34
                    }
                ],
                size: 25
            },
            {
                name: 'pane-c',
                no: 2,
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 33
                    },
                    {
                        name: 'pane-rc',
                        no: 5,
                        size: 33
                    },
                    {
                        name: 'pane-rb',
                        no: 7,
                        size: 34
                    }
                ],
                size: 25
            }
        ]
    },
    layout15: {
        layout: 'layout15',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-lc',
                        no: 4,
                        size: 33
                    },
                    {
                        name: 'pane-lb',
                        no: 6,
                        size: 34
                    }
                ],
                size: 25
            },
            {
                name: 'pane-c',
                orientation: Orientation.Vertical,
                selectorName: 'verticalCenter',
                panes: [
                    {
                        name: 'pane-ct',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-cb',
                        no: 7,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 33
                    },
                    {
                        name: 'pane-rc',
                        no: 5,
                        size: 33
                    },
                    {
                        name: 'pane-rb',
                        no: 8,
                        size: 34
                    }
                ],
                size: 25
            }
        ]
    },
    layout16: {
        layout: 'layout16',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                no: 1,
                size: 50
            },
            {
                name: 'pane-b',
                no: 2,
                size: 50
            }
        ]
    },
    layout17: {
        layout: 'layout17',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                no: 1,
                size: 50
            },
            {
                name: 'pane-b',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalBottom',
                panes: [
                    {
                        name: 'pane-lb',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 3,
                        size: 50
                    }
                ],
                size: 50
            }
        ]
    },
    layout18: {
        layout: 'layout18',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalTop',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-b',
                no: 3,
                size: 50
            }
        ]
    },
    layout19: {
        layout: 'layout19',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                no: 1,
                size: 50
            },
            {
                name: 'pane-b',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalBottom',
                panes: [
                    {
                        name: 'pane-lb',
                        no: 2,
                        size: 33
                    },
                    {
                        name: 'pane-cb',
                        no: 3,
                        size: 34
                    },
                    {
                        name: 'pane-rb',
                        no: 4,
                        size: 33
                    }
                ],
                size: 50
            }
        ]
    },
    layout20: {
        layout: 'layout20',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalTop',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-ct',
                        no: 2,
                        size: 34
                    },
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 33
                    }
                ],
                size: 50
            },
            {
                name: 'pane-b',
                no: 4,
                size: 50
            }
        ]
    },
    layout21: {
        layout: 'layout21',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                no: 1,
                size: 50
            },
            {
                name: 'pane-b',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalBottom',
                panes: [
                    {
                        name: 'pane-lb',
                        no: 2,
                        size: 25
                    },
                    {
                        name: 'pane-cb1',
                        no: 3,
                        size: 25
                    },
                    {
                        name: 'pane-cb2',
                        no: 4,
                        size: 25
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 25
                    }
                ],
                size: 50
            }
        ]
    },
    layout22: {
        layout: 'layout22',
        orientation: Orientation.Vertical,
        selectorName: 'vertical',
        panes: [
            {
                name: 'pane-t',
                orientation: Orientation.Horizontal,
                selectorName: 'horizontalTop',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 25
                    },
                    {
                        name: 'pane-ct1',
                        no: 2,
                        size: 25
                    },
                    {
                        name: 'pane-ct2',
                        no: 3,
                        size: 25
                    },
                    {
                        name: 'pane-rt',
                        no: 4,
                        size: 25
                    }
                ],
                size: 50
            },
            {
                name: 'pane-b',
                no: 5,
                size: 50
            }
        ]
    },
    layout23: {
        layout: 'layout23',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-ct',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-cb',
                        no: 4,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 50
                    }
                ],
                size: 25
            }
        ]
    },
    layout24: {
        layout: 'layout24',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        no: 2,
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 3,
                        size: 33
                    },
                    {
                        name: 'pane-rc',
                        no: 4,
                        size: 34
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 33
                    }
                ],
                size: 50
            }
        ]
    },
    layout25: {
        layout: 'layout25',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'verticalLeft',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 33
                    },
                    {
                        name: 'pane-lc',
                        no: 2,
                        size: 34
                    },
                    {
                        name: 'pane-lb',
                        no: 3,
                        size: 33
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'verticalRight',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 4,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        no: 5,
                        size: 50
                    }
                ],
                size: 50
            }
        ]
    },
    layout26: {
        layout: 'layout26',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-ct',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-cb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-cb1',
                                no: 4,
                                size: 50
                            },
                            {
                                name: 'pane-cb2',
                                no: 5,
                                size: 50
                            }
                        ],
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                no: 3,
                size: 25
            }
        ]
    },
    layout27: {
        layout: 'layout27',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-c',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-ct',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-cb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-cb1',
                                no: 4,
                                size: 33
                            },
                            {
                                name: 'pane-cb2',
                                no: 5,
                                size: 34
                            },
                            {
                                name: 'pane-cb3',
                                no: 6,
                                size: 33
                            }
                        ],
                        size: 50
                    }
                ],
                size: 50
            },
            {
                name: 'pane-r',
                no: 3,
                size: 25
            }
        ]
    },
    layout28: {
        layout: 'layout28',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-rb1',
                                no: 3,
                                size: 50
                            },
                            {
                                name: 'pane-rb2',
                                no: 4,
                                size: 50
                            }
                        ],
                        size: 50
                    }
                ],
                size: 75
            }
        ]
    },
    layout29: {
        layout: 'layout29',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-lb1',
                                no: 3,
                                size: 50
                            },
                            {
                                name: 'pane-lb2',
                                no: 4,
                                size: 50
                            }
                        ],
                        size: 50
                    }
                ],
                size: 75
            },
            {
                name: 'pane-r',
                no: 2,
                size: 25
            }
        ]
    },
    layout30: {
        layout: 'layout30',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                no: 1,
                size: 25
            },
            {
                name: 'pane-r',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-rt',
                        no: 2,
                        size: 50
                    },
                    {
                        name: 'pane-rb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-rb1',
                                no: 3,
                                size: 33
                            },
                            {
                                name: 'pane-rb2',
                                no: 4,
                                size: 34
                            },
                            {
                                name: 'pane-rb3',
                                no: 5,
                                size: 33
                            }
                        ],
                        size: 50
                    }
                ],
                size: 75
            }
        ]
    },
    layout31: {
        layout: 'layout31',
        orientation: Orientation.Horizontal,
        selectorName: 'horizontal',
        panes: [
            {
                name: 'pane-l',
                orientation: Orientation.Vertical,
                selectorName: 'vertical',
                panes: [
                    {
                        name: 'pane-lt',
                        no: 1,
                        size: 50
                    },
                    {
                        name: 'pane-lb',
                        orientation: Orientation.Horizontal,
                        selectorName: 'horizontalBottom',
                        panes: [
                            {
                                name: 'pane-lb1',
                                no: 3,
                                size: 33
                            },
                            {
                                name: 'pane-lb2',
                                no: 4,
                                size: 34
                            },
                            {
                                name: 'pane-lb3',
                                no: 5,
                                size: 33
                            }
                        ],
                        size: 50
                    }
                ],
                size: 75
            },
            {
                name: 'pane-r',
                no: 2,
                size: 25
            }
        ]
    },
};

/**
 * Layout menu item interface in layout editor
 */
export interface ILayoutMenuItem {
    /**
     * Layout id
     *
     */
    id: string;
    /**
     * Layout caption
     */
    caption: string;
    /**
     * Sort order
     */
    sort: number;
}

/**
 * Layout tab container interface in layout editor
 */
export interface ILayoutTabContainer {
    /**
     * container uuid
     */
    uuid: string;
    /**
     * Pane number which it belongs to
     */
    paneNo?: number;
    /**
     * Is an empty placeholder
     */
    placeHolder?: boolean;
    /**
     * Sort order
     */
    order?: number;
}