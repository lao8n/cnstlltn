import { UserFramework, Cluster } from "../state/userState";
import { CanvasForm, CanvasSpace, Pt, Circle } from "pts";
import { DisplayPoint } from './models'

export function setConstellationDisplayPoints(constellation: UserFramework[], clusters: Cluster[], canvasRef: React.RefObject<HTMLCanvasElement>): [DisplayPoint[], number] {
    let count = 0;
    const clustersMap = mapFrameworkToCluster(clusters);
    console.log("constellation: ", constellation, "clustersMap ", clustersMap)
    const displayPoints = constellation.filter(framework => {
        if (clustersMap.has(framework.id)) {
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
            description: framework.content,
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
            description: "",
            coord: [cx, cy],
            position: new Pt(x, y),
            selected: false,
        };
    })
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

export function drawClusterPoints(form: CanvasForm, clusterPts: React.MutableRefObject<DisplayPoint[]>) {
    clusterPts.current.forEach(cluster => {
        form.font(15).fill("#fff").text(cluster.position, cluster.name);
    });
}

export function drawMultiLineText(form: CanvasForm, width: number, lastSelected: DisplayPoint, lineHeight: number, maxWidth: number) {
    const topRightX = width - 450;
    const topRightY = 30;
    const topRight = new Pt(topRightX, topRightY);
    form.font(15).fill("#fff").text(topRight, lastSelected.name);
    const startingPoint = topRight.$add(0, 15)
    const words = lastSelected.description.split(' ');
    let line = '';
    let y = startingPoint.y;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = form.getTextWidth(testLine);
        if (testWidth > maxWidth && i > 0) {
            form.font(12).fill("#fff").text(new Pt(startingPoint.x, y), line);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    form.font(12).fill("#fff").text(new Pt(startingPoint.x, y), line);
}

export function drawUnclusteredContentNotification(form: CanvasForm, width: number, unclusteredContent: number) {
    const topRightX = width - 350;
    const topRightY = 10;
    const topRight = new Pt(topRightX, topRightY);
    form.font(12).fill("#fff").text(topRight, `You have ${unclusteredContent} unclustered content. Try 'Cluster By' again.`);
}

export function drawNoConstellationContentNotification(form: CanvasForm, width: number, height: number, constellationName: string, lineHeight: number) {
    const middleX = width / 2 - 100;
    let middleY = height / 2 - 10;
    let text: string[] = [
        `Hey! You have no constellations.`,
        `These are ways to organise your notes into topics.`,
        `Add one by using the panel on the right-hand side`
    ]
    if (constellationName !== 'Home') {
        text = [
            `Hey! You have no content in your constellation`,
            `Prompt the AI for possible notes, select the ones you are interested in and,`,
            `save them to your constellation.`
        ]
    }
    for (let i = 0; i < text.length; i++) {
        form.font(12).fill("#fff").text(new Pt(middleX, middleY), text[i]);
        middleY += lineHeight;
    }
}