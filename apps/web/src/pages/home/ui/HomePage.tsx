import Link from "next/link"

const data = [
  {
    key: "react-three-fiber",
    title: "@react-three/fiber",
    children: [
      {
        label: "cursor-driven-escape",
      },
    ],
  },
]

export const HomePage = () => {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center space-y-6 px-6 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold">
        Canvas Playground
      </h1>
      <div className="flex w-full gap-6 rounded-lg border p-4">
        {data.map((item, index) => (
          <div key={item.key} className={`${index !== data.length - 1 ? "mb-8" : ""}`}>
            <h2 className="mb-4 text-lg font-bold">
              {item.title}
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-sm">
              {item.children.map((element) => (
                <li key={element.label}>
                  <Link
                    href={`/${item.key}/${element.label}`}
                    className="text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                  >
                    {element.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
