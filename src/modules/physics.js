// @ts-nocheck
import * as THREE from 'three';
import { Kn } from './core.js';

var hg = 0.42,
  $s = 0.5,
  Ll = -40,
  wk = 31,
  ru = -32,
  Ek = 30,
  f0 = Math.round((wk - Ll) / $s),
  co = Math.round((Ek - ru) / $s),
  t1 = 0.5;

function v_(n) {
  let e = [],
    t = !0,
    i = new Uint8Array(f0 * co),
    s = new THREE.Vector3(),
    o = {
      boxes: e,
      bounds: { min: Kn.min.clone(), max: Kn.max.clone() },
      addBox(M, _, T = {}) {
        let w = x_(M),
          S = x_(_),
          R = {
            min: new THREE.Vector3(Math.min(w.x, S.x), Math.min(w.y, S.y), Math.min(w.z, S.z)),
            max: new THREE.Vector3(Math.max(w.x, S.x), Math.max(w.y, S.y), Math.max(w.z, S.z)),
            surface: T.surface || 'concrete',
            tag: T.tag || '',
            noNav: !!T.noNav,
            bulletOnly: !!T.bulletOnly,
            playerOnly: !!T.playerOnly,
          };
        return (e.push(R), (t = !0), R);
      },
      removeBox(M) {
        let _ = e.indexOf(M);
        _ >= 0 && (e.splice(_, 1), (t = !0));
      },
      build() {
        a();
      },
      raycast(M, _, T = 500) {
        let w = T,
          S = null,
          R = -1,
          z = 0,
          I = 0,
          L = M.x,
          U = M.y,
          k = M.z,
          C = _.x,
          A = _.y,
          F = _.z;
        if (A < -1e-6) {
          let J = (Kn.groundY - U) / A;
          if (J > 0 && J < w)
            if (L + C * J <= Kn.quayX) ((w = J), (I = 1));
            else {
              let te = (Kn.seaY - U) / A;
              te > 0 && te < w && ((w = te), (I = 2));
            }
        }
        let H = C === 0 ? 1 / 0 : 1 / C,
          N = A === 0 ? 1 / 0 : 1 / A,
          Z = F === 0 ? 1 / 0 : 1 / F;
        for (let J = 0; J < e.length; J++) {
          let G = e[J];
          if (G.playerOnly) continue;
          let te = 0,
            oe = w,
            ee = -1,
            le = 0,
            xe,
            j;
          if (C !== 0) {
            ((xe = (G.min.x - L) * H), (j = (G.max.x - L) * H));
            let O = -1;
            if (xe > j) {
              let q = xe;
              ((xe = j), (j = q), (O = 1));
            }
            if ((xe > te && ((te = xe), (ee = 0), (le = O)), j < oe && (oe = j), te > oe)) continue;
          } else if (L < G.min.x || L > G.max.x) continue;
          if (A !== 0) {
            ((xe = (G.min.y - U) * N), (j = (G.max.y - U) * N));
            let O = -1;
            if (xe > j) {
              let q = xe;
              ((xe = j), (j = q), (O = 1));
            }
            if ((xe > te && ((te = xe), (ee = 1), (le = O)), j < oe && (oe = j), te > oe)) continue;
          } else if (U < G.min.y || U > G.max.y) continue;
          if (F !== 0) {
            ((xe = (G.min.z - k) * Z), (j = (G.max.z - k) * Z));
            let O = -1;
            if (xe > j) {
              let q = xe;
              ((xe = j), (j = q), (O = 1));
            }
            if ((xe > te && ((te = xe), (ee = 2), (le = O)), j < oe && (oe = j), te > oe)) continue;
          } else if (k < G.min.z || k > G.max.z) continue;
          ee < 0 || ((w = te), (S = G), (R = ee), (z = le), (I = 0));
        }
        if (!S && !I) return null;
        let Q = new THREE.Vector3(L + C * w, U + A * w, k + F * w);
        if (I)
          return {
            dist: w,
            point: Q,
            normal: new THREE.Vector3(0, 1, 0),
            surface:
              I === 2
                ? 'water'
                : n.level && n.level.groundSurfaceAt
                  ? n.level.groundSurfaceAt(Q.x, Q.z)
                  : 'concrete',
            box: null,
          };
        let W = new THREE.Vector3();
        return (W.setComponent(R, z), { dist: w, point: Q, normal: W, surface: S.surface, box: S });
      },
      lineOfSight(M, _) {
        s.subVectors(_, M);
        let T = s.length();
        return T < 1e-4 ? !0 : (s.multiplyScalar(1 / T), !o.raycast(M, s, T - 0.05));
      },
      groundHeight(M, _, T = 50) {
        let w = M <= Kn.quayX ? Kn.groundY : Kn.seaY;
        for (let S = 0; S < e.length; S++) {
          let R = e[S];
          R.bulletOnly ||
            (M >= R.min.x &&
              M <= R.max.x &&
              _ >= R.min.z &&
              _ <= R.max.z &&
              R.max.y <= T &&
              R.max.y > w &&
              (w = R.max.y));
        }
        return w;
      },
      moveCapsule(M, _, T, w = 0.32, S = 1.8, R = !0) {
        let z = { onGround: !1, hitWall: !1, hitCeil: !1, surface: 'concrete' },
          I = _.x * T,
          L = _.z * T,
          U = Math.max(1, Math.ceil(Math.hypot(I, L) / (w * 0.6))),
          k = M.y;
        for (let Q = 0; Q < U; Q++) {
          ((M.x += I / U), (M.z += L / U));
          for (let W = 0; W < 3; W++) {
            let J = !1;
            for (let G = 0; G < e.length; G++) {
              let te = e[G];
              if (te.bulletOnly || te.max.y <= M.y + (R ? hg : 0.08) || te.min.y >= M.y + S) continue;
              let oe = Math.max(te.min.x, Math.min(te.max.x, M.x)),
                ee = Math.max(te.min.z, Math.min(te.max.z, M.z)),
                le = M.x - oe,
                xe = M.z - ee,
                j = le * le + xe * xe;
              if (!(j >= w * w)) {
                if (j > 1e-10) {
                  let O = Math.sqrt(j),
                    q = w - O;
                  ((le /= O), (xe /= O), (M.x += le * q), (M.z += xe * q));
                  let ue = _.x * le + _.z * xe;
                  ue < 0 && ((_.x -= le * ue), (_.z -= xe * ue));
                } else {
                  let O = M.x - te.min.x,
                    q = te.max.x - M.x,
                    ue = M.z - te.min.z,
                    de = te.max.z - M.z,
                    $ = Math.min(O, q, ue, de);
                  $ === O
                    ? ((M.x = te.min.x - w), _.x > 0 && (_.x = 0))
                    : $ === q
                      ? ((M.x = te.max.x + w), _.x < 0 && (_.x = 0))
                      : $ === ue
                        ? ((M.z = te.min.z - w), _.z > 0 && (_.z = 0))
                        : ((M.z = te.max.z + w), _.z < 0 && (_.z = 0));
                }
                ((J = !0), (z.hitWall = !0));
              }
            }
            if (!J) break;
          }
        }
        let C = M.y + _.y * T,
          A = w * 0.7,
          F = M.x <= Kn.quayX + A ? Kn.groundY : -50,
          H = null,
          N = 1 / 0,
          Z = k + (R ? hg : 0.08) + 1e-4;
        for (let Q = 0; Q < e.length; Q++) {
          let W = e[Q];
          W.bulletOnly ||
            M.x + A < W.min.x ||
            M.x - A > W.max.x ||
            M.z + A < W.min.z ||
            M.z - A > W.max.z ||
            (W.max.y <= Z && W.max.y > F && ((F = W.max.y), (H = W.surface)),
            W.min.y >= k + S - 0.05 && W.min.y < N && (N = W.min.y));
        }
        return (
          _.y > 0 && C + S > N
            ? ((M.y = N - S), (_.y = 0), (z.hitCeil = !0))
            : C <= F
              ? ((M.y = F), _.y < 0 && (_.y = 0), (z.onGround = !0))
              : R && _.y <= 0 && C - F < hg
                ? ((M.y = F), (_.y = 0), (z.onGround = !0))
                : (M.y = C),
          z.onGround &&
            (z.surface =
              H || (n.level && n.level.groundSurfaceAt ? n.level.groundSurfaceAt(M.x, M.z) : 'concrete')),
          z
        );
      },
      nav: {
        cell: $s,
        isWalkable(M, _) {
          r();
          let T = l(M, _);
          return T >= 0 && !i[T];
        },
        findPath(M, _) {
          r();
          let T = u(M.x, M.z),
            w = u(_.x, _.z);
          if (T < 0 || w < 0) return null;
          if (T === w) return [new THREE.Vector3(_.x, 0, _.z)];
          let S = E(T, w);
          if (!S) return null;
          let R = [],
            z = 0;
          for (; z < S.length - 1;) {
            let I = z + 1;
            for (let L = S.length - 1; L > z + 1; L--)
              if (f(S[z], S[L])) {
                I = L;
                break;
              }
            (R.push(c(S[I])), (z = I));
          }
          return (l(_.x, _.z) === w && R.length && R[R.length - 1].set(_.x, 0, _.z), R);
        },
        randomPoint(M, _) {
          r();
          for (let w = 0; w < 24; w++) {
            let S = Math.random() * 6.2832,
              R = Math.sqrt(Math.random()) * _,
              z = M.x + Math.cos(S) * R,
              I = M.z + Math.sin(S) * R,
              L = l(z, I);
            if (L >= 0 && !i[L]) return new THREE.Vector3(z, 0, I);
          }
          let T = u(M.x, M.z);
          return T >= 0 ? c(T) : new THREE.Vector3(M.x, 0, M.z);
        },
        clearLine(M, _) {
          r();
          let T = l(M.x, M.z),
            w = l(_.x, _.z);
          return T >= 0 && w >= 0 && f(T, w);
        },
        _grid: () => (r(), { blocked: i, w: f0, h: co, minX: Ll, minZ: ru, cell: $s }),
      },
    };
  function r() {
    t && a();
  }
  function a() {
    ((i = new Uint8Array(f0 * co)), (t = !1));
    for (let M of e) {
      if (M.noNav || M.bulletOnly || M.max.y < hg + 0.05 || M.min.y > 1.5) continue;
      let _ = Math.max(0, Math.floor((M.min.x - t1 - Ll) / $s)),
        T = Math.min(f0 - 1, Math.floor((M.max.x + t1 - Ll) / $s)),
        w = Math.max(0, Math.floor((M.min.z - t1 - ru) / $s)),
        S = Math.min(co - 1, Math.floor((M.max.z + t1 - ru) / $s));
      for (let R = w; R <= S; R++) for (let z = _; z <= T; z++) i[R * f0 + z] = 1;
    }
    for (let M = 0; M < co; M++)
      for (let _ = 0; _ < f0; _++)
        (Ll + (_ + 0.5) * $s > Kn.quayX - t1 || _ === 0 || M === 0 || _ === f0 - 1 || M === co - 1) &&
          (i[M * f0 + _] = 1);
  }
  function l(M, _) {
    let T = Math.floor((M - Ll) / $s),
      w = Math.floor((_ - ru) / $s);
    return T < 0 || w < 0 || T >= f0 || w >= co ? -1 : w * f0 + T;
  }
  function c(M) {
    return new THREE.Vector3(Ll + ((M % f0) + 0.5) * $s, 0, ru + (Math.floor(M / f0) + 0.5) * $s);
  }
  function u(M, _) {
    let T = Math.floor((M - Ll) / $s),
      w = Math.floor((_ - ru) / $s);
    if (((T = Math.max(0, Math.min(f0 - 1, T))), (w = Math.max(0, Math.min(co - 1, w))), !i[w * f0 + T]))
      return w * f0 + T;
    for (let S = 1; S <= 12; S++) {
      let R = -1,
        z = 1e9;
      for (let I = -S; I <= S; I++)
        for (let L = -S; L <= S; L++) {
          if (Math.max(Math.abs(L), Math.abs(I)) !== S) continue;
          let U = T + L,
            k = w + I;
          if (!(U < 0 || k < 0 || U >= f0 || k >= co) && !i[k * f0 + U]) {
            let C = L * L + I * I;
            C < z && ((z = C), (R = k * f0 + U));
          }
        }
      if (R >= 0) return R;
    }
    return -1;
  }
  function f(M, _) {
    let T = M % f0,
      w = Math.floor(M / f0),
      S = _ % f0,
      R = Math.floor(_ / f0),
      z = Math.abs(S - T),
      I = Math.abs(R - w),
      L = T < S ? 1 : -1,
      U = w < R ? 1 : -1,
      k = z - I;
    for (let C = 0; C < 600; C++) {
      if (i[w * f0 + T]) return !1;
      if (T === S && w === R) return !0;
      let A = 2 * k;
      if (A > -I && A < z) {
        if (i[w * f0 + T + L] || i[(w + U) * f0 + T]) return !1;
        ((k += z - I), (T += L), (w += U));
      } else A > -I ? ((k -= I), (T += L)) : ((k += z), (w += U));
    }
    return !1;
  }
  let h = new Float32Array(f0 * co),
    p = new Int32Array(f0 * co),
    d = new Uint32Array(f0 * co),
    m = new Uint32Array(f0 * co),
    x = 0,
    v = [],
    y = [];
  function b(M, _) {
    let T = v.length;
    for (v.push(M), y.push(_); T > 0;) {
      let w = (T - 1) >> 1;
      if (y[w] <= _) break;
      ((v[T] = v[w]), (y[T] = y[w]), (T = w));
    }
    ((v[T] = M), (y[T] = _));
  }
  function g() {
    let M = v[0],
      _ = v.pop(),
      T = y.pop(),
      w = v.length;
    if (w) {
      let S = 0;
      for (;;) {
        let R = 2 * S + 1;
        if (R >= w || (R + 1 < w && y[R + 1] < y[R] && R++, y[R] >= T)) break;
        ((v[S] = v[R]), (y[S] = y[R]), (S = R));
      }
      ((v[S] = _), (y[S] = T));
    }
    return M;
  }
  function E(M, _) {
    (x++, (v.length = 0), (y.length = 0));
    let T = _ % f0,
      w = Math.floor(_ / f0),
      S = (I) => {
        let L = Math.abs((I % f0) - T),
          U = Math.abs(Math.floor(I / f0) - w);
        return L + U + (1.4142 - 2) * Math.min(L, U);
      };
    ((h[M] = 0), (d[M] = x), (p[M] = -1), b(M, S(M)));
    let R = 0;
    for (; v.length;) {
      let I = g();
      if (I === _) break;
      if (m[I] === x) continue;
      if (((m[I] = x), ++R > 9e3)) return null;
      let L = I % f0,
        U = Math.floor(I / f0);
      for (let k = -1; k <= 1; k++)
        for (let C = -1; C <= 1; C++) {
          if (!C && !k) continue;
          let A = L + C,
            F = U + k;
          if (A < 0 || F < 0 || A >= f0 || F >= co) continue;
          let H = F * f0 + A;
          if (i[H] || m[H] === x || (C && k && (i[U * f0 + A] || i[F * f0 + L]))) continue;
          let N = h[I] + (C && k ? 1.4142 : 1);
          (d[H] !== x || N < h[H]) && ((h[H] = N), (d[H] = x), (p[H] = I), b(H, N + S(H)));
        }
    }
    if (d[_] !== x) return null;
    let z = [];
    for (let I = _; I !== -1; I = p[I]) z.push(I);
    return (z.reverse(), z);
  }
  return o;
}

function x_(n) {
  return n.isVector3 ? n.clone() : new THREE.Vector3(n[0], n[1], n[2]);
}

export { v_ };
