import React from "react";
import clsx from "clsx";
import "./FireworksAnimation.scss";

const color: FireworkColor = {
  yellow: "hsl(50, 100%, 70%)",
  green: "hsl(130, 90%, 70%)",
  cyan: "hsl(190, 80%, 70%)",
  blue: "hsl(240, 50%, 50%)",
  purple: "hsl(260, 50%, 55%)",
  lightPurple: "hsl(260, 80%, 75%)",
  pink: "hsl(330, 100%, 75%)",
};
const duration = 1200;

export default function FireworksAnimation() {
  return (
    <div className="fireworks-root">
      <Fireworks duration={duration}>
        <Firework x={336} y={284}>
          <FireworkRocket
            y={284}
            delay={-0.675 * duration}
            exhaustColor={color.purple}
            exhaustLength={150}
          />
          <FireworkRing
            delay={-0.675 * duration}
            type="32dots"
            radius={220}
            fillColor={color.yellow}
            strokeWidth={24}
            direction="cw"
          />
          <FireworkRing
            delay={-0.675 * duration}
            type="24dots"
            radius={170}
            fillColor={color.green}
            strokeWidth={15}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.675 * duration}
            type="dashed"
            radius={60}
            strokeColor={color.lightPurple}
            direction="ccw"
          />
        </Firework>
        <Firework x={346} y={326}>
          <FireworkRocket
            delay={-0.475 * duration}
            y={326}
            exhaustColor={color.purple}
            exhaustLength={200}
          />
          <FireworkRing
            delay={-0.475 * duration}
            type="16dots"
            radius={100}
            fillColor={color.green}
            strokeWidth={30}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.475 * duration}
            type="dashed"
            radius={60}
            strokeColor={color.lightPurple}
            direction="ccw"
          />
        </Firework>
        <Firework x={413} y={316}>
          <FireworkRocket
            delay={-0.975 * duration}
            y={316}
            exhaustColor={color.purple}
            exhaustLength={240}
          />
          <FireworkRing
            delay={-0.975 * duration}
            type="16dots"
            radius={168}
            fillColor={color.yellow}
            strokeWidth={30}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.975 * duration}
            type="16dots"
            radius={96}
            fillColor={color.pink}
            strokeWidth={30}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.975 * duration}
            type="dashed"
            radius={56}
            strokeColor={color.cyan}
            direction="ccw"
          />
        </Firework>
        <Firework x={512} y={348}>
          <FireworkRocket
            delay={-0.725 * duration}
            y={348}
            exhaustColor={color.purple}
            exhaustLength={190}
          />
          <FireworkRing
            delay={-0.725 * duration}
            type="16dots"
            radius={100}
            fillColor={color.green}
            strokeWidth={10}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.725 * duration}
            type="dashed"
            radius={38}
            strokeColor={color.lightPurple}
            direction="ccw"
          />
        </Firework>
        <Firework x={552} y={422}>
          <FireworkRocket
            delay={-0.6 * duration}
            y={422}
            exhaustColor={color.purple}
            exhaustLength={170}
          />
          <FireworkRing
            delay={-0.6 * duration}
            type="32dots"
            radius={170}
            fillColor={color.lightPurple}
            strokeWidth={30}
            direction="cw"
          />
          <FireworkRing
            delay={-0.6 * duration}
            type="20dots"
            radius={130}
            fillColor={color.cyan}
            strokeWidth={24}
            direction="ccw"
          />
          <FireworkRing
            delay={-0.6 * duration}
            type="8raysQuick"
            radius={60}
            strokeColor={color.pink}
            strokeWidth={25}
          />
        </Firework>
        <Firework x={173} y={338}>
          <FireworkRing
            delay={-0.45 * duration}
            type="16rays"
            radius={50}
            fillColor={color.blue}
            strokeWidth={15}
          />
        </Firework>
        <Firework x={222} y={160}>
          <FireworkRing
            delay={-0.375 * duration}
            type="8rays"
            radius={60}
            fillColor={color.yellow}
            strokeWidth={20}
          />
        </Firework>
        <Firework x={242} y={260}>
          <FireworkRing
            delay={-0.675 * duration}
            type="8rays"
            radius={50}
            fillColor={color.yellow}
            strokeWidth={25}
          />
        </Firework>
        <Firework x={278} y={438}>
          <FireworkRing
            delay={-0.475 * duration}
            type="8rays"
            radius={60}
            fillColor={color.yellow}
            strokeWidth={22}
          />
        </Firework>
        <Firework x={410} y={316}>
          <FireworkRing
            delay={-0.85 * duration}
            type="8rays"
            radius={192}
            fillColor={color.lightPurple}
            strokeWidth={70}
          />
        </Firework>
        <Firework x={478} y={230}>
          <FireworkRing
            delay={-0.4 * duration}
            type="16rays"
            radius={60}
            fillColor={color.blue}
            strokeWidth={22}
          />
        </Firework>
        <Firework x={542} y={182}>
          <FireworkRing
            delay={-0.55 * duration}
            type="8rays"
            radius={60}
            fillColor={color.yellow}
            strokeWidth={20}
          />
        </Firework>
        <Firework x={652} y={380}>
          <FireworkRing
            delay={-0.4 * duration}
            type="16rays"
            radius={36}
            fillColor={color.blue}
            strokeWidth={13}
          />
        </Firework>
      </Fireworks>
    </div>
  );
}

interface FireworksProps {
  duration: number;
  children?: React.ReactNode;
}
function Fireworks({ duration, children }: Readonly<FireworksProps>) {
  const viewBoxWidth = 800;
  const viewBoxHeight = 600;
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxHeight}`;
  const viewBoxWidthPx = `100%`;
  const viewBoxHeightPx = `auto`;
  const rootStyle: React.CSSProperties & CSSCustomProperty = {
    "--anim-dur": `${duration}ms`,
  };

  return (
    <svg
      data-testid="fireworks"
      className="fireworks"
      viewBox={viewBox}
      width={viewBoxWidthPx}
      height={viewBoxHeightPx}
      aria-label="Fireworks"
      style={rootStyle}
    >
      {children}
    </svg>
  );
}

interface FireworkProps {
  x: number;
  y: number;
  children?: React.ReactNode;
}
function Firework({ x, y, children }: Readonly<FireworkProps>) {
  const transform = `translate(${x}, ${y})`;

  return (
    <g data-testid="firework" transform={transform}>
      {children}
    </g>
  );
}

interface FireworkRingProps {
  radius: number;
  type?: FireworkRingType;
  delay?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  direction?: FireworkDirection;
}
function FireworkRing({
  radius,
  type = "dashed",
  delay = 0,
  fillColor = "none",
  strokeColor,
  strokeWidth = 1,
  direction,
}: Readonly<FireworkRingProps>) {
  const delayStyle: React.CSSProperties = {
    animationDelay: `${delay}ms`,
  };

  if (type.includes("dots")) {
    const dots = +type.slice(0, -4);
    const dotArray = [];
    const ringClass = clsx("fireworks__ring", `fireworks__ring--${direction}`);

    for (let d = 1; d <= dots; ++d) {
      const dotId = `dot${d}`;
      const dotRotate = `rotate(${(360 / dots) * d})`;
      const dotTranslate = `translate(0, ${radius})`;
      const dotTransform = `${dotRotate} ${dotTranslate}`;

      dotArray.push(
        <g key={dotId} transform={dotTransform}>
          <circle
            className={clsx(
              "fireworks__particle",
              "fireworks__particle--dot"
            )}
            fill={fillColor}
            stroke={strokeColor}
            r={strokeWidth}
            style={delayStyle}
          />
        </g>
      );
    }

    return (
      <g
        data-testid="firework-ring"
        className={ringClass}
        style={delayStyle}
      >
        {dotArray}
      </g>
    );
  }

  if (type.includes("rays")) {
    const isQuick = type.includes("Quick");
    const rays = +type.slice(0, isQuick ? -9 : -4);
    const rayArray = [];
    const rayStrokeWidth = fillColor === "none" ? 2 : 0;
    const rx = strokeWidth / 10;
    const rayClass = clsx(
      "fireworks__particle",
      isQuick
        ? "fireworks__particle--quick-ray"
        : "fireworks__particle--ray"
    );
    const quickRayClass = clsx(
      "fireworks__particle",
      isQuick
        ? "fireworks__particle--quick-ray-flip"
        : "fireworks__particle--ray-flip"
    );

    for (let r = 1; r <= rays; ++r) {
      const rayId = `ray${r}`;
      const rayRotate = `rotate(${(360 / rays) * r})`;
      const rayTranslateY = radius - strokeWidth;
      const rayTranslate = `translate(0, ${rayTranslateY})`;
      const rayTransform = `${rayRotate} ${rayTranslate}`;
      const rayFlipTranslate = `translate(0, ${-strokeWidth * 2})`;
      const rayFlipTransform = `rotate(180) ${rayFlipTranslate}`;

      rayArray.push(
        <g key={rayId} transform={rayTransform}>
          <ellipse
            className={rayClass}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={rayStrokeWidth}
            cy={strokeWidth}
            rx={rx}
            ry={strokeWidth}
            style={delayStyle}
          />
          <g transform={rayFlipTransform}>
            <ellipse
              className={quickRayClass}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={rayStrokeWidth}
              cy={strokeWidth}
              rx={rx}
              ry={strokeWidth}
              style={delayStyle}
            />
          </g>
        </g>
      );
    }

    return <g data-testid="firework-ring">{rayArray}</g>;
  }
  // dashed by default
  const directionClass = clsx(
    "fireworks__ring",
    `fireworks__ring--${direction}`
  );
  const dashedClass = clsx(
    "fireworks__particle",
    "fireworks__particle--dashed"
  );

  return (
    <g
      data-testid="firework-ring"
      className={directionClass}
      style={delayStyle}
    >
      <circle
        className={dashedClass}
        fill={fillColor}
        pathLength={48} // React uses number, but SVG attr is number-ish. JSX expects number for some, string for others. pathLength is usually number.
        stroke={strokeColor}
        strokeDasharray="1 2"
        strokeWidth={radius}
        r={radius / 2}
        style={delayStyle}
      />
    </g>
  );
}

interface RocketProps {
  y: number;
  delay?: number;
  exhaustColor?: string;
  exhaustLength?: number;
}
function FireworkRocket({
  y,
  delay = 0,
  exhaustColor = "#000",
  exhaustLength = 1,
}: Readonly<RocketProps>) {
  const trajectoryStart = 600;
  const delayStyle: React.CSSProperties = {
    animationDelay: `${delay}ms`,
  };
  const trajectoryWidth = 4;
  const trajectory = trajectoryStart - y - trajectoryWidth;
  const unfilled = trajectory - exhaustLength;
  const rocketStrokeDash = `${exhaustLength} ${unfilled + trajectory}`;

  return (
    <path
      data-testid="firework-rocket"
      className="fireworks__rocket"
      fill="none"
      stroke={exhaustColor}
      strokeLinecap="round"
      strokeWidth={trajectoryWidth}
      d={Utils.pathWave(0, 0, 0, trajectory, 20, 15)}
      strokeDasharray={rocketStrokeDash}
      strokeDashoffset={-trajectory}
      style={delayStyle}
    />
  );
}

class Utils {
  static random(min: number = 0, max: number = 1) {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;

    return min + value * (max - min);
  }

  static pathWave(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    segments: number,
    amplitude: number
  ) {
    const points = [];
    const maxFactor = 0.5;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // linear interpolation to find point on the straight line
      let x = x1 + (x2 - x1) * t;
      let y = y1 + (y2 - y1) * t;

      // add random offset perpendicular to the line (except for start/end)
      if (i > 0 && i < segments) {
        // calculate the angle of the line to offset perpendicularly
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const offset = this.random(-maxFactor, maxFactor) * amplitude;

        x += Math.cos(angle + Math.PI / 2) * offset;
        y += Math.sin(angle + Math.PI / 2) * offset;
      }

      points.push({ x, y });
    }

    // M = move to start, Q = control point + end point
    let d = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      // use the point itself as the curve anchor
      // for a smoother look, you can calculate midpoints between segments
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

      d += ` Q ${prev.x},${prev.y} ${midX},${midY}`;
    }

    d += ` L ${x2},${y2}`;

    return d;
  }
}

type CSSCustomProperty = {
  [key: string]: string;
};
type FireworkColor = Record<string, string>;
type FireworkDirection = "cw" | "ccw";
type FireworkRingType =
  | "16dots"
  | "20dots"
  | "24dots"
  | "32dots"
  | "8rays"
  | "8raysQuick"
  | "16rays"
  | "dashed";
