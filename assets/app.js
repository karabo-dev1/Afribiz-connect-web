(() => {
'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB = innerWidth < 760;
const FINE = matchMedia('(pointer:fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sm = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ================= content ================= */
const CH = [
  { n: 'Genesis', l: 'Home' }, { n: 'Origin', l: 'About' }, { n: 'Core', l: 'Services' }, { n: 'Signal', l: 'Awards' },
  { n: 'Network', l: 'Clients' }, { n: 'Crew', l: 'Team' }, { n: 'Portal', l: 'Contact' }];

const TIERS = [
  { k: 'foundations', n: 'Foundations', t: 'Tier 1', d: 'Look professional, get found and get legally set up.',
    items: [['Graphic design'], ['Brand photography'], ['Brand videography'], ['Social media management'], ['Google packages', 'Accredited affiliate of Google'], ['Business registration']],
    anchor: [-1.25, 0.8, 0.4] },
  { k: 'growth', n: 'Growth', t: 'Tier 2', d: 'Turn attention into enquiries with a site and strategy that perform.',
    items: [['Websites'], ['Digital audit & strategy'], ['SEO']], anchor: [1.3, 0.55, 0.3] },
  { k: 'intelligence', n: 'Intelligence', t: 'Tier 3', d: 'Systems, data and AI that run and scale the business.',
    items: [['AI & chatbots'], ['Data pipelines'], ['Cybersecurity'], ['Apps'], ['CRM'], ['Brand architecture'], ['PR & events'], ['3D mapping']], anchor: [0.15, -0.8, 1.0] }];

// Award names outside South Africa were not in the spec: placeholders are marked for the team to fill in.
const AWARDS = [
  { c: 'South Africa', ll: [-26.2, 28.0], list: [
    ['Hands Up For Small Business — Owner Winner', 'Nedbank · South Africa'],
    ['Forty Under 40 — 1st Runner Up, Telecom, Mobile & Software Development', 'Forty Under 40 South Africa'],
    ['KZN Youth Business Awards — Technology', 'Hollywood Bets Foundation · Ballito']] },
  { c: 'United Kingdom', ll: [52.5, -1.5], list: [['International award', 'Details to be added'], ['International award', 'Details to be added']] },
  { c: 'Nigeria', ll: [9.0, 7.5], list: [['Continental award', 'Details to be added']] },
  { c: 'Ghana', ll: [7.9, -1.0], list: [['Continental award', 'Details to be added']] },
  { c: 'Africa', ll: [3.0, 22.0], list: [['Pan-African award', 'Details to be added']] }];

const NAMED_CLIENTS = ['Shell', 'SPAR', 'Engen', 'Zakhele Granite & Tombstone', 'Elle Fitness Club', 'New Identity', 'iZibalo', 'Hotshots Nite Club'];
const MAJORS = ['Shell', 'SPAR', 'Engen'];
const CLIENTS = Array.from({ length: 131 }, (_, i) => NAMED_CLIENTS[i] || ('Client ' + String(i + 1).padStart(3, '0')));

const CREW = [
  ['Josh Indarjee', 'Director', 'Navigator', 'The full-time flux capacitor powering the entire operation.'],
  ['Morne Esterhuyizen', 'AI Specialist', 'Oracle', 'Engineers AI tools and chatbots, and streamlines how businesses run.'],
  ['Craige Dean Kavirayan', 'Cybersecurity Specialist', 'Shield', 'Keeps client systems, data and brands locked down.'],
  ['Nathan Goldstone', 'Developer', 'Code Whisperer', 'Builds the sites, apps and platforms clients run on.'],
  ['Crew member', 'Graphic Designer', 'Visual', 'Logos, identities and everything a brand is seen through.'],
  ['Crew member', 'Brand Photographer', 'Lens', 'Product, people and place, shot for the brand.'],
  ['Crew member', 'Videographer', 'Motion', 'Brand films and social video from script to edit.'],
  ['Crew member', 'Social Media Manager', 'Voice', 'Runs the channels and the calendar behind them.'],
  ['Crew member', 'Web Developer', 'Builder', 'Fast, findable websites that turn visits into enquiries.'],
  ['Crew member', 'SEO Specialist', 'Compass', 'Gets clients found on the searches that matter.'],
  ['Crew member', 'Data Engineer', 'Pipeline', 'Moves and shapes the data that decisions run on.'],
  ['Crew member', 'CRM Specialist', 'Connector', 'Sets up the systems that keep customers coming back.'],
  ['Crew member', 'Digital Strategist', 'Strategist', 'Audits where a business is and maps where it goes next.'],
  ['Crew member', 'PR & Events', 'Amplifier', 'Launches, events and the stories told about them.'],
  ['Crew member', '3D Mapping Artist', 'Projector', 'Projection mapping that turns buildings into stages.'],
  ['Crew member', 'Business Registration', 'Founder', 'Gets new businesses legally set up and compliant.'],
  ['Crew member', 'Brand Architect', 'Architect', 'Structures brand families so every piece fits.']];

/* ================= particle forms ================= */
let seed = 7;
const R = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const g = () => (R() + R() + R() + R() - 2) / 1.15;
const TAU = Math.PI * 2, DEG = Math.PI / 180;
const hex = h => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const mixC = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const C = {
  mag: hex('#E8306A'), ora: hex('#F08A1C'), navy: hex('#1A2440'), gray: hex('#8D99AD'), faint: hex('#A9B8FF'),
  teal: hex('#1490A8'), sky: hex('#22D3EE'), blue: hex('#3B6BF6'), violet: hex('#7C5CFF'), pink: hex('#F472B6'), deep: hex('#0E7C93')
};
const N = MOB ? 14000 : 34000;

function make(fn) {
  const p = new Float32Array(N * 3), c = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const r = fn(i); p[i * 3] = r[0]; p[i * 3 + 1] = r[1]; p[i * 3 + 2] = r[2]; c.set(r[3], i * 3); }
  return { p, c };
}

const nebula = () => make(() => {
  const r = Math.pow(R(), .6) * 6, a = R() * TAU, b = Math.acos(2 * R() - 1);
  const t = R();
  return [r * Math.sin(b) * Math.cos(a) * 1.4, r * Math.cos(b) * .8, r * Math.sin(b) * Math.sin(a) - 2,
    t < .3 ? C.violet : t < .55 ? C.blue : t < .75 ? C.pink : t < .9 ? C.sky : C.gray];
});

const ring = () => make(() => {
  const r = R(); let a, rad, col, th = .085;
  if (r < .45) { const t = R(); a = (80 - t * 230) * DEG; rad = 2.55; col = mixC(C.mag, C.ora, t); }
  else if (r < .6) { a = (152 + R() * 60) * DEG; rad = 2.55; col = C.gray; }
  else if (r < .95) { a = (48 + R() * 264) * DEG; rad = 1.55; col = C.navy; }
  else { a = R() * TAU; rad = 3.35; col = C.gray; th = .03; }
  const rr = rad + g() * th;
  return [Math.cos(a) * rr, Math.sin(a) * rr, g() * .12, col];
});

const blocks = [];
for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) {
  if (R() < .12) continue;
  const d = Math.hypot(x, z);
  blocks.push({ x: x * .62, z: z * .62, w: .2 + R() * .1, h: (.3 + Math.pow(R(), 1.5) * 2.3) * (1.25 - d / 6) });
}
const city = () => make(() => {
  const b = blocks[(R() * blocks.length) | 0], r = R(), base = -1.3;
  let x, y, z, col = R() < .5 ? C.teal : C.deep;
  if (r < .38) { x = b.x + (R() < .5 ? -b.w : b.w); z = b.z + (R() < .5 ? -b.w : b.w); y = R() * b.h; }
  else if (r < .7) {
    const fl = Math.floor(R() * Math.max(1, b.h / .16)) * .16, e = R() * 4, t = R() * 2 - 1;
    y = fl; if (e < 1) { x = b.x + t * b.w; z = b.z - b.w; } else if (e < 2) { x = b.x + t * b.w; z = b.z + b.w; } else if (e < 3) { x = b.x - b.w; z = b.z + t * b.w; } else { x = b.x + b.w; z = b.z + t * b.w; }
  } else if (r < .88) {
    y = R() * b.h; const face = R() < .5; x = b.x + (face ? (R() * 2 - 1) * b.w : b.w); z = b.z + (face ? b.w : (R() * 2 - 1) * b.w);
    col = R() < .3 ? C.sky : C.teal;
  } else { const t = R() * 4.4 - 2.2; if (R() < .5) { x = t; z = Math.round(R() * 6 - 3) * .62 + .31; } else { z = t; x = Math.round(R() * 6 - 3) * .62 + .31; } y = 0; col = C.faint; }
  return [x + g() * .01, base + y, z + g() * .01, col];
});

const brain = () => make(() => {
  const r = R();
  if (r < .78) {
    const a = R() * TAU, b = Math.acos(2 * R() - 1);
    let x = Math.sin(b) * Math.cos(a), y = Math.cos(b), z = Math.sin(b) * Math.sin(a);
    let rr = 1 + .08 * Math.sin(x * 11) * Math.sin(y * 9) * Math.sin(z * 12) + .05 * Math.sin(x * 23 + z * 17);
    rr *= Math.pow(R(), .15);
    x = x * 1.15 * rr; y = y * 1.0 * rr; z = z * 1.45 * rr;
    x += Math.sign(x) * .07;
    return [x, y + .2, z, R() < .7 ? C.teal : (R() < .5 ? C.sky : C.blue)];
  } else if (r < .9) {
    const a = R() * TAU, b = Math.acos(2 * R() - 1);
    return [Math.sin(b) * Math.cos(a) * .7, -.62 + Math.cos(b) * .32, -.85 + Math.sin(b) * Math.sin(a) * .45, R() < .7 ? C.pink : C.mag];
  } else {
    const t = R(), a = R() * TAU, rad = .16 * (1 - t * .3);
    return [Math.cos(a) * rad, -.4 - t * 1.4, -.4 - t * .25 + Math.sin(a) * rad, C.teal];
  }
});

const LAND = [[17, 10, 25, 20], [24, -14, 13, 19], [46, -19, 3, 6], [15, 50, 18, 9], [-3, 54, 4, 5], [90, 48, 48, 18], [102, 22, 22, 12], [78, 20, 7, 10], [46, 24, 9, 8],
  [-102, 46, 30, 16], [-95, 22, 10, 8], [-60, -14, 14, 22], [-70, -40, 6, 10], [134, -25, 17, 10], [-42, 72, 14, 8]];
const isLand = (lat, lon) => LAND.some(([cx, cy, rx, ry]) => { const n = .12 * Math.sin(lon * .3) * Math.cos(lat * .27); return ((lon - cx) / rx) ** 2 + ((lat - cy) / ry) ** 2 < 1 + n; });
const llv = (lat, lon, r) => { const a = lat * DEG, b = lon * DEG; return [r * Math.cos(a) * Math.sin(b), r * Math.sin(a), r * Math.cos(a) * Math.cos(b)]; };
const GR = 2.2;
const globe = () => {
  const src = llv(AWARDS[0].ll[0], AWARDS[0].ll[1], 1);
  return make(() => {
    const r = R();
    if (r < .74) {
      let lat, lon; do { lat = Math.asin(2 * R() - 1) / DEG; lon = R() * 360 - 180; } while (!isLand(lat, lon));
      const v = llv(lat, lon, GR); return [...v, R() < .8 ? C.teal : C.sky];
    } else if (r < .86) {
      const lat = Math.asin(2 * R() - 1) / DEG, lon = R() * 360 - 180; return [...llv(lat, lon, GR), C.faint];
    } else {
      const k = 1 + ((R() * (AWARDS.length - 1)) | 0), dst = llv(AWARDS[k].ll[0], AWARDS[k].ll[1], 1), t = R();
      let v = [lerp(src[0], dst[0], t), lerp(src[1], dst[1], t), lerp(src[2], dst[2], t)]; const L = Math.hypot(...v);
      const h = GR * (1 + .28 * Math.sin(t * Math.PI));
      return [v[0] / L * h, v[1] / L * h, v[2] / L * h, mixC(C.ora, C.mag, t)];
    }
  });
};

const STARS = Array.from({ length: 131 }, () => [(R() * 2 - 1) * (MOB ? 3.4 : 8.6), (R() * 2 - 1) * (MOB ? 5 : 4.4), -R() * 5 + 1]);
const NEI = STARS.map((s, i) => STARS.map((t, j) => [j, Math.hypot(s[0] - t[0], s[1] - t[1], s[2] - t[2])]).filter(x => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).map(x => x[0]));
const SCOL = [C.blue, C.violet, C.pink, C.ora, C.sky, C.mag];
const constellation = () => make(() => {
  const r = R(), i = (R() * 131) | 0, s = STARS[i];
  if (r < .3) return [s[0] + g() * .05, s[1] + g() * .05, s[2] + g() * .05, SCOL[i % 6]];
  if (r < .6) { const t = STARS[NEI[i][R() < .5 ? 0 : 1]], k = R(); return [lerp(s[0], t[0], k), lerp(s[1], t[1], k), lerp(s[2], t[2], k), C.faint]; }
  return [(R() * 2 - 1) * 11, (R() * 2 - 1) * 6.5, -R() * 8 + 1, R() < .5 ? C.faint : C.gray];
});

const orbit = () => make(() => {
  const a = R() * TAU, rr = 4.4 + g() * .32;
  return [Math.cos(a) * rr * (MOB ? .62 : 1), g() * .1, Math.sin(a) * rr * .8, R() < .65 ? C.teal : (R() < .5 ? C.pink : C.sky)];
});

const vortex = () => make(() => {
  const arm = (R() * 4) | 0, t = Math.pow(R(), .8), a = arm * TAU / 4 + t * 4.2 * Math.PI, rad = 5.4 * (1 - t) + .15;
  const sp = .12 + (1 - t) * .3;
  return [Math.cos(a) * rad + g() * sp, Math.sin(a) * rad + g() * sp, -t * 7, t < .33 ? C.pink : t < .66 ? C.violet : C.blue];
});

const FORMS = [nebula(), ring(), city(), brain(), globe(), constellation(), orbit(), vortex()];
// per-form placement: offset, scale, tilt [x,y,z], spin rad/s [y,z]
const FP = [
  { off: [0, 0, 0], s: 1, tilt: [0, 0, 0], spin: [.05, 0], ms: .7 },
  { off: [2.6, 0, 0], s: .82, tilt: [0, 0, 0], spin: [0, 0], ms: .7 },
  { off: [-2.4, -.2, 0], s: 1, tilt: [.5, 0, 0], spin: [.1, 0], ms: .7 },
  { off: [.8, 0, 0], s: 1.3, tilt: [.12, 0, 0], spin: [.1, 0], ms: .85 },
  { off: [-2.3, 0, 0], s: 1, tilt: [.3, -.32, 0], spin: [0, 0], ms: .72 },
  { off: [0, 0, 0], s: 1, tilt: [0, 0, 0], spin: [0, .012], ms: 1 },
  { off: [0, -1.1, -1], s: 1, tilt: [.42, 0, 0], spin: [.06, 0], ms: 1 },
  { off: [0, 0, -1.2], s: 1.25, tilt: [0, 0, 0], spin: [0, .12], ms: .8 }];
const offOf = f => MOB && f !== 5 && f !== 7 ? [0, f === 6 ? .4 : 1.55, FP[f].off[2]] : FP[f].off;
const scaleOf = f => MOB ? FP[f].s * FP[f].ms : FP[f].s;

/* ================= scene ================= */
const canvas = $('#scene');
let renderer = null, GL = false;
try {
  if (window.THREE) {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !MOB, powerPreference: 'high-performance' });
    GL = !!renderer.getContext();
  }
} catch (e) { GL = false; }
if (!GL) document.documentElement.classList.add('nogl');

let scene, camera, pts, pmat, pgeo, nn, streaks, grid, gizmo, sig;
const ang = FP.map(() => ({ y: 0, z: 0 }));
const drag = FP.map(() => ({ y: 0, p: 0, vy: 0, vp: 0 }));
const M3 = [null, null];
let pairA = -1, pairB = -1;

if (GL) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, MOB ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(MOB ? 58 : 45, innerWidth / innerHeight, .1, 200);
  camera.position.set(0, 0, 24);
  M3[0] = new THREE.Matrix3(); M3[1] = new THREE.Matrix3();

  pgeo = new THREE.BufferGeometry();
  const aR = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) { aR[i * 4] = R(); aR[i * 4 + 1] = .55 + R() * .9; aR[i * 4 + 2] = R(); aR[i * 4 + 3] = R(); }
  pgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  pgeo.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  pgeo.setAttribute('cA', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  pgeo.setAttribute('cB', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
  pgeo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));
  pmat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uMix: { value: 0 }, uTime: { value: 0 }, uBurst: { value: RM ? 0 : 1 }, uPix: { value: renderer.getPixelRatio() }, uSize: { value: MOB ? 3.4 : 2.7 },
      uOffA: { value: new THREE.Vector3() }, uOffB: { value: new THREE.Vector3() }, uScaleA: { value: 1 }, uScaleB: { value: 1 },
      uRotA: { value: M3[0] }, uRotB: { value: M3[1] },
      uWaveC: { value: new THREE.Vector3() }, uWave: { value: 0 }, uWaveR: { value: 0 },
      uGravP: { value: new THREE.Vector3() }, uGravS: { value: 0 }
    },
    vertexShader: `
      attribute vec3 aB; attribute vec3 cA; attribute vec3 cB; attribute vec4 aR;
      uniform float uMix,uTime,uBurst,uPix,uSize,uScaleA,uScaleB,uWave,uWaveR,uGravS;
      uniform vec3 uOffA,uOffB,uWaveC,uGravP; uniform mat3 uRotA,uRotB;
      varying vec3 vC; varying float vA;
      void main(){
        float m = clamp((uMix - aR.x*0.45)/0.55, 0.0, 1.0);
        m = m < 0.5 ? 4.0*m*m*m : 1.0 - pow(-2.0*m + 2.0, 3.0)/2.0;
        vec3 pA = uOffA + uRotA*(position*uScaleA);
        vec3 pB = uOffB + uRotB*(aB*uScaleB);
        vec3 p = mix(pA, pB, m);
        float burst = sin(m*3.14159)*uBurst;
        vec3 fl = vec3(sin(p.y*1.3 + uTime*.7 + aR.w*6.0), sin(p.z*1.1 + uTime*.6 + aR.w*4.0), cos(p.x*1.2 + uTime*.5 + aR.z*5.0));
        p += fl*burst*1.25;
        p += 0.025*uBurst*vec3(sin(uTime*.8 + aR.z*6.28), cos(uTime*.7 + aR.z*6.28), sin(uTime*.6 + aR.w*6.28));
        vec3 col = mix(cA, cB, m);
        vec3 dv = p - uWaveC; float d = length(dv);
        float wv = uWave*exp(-pow((d - uWaveR)*2.6, 2.0));
        p += dv/(d + 0.001)*wv*0.55;
        col = mix(col, vec3(0.23,0.42,0.96), clamp(wv*1.6, 0.0, 1.0));
        vec3 gv = uGravP - p; float gd = length(gv);
        float gs = uGravS*exp(-gd*gd*0.16);
        vec3 sw = normalize(cross(gv, vec3(0.0,0.0,1.0)) + 1e-4);
        p += (gv/(gd + 0.001)*min(gd, 1.2)*0.8 + sw*0.7)*gs;
        col = mix(col, vec3(0.91,0.19,0.42), clamp(gs, 0.0, 1.0)*0.85);
        vec4 mv = modelViewMatrix*vec4(p, 1.0);
        gl_Position = projectionMatrix*mv;
        gl_PointSize = uSize*aR.y*uPix*(8.0/max(-mv.z, 0.5));
        vC = col; vA = 0.82;
      }`,
    fragmentShader: `
      varying vec3 vC; varying float vA;
      void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c); if(d > 0.5) discard;
        gl_FragColor = vec4(vC, vA*smoothstep(0.5, 0.15, d)); }`
  });
  pts = new THREE.Points(pgeo, pmat); pts.frustumCulled = false; scene.add(pts);

  /* neural network */
  const NNn = MOB ? 80 : 160, npos = [], ncol = new Float32Array(NNn * 3), nfire = new Float32Array(NNn);
  for (let i = 0; i < NNn; i++) { npos.push([(R() * 2 - 1) * 12, (R() * 2 - 1) * 7, -3 - R() * 7]); ncol.set(R() < .55 ? C.violet : C.sky, i * 3); }
  const links = [], adj = npos.map(() => []);
  npos.forEach((a, i) => {
    npos.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])]).filter(x => x[0] !== i).sort((x, y) => x[1] - y[1]).slice(0, 3)
      .forEach(([j]) => { if (!links.some(l => (l[0] === j && l[1] === i))) { adj[i].push(links.length); adj[j].push(links.length); links.push([i, j]); } });
  });
  const lpos = new Float32Array(links.length * 6);
  links.forEach(([a, b], k) => { lpos.set(npos[a], k * 6); lpos.set(npos[b], k * 6 + 3); });
  const lgeo = new THREE.BufferGeometry(); lgeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
  const lmat = new THREE.LineBasicMaterial({ color: 0x7C5CFF, transparent: true, opacity: .08, depthWrite: false });
  const lines = new THREE.LineSegments(lgeo, lmat);
  const dotMat = () => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uPix: { value: renderer.getPixelRatio() }, uWake: { value: 0 }, uBase: { value: 3 } },
    vertexShader: `attribute float aF; attribute vec3 aC; uniform float uPix,uWake,uBase; varying vec3 vC; varying float vF;
      void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv;
        gl_PointSize = (uBase + aF*6.0 + uWake*2.0)*uPix*(10.0/max(-mv.z,0.5)); vC = aC; vF = aF; }`,
    fragmentShader: `varying vec3 vC; varying float vF; void main(){ float d = length(gl_PointCoord-0.5); if(d>0.5) discard;
        gl_FragColor = vec4(vC, (0.28 + vF*0.7)*smoothstep(0.5,0.1,d)); }`
  });
  const ngeo = new THREE.BufferGeometry();
  ngeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(npos.flat()), 3));
  ngeo.setAttribute('aC', new THREE.BufferAttribute(ncol, 3));
  ngeo.setAttribute('aF', new THREE.BufferAttribute(nfire, 1));
  const nmat = dotMat(); const neurons = new THREE.Points(ngeo, nmat); neurons.frustumCulled = false;
  const S = MOB ? 36 : 70, spos = new Float32Array(S * 3), scol = new Float32Array(S * 3), sf = new Float32Array(S).fill(1);
  for (let i = 0; i < S; i++) scol.set(R() < .5 ? C.sky : C.violet, i * 3);
  const sgeo = new THREE.BufferGeometry();
  sgeo.setAttribute('position', new THREE.BufferAttribute(spos, 3)); sgeo.setAttribute('aC', new THREE.BufferAttribute(scol, 3)); sgeo.setAttribute('aF', new THREE.BufferAttribute(sf, 1));
  const smat = dotMat(); smat.uniforms.uBase.value = 1.5; const signals = new THREE.Points(sgeo, smat); signals.frustumCulled = false;
  const sigs = Array.from({ length: S }, () => { const l = (R() * links.length) | 0; return { l, t: R(), dir: R() < .5 ? 1 : -1, sp: .25 + R() * .4 }; });
  nn = { npos, links, adj, nfire, ngeo, sgeo, spos, sigs, lmat, nmat, smat, group: new THREE.Group() };
  nn.group.add(lines, neurons, signals); scene.add(nn.group);

  /* hyperspace streaks */
  const SK = MOB ? 600 : 1200, kpos = new Float32Array(SK * 6), kd = [];
  for (let i = 0; i < SK; i++) { const a = R() * TAU, r = 2.5 + R() * 12; kd.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: -40 + R() * 46, s: .6 + R() * .8 }); }
  const kgeo = new THREE.BufferGeometry(); kgeo.setAttribute('position', new THREE.BufferAttribute(kpos, 3));
  const kmat = new THREE.LineBasicMaterial({ color: 0x3B6BF6, transparent: true, opacity: 0, depthWrite: false });
  streaks = { mesh: new THREE.LineSegments(kgeo, kmat), kd, kpos, kgeo, kmat }; streaks.mesh.frustumCulled = false; scene.add(streaks.mesh);

  /* grid floor */
  grid = new THREE.GridHelper(90, 90, 0x3B6BF6, 0x3B6BF6);
  grid.material.transparent = true; grid.material.opacity = 0; grid.material.depthWrite = false; grid.position.set(0, -4.2, -8); scene.add(grid);

  /* gizmo rings */
  gizmo = new THREE.Group();
  [[0x3B6BF6, 3.9, 1.1, .2], [0x22D3EE, 3.15, 3.15, -.5], [0xE8306A, 3.45, 2.6, .9]].forEach(([col, rx, ry, rot], k) => {
    const cv = new THREE.EllipseCurve(0, 0, rx, ry, 0, TAU).getPoints(160);
    const geo = new THREE.BufferGeometry().setFromPoints(cv.map(p => new THREE.Vector3(p.x, p.y, 0)));
    const mat = new THREE.LineDashedMaterial({ color: col, dashSize: k === 0 ? .32 : .08, gapSize: k === 0 ? .2 : .12, transparent: true, opacity: 0, depthWrite: false });
    const ln = new THREE.Line(geo, mat); ln.computeLineDistances(); ln.rotation.set(k === 0 ? 1.25 : .3 * k, rot, 0); gizmo.add(ln);
  });
  scene.add(gizmo);
}

function ensurePair(a, b) {
  if (!GL || (a === pairA && b === pairB)) return;
  const at = pgeo.attributes;
  if (a !== pairA) { at.position.array.set(FORMS[a].p); at.cA.array.set(FORMS[a].c); at.position.needsUpdate = at.cA.needsUpdate = true; }
  if (b !== pairB) { at.aB.array.set(FORMS[b].p); at.cB.array.set(FORMS[b].c); at.aB.needsUpdate = at.cB.needsUpdate = true; }
  pairA = a; pairB = b;
}

const _e = window.THREE ? new THREE.Euler() : null, _m4 = window.THREE ? new THREE.Matrix4() : null;
function formMat(f, out) {
  _e.set(FP[f].tilt[0] + drag[f].p, FP[f].tilt[1] + ang[f].y + drag[f].y, ang[f].z, 'XYZ');
  _m4.makeRotationFromEuler(_e); out.setFromMatrix4(_m4); return out;
}
const _v = window.THREE ? new THREE.Vector3() : null;
const _tmp3 = window.THREE ? new THREE.Matrix3() : null;
function worldOf(f, local, out) {
  formMat(f, _tmp3); const o = offOf(f);
  return out.set(local[0], local[1], local[2]).multiplyScalar(scaleOf(f)).applyMatrix3(_tmp3).add(_v.set(o[0], o[1], o[2]));
}
function toScreen(v) { const p = v.clone().project(camera); return [(p.x + 1) / 2 * innerWidth, (1 - p.y) / 2 * innerHeight, p.z]; }
function pointerWorld(px, py, out) {
  const n = new THREE.Vector3(px / innerWidth * 2 - 1, -(py / innerHeight) * 2 + 1, .5).unproject(camera).sub(camera.position).normalize();
  const t = -camera.position.z / n.z; return out.copy(camera.position).addScaledVector(n, t);
}

/* ================= journey state ================= */
let entered = false, introT = RM ? 1 : 0, u = 0, uT = 0, wake = 0, wakeT = 0, aiBusy = false, listening = false;
let pointer = { x: innerWidth / 2, y: innerHeight / 2, in: false };
const zones = $$('.zone');
const flyEls = zones.map(z => $$('.fly', z));
const streamed = zones.map(() => false);
const announce = t => { $('#announce').textContent = t; };

function maxScroll() { return Math.max(1, document.documentElement.scrollHeight - innerHeight); }
function goTo(i, smooth = true) {
  const target = i === 0 ? 0 : (i + .22) / 6.5 * maxScroll();
  window.scrollTo({ top: target, behavior: smooth && !RM ? 'smooth' : 'auto' });
}
function curCh() { return clamp(Math.floor(u + .3), 0, 6); }
function vis(i) {
  const a = sm((u - (i - .22)) / .26);
  const b = i === 6 ? 1 : 1 - sm((u - (i + .38)) / .18);
  return Math.min(a, b);
}

/* token streaming */
$$('.stream').forEach(el => {
  const txt = el.textContent.trim(); el.setAttribute('aria-label', txt);
  el.innerHTML = '<span aria-hidden="true" style="display:inline;white-space:normal">' + txt.split(' ').map((w, i) => `<span style="--i:${i}">${esc(w)} </span>`).join('') + '</span>';
});
function restream(z) { if (RM) return; const s = $('.stream', zones[z]); if (!s) return; s.classList.remove('go'); void s.offsetWidth; s.classList.add('go'); }

/* ================= HUD ================= */
const dl = $('#depthlist');
CH.forEach((c, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<button aria-label="Go to ${c.n}, ${c.l}"><span>${String(i + 1).padStart(2, '0')} ${c.n} <em>${c.l}</em></span><i></i></button>`;
  li.querySelector('button').onclick = () => goTo(i);
  dl.appendChild(li);
});
const dlis = $$('li', dl);

/* ================= anchors ================= */
const anc = $('#anchors');
const tierEls = TIERS.map(t => {
  const b = document.createElement('button'); b.className = 'anc tier hide';
  b.setAttribute('aria-label', `${t.n}: ${t.items.length} services`);
  b.innerHTML = `<small>${t.t} · ${t.items.length} services</small><b>${t.n}</b><span>${t.d}</span>`;
  b.onclick = () => openPanel('tier', b, t.k); anc.appendChild(b); return b;
});
const beaconLocal = AWARDS.map(a => llv(a.ll[0], a.ll[1], GR * 1.02));
const beaconEls = AWARDS.map(a => {
  const b = document.createElement('button'); b.className = 'anc beacon hide';
  b.setAttribute('aria-label', `${a.c}: ${a.list.length} award${a.list.length > 1 ? 's' : ''}`);
  b.innerHTML = `<span>${a.c} · ${a.list.length}</span>`;
  b.onclick = () => openPanel('country', b, a.c); anc.appendChild(b); return b;
});
const tagEls = Array.from({ length: 7 }, () => { const d = document.createElement('div'); d.className = 'anc tag hide'; d.setAttribute('aria-hidden', 'true'); anc.appendChild(d); return d; });
let scanHits = [];
$('#scan').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { scanHits = []; $('#scanline').textContent = ''; return; }
  const all = CLIENTS.map((n, i) => [n, i]).filter(([n]) => n.toLowerCase().includes(q));
  scanHits = all.slice(0, 7).map(x => x[1]);
  $('#scanline').textContent = all.length ? `${all.length} match${all.length > 1 ? 'es' : ''} · ${scanHits.length} lit in the field` : 'No match. Try a shorter name.';
});

/* ================= crew carousel ================= */
const ring3 = $('#crewring'), CR = MOB ? 360 : 560, step = 360 / CREW.length;
const AVC = [['#3B6BF6', '#7C5CFF'], ['#22D3EE', '#3B6BF6'], ['#E8306A', '#F08A1C'], ['#7C5CFF', '#F472B6']];
const crewEls = CREW.map(([name, role, nick, bio], i) => {
  const b = document.createElement('button'); b.className = 'crewcard';
  const ini = (name === 'Crew member' ? role : name).split(/\s+/).map(w => w[0]).slice(0, 2).join('');
  const [c1, c2] = AVC[i % 4];
  b.innerHTML = `<div class="av" style="background:linear-gradient(135deg,${c1},${c2})">${esc(ini)}</div><small>The ${esc(nick)}</small><b>${esc(name === 'Crew member' ? role : name)}</b><i>${esc(name === 'Crew member' ? 'Afribiz crew' : role)}</i><p>${esc(bio)}</p>`;
  b.setAttribute('aria-label', `${name === 'Crew member' ? role : name}, ${role}`);
  b.style.transform = `rotateY(${i * step}deg) translateZ(${CR}px)`;
  b.onclick = () => { crewTarget = -i * step; crewAuto = false; };
  b.onfocus = () => { crewTarget = -i * step; crewAuto = false; };
  ring3.appendChild(b); return b;
});
let crewAng = 0, crewTarget = 0, crewAuto = true;
$('#crewprev').onclick = () => { crewAuto = false; crewTarget = Math.round(crewTarget / step) * step + step; };
$('#crewnext').onclick = () => { crewAuto = false; crewTarget = Math.round(crewTarget / step) * step - step; };
function updateCrew(dt, v) {
  if (crewAuto && !RM && v > .5) crewTarget -= dt * 5;
  crewAng += (crewTarget - crewAng) * Math.min(1, dt * (crewAuto ? 3 : 6));
  ring3.style.transform = `translateZ(${-CR}px) rotateY(${crewAng}deg)`;
  let front = -1, best = -2;
  crewEls.forEach((el, i) => {
    const a = (i * step + crewAng) * DEG, c = Math.cos(a);
    el.style.opacity = clamp((c + .25) * 1.4, 0, 1).toFixed(3);
    el.tabIndex = c > .3 ? 0 : -1;
    if (c > best) { best = c; front = i; }
  });
  crewEls.forEach((el, i) => el.classList.toggle('front', i === front && best > .985));
}

/* ================= glass field ================= */
const shapes = $$('.glassfield i').map((el, i) => ({ el, d: .3 + (i % 4) * .25, r: (i * 37) % 23 - 11 }));

/* ================= gestures ================= */
const stage = $('#stage'), cur = $('#cursor');
let down = null, holdTimer = 0, holding = false, dragging = false, wave = 0, waveR = 0, gravS = 0;
const pw = GL ? new THREE.Vector3() : null, gravP = GL ? new THREE.Vector3() : null;
if (FINE && !RM && !MOB) document.documentElement.classList.add('reticle');
addEventListener('pointermove', e => {
  pointer.x = e.clientX; pointer.y = e.clientY; pointer.in = true;
  cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  cur.classList.toggle('over', !!(e.target.closest && e.target.closest('button,a,input,textarea,select,label')));
  if (down && !holding) {
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (!dragging && down.type === 'mouse' && Math.hypot(dx, dy) > 6) { dragging = true; clearTimeout(holdTimer); }
    if (dragging) { const f = activeForm(); drag[f].vy = (e.clientX - down.lx) * .006; drag[f].vp = (e.clientY - down.ly) * .004; drag[f].y += drag[f].vy; drag[f].p = clamp(drag[f].p + drag[f].vp, -.8, .8); }
  }
  if (down) { down.lx = e.clientX; down.ly = e.clientY; if (down.type === 'touch' && !holding && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { clearTimeout(holdTimer); down = null; } }
}, { passive: true });
document.addEventListener('pointerleave', () => { pointer.in = false; });
stage.addEventListener('pointerdown', e => {
  if (!entered || RM) return;
  down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, type: e.pointerType, t: performance.now() };
  holdTimer = setTimeout(() => { holding = true; cur.classList.add('hold'); }, e.pointerType === 'touch' ? 450 : 280);
});
addEventListener('pointerup', () => {
  if (!down) return; clearTimeout(holdTimer);
  if (!holding && !dragging && GL) { pointerWorld(down.x, down.y, pmat.uniforms.uWaveC.value); wave = 1; waveR = 0; }
  down = null; holding = false; dragging = false; cur.classList.remove('hold');
});
addEventListener('pointercancel', () => { clearTimeout(holdTimer); down = null; holding = false; dragging = false; cur.classList.remove('hold'); });
function activeForm() { return introT < 1 ? 1 : clamp(Math.floor(u), 0, 6) + 1; }

/* ================= intro ================= */
const intro = $('#intro');
$$('.boot div:not(.bar)').forEach((d, i) => setTimeout(() => d.classList.add('on'), RM ? 0 : 200 + i * 380));
requestAnimationFrame(() => { const b = $('.bar i'); if (b) b.style.width = '100%'; });
document.documentElement.style.overflow = 'hidden';
function enter() {
  if (entered) return; entered = true;
  intro.classList.add('gone'); intro.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  window.scrollTo(0, 0);
  ['#cards', '#hud', '#anchors'].forEach(s => $(s).inert = false);
  setTimeout(() => { $('#hud').classList.add('on'); $('#aiorb').classList.add('on'); }, RM ? 0 : 600);
  if (RM) introT = 1;
  setTimeout(() => { $('#descend').focus({ preventScroll: true }); }, RM ? 50 : 1300);
  qualityStart = performance.now(); qualityFrames = 0;
  announce('Chamber 01, Genesis. Scroll or use the arrow keys to travel.');
}
$('#enter').onclick = enter;
addEventListener('wheel', e => { if (!entered && Math.abs(e.deltaY) > 4) enter(); }, { passive: true });
let ty0 = 0;
addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, { passive: true });
addEventListener('touchmove', e => { if (!entered && Math.abs(e.touches[0].clientY - ty0) > 30) enter(); }, { passive: true });
setTimeout(() => $('#enter').focus({ preventScroll: true }), 100);

/* ================= keyboard ================= */
addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
  if (e.key === 'Escape') { if ($('#chat').classList.contains('open')) closeChat(); else if ($('#panel').classList.contains('open')) closePanel(); return; }
  if (typing) return;
  if (!entered) { if ([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'Enter'].includes(e.key) && tag !== 'button') { e.preventDefault(); enter(); } else if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); enter(); } return; }
  const next = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key) || (e.key === ' ' && tag !== 'button' && !e.shiftKey);
  const prev = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key) || (e.key === ' ' && e.shiftKey && tag !== 'button');
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && curCh() === 5) { e.preventDefault(); (e.key === 'ArrowLeft' ? $('#crewprev') : $('#crewnext')).click(); return; }
  if (next) { e.preventDefault(); goTo(Math.min(6, curCh() + 1)); }
  else if (prev) { e.preventDefault(); goTo(Math.max(0, curCh() - 1)); }
  else if (e.key === 'Home') { e.preventDefault(); goTo(0); } else if (e.key === 'End') { e.preventDefault(); goTo(6); }
});
$$('[data-go]').forEach(b => b.addEventListener('click', () => goTo(+b.dataset.go)));

/* ================= adaptive quality ================= */
let qualityStart = 0, qualityFrames = 0, qualityDone = false, qualitySum = 0;

/* ================= render loop ================= */
let last = performance.now(), introClock = 0, roTimer = 0, lastCh = -1;
const wv = GL ? new THREE.Vector3() : null;
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  // journey value
  uT = clamp(scrollY / maxScroll() * 6.5, 0, 6.5);
  u = RM ? uT : u + (uT - u) * Math.min(1, dt * 4.5);
  if (entered && introT < 1) introT = Math.min(1, introT + dt / 3.2);
  const ch = curCh();
  if (ch !== lastCh && entered) { lastCh = ch; announce(`Chamber ${String(ch + 1).padStart(2, '0')}, ${CH[ch].n}, ${CH[ch].l}`); }

  // morph pair & warp
  let A, B, mix, warp = 0;
  if (introT < 1) { A = 0; B = 1; const t = introT; mix = entered ? t : 0; warp = entered && !RM ? Math.sin(t * Math.PI) : 0; }
  else {
    const i = clamp(Math.floor(u), 0, 6), f = u - i;
    if (i >= 6) { A = 7; B = 7; mix = 0; }
    else { A = i + 1; B = i + 2; mix = f < .45 ? 0 : (f - .45) / .55; }
    warp = RM ? 0 : Math.sin(clamp(mix, 0, 1) * Math.PI);
  }
  wakeT = Math.max(warp, listening || aiBusy ? 1 : 0);
  wake += (wakeT - wake) * Math.min(1, dt * 2);
  document.documentElement.style.setProperty('--sat', (1.15 + (listening || aiBusy ? .45 : 0)).toFixed(2));

  // cards
  zones.forEach((z, i) => {
    const v = entered ? vis(i) : 0;
    const on = v > .01; z.classList.toggle('on', on);
    z.inert = v < .35;
    if (!on) { streamed[i] = false; return; }
    if (v > .6 && !streamed[i]) { streamed[i] = true; restream(i); }
    if (v < .1) streamed[i] = false;
    let s = clamp(u - i - .2, -1, 1); s = Math.sign(s) * Math.max(0, Math.abs(s) - .2);
    flyEls[i].forEach(el => {
      const d = +(el.dataset.depth || 1);
      el.style.transform = RM ? 'none' : `translateZ(${(-s * -620 * d).toFixed(1)}px)`;
      el.style.opacity = v.toFixed(3);
      el.style.filter = v < .99 ? `blur(${((1 - v) * 7).toFixed(1)}px)` : 'none';
    });
  });
  updateCrew(dt, entered ? vis(5) : 0);

  // glass shapes parallax
  if (!RM) shapes.forEach((s, i) => {
    const y = -(u * 90 * s.d) % (innerHeight + 300), x = Math.sin(now / 1000 * .15 + i) * 14 * s.d;
    s.el.style.transform = `translate3d(${x.toFixed(1)}px,${(y + (y < -innerHeight * .9 ? innerHeight + 300 : 0)).toFixed(1)}px,0) rotate(${(s.r + u * 6 * s.d).toFixed(1)}deg)`;
  });
  $('.aurora .shift').style.transform = `translate(${((pointer.x / innerWidth - .5) * -30).toFixed(1)}px, ${((pointer.y / innerHeight - .5) * -24 - u * 12).toFixed(1)}px)`;

  // HUD
  const fill = clamp(u / 6, 0, 1);
  $('#depthfill').style.height = `calc(${(fill * 100).toFixed(1)}% - ${(fill * 12).toFixed(1)}px)`;
  dlis.forEach((li, i) => { li.classList.toggle('cur', i === ch); li.classList.toggle('past', i < ch); });
  if ((roTimer -= dt) <= 0) {
    roTimer = .1;
    $('#ro-ch').textContent = `${String(ch + 1).padStart(2, '0')} · ${CH[ch].n} · ${CH[ch].l}`;
    $('#ro-depth').textContent = String(Math.round(u * 1000 + 192)).padStart(4, '0') + ' m';
    $('#ro-pos').textContent = `${(pointer.x / innerWidth).toFixed(2)} ${(pointer.y / innerHeight).toFixed(2)}`;
    $('#ro-sig').textContent = (96 + Math.round(Math.sin(now / 900) * 2 + wake * 2)) + '%';
  }

  if (GL) renderScene(dt, now, A, B, mix, warp);
  else hideAnchors();
  if (entered && !qualityDone && GL) {
    qualityFrames++; qualitySum += dt;
    if (qualityFrames >= 90) { qualityDone = true; if (qualitySum / 90 > .034) pgeo.setDrawRange(0, Math.floor(N * .45)); }
  }
  requestAnimationFrame(frame);
}

function hideAnchors() { [...tierEls, ...beaconEls, ...tagEls].forEach(e => { e.style.opacity = 0; e.classList.add('hide'); e.tabIndex = -1; }); $('#mic').style.opacity = 0; }

function renderScene(dt, now, A, B, mix, warp) {
  const t = now / 1000;
  ensurePair(A, B);
  // spins
  if (!RM) FP.forEach((p, f) => { ang[f].y += p.spin[0] * dt; ang[f].z += p.spin[1] * dt; });
  if (listening && !RM) ang[1].z -= dt * .9;
  drag.forEach((d, f) => {
    if (!dragging || f !== activeForm()) { d.y += d.vy; d.vy *= .93; d.vp *= .9; }
    if (f === 1 && !dragging) { d.y *= .94; d.p *= .94; }
    if (f !== 4 && f !== 1 && !dragging) d.p *= .97;
  });
  const U = pmat.uniforms;
  formMat(A, U.uRotA.value); formMat(B, U.uRotB.value);
  U.uOffA.value.fromArray(offOf(A)); U.uOffB.value.fromArray(offOf(B));
  U.uScaleA.value = scaleOf(A); U.uScaleB.value = scaleOf(B);
  U.uMix.value = mix; U.uTime.value = t;
  wave *= Math.pow(.25, dt); waveR += dt * 7; U.uWave.value = wave; U.uWaveR.value = waveR;
  gravS += ((holding ? 1 : 0) - gravS) * Math.min(1, dt * 4); U.uGravS.value = gravS;
  if (down || holding) { pointerWorld(pointer.x, pointer.y, pw); gravP.lerp(pw, Math.min(1, dt * 8)); U.uGravP.value.copy(gravP); }
  else if (gravS < .01) { pointerWorld(pointer.x, pointer.y, gravP); }

  // camera
  const baseZ = 8 - 2.2 * warp;
  const introZ = lerp(24, 8, 1 - Math.pow(1 - introT, 3));
  camera.position.z = introT < 1 ? (entered ? introZ - 2.2 * warp : 24) : baseZ;
  camera.fov = (MOB ? 58 : 45) + 28 * warp; camera.rotation.z = .06 * warp * (curCh() % 2 ? -1 : 1);
  camera.position.x = RM ? 0 : (pointer.x / innerWidth - .5) * .35; camera.position.y = RM ? 0 : -(pointer.y / innerHeight - .5) * .25;
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();

  // neural net
  const nw = wake;
  nn.lmat.opacity = .07 + nw * .14; nn.nmat.uniforms.uWake.value = nw; nn.smat.uniforms.uWake.value = nw;
  const active = Math.floor(nn.sigs.length * (.35 + .65 * nw));
  nn.sigs.forEach((s, k) => {
    const L = nn.links[s.l];
    if (k >= active) { nn.spos[k * 3 + 2] = 999; return; }
    s.t += dt * s.sp * (1 + nw * 2.2);
    if (s.t >= 1) {
      const end = s.dir > 0 ? L[1] : L[0]; nn.nfire[end] = 1;
      const opts = nn.adj[end]; s.l = opts[(Math.random() * opts.length) | 0]; const L2 = nn.links[s.l]; s.dir = L2[0] === end ? 1 : -1; s.t = 0;
    }
    const L3 = nn.links[s.l], a = nn.npos[s.dir > 0 ? L3[0] : L3[1]], b = nn.npos[s.dir > 0 ? L3[1] : L3[0]];
    nn.spos[k * 3] = lerp(a[0], b[0], s.t); nn.spos[k * 3 + 1] = lerp(a[1], b[1], s.t); nn.spos[k * 3 + 2] = lerp(a[2], b[2], s.t);
  });
  for (let i = 0; i < nn.nfire.length; i++) nn.nfire[i] *= Math.pow(.08, dt);
  nn.ngeo.attributes.aF.needsUpdate = true; nn.sgeo.attributes.position.needsUpdate = true;
  nn.group.rotation.y = Math.sin(t * .05) * .1;

  // streaks
  streaks.kmat.opacity = warp * .55;
  if (warp > .01) {
    const len = .4 + warp * 4.5;
    streaks.kd.forEach((k, i) => {
      k.z += dt * 38 * k.s * warp; if (k.z > 8) k.z -= 46;
      streaks.kpos.set([k.x, k.y, k.z, k.x, k.y, k.z - len * k.s], i * 6);
    });
    streaks.kgeo.attributes.position.needsUpdate = true; streaks.mesh.visible = true;
  } else streaks.mesh.visible = false;

  // grid
  const GOP = [.55, .3, .18, .14, .1, .3, .6];
  const ci = clamp(Math.floor(u), 0, 6), gi = lerp(GOP[ci], GOP[Math.min(6, ci + 1)], clamp((u - ci - .45) / .55, 0, 1));
  grid.material.opacity = (introT < 1 ? (entered ? introT : 0) : 1) * gi * .22;
  grid.position.y = -4.2 - (1 - introT) * 3;

  // gizmo
  const GZ = [0, 1, 0, .8, 1, 0, 0, 1];
  const hold = introT < 1 ? (entered ? introT : 0) : 1 - clamp(mix * 3, 0, 1);
  const gf = A, go = offOf(gf), gs = scaleOf(gf) * (gf === 4 ? .95 : gf === 3 ? .55 : gf === 7 ? 1.25 : 1);
  gizmo.position.set(go[0], go[1], go[2]); gizmo.scale.setScalar(gs);
  gizmo.children.forEach((ln, k) => { ln.material.opacity = GZ[gf] * hold * (k === 0 ? .55 : .4); ln.rotation.z += dt * (.05 + k * .03) * (k % 2 ? -1 : 1) * (listening ? 4 : 1); });

  renderer.render(scene, camera);
  updateAnchors(now);
}

function updateAnchors(now) {
  const settled = introT >= 1 && entered;
  // mic orb pinned to ring centre
  const v0 = settled ? vis(0) : 0;
  const mic = $('#mic'), trn = $('#transcript');
  if (v0 > .02) {
    worldOf(1, [0, 0, 0], wv); const [sx, sy] = toScreen(wv);
    mic.style.transform = `translate(${sx.toFixed(1)}px,${sy.toFixed(1)}px)`; mic.style.opacity = v0; mic.tabIndex = v0 > .35 ? 0 : -1;
    trn.style.transform = `translate(${sx.toFixed(1)}px,${(sy + (MOB ? 80 : 128)).toFixed(1)}px)`; trn.style.opacity = v0;
  } else { mic.style.opacity = 0; mic.tabIndex = -1; trn.style.opacity = 0; }
  mic.style.pointerEvents = v0 > .35 ? 'auto' : 'none';

  // tier labels
  const v2 = settled ? vis(2) : 0;
  if (v2 < .05) tierEls.forEach(el => { el.style.opacity = 0; el.classList.add('hide'); el.tabIndex = -1; });
  else {
    const rs = TIERS.map((t, k) => {
      const el = tierEls[k]; worldOf(3, t.anchor, wv); const [x, y] = toScreen(wv);
      const w = el.offsetWidth, h = el.offsetHeight;
      return { el, w, h, x: clamp(x - w / 2, 16, innerWidth - w - (MOB ? 40 : 70)), y: clamp(y - h / 2, 80, innerHeight - h - (MOB ? 260 : 90)) };
    }).sort((a, b) => a.y - b.y);
    for (let i = 1; i < rs.length; i++) for (let j = 0; j < i; j++) {
      const a = rs[j], b = rs[i];
      if (b.x < a.x + a.w + 8 && a.x < b.x + b.w + 8 && b.y < a.y + a.h + 8) b.y = a.y + a.h + 8;
    }
    rs.forEach(r => { r.el.style.transform = `translate(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px)`; r.el.style.opacity = v2; r.el.classList.toggle('hide', v2 < .35); r.el.tabIndex = v2 < .35 ? -1 : 0; });
  }

  // beacons
  const v3 = settled ? vis(3) : 0;
  AWARDS.forEach((a, k) => {
    const el = beaconEls[k];
    if (v3 < .05) { el.style.opacity = 0; el.classList.add('hide'); el.tabIndex = -1; return; }
    worldOf(4, beaconLocal[k], wv); const [sx, sy] = toScreen(wv);
    formMat(4, _tmp3); const nrm = new THREE.Vector3(...beaconLocal[k]).normalize().applyMatrix3(_tmp3);
    const face = sm((nrm.z - .05) / .3), o = v3 * face;
    el.style.transform = `translate(${(sx - 8).toFixed(1)}px,${(sy - 12).toFixed(1)}px)`; el.style.opacity = o.toFixed(3);
    el.classList.toggle('hide', o < .35); el.tabIndex = o < .35 ? -1 : 0;
  });

  // client name tags
  const v4 = settled ? vis(4) : 0;
  if (v4 < .05) { tagEls.forEach(e => { e.style.opacity = 0; }); return; }
  const scr = STARS.map((s, i) => { worldOf(5, s, wv); const [x, y, z] = toScreen(wv); return { i, x, y, z }; }).filter(p => p.z < 1 && p.x > 0 && p.x < innerWidth && p.y > 60 && p.y < innerHeight);
  let picks;
  if (scanHits.length) picks = scanHits.map(i => scr.find(p => p.i === i) || null).filter(Boolean).map(p => ({ ...p, hit: true }));
  else if (pointer.in && FINE) picks = scr.map(p => ({ ...p, d: Math.hypot(p.x - pointer.x, p.y - pointer.y) })).filter(p => p.d < 200).sort((a, b) => a.d - b.d).slice(0, 5);
  else picks = scr.filter(p => MAJORS.includes(CLIENTS[p.i]) || NAMED_CLIENTS.includes(CLIENTS[p.i])).slice(0, 5);
  tagEls.forEach((el, k) => {
    const p = picks[k];
    if (!p) { el.style.opacity = 0; return; }
    el.textContent = CLIENTS[p.i]; el.classList.toggle('hit', !!p.hit);
    el.style.transform = `translate(${(p.x - 3).toFixed(1)}px,${(p.y - 9).toFixed(1)}px)`; el.style.opacity = v4;
  });
}

addEventListener('resize', () => { if (GL) renderer.setSize(innerWidth, innerHeight, false); });
if (GL) renderer.setSize(innerWidth, innerHeight, false);
requestAnimationFrame(frame);

/* ================= detail panel ================= */
const panel = $('#panel'), pbody = $('#pbody');
let panelOpener = null;
const listHTML = items => '<ul class="list">' + items.map(([a, b]) => `<li>${esc(a)}${b ? `<small>${esc(b)}</small>` : ''}</li>`).join('') + '</ul>';
const svcList = t => '<ul class="list">' + t.items.map(([a, b]) => `<li><button data-svc="${esc(a)}"><span>${esc(a)}</span>${b ? `<small>${esc(b)}</small>` : ''}</button></li>`).join('') + '</ul>';
const PANELS = {
  about: () => ['Our story', 'Origin · who we are', `
    <p>Afribiz Connect is a multi-award-winning digital software and marketing agency, operating from Johannesburg, South Africa and building for the world.</p>
    <p>We are a diverse collective of specialists fusing information systems architecture, data engineering and AI with deep local expertise, to bring brands to the people they serve.</p>
    <p class="ptier">Rooted in townships</p><p>Full support and practical training for SMMEs and local businesses, built for long-term success.</p>
    <p class="ptier">Recognised by</p><p>Accredited affiliate of 22 On Sloane, YiEDI, Microsoft and Google.</p>
    <div class="actions"><button class="btn primary" data-close-go="6">Start a project</button></div>`],
  services: () => ['All services', 'Three tiers · choose one to ask the AI', TIERS.map(t => `<p class="ptier">${t.t} · ${t.n}</p><p>${esc(t.d)}</p>${svcList(t)}`).join('')],
  tier: k => { const t = TIERS.find(x => x.k === k); return [t.n, `${t.t}. ${t.d}`, svcList(t)]; },
  awards: () => ['Every award', `${AWARDS.reduce((n, a) => n + a.list.length, 0)} awards on file`, AWARDS.map(a => `<p class="ptier">${esc(a.c)} · ${a.list.length}</p>${listHTML(a.list)}`).join('')],
  country: c => { const a = AWARDS.find(x => x.c === c); return [a.c, `${a.list.length} award${a.list.length > 1 ? 's' : ''}`, listHTML(a.list)]; },
  crew: () => ['Full crew list', `${CREW.length} specialists`, '<ul class="list">' + CREW.map(([n, r], i) => `<li><button data-crew="${i}"><span>${esc(n === 'Crew member' ? r : n)}</span><small>${esc(n === 'Crew member' ? 'Afribiz crew' : r)}</small></button></li>`).join('') + '</ul>'],
  enquiry: () => ['Send an enquiry', 'Opens your email app with everything filled in.', `
    <form class="enq" id="enq">
      <label for="en">Your name</label><input id="en" required autocomplete="name">
      <label for="ec">Email or phone</label><input id="ec" required autocomplete="email">
      <label for="es">What do you need?</label><select id="es"><option>Not sure yet</option>${TIERS.map(t => `<optgroup label="${t.n}">${t.items.map(([a]) => `<option>${esc(a)}</option>`).join('')}</optgroup>`).join('')}</select>
      <label for="ea">About the project</label><textarea id="ea" placeholder="Your business, goals and timeline"></textarea>
      <button class="btn primary" type="submit">Send enquiry</button>
      <p class="fstatus" id="fstatus" aria-live="polite"></p>
    </form>`]
};
function openPanel(kind, opener, arg) {
  const [title, sub, html] = PANELS[kind](arg);
  $('#ptitle').textContent = title; $('#psub').textContent = sub; pbody.innerHTML = html; pbody.scrollTop = 0;
  panelOpener = opener || document.activeElement;
  panel.classList.add('open');
  setTimeout(() => $('#pclose').focus({ preventScroll: true }), 60);
  const f = $('#enq');
  if (f) f.onsubmit = e => {
    e.preventDefault();
    const n = $('#en').value.trim(), c = $('#ec').value.trim(), s = $('#es').value, a = $('#ea').value.trim();
    const body = `Name: ${n}\nContact: ${c}\nService: ${s}\n\n${a}`;
    const href = `mailto:info@afribizconnect.co.za?subject=${encodeURIComponent('Project enquiry: ' + s)}&body=${encodeURIComponent(body)}`;
    const w = window.open(href, '_blank'); if (!w) location.href = href;
    $('#fstatus').textContent = 'Your email app should open with the enquiry ready to send. If it doesn\'t, email info@afribizconnect.co.za.';
  };
}
function closePanel() {
  panel.classList.remove('open');
  if (panelOpener && panelOpener.focus) panelOpener.focus({ preventScroll: true });
}
$('#pclose').onclick = closePanel;
pbody.addEventListener('click', e => {
  const s = e.target.closest('[data-svc]'), cr = e.target.closest('[data-crew]'), cg = e.target.closest('[data-close-go]');
  if (s) { panel.classList.remove('open'); openChat(); ask(`Tell me about your ${s.dataset.svc} service.`); }
  if (cr) { panel.classList.remove('open'); goTo(5); crewAuto = false; crewTarget = -(+cr.dataset.crew) * step; }
  if (cg) { panel.classList.remove('open'); goTo(+cg.dataset.closeGo); }
});
$$('[data-panel]').forEach(b => b.addEventListener('click', () => openPanel(b.dataset.panel, b)));
$('#startproject').onclick = e => { goTo(6); setTimeout(() => openPanel('enquiry', e.currentTarget), RM ? 0 : 900); };

/* ================= AI chat ================= */
const chat = $('#chat'), msgs = $('#msgs'), cin = $('#cin'), orbBtn = $('#aiorb');
let chatOpener = null, history = [];
function setBusy(b) {
  aiBusy = b;
  [orbBtn.querySelector('.orb'), $('#avatar'), $('#mic .orb')].forEach(o => o.classList.toggle('busy', b || listening));
  $('#cstatus').textContent = listening ? 'listening…' : b ? 'thinking…' : 'online · type or speak';
}
function openChat(opener) {
  chatOpener = opener || document.activeElement;
  chat.classList.add('open'); orbBtn.setAttribute('aria-expanded', 'true');
  if (!msgs.children.length) addMsg('ai', "Hi! I'm the Afribiz Connect assistant. Ask me about our services, awards, team or how to get a quote. You can type, or tap the mic to speak.");
  setTimeout(() => cin.focus({ preventScroll: true }), 80);
}
function closeChat() {
  chat.classList.remove('open'); orbBtn.setAttribute('aria-expanded', 'false');
  if (chatOpener && chatOpener.focus) chatOpener.focus({ preventScroll: true });
}
orbBtn.onclick = () => chat.classList.contains('open') ? closeChat() : openChat(orbBtn);
$('#cclose').onclick = closeChat;
$$('[data-ai]').forEach(b => b.addEventListener('click', () => openChat(b)));
function addMsg(who, text) { const d = document.createElement('div'); d.className = 'msg ' + who; d.textContent = text; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; }
$('#cform').onsubmit = e => { e.preventDefault(); const q = cin.value.trim(); if (q) { cin.value = ''; ask(q); } };
$('#sugg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) ask(b.textContent); });

const FACTS = `Afribiz Connect is a multi-award-winning digital software and marketing agency based in Johannesburg, South Africa (Company Reg 2020/510825/07). Tagline: Urbanisation & development through technology. Team of 17 specialists including Josh Indarjee (Director), Morne Esterhuyizen (AI Specialist), Craige Dean Kavirayan (Cybersecurity Specialist) and Nathan Goldstone (Developer). 131 client businesses including Shell, SPAR, Engen and township family businesses such as Zakhele Granite & Tombstone, Elle Fitness Club, New Identity, iZibalo and Hotshots Nite Club. 9 awards across 5 countries including Nedbank Hands Up For Small Business (Owner Winner), Forty Under 40 South Africa (1st Runner Up, Telecom, Mobile & Software Development) and KZN Youth Business Awards (Technology). Accredited affiliate of 22 On Sloane, YiEDI, Microsoft and Google. Services in three tiers. Foundations: graphic design, brand photography, brand videography, social media management, Google packages, business registration. Growth: websites, digital audit & strategy, SEO. Intelligence: AI & chatbots, data pipelines, cybersecurity, apps, CRM, brand architecture, PR & events, 3D mapping. Supports SMMEs and township businesses with practical training. Contact: +27 65 332 1150, info@afribizconnect.co.za, WhatsApp on the same number, Instagram @afribizconnect_. Quotes are given after a short brief: use the Send an enquiry form in the Portal chamber or email.`;
const PROMPT = `You are Afribiz AI, the friendly assistant on the Afribiz Connect website. Answer only from these facts; if something is not covered (like prices), say the team will confirm it and point to the enquiry form or contact details. Keep replies under 80 words, plain text, no markdown, warm and direct, South African English spelling.\n\nFACTS:\n${FACTS}`;

let samplerP = null;
function getSampler() {
  if (!samplerP) samplerP = (window.claude && typeof window.claude.use === 'function') ? Promise.resolve(window.claude.use('sample')).catch(() => null) : Promise.resolve(null);
  return samplerP;
}
getSampler();
let sampleOff = false;

function localAnswer(q) {
  const s = q.toLowerCase();
  if (/price|cost|quote|budget|how much/.test(s)) return 'Every quote starts from a short brief, so the team can price exactly what you need. Use "Send an enquiry" in the Portal chamber, email info@afribizconnect.co.za or WhatsApp +27 65 332 1150, and we\'ll come back to you.';
  if (/award|recogni|win/.test(s)) return 'We hold nine awards across five countries, including Nedbank Hands Up For Small Business (Owner Winner), Forty Under 40 South Africa (1st Runner Up, Telecom, Mobile & Software Development) and the KZN Youth Business Awards for Technology.';
  if (/team|crew|who|staff|people|director/.test(s)) return 'Seventeen specialists, led by our Director Josh Indarjee, with Morne Esterhuyizen on AI, Craige Dean Kavirayan on cybersecurity and Nathan Goldstone on development. Visit the Crew chamber to meet everyone.';
  if (/client|shell|spar|engen|work with/.test(s)) return 'We work with 131 businesses, from Shell, SPAR and Engen to township family businesses like Zakhele Granite & Tombstone and Elle Fitness Club.';
  if (/contact|phone|email|whatsapp|call|reach/.test(s)) return 'Call or WhatsApp +27 65 332 1150, email info@afribizconnect.co.za, or find us on Instagram at @afribizconnect_.';
  if (/web|site|seo|growth/.test(s)) return 'Our Growth tier covers websites, digital audits and strategy, and SEO: turning attention into enquiries with a site that performs.';
  if (/ai|chatbot|data|cyber|app|crm|3d|intelligen/.test(s)) return 'Our Intelligence tier covers AI and chatbots, data pipelines, cybersecurity, apps, CRM, brand architecture, PR and events, and 3D mapping.';
  if (/design|logo|photo|video|social|brand|register|google|foundation/.test(s)) return 'Our Foundations tier gets you looking professional, found and legally set up: graphic design, brand photography and videography, social media management, Google packages and business registration.';
  if (/service|offer|do you do|help/.test(s)) return 'We work in three tiers. Foundations: design, photography, video, social media, Google packages and business registration. Growth: websites, digital audit and strategy, and SEO. Intelligence: AI and chatbots, data pipelines, cybersecurity, apps, CRM, brand architecture, PR and events, and 3D mapping.';
  if (/about|story|township|smme/.test(s)) return 'Afribiz Connect is a multi-award-winning digital software and marketing agency from Johannesburg. We fuse systems architecture, data and AI with local expertise, and support SMMEs and township businesses with practical training.';
  return 'I can tell you about our services, awards, team, clients or how to get a quote. For anything else, the team is on +27 65 332 1150 or info@afribizconnect.co.za.';
}

async function streamLocal(el, text) {
  if (RM) { el.textContent = text; return; }
  const words = text.split(' '); el.textContent = '';
  for (let i = 0; i < words.length; i++) { el.textContent += (i ? ' ' : '') + words[i]; msgs.scrollTop = msgs.scrollHeight; await new Promise(r => setTimeout(r, 38)); }
}

async function ask(q) {
  if (!chat.classList.contains('open')) openChat();
  addMsg('me', q); history.push(['Visitor', q]);
  const el = addMsg('ai', 'Thinking…'); el.classList.add('thinking');
  setBusy(true);
  let answer = null;
  const sample = sampleOff ? null : await Promise.race([getSampler(), new Promise(r => setTimeout(() => r(null), 1500))]);
  if (sample) {
    try {
      const convo = history.slice(-8).map(([w, t]) => `${w}: ${t}`).join('\n');
      const res = await sample(`${PROMPT}\n\nConversation:\n${convo}\n\nReply as Afribiz AI to the visitor's last message.`, {
        modelTier: 'quick', cache: false,
        onText: ({ text }) => { el.classList.remove('thinking'); el.textContent = text; msgs.scrollTop = msgs.scrollHeight; }
      });
      answer = (res && res.text || '').trim() || null;
    } catch (err) {
      if (err && (err.code === 'not_granted' || err.code === 'unavailable')) sampleOff = true;
      answer = null;
    }
  }
  el.classList.remove('thinking');
  if (!answer) { answer = localAnswer(q); await streamLocal(el, answer); }
  else el.textContent = answer;
  history.push(['Afribiz AI', answer]);
  setBusy(false);
}

/* ================= voice ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
function startVoice(fromRing) {
  if (listening) { rec && rec.stop(); return; }
  if (!SR) { openChat(); addMsg('ai', "Voice isn't available in this browser. Type your question below instead."); return; }
  try {
    rec = new SR(); rec.lang = 'en-ZA'; rec.interimResults = true; rec.continuous = false;
    let finalText = '';
    rec.onresult = e => {
      let t = ''; for (const r of e.results) t += r[0].transcript;
      finalText = t; if (fromRing) $('#transcript').textContent = t; else cin.value = t;
    };
    rec.onerror = ev => {
      const msg = ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ? 'Microphone access is blocked here. Type your question instead, or allow the microphone in your browser.' : 'I didn\'t catch that. Try again, or type your question.';
      openChat(); addMsg('ai', msg);
    };
    rec.onend = () => {
      listening = false; document.documentElement.classList.remove('listening'); setBusy(aiBusy);
      setTimeout(() => { $('#transcript').textContent = ''; }, 1200);
      if (finalText.trim()) { cin.value = ''; ask(finalText.trim()); }
    };
    rec.start(); listening = true; document.documentElement.classList.add('listening'); setBusy(aiBusy);
    if (fromRing) $('#transcript').textContent = 'Listening…';
  } catch (e) { openChat(); addMsg('ai', "Voice couldn't start here. Type your question below instead."); }
}
$('#mic').onclick = () => startVoice(true);
$('#vmic').onclick = () => startVoice(false);
})();

