import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {IconData} from './qto-formula-icon-lookup.service';
@Injectable({
    providedIn: 'root'
})
export class QtoFormulaIconProcessorService {
    public QtoFormulaIconProcessor():IconData[] {

        const createIconEntity = this.createIconEntity;

        const iconPrefix:string[] = [
            'bl',
            'gr',
            'ye'
        ];

        const iconPostfix:string[] = [
            '',
            '-pi',
            '-sum'
        ];

        let id = 1;
        const iconData:IconData[] = [];
        // add icons by post- and prefix
        for (let i = 0; i < iconPrefix.length; i++) {
            for (let j = 0; j < iconPostfix.length; j++) {
                for (let index = 1; index <= 21; index++) {
                    iconData.push(
                        createIconEntity(id++, '  ', iconPrefix[i] + _.padStart(index.toString(), 3, '0') + iconPostfix[j])
                    );
                }
            }
        }

        // add reb icons
        const rebIds:number[] = _.range(0, 16).concat(_.range(20, 33)).concat(_.range(50, 53).concat([91]));

        _.forEach(rebIds, function(item){
            iconData.push(
                createIconEntity(id++, '  ', 'reb-' + _.padStart(item.toString(), 2, '0'))
            );
        });

        // add ONorm icons
        let ONormIds = _.range(1, 7).concat(_.range(10, 16)).concat(_.range(20, 24)).concat([27]).concat(_.range(30, 34)).concat(_.range(40, 44)).concat(_.range(46, 54));
        ONormIds = ONormIds.concat(_.range(56, 64)).concat(_.range(66, 74)).concat(_.range(76, 84)).concat(_.range(86, 94)).concat(_.range(96, 104));
        ONormIds = ONormIds.concat(_.range(110, 114)).concat(_.range(120, 123)).concat(_.range(126, 130)).concat([136]).concat(_.range(141, 147)).concat(_.range(150, 152));
        ONormIds = ONormIds.concat(_.range(160, 162)).concat(_.range(170, 175)).concat(_.range(180, 182)).concat(_.range(190, 192)).concat(_.range(200, 202));
        ONormIds = ONormIds.concat(_.range(210, 214)).concat(_.range(220, 222)).concat(_.range(230, 232)).concat(_.range(240, 242)).concat([246]).concat(_.range(250, 252));
        ONormIds = ONormIds.concat(_.range(260, 262)).concat(_.range(270, 272)).concat(_.range(280, 282)).concat(_.range(290, 292)).concat([293]);
        ONormIds = ONormIds.concat(_.range(300, 302)).concat(_.range(310, 312)).concat([380,390]).concat(_.range(401, 406));
        ONormIds = ONormIds.concat(_.range(411, 414)).concat([421,431,432,500,501,502,503,511,520,530,531,532,533,536,550,551,560,561,571,572,580,581]);

        _.forEach(ONormIds, function(item){
            iconData.push(
                createIconEntity(id++, '  ', 'o-' + _.padStart(item.toString(), 3, '0'))
            );
        });

        return iconData;
    }

    private createIconEntity(id:number, translationKey:string, replaceText:string, type?:string):IconData {
        return {
            Id: id,
            res: translationKey,
            text: replaceText,
            type: type
        };
    }

}