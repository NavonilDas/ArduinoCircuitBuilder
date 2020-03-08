import { Point } from './Point';
import { CircuitElement } from './CircuitElement';

declare var window;

export class Breadboard extends CircuitElement {
    // 330x212
    body:any;
    ////// 315
    constructor(private canvas: any, public x: number, public y: number) {
        super("Breadboard");
        this.body = this.canvas.rect(x, y, 330, 220);
        for(let i=1;i<=30;++i){
            this.canvas.rect(x + (i-1)*10,y + 15,5,5);
        }
        console.log("sss")
    }

    save() {
    } 
    load(data: any): void {
    }
    getNode(point: number[]): Point {
        return null;
    }
    remove(): void {
    }
}