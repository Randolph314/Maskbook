import _anchorme from 'anchorme'
import type { TypedMessageAnchor } from '..'
// ESM/CJS compat
const anchorme = ((_anchorme as any).default || _anchorme) as typeof _anchorme

export type ParseLinkResult =
    | {
          type: 'text'
          content: string
      }
    | {
          type: 'link'
          content: string
          category: TypedMessageAnchor['category']
      }

export function parseLink(text: string): ParseLinkResult[] {
    const parsed = anchorme.list(text)

    const result: ParseLinkResult[] = []

    let start = 0
    for (const x of parsed) {
        if (x.isURL) {
            result.push({ type: 'text', content: text.slice(start, x.start) })
            result.push({ type: 'link', content: x.string, category: 'normal' })
        } else {
            result.push({ type: 'text', content: text.slice(start, x.end) })
        }
        start = x.end
    }
    result.push({ type: 'text', content: text.slice(start, text.length) })
    return result.filter((x) => x.content).flatMap((x) => (x.type === 'text' ? parseTag(x.content) : x))
}

const TagLike = /([@#$][\w\-_]+)/g
const map = {
    '@': 'user',
    '#': 'hash',
    $: 'cash',
} as const
function parseTag(x: string): ParseLinkResult[] {
    return x
        .split(TagLike)
        .map<ParseLinkResult>((x) =>
            TagLike.test(x)
                ? { type: 'link', content: x, category: map[x[0] as keyof typeof map] || 'normal' }
                : { type: 'text', content: x },
        )
}
