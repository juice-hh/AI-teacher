export function ProblemPanel() {
  return (
    <div
      data-testid="problem-panel"
      className="w-1/2 h-screen bg-slate-50 border-r border-slate-200 flex flex-col p-6 overflow-y-auto"
    >
      <h2 className="text-lg font-semibold text-slate-700 mb-4">题目</h2>
      <div className="rounded-xl border border-slate-200 bg-white p-4 mb-4">
        <img
          src="/problem.png"
          alt="例题"
          className="w-full rounded-lg object-contain max-h-64"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">已知条件：</p>
        <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
          <li>四边形 ABCD 中，∠B = ∠C = 90°</li>
          <li>点 E 在 BC 上</li>
          <li>AB = EC，BE = DC</li>
        </ul>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-slate-600">求证 / 求：</p>
        <p className="text-sm text-slate-700">（1）AE = ED</p>
        <p className="text-sm text-slate-700">（2）已知 AB = 2，CD = 3，求 △AED 面积</p>
      </div>
    </div>
  )
}
