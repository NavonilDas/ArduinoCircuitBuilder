import { Point } from './Point';

export abstract class CircuitElement {
    public keyName: string;

    constructor(keyName: string) {
        this.keyName = keyName;
    }
    /**
     * Return Object Containing properties of Element
     */
    abstract save():any;
    abstract load(data:any):void;
    abstract getNode(point:number[]):Point;
    abstract remove():void;

}