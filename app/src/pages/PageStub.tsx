export function PageStub({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className="animate-rise">
      <p className="label mb-3">{eyebrow}</p>
      <h1 className="text-3xl font-medium tracking-[-0.04em] text-paper">{title}</h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
        Este módulo se está construyendo. La estructura visual ya está lista.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="panel h-40 p-5">
            <div className="h-2 w-20 rounded bg-line" />
            <div className="mt-6 h-7 w-28 rounded bg-line" />
            <div className="mt-4 h-2 w-full rounded bg-line" />
            <div className="mt-2 h-2 w-2/3 rounded bg-line" />
          </div>
        ))}
      </div>
    </div>
  )
}
