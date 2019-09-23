import { BasicApp } from './app/basic-app';
import { StaticTriangle } from './app/static-triangle';
import { TriangleTranslation } from './app/triangle-translation';
import { TriangleAspectRatio } from './app/triangle-aspect-ratio';
import { SpinningTriangle } from './app/spinning-triangle';
import './styles/scss/main.scss';
import { SpinningTriangleShader } from './app/spinning-triangle-shader';
import { MovableSpinningTriangle } from './app/movable-spinning-triangle';
import { InteractiveTriangleTranslation } from './app/interactive-triangle-translation';
import { SpinningSquare } from './app/spinning-square';
import { StaticCube } from './app/static-cube';
import { CubeSpinX } from './app/spinningx-cube';
import { CubeSpinY } from './app/spinningy-cube';
import { CubeSpinXY } from './app/spinningxy-cube';
import { InteractiveCubeSpin } from './app/movable-spinning-cube';

const canvas = document.querySelector<HTMLCanvasElement>('.main__canvas');

let currentApp: BasicApp = new StaticTriangle(canvas);
currentApp.run();

document.getElementById('demo-picker').addEventListener('change', async d => {
    const selection: string = (<HTMLSelectElement>d.target).value;    
    
    if (selection.localeCompare('static-triangle') === 0) {        
        await currentApp.stop();
        currentApp = new StaticTriangle(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('triangle-translation') === 0) {        
        await currentApp.stop();
        currentApp = new TriangleTranslation(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('triangle-aspect-ratio') === 0) {        
        await currentApp.stop();
        currentApp = new TriangleAspectRatio(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('spinning-triangle') === 0) {        
        await currentApp.stop();
        currentApp = new SpinningTriangle(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('spinning-square') === 0) {        
        await currentApp.stop();
        currentApp = new SpinningSquare(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('spinning-triangle-shader') === 0) {        
        await currentApp.stop();
        currentApp = new SpinningTriangleShader(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('interactive-triangle-translation') === 0) {        
        await currentApp.stop();
        currentApp = new InteractiveTriangleTranslation(canvas);
        currentApp.run();
        return;
    }

    if (selection.localeCompare('movable-spinning-triangle') === 0) {        
        await currentApp.stop();
        currentApp = new MovableSpinningTriangle(canvas);
        currentApp.run();
        return;
    }
    if(selection.localeCompare('simple-cube')===0){
        await currentApp.stop();
        currentApp = new StaticCube(canvas);
        currentApp.run();
        return;
    }
    
    if(selection.localeCompare('spinningx-cube')===0){
        await currentApp.stop();
        currentApp = new CubeSpinX(canvas);
        currentApp.run();
        return;
    }
    
    if(selection.localeCompare('spinningy-cube')===0){
        await currentApp.stop();
        currentApp = new CubeSpinY(canvas);
        currentApp.run();
        return;
    }
    if(selection.localeCompare('spinningxy-cube')===0){
        await currentApp.stop();
        currentApp = new CubeSpinXY(canvas);
        currentApp.run();
        return;
    }

    if(selection.localeCompare('movable-spinning-cube')===0){
        await currentApp.stop();
        currentApp = new InteractiveCubeSpin(canvas);
        currentApp.run();
        return;
    }
      
});

// const main = new StaticTriangle(canvas);
// main.run();

// const footerText = main.printSomething();
// console.log(footerText);