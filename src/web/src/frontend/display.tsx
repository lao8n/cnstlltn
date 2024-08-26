import { UserFramework, Cluster } from "../state/userState";
import { CanvasForm, CanvasSpace, Pt, Circle, Num } from "pts";
import { DisplayPoint, TwinklePoint } from './models'

export function setConstellationDisplayPoints(constellation: UserFramework[], clusters: Cluster[], canvasRef: React.RefObject<HTMLCanvasElement>): [DisplayPoint[], number] {
    let count = 0;
    const clustersMap = mapFrameworkToCluster(clusters);
    console.log("constellation: ", constellation, "clustersMap ", clustersMap)
    const displayPoints = constellation.filter(framework => {
        if (clustersMap.has(framework.id)) {
            if (clustersMap.get(framework.id)?.cluster === "Unclustered") {
                count++ // increment count for those with cluster unclustered
            }
            return true;
        } else {
            console.log(`Missing coordinate data for framework: ${framework.title}`);
            count++;
            return false;
        }
    }).map(framework => {
        const cluster = clustersMap.get(framework.id);
        const coords = cluster?.frameworks[framework.id];
        const cx = (coords?.[0] || 0);
        const cy = (coords?.[1] || 0);
        const x = cx * (canvasRef.current?.width || 0);
        const y = cy * (canvasRef.current?.height || 0);
        return {
            name: framework.title,
            userFramework: framework,
            coord: [cx, cy],
            position: new Pt(x, y),
            selected: false,
        } as DisplayPoint;
    });
    return [displayPoints, count];
}

function mapFrameworkToCluster(clusters: Cluster[]): Map<string, Cluster>{
    const clustersMap = new Map<string, Cluster>();
    for (const cluster of clusters) {
        for (const framework in cluster.frameworks) {
            clustersMap.set(framework, cluster);
        }
    }
    return clustersMap;
}

export function setClusterDisplayPoints(clusters: Cluster[], canvasRef: React.RefObject<HTMLCanvasElement>): DisplayPoint[] {
    return clusters.map(cluster => {
        const cx = cluster.coordinate[0]
        const cy = cluster.coordinate[1]
        const x = cx * (canvasRef.current?.width || 0);
        const y = cy * (canvasRef.current?.height || 0);
        return {
            name: cluster.cluster,
            userFramework: null,
            coord: [cx, cy],
            position: new Pt(x, y),
            selected: false,
        };
    })
}

export function updatePositions(canvasRef: React.RefObject<HTMLCanvasElement>, constellationPts: React.MutableRefObject<DisplayPoint[]>, clusterPts: React.MutableRefObject<DisplayPoint[]>, twinklePoints: React.MutableRefObject<TwinklePoint[]>) {
    if (!constellationPts.current || constellationPts.current.length === 0) {
        console.log("No data in constellationPts yet.");
        return;
    }
    // console.log("update positions:", canvasRef.current?.parentElement?.clientWidth, canvasRef.current?.parentElement?.clientHeight);
    constellationPts.current.forEach(pt => {
        const x = pt.coord[0] * (canvasRef.current?.parentElement?.clientWidth || 0);
        const y = pt.coord[1] * (canvasRef.current?.parentElement?.clientHeight || 0);
        pt.position = new Pt(x, y);
    });
    clusterPts.current.forEach(pt => {
        const x = pt.coord[0] * (canvasRef.current?.parentElement?.clientWidth || 0);
        const y = pt.coord[1] * (canvasRef.current?.parentElement?.clientHeight || 0);
        pt.position = new Pt(x, y);
    });
    twinklePoints.current.forEach(pt => {
        const x = pt.coord[0] * (canvasRef.current?.parentElement?.clientWidth || 0);
        const y = pt.coord[1] * (canvasRef.current?.parentElement?.clientHeight || 0);
        pt.position = new Pt(x, y);
    });
}

export function drawConstellationPoints(space : CanvasSpace, form: CanvasForm, constellationPts: React.MutableRefObject<DisplayPoint[]>) {
    const r = 50;
    const range = Circle.fromCenter(space.pointer, r);
    constellationPts.current.forEach(pt => {
        const colour = pt.selected ? "#ff0" : "#fff";
        if (Circle.withinBound(range, pt.position)) {
            const dist = (r - pt.position.$subtract(space.pointer).magnitude()) / r;
            const p = pt.position.$subtract(space.pointer).scale(1 + dist).add(space.pointer);
            form.fill(colour).point(p, dist * 15, "circle");
            form.font(dist * 15).fill("#fff").text(pt.position.$add(15, 15), pt.name);
        } else {
            form.fill(colour).point(pt.position, 3, "circle");
        }
    });
}

export function initializeTwinklePoints(count: number): TwinklePoint[] {
    const twinklePoints = Array(count).fill(null).map(() => ({
        coord: [Math.random(), Math.random()] as [number, number],
        position: new Pt(0, 0), // placeholder
        opacity: Math.random(),
        twinkleSpeed: Math.random() * 0.005 + 0.001,
        maxOpacity: Math.random() * 0.5 + 0.5
    }));
    return twinklePoints;
}

export function drawTwinklingPoints(form: CanvasForm, twinklePoints: TwinklePoint[]) {
    twinklePoints.forEach(point => {
        point.opacity += point.twinkleSpeed;
        if (point.opacity > point.maxOpacity || point.opacity < 0) {
            point.twinkleSpeed *= -1;
        }
        form.fillOnly(`rgba(255, 255, 255, ${Num.clamp(point.opacity, 0, point.maxOpacity)})`).point(point.position, 1);
    });
}


export function drawClusterPoints(form: CanvasForm, clusterPts: React.MutableRefObject<DisplayPoint[]>) {
    clusterPts.current.forEach(cluster => {
        form.font(15).fill("#fff").text(cluster.position, cluster.name);
    });
}

export function drawUnclusteredContentNotification(form: CanvasForm, width: number, unclusteredContent: number) {
    const topRightX = width - 330;
    const topRightY = 30;
    const topRight = new Pt(topRightX, topRightY);
    form.font(12).fill("#fff").text(topRight, `You have ${unclusteredContent} unclustered content. Try 'Cluster By' again.`);
}

export function drawNoConstellationContentNotification(form: CanvasForm, width: number, height: number, constellationName: string, lineHeight: number) {
    const middleX = width / 2 - 150;
    let middleY = height / 2 - 100;
    let text: string[] = [
        `Hey! You have no constellations.`,
        `These are ways to organise your notes into topics.`,
        `Add one by using the panel on the right-hand side`
    ]
    if (constellationName !== 'Home') {
        text = [
            `Hey! You have no content in your constellation`,
            `Prompt the AI for possible notes in the right-hand panel.`,
            `Then select the ones you are interested in and save them to your constellation.`,
            `Good prompts to try include a book you like such as Jared Diamond's Guns, Germs and Steel`,
            `Or you could try a concepts and arguments such as Causes of the First World War`, 
            `Prompting is an art rather than a science but usually the more detail the better!!`
        ]
    }
    for (let i = 0; i < text.length; i++) {
        form.font(12).fill("#fff").text(new Pt(middleX, middleY), text[i]);
        middleY += lineHeight;
    }
}