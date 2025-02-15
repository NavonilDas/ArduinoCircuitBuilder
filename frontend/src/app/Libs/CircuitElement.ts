import { Point } from './Point';

/**
 * Abstract Class to for Circuit Elements
 */
export abstract class CircuitElement {
    public keyName: string;
    public id: number = 0;
    // isSimulating:boolean;
    constructor(keyName: string) {
        this.keyName = keyName;
        if(window["scope"][this.keyName])
            this.id = window["scope"][this.keyName].length;
    }
    /**
     * Return Object Containing properties of Element
     */
    abstract save(): any;
    /**
     * Load Properties of circuit element from data
     * @param data Object respective to the circuit element
     */
    abstract load(data: any): void;
    /**
     * Return Point (Circuit Node) present on the Circuit Element
     * @param point array of length 2 such that 0-> X position 1-> Y Position
     */
    abstract getNode(point: number[]): Point;
    /**
     * Clear Circuit Element from SVG(Canvas)
     */
    abstract remove(): void;
    /**
     * returns property of an element
     */
    abstract properties(): any;

    /******************  TODO:USE FOR FUTURE PURPOSE  *************************/
    // abstract initSimulation():void;
    // abstract simulate():void;
    // abstract closeSimulation():void;
}