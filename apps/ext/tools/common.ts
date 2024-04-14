export interface IToolMatcherCtx {
  url: string
}

export interface ITool {
  matcher?: (ctx: IToolMatcherCtx) => boolean | Promise<boolean>
  id: string
}

export interface ITools {
  matcher?: (ctx: IToolMatcherCtx) => boolean | Promise<boolean>
  tools: ITool[]
}

export function defineTools({ tools, matcher }: ITools): ITool[] {
  return tools.map(({ matcher: subMatcher, id }) => ({
    matcher: (ctx) =>
      Promise.all([matcher, subMatcher].map((f) => f?.(ctx))) //
        .then((res) => res.every((r) => r !== false)),
    id
  }))
}
