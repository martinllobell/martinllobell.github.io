"use client";

import { useEffect, useRef } from "react";

const vert = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const frag = `precision highp float;
uniform vec2 R;uniform float T,S,P,D;uniform vec2 M;uniform vec3 A,C;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
float tor(vec3 p,float r0,float r){return length(vec2(length(p.xz)-r0,p.y))-r;}
vec2 map(vec3 p){
  p=rx(M.y*.45)*ry(M.x*.6)*p;
  vec2 m=vec2(tor(rx(1.5708+.45*sin(S*.45))*rz(.35*cos(S*.35))*p,1.,.07),0.);
  float b=tor(rx(1.5708)*ry(S*.9)*p,.76,.06);if(b<m.x)m=vec2(b,1.);
  float c=tor(rz(1.5708)*rx(S*1.3+.8)*p,.54,.05);if(c<m.x)m=vec2(c,2.);
  float d=length(p)-.16-.05*P;if(d<m.x)m=vec2(d,3.);
  return m;
}
vec3 env(vec3 r){
  vec3 sky=mix(mix(C*.3,vec3(.8,.72,.6),r.y*.5+.5),mix(vec3(.05,.055,.07),vec3(.3),r.y*.5+.5),D);
  float box=smoothstep(.55,.95,r.y)*smoothstep(.9,.15,abs(r.x));
  float rim=smoothstep(.65,1.,r.x)+smoothstep(.75,1.,-r.y)*.4;
  return sky+vec3(1.,.96,.9)*box*1.2+A*rim*.8;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  float k=min(R.x,R.y);
  vec2 uv=(gl_FragCoord.xy*2.-R)/k;
  vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv,-2.6));
  float t=0.,md=1e3,mt=0.;vec2 h;
  for(int i=0;i<80;i++){h=map(ro+rd*t);if(h.x<md){md=h.x;mt=t;}if(h.x<.001||t>6.)break;t+=h.x;}
  float cov=1.-smoothstep(0.,3.*mt/(2.6*k),md);
  float g=(.18+.5*P)*exp(-pow(length(cross(rd,ro)),2.)*10.);
  vec3 col=vec3(0.);
  if(cov>0.){
    vec3 q=ro+rd*mt;vec2 e=vec2(.001,0.);float id=map(q).y;
    vec3 n=normalize(vec3(map(q+e.xyy).x-map(q-e.xyy).x,map(q+e.yxy).x-map(q-e.yxy).x,map(q+e.yyx).x-map(q-e.yyx).x));
    vec3 r=reflect(rd,n);float nv=max(dot(n,-rd),0.),fr=pow(1.-nv,3.);
    vec3 base=id<.5?C:id<1.5?mix(C,A,.35):id<2.5?mix(C,A,.65):A*(1.15+1.6*P);
    float lit=dot(n,normalize(vec3(-.4,.8,.6)))*.5+.5;
    vec3 shade=mix(mix(vec3(.36,.28,.2),vec3(.3,.31,.36),D),vec3(mix(1.,.93,D)),smoothstep(.1,.85+.1*D,lit));
    col=id>2.5?base+env(r)*.15:base*shade+env(r)*(.1+.45*fr);
    col+=(hash(gl_FragCoord.xy+fract(T))-.5)*.04;
  }
  gl_FragColor=vec4(col*cov+A*g*(1.-cov),max(cov,g*.9));
}`;

const rgb = (name: string) => {
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = String(probe.fillStyle).slice(1);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};

const palette = () => [...rgb("--ember"), ...rgb("--bone"), document.documentElement.dataset.theme === "dark" ? 1 : 0];

export default function GatewayCore({ className }: { className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { antialias: false });
    const hero = canvas?.closest("section");
    if (!canvas || !gl || !hero) return;

    const shader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(["R", "T", "S", "P", "D", "M", "A", "C"].map((n) => [n, gl.getUniformLocation(prog, n)]));

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let time = 0;
    let spin = 0;
    let vel = 0;
    let pulse = 0;
    let last = 0;
    let raf = 0;
    let visible = true;

    let goal = palette();
    let mix = goal;
    const colors = (k: number) => {
      mix = mix.map((v, i) => v + (goal[i] - v) * k);
      gl.uniform3fv(u.A, mix.slice(0, 3));
      gl.uniform3fv(u.C, mix.slice(3, 6));
      gl.uniform1f(u.D, mix[6]);
    };
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 1.75);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.R, canvas.width, canvas.height);
    };
    const draw = () => {
      gl.uniform1f(u.T, time);
      gl.uniform1f(u.S, spin);
      gl.uniform1f(u.P, pulse);
      gl.uniform2f(u.M, tilt.x, tilt.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const running = () => visible && !still && !document.documentElement.dataset.motion;
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      vel *= Math.exp(-dt * 1.4);
      spin += (0.4 + vel) * dt;
      pulse *= Math.exp(-dt * 3);
      tilt.x += (tilt.tx - tilt.x) * Math.min(1, dt * 4);
      tilt.y += (tilt.ty - tilt.y) * Math.min(1, dt * 4);
      colors(Math.min(1, dt * 7));
      draw();
      raf = running() ? requestAnimationFrame(frame) : 0;
    };
    const start = () => {
      if (raf || !running()) return draw();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      tilt.tx = (e.clientX / innerWidth) * 2 - 1;
      tilt.ty = (e.clientY / innerHeight) * 2 - 1;
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      vel += 5;
      pulse = 1;
    };
    const onGate = () => {
      pulse = Math.max(pulse, 0.45);
    };

    colors(1);
    size();
    start();
    const resize = new ResizeObserver(() => {
      size();
      draw();
    });
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    const watch = new MutationObserver(() => {
      goal = palette();
      if (!running()) colors(1);
      start();
    });
    resize.observe(canvas);
    seen.observe(canvas);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-motion"] });
    addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerdown", onDown);
    hero.addEventListener("gate", onGate);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      watch.disconnect();
      removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      hero.removeEventListener("gate", onGate);
    };
  }, []);

  return <canvas ref={ref} className={className} data-parallax="30" aria-hidden="true" />;
}
