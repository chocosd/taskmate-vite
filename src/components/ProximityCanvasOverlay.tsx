// import { useSharedWindow } from '@context/shared-window/useSharedWindow';
// import { useProximitySync } from '@hooks/useProximitySync.hooks';
// import { useEffect, useRef } from 'react';

// export default function ProximityCanvasOverlay() {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const { proximity } = useSharedWindow();
//     useProximitySync();

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d');
//         if (!ctx) return;

//         let animationFrameId: number;

//         const resize = () => {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//         };

//         const draw = () => {
//             if (!ctx || !proximity) {
//                 return;
//             }

//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             const glowWidth = 80;
//             const alpha = proximity.intensity * 0.6;

//             let gradient: CanvasGradient;

//             switch (proximity.edge) {
//                 case 'left':
//                     gradient = ctx.createLinearGradient(0, 0, glowWidth, 0);
//                     break;
//                 case 'right':
//                     gradient = ctx.createLinearGradient(
//                         canvas.width,
//                         0,
//                         canvas.width - glowWidth,
//                         0
//                     );
//                     break;
//                 case 'top':
//                     gradient = ctx.createLinearGradient(0, 0, 0, glowWidth);
//                     break;
//                 case 'bottom':
//                     gradient = ctx.createLinearGradient(
//                         0,
//                         canvas.height,
//                         0,
//                         canvas.height - glowWidth
//                     );
//                     break;
//                 default:
//                     return;
//             }

//             gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha})`);
//             gradient.addColorStop(0.7, `rgba(0, 255, 255, ${alpha * 0.4})`);
//             gradient.addColorStop(1, `rgba(0, 255, 255, 0)`);

//             ctx.fillStyle = gradient;

//             switch (proximity.edge) {
//                 case 'left':
//                     ctx.fillRect(0, 0, glowWidth, canvas.height);
//                     break;
//                 case 'right':
//                     ctx.fillRect(canvas.width - glowWidth, 0, glowWidth, canvas.height);
//                     break;
//                 case 'top':
//                     ctx.fillRect(0, 0, canvas.width, glowWidth);
//                     break;
//                 case 'bottom':
//                     ctx.fillRect(0, canvas.height - glowWidth, canvas.width, glowWidth);
//                     break;
//             }
//         };

//         const animate = () => {
//             draw();
//             animationFrameId = requestAnimationFrame(animate);
//         };

//         resize();
//         window.addEventListener('resize', resize);
//         animate();

//         return () => {
//             window.removeEventListener('resize', resize);
//             cancelAnimationFrame(animationFrameId);
//         };
//     }, [proximity]);

//     return (
//         <canvas
//             ref={canvasRef}
//             className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
//         />
//     );
// }
