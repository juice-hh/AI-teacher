import { useState } from 'react'

interface Props { onComplete: () => void }

const REF = { a: 80, b: 100, angle: 55 }

function toRad(deg: number) { return (deg * Math.PI) / 180 }

function trianglePoints(a: number, b: number, angleDeg: number, ox: number, oy: number) {
  const bx = ox + b
  const by = oy
  const cx = ox + a * Math.cos(toRad(angleDeg))
  const cy = oy - a * Math.sin(toRad(angleDeg))
  return { ox, oy, bx, by, cx, cy }
}

export function CongruentSAS({ onComplete }: Props) {
  const [a2, setA2] = useState(60)
  const [b2, setB2] = useState(70)
  const [ang2, setAng2] = useState(40)
  const [ssaMode, setSsaMode] = useState(false)
  const [completed, setCompleted] = useState(false)

  const matched =
    !ssaMode &&
    Math.abs(a2 - REF.a) < 5 &&
    Math.abs(b2 - REF.b) < 5 &&
    Math.abs(ang2 - REF.angle) < 3

  const ref = trianglePoints(REF.a, REF.b, REF.angle, 30, 135)
  const t2 = trianglePoints(a2, b2, ang2, 220, 135)

  // SSA: same two sides + a non-included angle → two possible triangles
  const ssaAngle1 = ang2
  const ssaAngle2 = 180 - ang2
  const ssa1 = trianglePoints(a2, b2, ssaAngle1, 220, 135)
  const ssa2 = trianglePoints(a2, b2, ssaAngle2, 220, 135)

  function handleComplete() {
    setCompleted(true)
    setTimeout(onComplete, 1200)
  }

  return (
    <div className="flex flex-col h-full p-6 gap-4 overflow-y-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-800">📐 全等三角形 SAS 判定</h2>
        <p className="text-sm text-slate-500 mt-1">
          调节右侧滑块，让两个三角形完全重合！
        </p>
      </div>

      <div className="flex gap-3 text-sm flex-wrap">
        <button
          onClick={() => setSsaMode(false)}
          className={`px-3 py-1 rounded-full border transition-colors ${
            !ssaMode ? 'bg-blue-500 text-white border-blue-500' : 'border-slate-300 text-slate-600'
          }`}
        >
          SAS 模式
        </button>
        <button
          onClick={() => setSsaMode(true)}
          className={`px-3 py-1 rounded-full border transition-colors ${
            ssaMode ? 'bg-orange-500 text-white border-orange-500' : 'border-slate-300 text-slate-600'
          }`}
        >
          SSA 反例
        </button>
      </div>

      {ssaMode && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-800">
          ⚠️ SSA（边边角）不能判定全等！同样的两边 + 非夹角，可以拼出<strong>两个不同</strong>的三角形。
          这就是为什么 SAS 中角必须是<strong>夹角</strong>。
        </div>
      )}

      <svg
        viewBox="0 0 400 165"
        className="w-full max-h-44 border border-slate-100 rounded-xl bg-slate-50"
      >
        {/* Reference triangle */}
        <polygon
          points={`${ref.ox},${ref.oy} ${ref.bx},${ref.by} ${ref.cx},${ref.cy}`}
          fill="#dbeafe"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <text x={ref.ox - 8} y={ref.oy + 14} fontSize="10" fill="#1e40af">A</text>
        <text x={ref.bx + 3} y={ref.by + 14} fontSize="10" fill="#1e40af">B</text>
        <text x={ref.cx - 4} y={ref.cy - 5} fontSize="10" fill="#1e40af">C</text>
        <text x={80} y={158} fontSize="9" fill="#6b7280" textAnchor="middle">参考三角形</text>

        {/* Adjustable triangle(s) */}
        {ssaMode ? (
          <>
            <polygon
              points={`${ssa1.ox},${ssa1.oy} ${ssa1.bx},${ssa1.by} ${ssa1.cx},${ssa1.cy}`}
              fill="#fed7aa"
              stroke="#f97316"
              strokeWidth="2"
              opacity="0.8"
            />
            <polygon
              points={`${ssa2.ox},${ssa2.oy} ${ssa2.bx},${ssa2.by} ${ssa2.cx},${ssa2.cy}`}
              fill="#fde68a"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <text x={300} y={158} fontSize="9" fill="#ea580c" textAnchor="middle">两种可能！</text>
          </>
        ) : (
          <polygon
            points={`${t2.ox},${t2.oy} ${t2.bx},${t2.by} ${t2.cx},${t2.cy}`}
            fill={matched ? '#dcfce7' : '#fef3c7'}
            stroke={matched ? '#16a34a' : '#f59e0b'}
            strokeWidth="2"
          />
        )}

        {matched && (
          <text x={300} y={80} fontSize="22" textAnchor="middle" fill="#16a34a">✓</text>
        )}
        {!ssaMode && (
          <text x={300} y={158} fontSize="9" fill="#6b7280" textAnchor="middle">可调三角形</text>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <label className="flex flex-col gap-1">
          <span className="text-slate-600 text-xs">边 a' = {a2}</span>
          <input
            type="range" min={40} max={120} value={a2}
            onChange={e => setA2(+e.target.value)}
            className="accent-blue-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-slate-600 text-xs">边 b' = {b2}</span>
          <input
            type="range" min={40} max={140} value={b2}
            onChange={e => setB2(+e.target.value)}
            className="accent-blue-500"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-slate-600 text-xs">夹角 θ = {ang2}°</span>
          <input
            type="range" min={20} max={100} value={ang2}
            onChange={e => setAng2(+e.target.value)}
            className="accent-blue-500"
          />
        </label>
      </div>

      {!ssaMode && !matched && (
        <p className="text-xs text-slate-400 text-center">
          参考值：a = {REF.a}，b = {REF.b}，角 = {REF.angle}°（误差 5 以内即可）
        </p>
      )}

      {matched && !completed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 flex items-center gap-3">
          <span>🎉 完全重合！两边夹角固定，第三边唯一——这就是 SAS 判定的核心。</span>
          <button
            onClick={handleComplete}
            className="shrink-0 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
          >
            回到题目 →
          </button>
        </div>
      )}
    </div>
  )
}
