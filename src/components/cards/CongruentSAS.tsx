interface Props { onComplete: () => void }
export function CongruentSAS({ onComplete }: Props) {
  return (
    <div className="flex flex-col h-full p-6 items-center justify-center gap-4">
      <h2 className="text-xl font-bold text-slate-800">📐 全等三角形 SAS 判定</h2>
      <p className="text-slate-500 text-sm">互动卡片加载中…</p>
      <button onClick={onComplete} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm">
        完成，回到题目 →
      </button>
    </div>
  )
}
