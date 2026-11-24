"use client";

import { useEffect, useRef } from "react";

const vert = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const shapes = {
  gateway: `
  vec2 m=vec2(tor(rx(1.5708+.45*sin(S*.45))*rz(.35*cos(S*.35))*p,1.,.07),0.);
  m=near(m,tor(rx(1.5708)*ry(S*.9)*p,.76,.06),1.);
  m=near(m,tor(rz(1.5708)*rx(S*1.3+.8)*p,.54,.05),2.);
  return near(m,length(p)-.16-.05*P,3.);`,
  lattice: `
  p=ry(S*.45)*rx(.4)*p;
  vec3 q=p*5.2;
  float g=abs(dot(sin(q),cos(q.yzx)))/5.2-.03;
  float o=abs(length(p)-.98)-.06,h=max(.05-abs(g-o),0.);
  vec2 m=vec2((max(g,o)+h*h*5.)*.5,0.);
  return near(m,length(p)-.36-.06*P+.02*sin(T*2.),3.);`,
  watch: `
  p=ry(.55*sin(S*.5))*rx(-.35)*p*1.17;
  vec2 m=vec2(tor(rx(1.5708)*p,1.,.075),0.);
  m=near(m,tor(rx(1.5708)*p,.86,.018),2.);
  float s=.5236,a=mod(atan(p.y,p.x)+s*.5,s)-s*.5,l=length(p.xy);
  vec2 k=l*vec2(cos(a),sin(a));
  m=near(m,box(vec3(k-vec2(.7,0.),p.z),vec3(.07,.018,.02))-.008,1.);
  vec3 h=rz(S*.12)*p,n=rz(S*1.44)*p;
  m=near(m,box(h-vec3(0.,.2,.05),vec3(.022,.22,.014))-.012,0.);
  m=near(m,box(n-vec3(0.,.28,.1),vec3(.014,.32,.01))-.01,0.);
  m=near(m,box(p-vec3(0.,1.13,0.),vec3(.06,.07,.06))-.02,2.);
  m=near(m,length(p-vec3(0.,0.,.1))-.06-.02*P,3.);
  return vec2(m.x*.85,m.y);`,
  links: `
  p=rz(1.5708+.12*sin(S*.8))*ry(S*.7)*p*.74;
  vec2 m=vec2(link(p),1.);
  m=near(m,link(ry(1.5708)*(p-vec3(0.,.66,0.))),0.);
  return near(m,link(ry(1.5708)*(p+vec3(0.,.66,0.))),2.);`,
  planet: `
  p*=1.16;
  vec3 s=rz(.35)*ry(S*.5)*p,q=rz(-.32+.05*sin(S*.6))*rx(.42)*p;
  float lat=s.y/.66,r=length(q.xz);
  vec2 m=vec2((length(s)-.64-.012*smoothstep(.2,.8,sin(lat*21.))*(1.-lat*lat))*.8,0.);
  m=near(m,length(max(abs(vec2(r-.98,q.y))-vec2(.1,.006),0.))-.012,1.);
  m=near(m,length(max(abs(vec2(r-1.2,q.y))-vec2(.045,.004),0.))-.01,2.);
  m=near(m,length(q-vec3(1.2*cos(S*1.1),0.,1.2*sin(S*1.1)))-.075,3.);
  return vec2(m.x*.86,m.y);`,
  bowtie: `
  p=ry(.5*sin(S*.7))*rx(.12*sin(S*.9))*p;
  float x=abs(p.x),f=smoothstep(.1,1.05,x);
  float th=.09+.1*f+.022*cos(p.y*17.)*smoothstep(.85,.15,x);
  float wing=(box(vec3(x-.62,p.y,p.z),vec3(.45,.1+.4*f,max(.02,th-.05)))-.06)*.55;
  vec2 m=vec2(wing,0.);
  return near(m,box(p,vec3(.12,.15,.17))-.07,0.);`,
};

type Shape = keyof typeof shapes;

const frag = (shape: Shape, light: boolean) => `#define STEPS ${light ? 56 : 96}
#define LIMIT ${shape === "links" ? "5." : "1.7"}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T,S,P,D;uniform vec2 M;uniform vec3 A,C;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
float tor(vec3 p,float r0,float r){return length(vec2(length(p.xz)-r0,p.y))-r;}
float box(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
float link(vec3 p){return length(vec2(length(vec2(p.x,max(abs(p.y)-.2,0.)))-.27,p.z))-.085;}
vec2 near(vec2 m,float d,float id){return d<m.x?vec2(d,id):m;}
vec2 map(vec3 p){
  p=rx(M.y*.5)*ry(M.x*.7)*p;${shapes[shape]}
}
vec3 env(vec3 r){
  vec3 sky=mix(mix(C*.3,vec3(.72,.76,.84),r.y*.5+.5),mix(vec3(.05,.055,.07),vec3(.3),r.y*.5+.5),D);
  float box=smoothstep(.55,.95,r.y)*smoothstep(.9,.15,abs(r.x));
  float rim=smoothstep(.65,1.,r.x)+smoothstep(.75,1.,-r.y)*.4;
  return sky+vec3(1.,.96,.9)*box*1.2+A*rim*.8;
}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  float k=min(R.x,R.y);
  vec2 uv=(gl_FragCoord.xy*2.-R)/k;
  vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(uv,-2.6));
  float near2=dot(cross(rd,ro),cross(rd,ro));
  if(near2>LIMIT){gl_FragColor=vec4(0.);return;}
  float t=1.2,md=1e3,mt=1.2;vec2 h;
  for(int i=0;i<STEPS;i++){h=map(ro+rd*t);if(h.x<md){md=h.x;mt=t;}if(h.x<.001||t>6.)break;t+=h.x;}
  float cov=1.-smoothstep(0.,3.*mt/(2.6*k),md);
  float g=(.18+.5*P)*exp(-near2*10.);
  vec3 col=vec3(0.);
  if(cov>0.){
    vec3 q=ro+rd*mt;vec2 e=vec2(.001,0.);float id=map(q).y;
    vec3 n=normalize(vec3(map(q+e.xyy).x-map(q-e.xyy).x,map(q+e.yxy).x-map(q-e.yxy).x,map(q+e.yyx).x-map(q-e.yyx).x));
    vec3 r=reflect(rd,n);float nv=max(dot(n,-rd),0.),fr=pow(1.-nv,3.);
    float lit=dot(n,normalize(vec3(-.4,.8,.6)))*.5+.5;
    vec3 base=id<.5?C:id<1.5?mix(C,A,.35):id<2.5?mix(C,A,.65):id<3.5?A*(mix(.7,1.,smoothstep(0.,.8,lit))+1.6*P):C;
    vec3 shade=mix(mix(vec3(.4,.42,.5),vec3(.3,.31,.36),D),vec3(mix(1.,.93,D)),smoothstep(.1,.85+.1*D,lit));
    col=id>3.5?base*shade*.75+env(r)*.5+env(refract(rd,n,.6))*.35:id>2.5?base+env(r)*.15:base*shade+env(r)*(.1+.45*fr);
    col+=(hash(gl_FragCoord.xy+fract(T))-.5)*.04;
  }
  vec2 edge=smoothstep(vec2(1.),vec2(.93),abs(uv)*k/R);
  gl_FragColor=vec4(col*cov+A*g*(1.-cov),max(cov,g*.9))*edge.x*edge.y;
}`;

const rgb = (name: string) => {
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = String(probe.fillStyle).slice(1);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};

const palette = (tone: string) => [...rgb("--ember"), ...rgb(tone), document.documentElement.dataset.theme === "dark" ? 1 : 0];

function mount(canvas: HTMLCanvasElement, shape: Shape, tone: string) {
  const gl = canvas.getContext("webgl", { antialias: false });
  const host = canvas.closest("section");
  if (!gl || !host) return;

  const coarse = matchMedia("(pointer: coarse)").matches;
  const shader = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag(shape, coarse)));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
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
  let quality = 1;
  let slow = 0;
  let visible = true;

  let goal = palette(tone);
  let mix = goal;
  const colors = (k: number) => {
    mix = mix.map((v, i) => v + (goal[i] - v) * k);
    gl.uniform3fv(u.A, mix.slice(0, 3));
    gl.uniform3fv(u.C, mix.slice(3, 6));
    gl.uniform1f(u.D, mix[6]);
  };
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 1.75) * quality;
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
    if (coarse && now - last < 30) {
      raf = requestAnimationFrame(frame);
      return;
    }
    slow = now - last > 48 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 12 && quality > 0.5) {
      quality -= 0.15;
      slow = 0;
      size();
    }
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
    if (!visible || e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    tilt.tx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (innerWidth * 0.4)));
    tilt.ty = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (innerHeight * 0.4)));
  };
  const onClick = (e: MouseEvent) => {
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
    goal = palette(tone);
    if (!running()) colors(1);
    start();
  });
  resize.observe(canvas);
  seen.observe(canvas);
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-motion"] });
  addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("click", onClick);
  host.addEventListener("gate", onGate);
  return () => {
    cancelAnimationFrame(raf);
    gl.deleteProgram(prog);
    gl.deleteBuffer(quad);
    resize.disconnect();
    seen.disconnect();
    watch.disconnect();
    removeEventListener("pointermove", onMove);
    host.removeEventListener("click", onClick);
    host.removeEventListener("gate", onGate);
  };
}

export default function Sculpture({ shape, className, tone = "--bone" }: { shape: Shape; className: string; tone?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let stop: (() => void) | undefined;
    const close = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        close.disconnect();
        stop = mount(canvas, shape, tone);
      },
      { rootMargin: "60%" },
    );
    const lost = (e: Event) => {
      e.preventDefault();
      stop?.();
    };
    const restored = () => {
      stop = mount(canvas, shape, tone);
    };
    close.observe(canvas);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      close.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      stop?.();
    };
  }, [shape, tone]);

  return <canvas ref={ref} className={className} data-parallax="30" aria-hidden="true" />;
}
